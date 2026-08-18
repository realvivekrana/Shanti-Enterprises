const mongoose = require('mongoose');

// ==============================
// WHOLESALE PRICE SCHEMA
// ==============================

const wholesalePriceSchema = new mongoose.Schema(
  {
    minQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    maxQuantity: {
      type: Number,
      default: null,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// ==============================
// DIMENSIONS SCHEMA
// ==============================

const dimensionsSchema = new mongoose.Schema(
  {
    length: {
      type: Number,
      default: 0,
      min: 0,
    },

    width: {
      type: Number,
      default: 0,
      min: 0,
    },

    height: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      enum: ['cm', 'mm', 'inch'],
      default: 'cm',
    },
  },
  { _id: false }
);

// ==============================
// PRODUCT SCHEMA
// ==============================

const productSchema = new mongoose.Schema(
  {
    // ==============================
    // BASIC PRODUCT INFORMATION
    // ==============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Courier Bags',
        'Boxes',
        'Tapes',
        'Labels',
        'Paper Shredded',
        'Others',
      ],
    },

    brand: {
      type: String,
      trim: true,
      default: '',
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ==============================
    // WHOLESALE / STOCK INFORMATION
    // ==============================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    moq: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },

    // ==============================
    // MULTIPLE QUANTITY PRICING
    // ==============================

    wholesalePricing: {
      type: [wholesalePriceSchema],
      default: [],
    },

    // ==============================
    // GST
    // ==============================

    gst: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==============================
    // PRODUCT IMAGES
    // ==============================

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==============================
    // PRODUCT SPECIFICATIONS
    // ==============================

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // ==============================
    // WEIGHT
    // ==============================

    weight: {
      value: {
        type: Number,
        default: 0,
        min: 0,
      },

      unit: {
        type: String,
        enum: ['g', 'kg'],
        default: 'kg',
      },
    },

    // ==============================
    // DIMENSIONS
    // ==============================

    dimensions: {
      type: dimensionsSchema,
      default: () => ({}),
    },

    // ==============================
    // LOCATION
    // ==============================

    location: {
      type: String,
      trim: true,
      default: '',
    },

    // ==============================
    // DELIVERY TIME
    // ==============================

    deliveryTimeDays: {
      type: Number,
      min: 0,
      default: 7,
    },

    // ==============================
    // PRODUCT FLAGS
    // ==============================

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // REVIEWS
    // ==============================

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  {
    timestamps: true,
  }
);

// ==============================
// VALIDATE WHOLESALE PRICE TIERS
// ==============================

productSchema.path('wholesalePricing').validate(function (tiers) {
  if (!tiers || tiers.length === 0) {
    return true;
  }

  const sortedTiers = [...tiers].sort(
    (a, b) => a.minQuantity - b.minQuantity
  );

  for (let i = 0; i < sortedTiers.length; i++) {
    const current = sortedTiers[i];

    // ==============================
    // MAX QUANTITY VALIDATION
    // ==============================

    if (
      current.maxQuantity !== null &&
      current.maxQuantity < current.minQuantity
    ) {
      return false;
    }

    // ==============================
    // OVERLAPPING TIER VALIDATION
    // ==============================

    if (i < sortedTiers.length - 1) {
      const next = sortedTiers[i + 1];

      if (
        current.maxQuantity !== null &&
        current.maxQuantity >= next.minQuantity
      ) {
        return false;
      }
    }
  }

  return true;
}, 'Wholesale pricing tiers cannot overlap or contain invalid quantities.');

// ==============================
// SKU & BRAND NORMALIZATION
// ==============================

productSchema.pre('validate', function (next) {
  // SKU uppercase
  if (this.sku) {
    this.sku = this.sku
      .trim()
      .toUpperCase();
  }

  // Brand trim
  if (this.brand) {
    this.brand = this.brand.trim();
  }

  // Location trim
  if (this.location) {
    this.location = this.location.trim();
  }

  next();
});

// ==============================
// EXPORT MODEL
// ==============================

module.exports = mongoose.model(
  'Product',
  productSchema
);