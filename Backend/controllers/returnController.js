const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const ReturnRequest =
  require('../models/ReturnRequest');

const Order =
  require('../models/Order');

// ==============================
// CREATE RETURN REQUEST
// ==============================

const createReturnRequest =
  asyncHandler(async (req, res) => {
    const {
      reason,
      type,
      description,
      items,
      evidenceImages,
    } = req.body;

    const {
      orderId,
    } = req.params;

    // ==============================
    // VALIDATION
    // ==============================

    if (!reason || !type) {
      throw new ApiError(
        400,
        'Reason and type (return/refund) are required'
      );
    }

    const validReasons = [
      'Damaged',
      'Wrong Product',
      'Quantity Mismatch',
      'Defective',
      'Quality Issue',
      'Other',
    ];

    if (
      !validReasons.includes(
        reason
      )
    ) {
      throw new ApiError(
        400,
        'Invalid return reason'
      );
    }

    if (
      ![
        'return',
        'refund',
      ].includes(type)
    ) {
      throw new ApiError(
        400,
        'Type must be return or refund'
      );
    }

    // ==============================
    // FIND ORDER
    // ==============================

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order not found'
      );
    }

    // ==============================
    // OWNER CHECK
    // ==============================

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        'Not authorized for this order'
      );
    }

    // ==============================
    // ONLY DELIVERED ORDERS
    // ==============================

    if (
      order.orderStatus !==
      'Delivered'
    ) {
      throw new ApiError(
        400,
        'Only delivered orders can be returned or refunded'
      );
    }

    // ==============================
    // EXISTING REQUEST
    // ==============================

    const existing =
      await ReturnRequest.findOne({
        order: orderId,

        status: {
          $nin: [
            'Rejected',
            'Cancelled',
          ],
        },
      });

    if (existing) {
      throw new ApiError(
        400,
        'A return/refund request already exists for this order'
      );
    }

    // ==============================
    // PREPARE RETURN ITEMS
    // ==============================

    let returnItems = [];

    if (
      Array.isArray(items) &&
      items.length > 0
    ) {
      returnItems =
        items.map(
          (item) => {
            const orderItem =
              order.orderItems.find(
                (orderProduct) =>
                  orderProduct.product.toString() ===
                  item.product.toString()
              );

            if (!orderItem) {
              throw new ApiError(
                400,
                `Product ${item.product} does not belong to this order`
              );
            }

            const returnQuantity =
              Number(
                item.returnQuantity
              );

            if (
              !Number.isInteger(
                returnQuantity
              ) ||
              returnQuantity <= 0
            ) {
              throw new ApiError(
                400,
                'Return quantity must be a positive whole number'
              );
            }

            if (
              returnQuantity >
              orderItem.quantity
            ) {
              throw new ApiError(
                400,
                `Return quantity cannot exceed ordered quantity for ${orderItem.name}`
              );
            }

            return {
              product:
                orderItem.product,

              name:
                orderItem.name,

              orderedQuantity:
                orderItem.quantity,

              returnQuantity,

              price:
                orderItem.price,
            };
          }
        );
    } else {
      // If frontend doesn't send items,
      // return complete order automatically.

      returnItems =
        order.orderItems.map(
          (item) => ({
            product:
              item.product,

            name:
              item.name,

            orderedQuantity:
              item.quantity,

            returnQuantity:
              item.quantity,

            price:
              item.price,
          })
        );
    }

    // ==============================
    // CALCULATE REFUND
    // ==============================

    const requestedRefundAmount =
      returnItems.reduce(
        (total, item) =>
          total +
          item.price *
            item.returnQuantity,
        0
      );

    // ==============================
    // CREATE REQUEST
    // ==============================

    const returnRequest =
      await ReturnRequest.create({
        order:
          orderId,

        user:
          req.user._id,

        reason,

        type,

        description:
          description || '',

        items:
          returnItems,

        requestedRefundAmount,

        evidenceImages:
          Array.isArray(
            evidenceImages
          )
            ? evidenceImages
            : [],

        status:
          'Requested',

        statusHistory: [
          {
            status:
              'Requested',

            note:
              'Return/refund request submitted',

            updatedBy:
              req.user._id,
          },
        ],
      });

    res.status(201).json(
      new ApiResponse(
        201,
        returnRequest,
        'Return/refund request submitted'
      )
    );
  });

// ==============================
// GET MY RETURNS
// ==============================

const getMyReturnRequests =
  asyncHandler(async (req, res) => {
    const requests =
      await ReturnRequest.find({
        user:
          req.user._id,
      })
        .populate(
          'order',
          'totalPrice orderStatus'
        )
        .populate(
          'items.product',
          'name sku images'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        requests,
        'Your return requests fetched'
      )
    );
  });

// ==============================
// GET ALL RETURNS
// ==============================

const getAllReturnRequests =
  asyncHandler(async (req, res) => {
    const requests =
      await ReturnRequest.find({})
        .populate(
          'user',
          'name email phone businessName'
        )
        .populate(
          'order',
          'totalPrice orderStatus'
        )
        .populate(
          'items.product',
          'name sku images'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        requests,
        'All return requests fetched'
      )
    );
  });

// ==============================
// UPDATE RETURN STATUS
// ADMIN
// ==============================

const updateReturnStatus =
  asyncHandler(async (req, res) => {
    const {
      status,
      adminNote,
      approvedRefundAmount,
    } = req.body;

    const validStatuses = [
      'Requested',
      'Under Review',
      'Approved',
      'Rejected',
      'Pickup Scheduled',
      'Picked Up',
      'Received',
      'Inspection',
      'Refund Pending',
      'Refunded',
      'Cancelled',
    ];

    if (
      !validStatuses.includes(
        status
      )
    ) {
      throw new ApiError(
        400,
        `Status must be one of: ${validStatuses.join(
          ', '
        )}`
      );
    }

    const request =
      await ReturnRequest.findById(
        req.params.id
      );

    if (!request) {
      throw new ApiError(
        404,
        'Return request not found'
      );
    }

    // ==============================
    // PREVENT CHANGES AFTER REFUND
    // ==============================

    if (
      request.status ===
        'Refunded' &&
      status !==
        'Refunded'
    ) {
      throw new ApiError(
        400,
        'Refunded request cannot be moved to another status'
      );
    }

    // ==============================
    // APPROVED REFUND
    // ==============================

    if (
      approvedRefundAmount !==
      undefined
    ) {
      const amount =
        Number(
          approvedRefundAmount
        );

      if (
        !Number.isFinite(
          amount
        ) ||
        amount < 0
      ) {
        throw new ApiError(
          400,
          'Invalid approved refund amount'
        );
      }

      if (
        amount >
        request.requestedRefundAmount
      ) {
        throw new ApiError(
          400,
          'Approved refund cannot exceed requested refund amount'
        );
      }

      request.approvedRefundAmount =
        amount;

      request.refund.amount =
        amount;
    }

    // ==============================
    // STATUS
    // ==============================

    request.status =
      status;

    if (adminNote !== undefined) {
      request.adminNote =
        adminNote;
    }

    // ==============================
    // INSPECTION
    // ==============================

    if (
      status ===
      'Inspection'
    ) {
      request.inspectionStatus =
        'Pending';
    }

    // ==============================
    // REFUND PENDING
    // ==============================

    if (
      status ===
      'Refund Pending'
    ) {
      request.refund.status =
        'Pending';
    }

    // ==============================
    // REFUNDED
    // ==============================

    if (
      status ===
      'Refunded'
    ) {
      request.refund.status =
        'Completed';

      request.refund.processedAt =
        new Date();
    }

    // ==============================
    // PICKUP
    // ==============================

    if (
      status ===
      'Picked Up'
    ) {
      request.pickup.pickedUpAt =
        new Date();
    }

    // ==============================
    // HISTORY
    // ==============================

    request.statusHistory.push({
      status,

      note:
        adminNote || '',

      updatedBy:
        req.user._id,

      timestamp:
        new Date(),
    });

    await request.save();

    res.status(200).json(
      new ApiResponse(
        200,
        request,
        'Return request status updated'
      )
    );
  });

// ==============================
// UPDATE PICKUP DETAILS
// ADMIN
// ==============================

const updatePickupDetails =
  asyncHandler(async (req, res) => {
    const {
      carrier,
      trackingId,
      trackingUrl,
      scheduledDate,
    } = req.body;

    const request =
      await ReturnRequest.findById(
        req.params.id
      );

    if (!request) {
      throw new ApiError(
        404,
        'Return request not found'
      );
    }

    request.pickup.carrier =
      carrier || '';

    request.pickup.trackingId =
      trackingId || '';

    request.pickup.trackingUrl =
      trackingUrl || '';

    request.pickup.scheduledDate =
      scheduledDate || null;

    if (
      request.status ===
      'Approved'
    ) {
      request.status =
        'Pickup Scheduled';

      request.statusHistory.push({
        status:
          'Pickup Scheduled',

        note:
          'Reverse pickup scheduled',

        updatedBy:
          req.user._id,
      });
    }

    await request.save();

    res.status(200).json(
      new ApiResponse(
        200,
        request,
        'Reverse pickup details updated'
      )
    );
  });

// ==============================
// INSPECTION
// ADMIN
// ==============================

const updateInspection =
  asyncHandler(async (req, res) => {
    const {
      inspectionStatus,
      inspectionNote,
    } = req.body;

    const validInspectionStatuses = [
      'Pending',
      'Passed',
      'Failed',
    ];

    if (
      !validInspectionStatuses.includes(
        inspectionStatus
      )
    ) {
      throw new ApiError(
        400,
        'Invalid inspection status'
      );
    }

    const request =
      await ReturnRequest.findById(
        req.params.id
      );

    if (!request) {
      throw new ApiError(
        404,
        'Return request not found'
      );
    }

    request.inspectionStatus =
      inspectionStatus;

    request.inspectionNote =
      inspectionNote || '';

    request.inspectedAt =
      new Date();

    request.inspectedBy =
      req.user._id;

    if (
      inspectionStatus ===
      'Passed'
    ) {
      request.status =
        'Refund Pending';
    }

    if (
      inspectionStatus ===
      'Failed'
    ) {
      request.status =
        'Rejected';
    }

    request.statusHistory.push({
      status:
        request.status,

      note:
        inspectionNote || '',

      updatedBy:
        req.user._id,
    });

    await request.save();

    res.status(200).json(
      new ApiResponse(
        200,
        request,
        'Product inspection updated'
      )
    );
  });

// ==============================
// PROCESS REFUND
// ADMIN
// ==============================

const processRefund =
  asyncHandler(async (req, res) => {
    const {
      method,
      transactionId,
      amount,
    } = req.body;

    const validMethods = [
      'original_payment',
      'bank_transfer',
      'upi',
      'credit',
      'manual',
    ];

    if (
      !validMethods.includes(
        method
      )
    ) {
      throw new ApiError(
        400,
        'Invalid refund method'
      );
    }

    const request =
      await ReturnRequest.findById(
        req.params.id
      );

    if (!request) {
      throw new ApiError(
        404,
        'Return request not found'
      );
    }

    if (
      request.status !==
      'Refund Pending'
    ) {
      throw new ApiError(
        400,
        'Return is not ready for refund'
      );
    }

    const refundAmount =
      Number(
        amount ||
          request.approvedRefundAmount
      );

    if (
      !Number.isFinite(
        refundAmount
      ) ||
      refundAmount <= 0
    ) {
      throw new ApiError(
        400,
        'Valid refund amount is required'
      );
    }

    if (
      refundAmount >
      request.approvedRefundAmount
    ) {
      throw new ApiError(
        400,
        'Refund cannot exceed approved refund amount'
      );
    }

    request.refund.amount =
      refundAmount;

    request.refund.method =
      method;

    request.refund.transactionId =
      transactionId || '';

    request.refund.status =
      'Completed';

    request.refund.processedAt =
      new Date();

    request.status =
      'Refunded';

    request.statusHistory.push({
      status:
        'Refunded',

      note:
        `Refund processed using ${method}`,

      updatedBy:
        req.user._id,
    });

    await request.save();

    res.status(200).json(
      new ApiResponse(
        200,
        request,
        'Refund processed successfully'
      )
    );
  });

// ==============================
// EXPORT
// ==============================

module.exports = {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnStatus,
  updatePickupDetails,
  updateInspection,
  processRefund,
};