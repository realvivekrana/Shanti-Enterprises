// ============================================================
// SHANTI ENTERPRISES
// RFQ Controller
// Phase 4 - Wholesale
// ============================================================

const RFQ = require("../models/RFQ");
const Product = require("../models/Product");

const {
  validateWholesaleQuantity,
} = require("../utils/wholesaleUtils");

// ============================================================
// GENERATE RFQ NUMBER
// ============================================================

const generateRFQNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `RFQ-${timestamp}-${random}`;
};

// ============================================================
// CREATE RFQ
// ============================================================

const createRFQ = async (
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

    const rfqItems = [];

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
      } else if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        const error = new Error(
          "Each RFQ item must have a valid quantity"
        );

        error.statusCode = 400;

        return next(error);
      }

      rfqItems.push({
        product: product._id,
        productName: product.name,
        quantity,
        unit: product.unit,
        note: item.note || "",
      });
    }

    const rfq = await RFQ.create({
      rfqNumber:
        generateRFQNumber(),

      user: req.user.id,

      items: rfqItems,

      message:
        typeof message === "string"
          ? message.trim()
          : "",

      status: "pending",
    });

    res.status(201).json({
      success: true,

      message:
        "Wholesale RFQ submitted successfully",

      rfq: {
        id: rfq._id,
        rfqNumber:
          rfq.rfqNumber,
        items: rfq.items,
        message: rfq.message,
        status: rfq.status,
        createdAt:
          rfq.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY RFQs
// ============================================================

const getMyRFQs = async (
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
      rfqs,
      totalRFQs,
    ] = await Promise.all([
      RFQ.find(filter)
        .populate(
          "items.product",
          "name slug image unit price moq isWholesale"
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
// GET SINGLE RFQ
// ============================================================

const getRFQById = async (
  req,
  res,
  next
) => {
  try {
    const rfq =
      await RFQ.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate(
        "items.product",
        "name slug image unit price moq isWholesale"
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
// CANCEL RFQ
// ============================================================

const cancelRFQ = async (
  req,
  res,
  next
) => {
  try {
    const rfq =
      await RFQ.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!rfq) {
      const error = new Error(
        "RFQ not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // Customer can cancel only pending/reviewing RFQs
    if (
      ![
        "pending",
        "reviewing",
      ].includes(rfq.status)
    ) {
      const error = new Error(
        "This RFQ can no longer be cancelled"
      );

      error.statusCode = 400;

      return next(error);
    }

    rfq.status = "cancelled";
    rfq.cancelledAt = new Date();

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
        cancelledAt:
          rfq.cancelledAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRFQ,
  getMyRFQs,
  getRFQById,
  cancelRFQ,
};