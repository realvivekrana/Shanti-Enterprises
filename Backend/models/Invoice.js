const mongoose = require('mongoose');

// ==============================
// INVOICE ITEM
// ==============================

const invoiceItemSchema =
  new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      sku: {
        type: String,
        default: '',
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      rate: {
        type: Number,
        required: true,
        min: 0,
      },

      discount: {
        type: Number,
        default: 0,
        min: 0,
      },

      taxableAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      gstRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      cgstRate: {
        type: Number,
        default: 0,
      },

      cgstAmount: {
        type: Number,
        default: 0,
      },

      sgstRate: {
        type: Number,
        default: 0,
      },

      sgstAmount: {
        type: Number,
        default: 0,
      },

      igstRate: {
        type: Number,
        default: 0,
      },

      igstAmount: {
        type: Number,
        default: 0,
      },

      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

// ==============================
// ADDRESS SNAPSHOT
// ==============================

const addressSchema =
  new mongoose.Schema(
    {
      addressLine1: {
        type: String,
        default: '',
      },

      addressLine2: {
        type: String,
        default: '',
      },

      street: {
        type: String,
        default: '',
      },

      city: {
        type: String,
        default: '',
      },

      state: {
        type: String,
        default: '',
      },

      pincode: {
        type: String,
        default: '',
      },

      country: {
        type: String,
        default: 'India',
      },

      phone: {
        type: String,
        default: '',
      },
    },
    {
      _id: false,
    }
  );

// ==============================
// INVOICE SCHEMA
// ==============================

const invoiceSchema =
  new mongoose.Schema(
    {
      invoiceNumber: {
        type: String,
        required: true,
        unique: true,
      },

      invoiceDate: {
        type: Date,
        default: Date.now,
      },

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true,
      },

      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ==============================
      // SELLER SNAPSHOT
      // ==============================

      seller: {
        name: {
          type: String,
          required: true,
        },

        address: {
          type: addressSchema,
          default: () => ({}),
        },

        gstin: {
          type: String,
          default: '',
        },

        phone: {
          type: String,
          default: '',
        },

        email: {
          type: String,
          default: '',
        },
      },

      // ==============================
      // BUYER SNAPSHOT
      // ==============================

      buyer: {
        name: {
          type: String,
          required: true,
        },

        businessName: {
          type: String,
          default: '',
        },

        gstin: {
          type: String,
          default: '',
        },

        address: {
          type: addressSchema,
          default: () => ({}),
        },

        phone: {
          type: String,
          default: '',
        },

        email: {
          type: String,
          default: '',
        },
      },

      // ==============================
      // ITEMS
      // ==============================

      items: {
        type: [
          invoiceItemSchema,
        ],

        default: [],
      },

      // ==============================
      // TOTALS
      // ==============================

      subtotal: {
        type: Number,
        default: 0,
      },

      totalDiscount: {
        type: Number,
        default: 0,
      },

      taxableAmount: {
        type: Number,
        default: 0,
      },

      totalCGST: {
        type: Number,
        default: 0,
      },

      totalSGST: {
        type: Number,
        default: 0,
      },

      totalIGST: {
        type: Number,
        default: 0,
      },

      shippingAmount: {
        type: Number,
        default: 0,
      },

      grandTotal: {
        type: Number,
        default: 0,
      },

      taxType: {
        type: String,

        enum: [
          'CGST_SGST',
          'IGST',
          'NONE',
        ],

        default: 'NONE',
      },

      paymentMethod: {
        type: String,
        default: '',
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    'Invoice',
    invoiceSchema
  );