// ============================================================
// SHANTI ENTERPRISES
// Admin Order Controller
// Phase 6 - Admin
// ============================================================

const Order = require("../models/Order");

// ============================================================
// GET ALL ORDERS - ADMIN
// ============================================================

const getAdminOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      paymentStatus = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {};

    // --------------------------------------------------------
    // ORDER STATUS FILTER
    // --------------------------------------------------------

    if (status.trim()) {
      filter.orderStatus = status.trim();
    }

    // --------------------------------------------------------
    // PAYMENT STATUS FILTER
    // --------------------------------------------------------

    if (paymentStatus.trim()) {
      filter.paymentStatus =
        paymentStatus.trim();
    }

    // --------------------------------------------------------
    // SEARCH BY ORDER NUMBER
    // --------------------------------------------------------

    if (search.trim()) {
      filter.orderNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    // --------------------------------------------------------
    // GET ORDERS + COUNT
    // --------------------------------------------------------

    const [
      orders,
      totalOrders,
    ] = await Promise.all([
      Order.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name slug image price unit"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalOrders / perPage
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      count: orders.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalOrders,
        totalPages,
      },

      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE ORDER - ADMIN
// ============================================================

const getAdminOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name slug image price unit"
        );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE ORDER STATUS
// ADMIN ONLY
// ============================================================

const updateAdminOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.body;

    // --------------------------------------------------------
    // ALLOWED ORDER STATUSES
    // --------------------------------------------------------

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid order status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // UPDATE CORRECT MODEL FIELD
    // --------------------------------------------------------

    order.orderStatus = status;

    await order.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Order status updated successfully",

      order: {
        id: order._id,

        orderNumber:
          order.orderNumber,

        orderStatus:
          order.orderStatus,

        paymentStatus:
          order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE PAYMENT STATUS
// ADMIN ONLY
// ============================================================

const updateAdminPaymentStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      paymentStatus,
    } = req.body;

    // --------------------------------------------------------
    // ALLOWED PAYMENT STATUSES
    // --------------------------------------------------------

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (
      !paymentStatus ||
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      const error = new Error(
        `Invalid payment status. Allowed values: ${allowedPaymentStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // UPDATE PAYMENT STATUS
    // --------------------------------------------------------

    order.paymentStatus =
      paymentStatus;

    await order.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Payment status updated successfully",

      order: {
        id: order._id,

        orderNumber:
          order.orderNumber,

        orderStatus:
          order.orderStatus,

        paymentStatus:
          order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CANCEL ORDER - ADMIN
// ============================================================

const cancelAdminOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK CURRENT STATUS
    // --------------------------------------------------------

    if (
      [
        "delivered",
        "cancelled",
      ].includes(
        order.orderStatus
      )
    ) {
      const error = new Error(
        "This order cannot be cancelled"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // CANCEL ORDER
    // --------------------------------------------------------

    order.orderStatus =
      "cancelled";

    await order.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully",

      order: {
        id: order._id,

        orderNumber:
          order.orderNumber,

        orderStatus:
          order.orderStatus,

        paymentStatus:
          order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  cancelAdminOrder,
};