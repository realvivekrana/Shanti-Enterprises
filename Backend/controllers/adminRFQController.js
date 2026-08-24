// ============================================================
// SHANTI ENTERPRISES
// Admin RFQ Controller
// Phase 6 - Admin
// ============================================================

const RFQ = require("../models/RFQ");

// ============================================================
// GET ALL RFQs - ADMIN
// ============================================================

const getAdminRFQs = async (req, res, next) => {
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
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.rfqNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      rfqs,
      totalRFQs,
    ] = await Promise.all([
      RFQ.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      RFQ.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalRFQs / perPage
    );

    res.status(200).json({
      success: true,

      count: rfqs.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalRFQs,
        totalPages,
      },

      rfqs,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE RFQ - ADMIN
// ============================================================

const getAdminRFQById = async (
  req,
  res,
  next
) => {
  try {
    const rfq =
      await RFQ.findById(req.params.id)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name sku image price"
        );

    if (!rfq) {
      const error = new Error(
        "RFQ not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      rfq,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE RFQ STATUS
// ============================================================

const updateAdminRFQStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewing",
      "quoted",
      "accepted",
      "rejected",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid RFQ status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    const rfq =
      await RFQ.findById(
        req.params.id
      );

    if (!rfq) {
      const error = new Error(
        "RFQ not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    rfq.status = status;

    await rfq.save();

    res.status(200).json({
      success: true,

      message:
        "RFQ status updated successfully",

      rfq: {
        id: rfq._id,

        rfqNumber:
          rfq.rfqNumber,

        status: rfq.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE / CANCEL RFQ - ADMIN
// ============================================================

const cancelAdminRFQ = async (
  req,
  res,
  next
) => {
  try {
    const rfq =
      await RFQ.findById(
        req.params.id
      );

    if (!rfq) {
      const error = new Error(
        "RFQ not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      [
        "accepted",
        "cancelled",
      ].includes(rfq.status)
    ) {
      const error = new Error(
        "This RFQ cannot be cancelled"
      );

      error.statusCode = 400;

      return next(error);
    }

    rfq.status =
      "cancelled";

    await rfq.save();

    res.status(200).json({
      success: true,

      message:
        "RFQ cancelled successfully",

      rfq: {
        id: rfq._id,

        rfqNumber:
          rfq.rfqNumber,

        status: rfq.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminRFQs,
  getAdminRFQById,
  updateAdminRFQStatus,
  cancelAdminRFQ,
};