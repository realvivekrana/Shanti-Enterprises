// ============================================================
// SHANTI ENTERPRISES
// Return Request Model
// Phase 5 - Operations
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// RETURN ITEM
// ============================================================

const returnItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
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

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  }
);

// ============================================================
// RETURN REQUEST SCHEMA
// ============================================================

const returnRequestSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [returnItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          items.length > 0,

        message:
          "Return request must contain at least one item",
      },
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "picked_up",
        "received",
        "refunded",
        "cancelled",
      ],
      default: "requested",
      index: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    receivedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
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

const ReturnRequest = mongoose.model(
  "ReturnRequest",
  returnRequestSchema
);

module.exports = ReturnRequest;