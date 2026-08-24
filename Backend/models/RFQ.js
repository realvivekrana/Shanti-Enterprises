// ============================================================
// SHANTI ENTERPRISES
// RFQ Model
// Phase 4 - Wholesale
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// RFQ ITEM
// ============================================================

const rfqItemSchema = new mongoose.Schema(
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

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  }
);

// ============================================================
// RFQ SCHEMA
// ============================================================

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: {
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
      type: [rfqItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          items.length > 0,

        message:
          "RFQ must contain at least one item",
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

    reviewedAt: {
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

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const RFQ = mongoose.model(
  "RFQ",
  rfqSchema
);

module.exports = RFQ;