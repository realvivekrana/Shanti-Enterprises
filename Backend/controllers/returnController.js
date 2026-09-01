// ============================================================
// SHANTI ENTERPRISES
// Return Controller
// Phase 5 - Operations
// ============================================================

const ReturnRequest = require("../models/ReturnRequest");
const Order = require("../models/Order");

// ============================================================
// GENERATE RETURN NUMBER
// ============================================================

const generateReturnNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `RET-${timestamp}-${random}`;
};

// ============================================================
// CREATE RETURN REQUEST
// ============================================================

const createReturnRequest = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
      items,
      reason,
      description = "",
    } = req.body;

    if (!orderId) {
      const error = new Error(
        "Order ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      const error = new Error(
        "At least one return item is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (
      !reason ||
      !String(reason).trim()
    ) {
      const error = new Error(
        "Return reason is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user.id,
      }).populate(
        "items.product",
        "name"
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK ORDER STATUS
    // --------------------------------------------------------

    if (
      [
        "cancelled",
        "returned",
      ].includes(order.orderStatus)
    ) {
      const error = new Error(
        "Return cannot be requested for this order"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // PREVENT DUPLICATE ACTIVE RETURN
    // --------------------------------------------------------

    const existingReturn =
      await ReturnRequest.findOne({
        order: order._id,
        user: req.user.id,
        status: {
          $in: [
            "requested",
            "approved",
            "picked_up",
            "received",
          ],
        },
      });

    if (existingReturn) {
      const error = new Error(
        "An active return request already exists for this order"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // PREPARE RETURN ITEMS
    // --------------------------------------------------------

    const returnItems = [];

    for (const item of items) {
      if (!item.productId) {
        const error = new Error(
          "Product ID is required for every return item"
        );

        error.statusCode = 400;

        return next(error);
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        const error = new Error(
          "Return quantity must be a positive whole number"
        );

        error.statusCode = 400;

        return next(error);
      }

      const orderItem =
        order.items.find(
          (orderItem) =>
            (
              orderItem.product?._id ||
              orderItem.product
            ).toString() ===
            item.productId.toString()
        );

      if (!orderItem) {
        const error = new Error(
          "Product does not belong to this order"
        );

        error.statusCode = 400;

        return next(error);
      }

      if (
        quantity >
        Number(orderItem.quantity)
      ) {
        const error = new Error(
          `Return quantity cannot exceed ordered quantity for ${
            orderItem.product?.name ||
            orderItem.productName ||
            "product"
          }`
        );

        error.statusCode = 400;

        return next(error);
      }

      returnItems.push({
        product:
          orderItem.product?._id ||
          orderItem.product ||
          null,

        productName:
          orderItem.productName ||
          orderItem.name ||
          orderItem.product?.name ||
          "Product",

        quantity,

        reason:
          item.reason ||
          reason,
      });
    }

    // --------------------------------------------------------
    // CREATE RETURN
    // --------------------------------------------------------

    const returnRequest =
      await ReturnRequest.create({
        returnNumber:
          generateReturnNumber(),

        order: order._id,

        user: req.user.id,

        items: returnItems,

        reason:
          String(reason).trim(),

        description:
          String(description).trim(),

        status: "requested",

        requestedAt: new Date(),
      });

    res.status(201).json({
      success: true,

      message:
        "Return request submitted successfully",

      returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY RETURNS
// ============================================================

const getMyReturns = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

    const filter = {
      user: req.user.id,
    };

    if (status.trim()) {
      filter.status = status.trim();
    }

    const skip =
      (currentPage - 1) *
      perPage;

    const [
      returns,
      totalReturns,
    ] = await Promise.all([
      ReturnRequest.find(filter)
        .populate(
          "order",
          "orderNumber status totalAmount"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      ReturnRequest.countDocuments(
        filter
      ),
    ]);

    const totalPages = Math.ceil(
      totalReturns / perPage
    );

    res.status(200).json({
      success: true,

      count: returns.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalReturns,
        totalPages,
      },

      returns,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET RETURN BY ID
// ============================================================

const getReturnById = async (
  req,
  res,
  next
) => {
  try {
    const returnRequest =
      await ReturnRequest.findOne({
        _id: req.params.id,
        user: req.user.id,
      })
        .populate(
          "order",
          "orderNumber status paymentStatus totalAmount createdAt"
        )
        .populate(
          "items.product",
          "name slug image"
        );

    if (!returnRequest) {
      const error = new Error(
        "Return request not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CANCEL RETURN REQUEST
// ============================================================

const cancelReturnRequest = async (
  req,
  res,
  next
) => {
  try {
    const returnRequest =
      await ReturnRequest.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!returnRequest) {
      const error = new Error(
        "Return request not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      ![
        "requested",
      ].includes(
        returnRequest.status
      )
    ) {
      const error = new Error(
        "This return request can no longer be cancelled"
      );

      error.statusCode = 400;

      return next(error);
    }

    returnRequest.status =
      "cancelled";

    returnRequest.cancelledAt =
      new Date();

    await returnRequest.save();

    res.status(200).json({
      success: true,

      message:
        "Return request cancelled successfully",

      returnRequest: {
        id: returnRequest._id,

        returnNumber:
          returnRequest.returnNumber,

        status:
          returnRequest.status,

        cancelledAt:
          returnRequest.cancelledAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReturnRequest,
  getMyReturns,
  getReturnById,
  cancelReturnRequest,
};