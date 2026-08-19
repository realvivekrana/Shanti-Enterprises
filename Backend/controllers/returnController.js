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

const Product =
  require('../models/Product');


// ======================================================
// NOTIFICATION SERVICE
// ======================================================

const {

  sendReturnUpdate,

  sendRefundUpdate,

} = require(
  '../services/notificationService'
);


// ======================================================
// CREATE RETURN REQUEST
// ======================================================

const createReturnRequest =
  asyncHandler(
    async (req, res) => {

      const {
        orderId,
        reason,
        description,
        items,
        images,
      } = req.body;


      // ==================================================
      // ORDER ID
      // ==================================================

      if (
        !orderId
      ) {

        throw new ApiError(
          400,
          'Order ID is required'
        );

      }


      // ==================================================
      // FIND ORDER
      // ==================================================

      const order =
        await Order.findById(
          orderId
        );


      if (
        !order
      ) {

        throw new ApiError(
          404,
          'Order not found'
        );

      }


      // ==================================================
      // ORDER OWNER
      // ==================================================

      if (
        order.user.toString() !==
        req.user._id.toString()
      ) {

        throw new ApiError(
          403,
          'You are not authorized to request return for this order'
        );

      }


      // ==================================================
      // ORDER STATUS
      // ==================================================

      if (
        order.orderStatus !==
        'Delivered'
      ) {

        throw new ApiError(
          400,
          'Return can only be requested after delivery'
        );

      }


      // ==================================================
      // EXISTING RETURN
      // ==================================================

      const existingRequest =
        await ReturnRequest.findOne({

          order:
            orderId,

          user:
            req.user._id,

          status: {

            $nin: [

              'Rejected',

              'Cancelled',

            ],

          },

        });


      if (
        existingRequest
      ) {

        throw new ApiError(
          400,
          'A return request already exists for this order'
        );

      }


      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !reason
      ) {

        throw new ApiError(
          400,
          'Return reason is required'
        );

      }


      // ==================================================
      // CREATE RETURN REQUEST
      // ==================================================

      const returnRequest =
        await ReturnRequest.create({

          order:
            orderId,

          user:
            req.user._id,

          reason,

          description:
            description ||
            '',

          items:
            items ||
            [],

          images:
            images ||
            [],

          status:
            'Requested',

        });


      // ==================================================
      // NOTIFICATION
      // ==================================================

      try {

        await sendReturnUpdate({

          userId:
            req.user._id,

          orderId:
            order._id,

          returnRequestId:
            returnRequest._id,

          status:
            'Requested',

        });

      } catch (error) {

        console.error(
          'Return notification failed:',
          error.message
        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(201).json(

        new ApiResponse(

          201,

          returnRequest,

          'Return/refund request submitted'

        )

      );

    }
  );


// ======================================================
// GET MY RETURN REQUESTS
// ======================================================

const getMyReturnRequests =
  asyncHandler(
    async (req, res) => {

      const requests =
        await ReturnRequest.find({

          user:
            req.user._id,

        })

          .populate(

            'order',

            'orderItems totalPrice orderStatus createdAt'

          )

          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(

        new ApiResponse(

          200,

          requests,

          'Return requests fetched successfully'

        )

      );

    }
  );


// ======================================================
// GET ALL RETURN REQUESTS
// ======================================================

const getAllReturnRequests =
  asyncHandler(
    async (req, res) => {

      const requests =
        await ReturnRequest.find({})

          .populate(

            'user',

            'name email phone businessName'

          )

          .populate(

            'order',

            'orderItems totalPrice orderStatus'

          )

          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(

        new ApiResponse(

          200,

          requests,

          'All return requests fetched'

        )

      );

    }
  );


// ======================================================
// UPDATE RETURN STATUS
// ======================================================

const updateReturnStatus =
  asyncHandler(
    async (req, res) => {

      const {
        status,
        adminNote,
      } = req.body;


      // ==================================================
      // VALID STATUSES
      // ==================================================

      const validStatuses = [

        'Requested',

        'Under Review',

        'Approved',

        'Rejected',

        'Pickup Scheduled',

        'Picked Up',

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

          `Status must be one of: ${
            validStatuses.join(', ')
          }`

        );

      }


      // ==================================================
      // FIND REQUEST
      // ==================================================

      const request =
        await ReturnRequest.findById(
          req.params.id
        );


      if (
        !request
      ) {

        throw new ApiError(
          404,
          'Return request not found'
        );

      }


      // ==================================================
      // UPDATE
      // ==================================================

      request.status =
        status;


      if (
        adminNote !==
        undefined
      ) {

        request.adminNote =
          adminNote;

      }


      // ==================================================
      // REFUND PENDING
      // ==================================================

      if (
        status ===
        'Refund Pending'
      ) {

        request.refund.status =
          'pending';

      }


      // ==================================================
      // REFUNDED
      // ==================================================

      if (
        status ===
        'Refunded'
      ) {

        request.refund.status =
          'completed';

        request.refund.refundedAt =
          new Date();

      }


      await request.save();


      // ==================================================
      // NOTIFICATION
      // ==================================================

      try {

        if (
          status ===
          'Refunded'
        ) {

          await sendRefundUpdate({

            userId:
              request.user,

            orderId:
              request.order,

            amount:
              request.refund?.amount ||
              request.approvedRefundAmount ||
              0,

            status:
              'Completed',

          });

        } else {

          await sendReturnUpdate({

            userId:
              request.user,

            orderId:
              request.order,

            returnRequestId:
              request._id,

            status,

          });

        }

      } catch (error) {

        console.error(

          'Return/refund notification failed:',

          error.message

        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json(

        new ApiResponse(

          200,

          request,

          'Return request status updated'

        )

      );

    }
  );


// ======================================================
// UPDATE PICKUP DETAILS
// ======================================================

const updatePickupDetails =
  asyncHandler(
    async (req, res) => {

      const {

        pickupDate,

        pickupAgent,

        pickupTrackingId,

        pickupNote,

      } = req.body;


      // ==================================================
      // FIND REQUEST
      // ==================================================

      const request =
        await ReturnRequest.findById(
          req.params.id
        );


      if (
        !request
      ) {

        throw new ApiError(
          404,
          'Return request not found'
        );

      }


      // ==================================================
      // PICKUP DETAILS
      // ==================================================

      request.pickup = {

        ...(request.pickup?.toObject?.() ||
          request.pickup ||
          {}),

        pickupDate:
          pickupDate ||
          request.pickup?.pickupDate ||
          null,

        pickupAgent:
          pickupAgent ||
          request.pickup?.pickupAgent ||
          null,

        trackingId:
          pickupTrackingId ||
          request.pickup?.trackingId ||
          null,

        note:
          pickupNote ||
          request.pickup?.note ||
          '',

      };


      // ==================================================
      // STATUS
      // ==================================================

      request.status =
        'Pickup Scheduled';


      await request.save();


      // ==================================================
      // NOTIFICATION
      // ==================================================

      try {

        await sendReturnUpdate({

          userId:
            request.user,

          orderId:
            request.order,

          returnRequestId:
            request._id,

          status:
            'Pickup Scheduled',

        });

      } catch (error) {

        console.error(

          'Pickup notification failed:',

          error.message

        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json(

        new ApiResponse(

          200,

          request,

          'Reverse pickup details updated'

        )

      );

    }
  );


// ======================================================
// UPDATE INSPECTION
// ======================================================

const updateInspection =
  asyncHandler(
    async (req, res) => {

      const {

        result,

        note,

      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      const validResults = [

        'Passed',

        'Failed',

        'Pending',

      ];


      if (
        result &&
        !validResults.includes(
          result
        )
      ) {

        throw new ApiError(

          400,

          `Inspection result must be one of: ${
            validResults.join(', ')
          }`

        );

      }


      // ==================================================
      // FIND REQUEST
      // ==================================================

      const request =
        await ReturnRequest.findById(
          req.params.id
        );


      if (
        !request
      ) {

        throw new ApiError(
          404,
          'Return request not found'
        );

      }


      // ==================================================
      // INSPECTION
      // ==================================================

      request.inspection = {

        ...(request.inspection?.toObject?.() ||
          request.inspection ||
          {}),

        result:
          result ||
          request.inspection?.result ||
          'Pending',

        note:
          note ||
          request.inspection?.note ||
          '',

        inspectedAt:
          new Date(),

      };


      // ==================================================
      // STATUS
      // ==================================================

      request.status =
        'Inspection';


      await request.save();


      // ==================================================
      // NOTIFICATION
      // ==================================================

      try {

        await sendReturnUpdate({

          userId:
            request.user,

          orderId:
            request.order,

          returnRequestId:
            request._id,

          status:
            'Inspection',

        });

      } catch (error) {

        console.error(

          'Inspection notification failed:',

          error.message

        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json(

        new ApiResponse(

          200,

          request,

          'Product inspection updated'

        )

      );

    }
  );


// ======================================================
// PROCESS REFUND
// ======================================================

const processRefund =
  asyncHandler(
    async (req, res) => {

      const {

        amount,

        transactionId,

        note,

      } = req.body;


      // ==================================================
      // FIND REQUEST
      // ==================================================

      const request =
        await ReturnRequest.findById(
          req.params.id
        );


      if (
        !request
      ) {

        throw new ApiError(
          404,
          'Return request not found'
        );

      }


      // ==================================================
      // REFUND AMOUNT
      // ==================================================

      const refundAmount =
        Number(
          amount
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


      // ==================================================
      // UPDATE REFUND
      // ==================================================

      request.refund = {

        ...(request.refund?.toObject?.() ||
          request.refund ||
          {}),

        amount:
          refundAmount,

        status:
          'completed',

        transactionId:
          transactionId ||
          null,

        note:
          note ||
          '',

        refundedAt:
          new Date(),

      };


      request.status =
        'Refunded';


      await request.save();


      // ==================================================
      // NOTIFICATION
      // ======================================================

      try {

        await sendRefundUpdate({

          userId:
            request.user,

          orderId:
            request.order,

          amount:
            refundAmount,

          status:
            'Completed',

        });

      } catch (error) {

        console.error(

          'Refund notification failed:',

          error.message

        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json(

        new ApiResponse(

          200,

          request,

          'Refund processed successfully'

        )

      );

    }
  );


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  createReturnRequest,

  getMyReturnRequests,

  getAllReturnRequests,

  updateReturnStatus,

  updatePickupDetails,

  updateInspection,

  processRefund,

};