const mongoose = require('mongoose');

// ==============================
// RFQ ITEM SCHEMA
// ==============================

const rfqItemSchema =
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

      expectedPrice: {
        type: Number,
        min: 0,
        default: null,
      },

      quotedPrice: {
        type: Number,
        min: 0,
        default: null,
      },

      quotedTotal: {
        type: Number,
        min: 0,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

// ==============================
// RFQ SCHEMA
// ==============================

const rfqSchema =
  new mongoose.Schema(
    {
      // ==============================
      // CUSTOMER
      // ==============================

      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ==============================
      // RFQ ITEM
      // ==============================

      items: {
        type: [rfqItemSchema],
        required: true,
        validate: {
          validator: function (items) {
            return (
              Array.isArray(items) &&
              items.length > 0
            );
          },

          message:
            'At least one product is required',
        },
      },

      // ==============================
      // CUSTOMER MESSAGE
      // ==============================

      message: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },

      // ==============================
      // ADMIN MESSAGE
      // ==============================

      adminMessage: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },

      // ==============================
      // STATUS
      // ==============================

      status: {
        type: String,

        enum: [
          'pending',
          'quoted',
          'accepted',
          'rejected',
          'expired',
          'cancelled',
        ],

        default: 'pending',
      },

      // ==============================
      // QUOTATION
      // ==============================

      quotationValidUntil: {
        type: Date,
        default: null,
      },

      // ==============================
      // CUSTOMER RESPONSE
      // ==============================

      customerResponseAt: {
        type: Date,
        default: null,
      },

      // ==============================
      // ADMIN
      // ==============================

      quotedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

      quotedAt: {
        type: Date,
        default: null,
      },

      // ==============================
      // TOTALS
      // ==============================

      totalQuantity: {
        type: Number,
        default: 0,
      },

      quotedTotal: {
        type: Number,
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

rfqSchema.index({
  customer: 1,
  createdAt: -1,
});

rfqSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    'RFQ',
    rfqSchema
  );