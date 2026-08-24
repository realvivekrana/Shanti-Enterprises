// ============================================================
// SHANTI ENTERPRISES
// Quotation Controller
// Phase 4 - Wholesale
// ============================================================

const Quotation = require("../models/Quotation");
const RFQ = require("../models/RFQ");

// ============================================================
// GET MY QUOTATIONS
// ============================================================

const getMyQuotations = async (
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
      quotations,
      totalQuotations,
    ] = await Promise.all([
      Quotation.find(filter)
        .populate(
          "rfq",
          "rfqNumber status createdAt"
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
// GET QUOTATION DETAILS
// ============================================================

const getQuotationById = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findOne({
        _id: req.params.id,
        user: req.user.id,
      })
        .populate(
          "rfq",
          "rfqNumber status message createdAt"
        )
        .populate(
          "items.product",
          "name slug image unit"
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
// ACCEPT QUOTATION
// ============================================================

const acceptQuotation = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // ONLY SENT QUOTATIONS CAN BE ACCEPTED
    // --------------------------------------------------------

    if (
      quotation.status !== "sent"
    ) {
      const error = new Error(
        "Only sent quotations can be accepted"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK EXPIRY
    // --------------------------------------------------------

    if (
      quotation.validUntil &&
      new Date() >
        quotation.validUntil
    ) {
      quotation.status = "expired";

      await quotation.save();

      const error = new Error(
        "This quotation has expired"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // ACCEPT QUOTATION
    // --------------------------------------------------------

    quotation.status = "accepted";
    quotation.acceptedAt =
      new Date();

    await quotation.save();

    // --------------------------------------------------------
    // UPDATE RELATED RFQ
    // --------------------------------------------------------

    await RFQ.findByIdAndUpdate(
      quotation.rfq,
      {
        $set: {
          status: "accepted",
          acceptedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,

      message:
        "Quotation accepted successfully",

      quotation: {
        id: quotation._id,
        quotationNumber:
          quotation.quotationNumber,
        status:
          quotation.status,
        acceptedAt:
          quotation.acceptedAt,
        totalAmount:
          quotation.totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// REJECT QUOTATION
// ============================================================

const rejectQuotation = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // ONLY SENT QUOTATIONS CAN BE REJECTED
    // --------------------------------------------------------

    if (
      quotation.status !== "sent"
    ) {
      const error = new Error(
        "Only sent quotations can be rejected"
      );

      error.statusCode = 400;

      return next(error);
    }

    quotation.status = "rejected";
    quotation.rejectedAt =
      new Date();

    await quotation.save();

    // --------------------------------------------------------
    // UPDATE RELATED RFQ
    // --------------------------------------------------------

    await RFQ.findByIdAndUpdate(
      quotation.rfq,
      {
        $set: {
          status: "rejected",
        },
      }
    );

    res.status(200).json({
      success: true,

      message:
        "Quotation rejected successfully",

      quotation: {
        id: quotation._id,
        quotationNumber:
          quotation.quotationNumber,
        status:
          quotation.status,
        rejectedAt:
          quotation.rejectedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyQuotations,
  getQuotationById,
  acceptQuotation,
  rejectQuotation,
};