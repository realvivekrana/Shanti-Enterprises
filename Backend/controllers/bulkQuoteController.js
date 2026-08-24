// ============================================================
// SHANTI ENTERPRISES
// Bulk Quote Controller
// Phase 4 - Wholesale
// ============================================================

const BulkQuote = require("../models/BulkQuote");
const Product = require("../models/Product");

const {
  validateWholesaleQuantity,
} = require("../utils/wholesaleUtils");

// ============================================================
// GENERATE QUOTE NUMBER
// ============================================================

const generateQuoteNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `BQ-${timestamp}-${random}`;
};

// ============================================================
// CREATE BULK QUOTE
// ============================================================

const createBulkQuote = async (
  req,
  res,
  next
) => {
  try {
    const {
      items,
      message = "",
    } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      const error = new Error(
        "At least one product is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const productIds = items.map(
      (item) => item.productId
    );

    const products = await Product.find({
      _id: {
        $in: productIds,
      },

      isActive: true,
    });

    if (
      products.length !== productIds.length
    ) {
      const error = new Error(
        "One or more selected products are unavailable"
      );

      error.statusCode = 400;

      return next(error);
    }

    const quoteItems = [];

    for (const item of items) {
      const product = products.find(
        (productItem) =>
          productItem._id.toString() ===
          item.productId.toString()
      );

      if (!product) {
        const error = new Error(
          "Product not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      const quantity =
        Number(item.quantity);

      // ------------------------------------------------------
      // MOQ VALIDATION
      // ------------------------------------------------------

      if (product.isWholesale) {
        const moqResult =
          validateWholesaleQuantity(
            quantity,
            product.moq
          );

        if (!moqResult.valid) {
          const error = new Error(
            `${product.name}: ${moqResult.message}`
          );

          error.statusCode = 400;

          return next(error);
        }
      }

      // ------------------------------------------------------
      // REQUESTED PRICE
      // ------------------------------------------------------

      let requestedPrice = null;

      if (
        item.requestedPrice !==
          undefined &&
        item.requestedPrice !==
          null &&
        item.requestedPrice !== ""
      ) {
        requestedPrice =
          Number(
            item.requestedPrice
          );

        if (
          !Number.isFinite(
            requestedPrice
          ) ||
          requestedPrice < 0
        ) {
          const error = new Error(
            `Invalid requested price for ${product.name}`
          );

          error.statusCode = 400;

          return next(error);
        }
      }

      quoteItems.push({
        product: product._id,
        productName: product.name,
        quantity,
        unit: product.unit,
        requestedPrice,
      });
    }

    // --------------------------------------------------------
    // CREATE BULK QUOTE
    // --------------------------------------------------------

    const bulkQuote =
      await BulkQuote.create({
        quoteNumber:
          generateQuoteNumber(),

        user: req.user.id,

        items: quoteItems,

        message:
          typeof message === "string"
            ? message.trim()
            : "",

        status: "pending",
      });

    res.status(201).json({
      success: true,

      message:
        "Bulk quote request submitted successfully",

      bulkQuote: {
        id: bulkQuote._id,

        quoteNumber:
          bulkQuote.quoteNumber,

        items: bulkQuote.items,

        message:
          bulkQuote.message,

        status:
          bulkQuote.status,

        createdAt:
          bulkQuote.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY BULK QUOTES
// ============================================================

const getMyBulkQuotes = async (
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
      bulkQuotes,
      totalQuotes,
    ] = await Promise.all([
      BulkQuote.find(filter)
        .populate(
          "items.product",
          "name slug image price unit moq isWholesale"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      BulkQuote.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalQuotes / perPage
    );

    res.status(200).json({
      success: true,

      count: bulkQuotes.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalQuotes,
        totalPages,
      },

      bulkQuotes,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE BULK QUOTE
// ============================================================

const getBulkQuoteById = async (
  req,
  res,
  next
) => {
  try {
    const bulkQuote =
      await BulkQuote.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate(
        "items.product",
        "name slug image price unit moq isWholesale"
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

module.exports = {
  createBulkQuote,
  getMyBulkQuotes,
  getBulkQuoteById,
};