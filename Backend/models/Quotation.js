const mongoose = require('mongoose');

// ==============================
// QUOTATION PRODUCT SCHEMA
// ==============================

const quotationProductSchema =
  new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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

      offeredPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      finalPrice: {
        type: Number,
        default: null,
        min: 0,
      },

      totalAmount: {
        type: Number,
        default: null,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

// ==============================
// NEGOTIATION HISTORY
// ==============================

const negotiationSchema =
  new mongoose.Schema(
    {
      offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      offeredByRole: {
        type: String,
        enum: [
          'customer',
          'admin',
          'staff',
          'supplier',
        ],
        required: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      message: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: true,
    }
  );

// ==============================
// QUOTATION SCHEMA
// ==============================

const quotationSchema =
  new mongoose.Schema(
    {
      // ==============================
      // RFQ REFERENCE
      // ==============================

      rfqId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RFQ',
        default: null,
      },

      // ==============================
      // CUSTOMER
      // ==============================

      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ==============================
      // SUPPLIER
      // ==============================

      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ==============================
      // PRODUCTS
      // ==============================

      products: {
        type: [quotationProductSchema],

        required: true,

        validate: {
          validator: function (
            products
          ) {
            return (
              Array.isArray(
                products
              ) &&
              products.length > 0
            );
          },

          message:
            'At least one product is required',
        },
      },

      // ==============================
      // TOTAL QUANTITY
      // ==============================

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      // ==============================
      // OFFERED PRICE
      // ==============================

      offeredPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==============================
      // FINAL PRICE
      // ==============================

      finalPrice: {
        type: Number,
        default: null,
        min: 0,
      },

      // ==============================
      // TOTAL QUOTATION VALUE
      // ==============================

      totalAmount: {
        type: Number,
        default: null,
        min: 0,
      },

      // ==============================
      // STATUS
      // ==============================

      status: {
        type: String,

        enum: [
          'draft',
          'offered',
          'negotiating',
          'accepted',
          'rejected',
          'expired',
          'cancelled',
        ],

        default: 'offered',
      },

      // ==============================
      // NEGOTIATION HISTORY
      // ==============================

      negotiationHistory: {
        type: [
          negotiationSchema,
        ],

        default: [],
      },

      // ==============================
      // EXPIRY
      // ==============================

      expiryDate: {
        type: Date,
        required: true,
      },

      // ==============================
      // ACCEPTED / REJECTED
      // ==============================

      respondedAt: {
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
    },
    {
      timestamps: true,
    }
  );

// ==============================
// INDEXES
// ==============================

quotationSchema.index({
  customerId: 1,
  createdAt: -1,
});

quotationSchema.index({
  supplierId: 1,
  createdAt: -1,
});

quotationSchema.index({
  status: 1,
  createdAt: -1,
});

quotationSchema.index({
  rfqId: 1,
});

module.exports =
  mongoose.model(
    'Quotation',
    quotationSchema
  );