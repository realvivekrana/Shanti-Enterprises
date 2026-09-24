// ============================================================
// SHANTI ENTERPRISES
// Bulk Quote Model
// Phase 4 - Wholesale
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// BULK QUOTE ITEM
// ============================================================

const bulkQuoteItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      default: "piece",
      trim: true,
    },

    requestedPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    // --------------------------------------------------------
    // ADMIN QUOTED PRICE (set when admin responds)
    // --------------------------------------------------------

    quotedPrice: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ============================================================
// BULK QUOTE SCHEMA
// ============================================================

const bulkQuoteSchema = new mongoose.Schema(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [bulkQuoteItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          items.length > 0,

        message:
          "Bulk quote must contain at least one product",
      },
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "quoted",
        "accepted",
        "rejected",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    // --------------------------------------------------------
    // ADMIN RESPONSE
    // --------------------------------------------------------

    adminNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    totalAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    validUntil: {
      type: Date,
      default: null,
    },

    quotedAt: {
      type: Date,
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BulkQuote = mongoose.model(
  "BulkQuote",
  bulkQuoteSchema
);

module.exports = BulkQuote;