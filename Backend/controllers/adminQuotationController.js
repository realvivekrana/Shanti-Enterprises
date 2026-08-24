// ============================================================
// SHANTI ENTERPRISES
// Admin Quotation Controller
// Phase 6 - Admin
// ============================================================

const Quotation = require("../models/Quotation");

// ============================================================
// GET ALL QUOTATIONS - ADMIN
// ============================================================

const getAdminQuotations = async (
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
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.quotationNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      quotations,
      totalQuotations,
    ] = await Promise.all([
      Quotation.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "rfq",
          "rfqNumber status"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Quotation.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalQuotations / perPage
    );

    res.status(200).json({
      success: true,

      count: quotations.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalQuotations,
        totalPages,
      },

      quotations,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE QUOTATION - ADMIN
// ============================================================

const getAdminQuotationById = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "rfq",
          "rfqNumber status items"
        )
        .populate(
          "items.product",
          "name sku image price"
        );

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE QUOTATION STATUS
// ============================================================

const updateAdminQuotationStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "draft",
      "sent",
      "accepted",
      "rejected",
      "expired",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid quotation status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    quotation.status = status;

    // --------------------------------------------------------
    // STATUS DATES
    // --------------------------------------------------------

    if (status === "sent") {
      quotation.sentAt =
        quotation.sentAt ||
        new Date();
    }

    if (status === "accepted") {
      quotation.acceptedAt =
        quotation.acceptedAt ||
        new Date();
    }

    if (status === "rejected") {
      quotation.rejectedAt =
        quotation.rejectedAt ||
        new Date();
    }

    if (status === "cancelled") {
      quotation.cancelledAt =
        quotation.cancelledAt ||
        new Date();
    }

    await quotation.save();

    res.status(200).json({
      success: true,

      message:
        "Quotation status updated successfully",

      quotation: {
        id: quotation._id,

        quotationNumber:
          quotation.quotationNumber,

        status:
          quotation.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CANCEL QUOTATION
// ============================================================

const cancelAdminQuotation = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      [
        "accepted",
        "cancelled",
      ].includes(
        quotation.status
      )
    ) {
      const error = new Error(
        "This quotation cannot be cancelled"
      );

      error.statusCode = 400;

      return next(error);
    }

    quotation.status =
      "cancelled";

    quotation.cancelledAt =
      new Date();

    await quotation.save();

    res.status(200).json({
      success: true,

      message:
        "Quotation cancelled successfully",

      quotation: {
        id: quotation._id,

        quotationNumber:
          quotation.quotationNumber,

        status:
          quotation.status,

        cancelledAt:
          quotation.cancelledAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminQuotations,
  getAdminQuotationById,
  updateAdminQuotationStatus,
  cancelAdminQuotation,
};