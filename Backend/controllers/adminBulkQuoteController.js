// ============================================================
// SHANTI ENTERPRISES
// Admin Bulk Quote Controller
// Phase 6 - Admin
// ============================================================

const BulkQuote = require("../models/BulkQuote");

// ============================================================
// GET ALL BULK QUOTES - ADMIN
// ============================================================

const getAdminBulkQuotes = async (
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
    // SEARCH BY QUOTE NUMBER
    // --------------------------------------------------------

    if (search.trim()) {
      filter.quoteNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      bulkQuotes,
      totalBulkQuotes,
    ] = await Promise.all([
      BulkQuote.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      BulkQuote.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalBulkQuotes / perPage
    );

    res.status(200).json({
      success: true,

      count: bulkQuotes.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalBulkQuotes,
        totalPages,
      },

      bulkQuotes,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE BULK QUOTE - ADMIN
// ============================================================

const getAdminBulkQuoteById = async (
  req,
  res,
  next
) => {
  try {
    const bulkQuote =
      await BulkQuote.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name slug image price unit moq isWholesale stock"
        );

    if (!bulkQuote) {
      const error = new Error(
        "Bulk quote not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      bulkQuote,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// RESPOND TO BULK QUOTE - ADMIN
// (sets per-item pricing and moves status to "quoted")
// ============================================================

const respondToBulkQuote = async (
  req,
  res,
  next
) => {
  try {
    const {
      items,
      adminNote = "",
      validUntil = null,
    } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      const error = new Error(
        "At least one priced item is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const bulkQuote =
      await BulkQuote.findById(
        req.params.id
      );

    if (!bulkQuote) {
      const error = new Error(
        "Bulk quote not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK STATUS
    // --------------------------------------------------------

    const allowedStatuses = [
      "pending",
      "reviewing",
      "quoted",
    ];

    if (
      !allowedStatuses.includes(
        bulkQuote.status
      )
    ) {
      const error = new Error(
        `Bulk quote cannot be priced while in "${bulkQuote.status}" status`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // APPLY PRICING TO EACH ITEM
    // --------------------------------------------------------

    let totalAmount = 0;

    for (const priced of items) {
      const {
        productId,
        quotedPrice,
      } = priced;

      if (!productId) {
        const error = new Error(
          "Product ID is required for every priced item"
        );

        error.statusCode = 400;

        return next(error);
      }

      const parsedQuotedPrice =
        Number(quotedPrice);

      if (
        !Number.isFinite(
          parsedQuotedPrice
        ) ||
        parsedQuotedPrice < 0
      ) {
        const error = new Error(
          "Valid quoted price is required for every item"
        );

        error.statusCode = 400;

        return next(error);
      }

      const quoteItem =
        bulkQuote.items.find(
          (item) =>
            item.product.toString() ===
            productId.toString()
        );

      if (!quoteItem) {
        const error = new Error(
          `Product ${productId} is not part of this bulk quote`
        );

        error.statusCode = 400;

        return next(error);
      }

      quoteItem.quotedPrice =
        parsedQuotedPrice;

      totalAmount +=
        parsedQuotedPrice *
        quoteItem.quantity;
    }

    // --------------------------------------------------------
    // VALIDATE ALL ITEMS ARE PRICED
    // --------------------------------------------------------

    const unpricedItem =
      bulkQuote.items.find(
        (item) =>
          item.quotedPrice === null ||
          item.quotedPrice === undefined
      );

    if (unpricedItem) {
      const error = new Error(
        "Bulk quote must include pricing for every item"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // VALIDATE VALID UNTIL
    // --------------------------------------------------------

    let quoteValidUntil = null;

    if (validUntil) {
      const parsedDate = new Date(
        validUntil
      );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        const error = new Error(
          "Invalid quote validity date"
        );

        error.statusCode = 400;

        return next(error);
      }

      if (parsedDate <= new Date()) {
        const error = new Error(
          "validUntil must be a future date"
        );

        error.statusCode = 400;

        return next(error);
      }

      quoteValidUntil = parsedDate;
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    bulkQuote.status = "quoted";
    bulkQuote.totalAmount = totalAmount;
    bulkQuote.adminNote =
      typeof adminNote === "string"
        ? adminNote.trim()
        : "";
    bulkQuote.validUntil = quoteValidUntil;
    bulkQuote.quotedAt = new Date();

    await bulkQuote.save();

    res.status(200).json({
      success: true,

      message:
        "Bulk quote priced and sent successfully",

      bulkQuote: {
        id: bulkQuote._id,
        quoteNumber: bulkQuote.quoteNumber,
        items: bulkQuote.items,
        totalAmount: bulkQuote.totalAmount,
        adminNote: bulkQuote.adminNote,
        validUntil: bulkQuote.validUntil,
        status: bulkQuote.status,
        quotedAt: bulkQuote.quotedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE BULK QUOTE STATUS - ADMIN
// (for marking "reviewing" or rejecting a request outright)
// ============================================================

const updateAdminBulkQuoteStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "reviewing",
      "rejected",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid bulk quote status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    const bulkQuote =
      await BulkQuote.findById(
        req.params.id
      );

    if (!bulkQuote) {
      const error = new Error(
        "Bulk quote not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      [
        "accepted",
        "rejected",
        "cancelled",
      ].includes(bulkQuote.status)
    ) {
      const error = new Error(
        `A ${bulkQuote.status} bulk quote cannot be updated further`
      );

      error.statusCode = 400;

      return next(error);
    }

    bulkQuote.status = status;

    if (status === "rejected") {
      bulkQuote.rejectedAt = new Date();
    }

    if (status === "cancelled") {
      bulkQuote.cancelledAt = new Date();
    }

    await bulkQuote.save();

    res.status(200).json({
      success: true,

      message:
        "Bulk quote status updated successfully",

      bulkQuote: {
        id: bulkQuote._id,
        quoteNumber: bulkQuote.quoteNumber,
        status: bulkQuote.status,
        rejectedAt: bulkQuote.rejectedAt,
        cancelledAt: bulkQuote.cancelledAt,
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
  getAdminBulkQuotes,
  getAdminBulkQuoteById,
  respondToBulkQuote,
  updateAdminBulkQuoteStatus,
};