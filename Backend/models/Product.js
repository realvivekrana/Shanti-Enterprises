// ============================================================
// SHANTI ENTERPRISES
// Product Model
// Phase 4 - Wholesale Pricing
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// WHOLESALE PRICE TIER
// ============================================================

const wholesalePriceTierSchema =
  new mongoose.Schema(
    {
      minQuantity: {
        type: Number,
        required: true,
        min: 1,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

// ============================================================
// PRODUCT SCHEMA
// ============================================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
      default: undefined,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    image: {
      type: String,
      default: "",
      trim: true,
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

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // WHOLESALE SETTINGS
    // ========================================================

    moq: {
      type: Number,
      default: 1,
      min: 1,
    },

    isWholesale: {
      type: Boolean,
      default: true,
    },

    wholesalePriceTiers: {
      type: [wholesalePriceTierSchema],
      default: [],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;
