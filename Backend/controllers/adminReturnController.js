// ============================================================
// SHANTI ENTERPRISES
// Admin Return Controller
// Phase 6 - Admin
// ============================================================

const ReturnRequest = require("../models/ReturnRequest");
const Product = require("../models/Product");

// Refund hone par return ke items ka stock wapas product me jodo
const restoreReturnStock = async (returnRequest) => {
  for (const item of returnRequest.items || []) {
    if (!item.product) {
      continue;
    }

    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: Number(item.quantity) || 0 } }
    );
  }
};

// ============================================================
// GET ALL RETURNS - ADMIN
// ============================================================

const getAdminReturns = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
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
    // STATUS FILTER
    // --------------------------------------------------------

    if (status.trim()) {
      filter.status = status.trim();
    }

    // --------------------------------------------------------
    // SEARCH BY RETURN NUMBER
    // --------------------------------------------------------

    if (search.trim()) {
      filter.returnNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      returns,
      totalReturns,
    ] = await Promise.all([
      ReturnRequest.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "order",
          "orderNumber orderStatus totalAmount"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      ReturnRequest.countDocuments(filter),
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
// GET SINGLE RETURN - ADMIN
// ============================================================

const getAdminReturnById = async (
  req,
  res,
  next
) => {
  try {
    const returnRequest =
      await ReturnRequest.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "order",
          "orderNumber orderStatus paymentStatus totalAmount createdAt"
        )
        .populate(
          "items.product",
          "name slug image unit"
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
// UPDATE RETURN STATUS - ADMIN
// ============================================================

const updateAdminReturnStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      refundAmount,
    } = req.body;

    const allowedStatuses = [
      "approved",
      "rejected",
      "picked_up",
      "received",
      "refunded",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid return status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    const returnRequest =
      await ReturnRequest.findById(
        req.params.id
      );

    if (!returnRequest) {
      const error = new Error(
        "Return request not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // TERMINAL STATES CANNOT MOVE FURTHER
    // --------------------------------------------------------

    if (
      [
        "rejected",
        "refunded",
        "cancelled",
      ].includes(returnRequest.status)
    ) {
      const error = new Error(
        `A ${returnRequest.status} return request cannot be updated further`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // VALID FORWARD TRANSITIONS
    // --------------------------------------------------------

    const allowedNextStatuses = {
      requested: [
        "approved",
        "rejected",
        "cancelled",
      ],
      approved: [
        "picked_up",
        "cancelled",
      ],
      picked_up: ["received"],
      received: ["refunded"],
    };

    const validNext =
      allowedNextStatuses[
        returnRequest.status
      ] || [];

    if (!validNext.includes(status)) {
      const error = new Error(
        `Return request in "${returnRequest.status}" status cannot move to "${status}"`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // UPDATE STATUS + DATE
    // --------------------------------------------------------

    returnRequest.status = status;

    if (status === "approved") {
      returnRequest.approvedAt = new Date();
    }

    if (status === "rejected") {
      returnRequest.rejectedAt = new Date();
    }

    if (status === "received") {
      returnRequest.receivedAt = new Date();
    }

    if (status === "refunded") {
      returnRequest.refundedAt = new Date();

      if (
        refundAmount !== undefined &&
        refundAmount !== null &&
        refundAmount !== ""
      ) {
        const parsedRefundAmount =
          Number(refundAmount);

        if (
          !Number.isFinite(
            parsedRefundAmount
          ) ||
          parsedRefundAmount < 0
        ) {
          const error = new Error(
            "Invalid refund amount"
          );

          error.statusCode = 400;

          return next(error);
        }

        returnRequest.refundAmount =
          parsedRefundAmount;
      }
    }

    if (status === "cancelled") {
      returnRequest.cancelledAt = new Date();
    }

    await returnRequest.save();

    // --------------------------------------------------------
    // RESTORE STOCK ON REFUND
    // --------------------------------------------------------

    if (status === "refunded") {
      await restoreReturnStock(
        returnRequest
      );
    }

    res.status(200).json({
      success: true,

      message:
        "Return status updated successfully",

      returnRequest: {
        id: returnRequest._id,

        returnNumber:
          returnRequest.returnNumber,

        status: returnRequest.status,

        refundAmount:
          returnRequest.refundAmount,

        approvedAt:
          returnRequest.approvedAt,

        rejectedAt:
          returnRequest.rejectedAt,

        receivedAt:
          returnRequest.receivedAt,

        refundedAt:
          returnRequest.refundedAt,

        cancelledAt:
          returnRequest.cancelledAt,
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
  getAdminReturns,
  getAdminReturnById,
  updateAdminReturnStatus,
};