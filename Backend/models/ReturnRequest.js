const mongoose = require('mongoose');

// ==============================
// RETURN ITEM
// ==============================

const returnItemSchema =
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

      orderedQuantity: {
        type: Number,
        required: true,
        min: 1,
      },

      returnQuantity: {
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

// ==============================
// STATUS HISTORY
// ==============================

const statusHistorySchema =
  new mongoose.Schema(
    {
      status: {
        type: String,
        required: true,
      },

      note: {
        type: String,
        default: '',
      },

      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: false,
    }
  );

// ==============================
// RETURN REQUEST SCHEMA
// ==============================

const returnRequestSchema =
  new mongoose.Schema(
    {
      // ==============================
      // ORDER
      // ==============================

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
      },

      // ==============================
      // CUSTOMER
      // ==============================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ==============================
      // RETURN TYPE
      // ==============================

      type: {
        type: String,

        enum: [
          'return',
          'refund',
        ],

        required: true,
      },

      // ==============================
      // RETURN REASON
      // ==============================

      reason: {
        type: String,

        enum: [
          'Damaged',
          'Wrong Product',
          'Quantity Mismatch',
          'Defective',
          'Quality Issue',
          'Other',
        ],

        required: true,
      },

      // ==============================
      // CUSTOMER DESCRIPTION
      // ==============================

      description: {
        type: String,
        default: '',
        maxlength: 3000,
      },

      // ==============================
      // RETURN ITEMS
      // ==============================

      items: {
        type: [
          returnItemSchema,
        ],

        default: [],
      },

      // ==============================
      // REQUESTED REFUND
      // ==============================

      requestedRefundAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      // ==============================
      // APPROVED REFUND
      // ==============================

      approvedRefundAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      // ==============================
      // STATUS
      // ==============================

      status: {
        type: String,

        enum: [
          'Requested',
          'Under Review',
          'Approved',
          'Rejected',
          'Pickup Scheduled',
          'Picked Up',
          'Received',
          'Inspection',
          'Refund Pending',
          'Refunded',
          'Cancelled',
        ],

        default: 'Requested',
      },

      // ==============================
      // ADMIN NOTE
      // ==============================

      adminNote: {
        type: String,
        default: '',
      },

      // ==============================
      // INSPECTION
      // ==============================

      inspectionStatus: {
        type: String,

        enum: [
          'Pending',
          'Passed',
          'Failed',
        ],

        default: 'Pending',
      },

      inspectionNote: {
        type: String,
        default: '',
      },

      inspectedAt: {
        type: Date,
        default: null,
      },

      inspectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },

      // ==============================
      // REVERSE PICKUP
      // ==============================

      pickup: {
        carrier: {
          type: String,
          default: '',
        },

        trackingId: {
          type: String,
          default: '',
        },

        trackingUrl: {
          type: String,
          default: '',
        },

        scheduledDate: {
          type: Date,
          default: null,
        },

        pickedUpAt: {
          type: Date,
          default: null,
        },
      },

      // ==============================
      // REFUND
      // ==============================

      refund: {
        amount: {
          type: Number,
          default: 0,
          min: 0,
        },

        method: {
          type: String,

          enum: [
            'original_payment',
            'bank_transfer',
            'upi',
            'credit',
            'manual',
          ],

          default: null,
        },

        transactionId: {
          type: String,
          default: '',
        },

        status: {
          type: String,

          enum: [
            'Pending',
            'Processing',
            'Completed',
            'Failed',
          ],

          default: 'Pending',
        },

        processedAt: {
          type: Date,
          default: null,
        },
      },

      // ==============================
      // EVIDENCE / IMAGES
      // ==============================

      evidenceImages: {
        type: [
          String,
        ],

        default: [],
      },

      // ==============================
      // STATUS HISTORY
      // ==============================

      statusHistory: {
        type: [
          statusHistorySchema,
        ],

        default: [],
      },
    },

    {
      timestamps: true,
    }
  );

// ==============================
// INDEXES
// ==============================

returnRequestSchema.index({
  user: 1,
  createdAt: -1,
});

returnRequestSchema.index({
  order: 1,
});

returnRequestSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    'ReturnRequest',
    returnRequestSchema
  );