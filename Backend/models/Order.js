// ============================================================
// SHANTI ENTERPRISES
// Order Model
// Phase 2 - Shopping
// Updated - Wholesale Order Support
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// ORDER ITEM
// ============================================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "piece",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ============================================================
// SHIPPING ADDRESS
// ============================================================

const shippingAddressSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

// ============================================================
// ORDER SCHEMA
// ============================================================

const orderSchema = new mongoose.Schema(
  {
    // --------------------------------------------------------
    // ORDER NUMBER
    // --------------------------------------------------------

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // --------------------------------------------------------
    // USER
    // --------------------------------------------------------

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // --------------------------------------------------------
    // WHOLESALE QUOTATION REFERENCE
    // --------------------------------------------------------

    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      default: null,
      index: true,
    },

    // --------------------------------------------------------
    // WHOLESALE RFQ REFERENCE
    // --------------------------------------------------------

    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      default: null,
      index: true,
    },

    // --------------------------------------------------------
    // ITEMS
    // --------------------------------------------------------

    items: {
      type: [orderItemSchema],

      required: true,

      validate: {
        validator: (items) =>
          items.length > 0,

        message:
          "Order must contain at least one item",
      },
    },

    // --------------------------------------------------------
    // SHIPPING ADDRESS
    // --------------------------------------------------------

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // --------------------------------------------------------
    // SUBTOTAL
    // --------------------------------------------------------

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------------
    // TOTAL AMOUNT
    // --------------------------------------------------------

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------------
    // PAYMENT METHOD
    // --------------------------------------------------------

    paymentMethod: {
      type: String,

      enum: [
        "razorpay",
        "cod",
      ],

      default: "razorpay",

      lowercase: true,

      trim: true,

      index: true,
    },

    // --------------------------------------------------------
    // PAYMENT STATUS
    // --------------------------------------------------------

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",

      index: true,
    },

    // --------------------------------------------------------
    // ORDER STATUS
    // --------------------------------------------------------

    orderStatus: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "pending",

      index: true,
    },
  },

  {
    timestamps: true,
  }
);

// ============================================================
// MODEL
// ============================================================

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );

module.exports = Order;