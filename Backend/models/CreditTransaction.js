const mongoose = require('mongoose');

// ==============================
// CREDIT TRANSACTION
// ==============================

const creditTransactionSchema =
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
      // ORDER
      // ==============================

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null,
      },

      // ==============================
      // TRANSACTION TYPE
      // ==============================

      type: {
        type: String,

        enum: [
          'credit_used',
          'payment',
          'adjustment',
          'refund',
        ],

        required: true,
      },

      // ==============================
      // AMOUNT
      // ==============================

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==============================
      // BALANCE AFTER TRANSACTION
      // ==============================

      balanceAfter: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==============================
      // DESCRIPTION
      // ==============================

      description: {
        type: String,
        trim: true,
        default: '',
      },

      // ==============================
      // PAYMENT REFERENCE
      // ==============================

      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        default: null,
      },

      // ==============================
      // DUE DATE
      // ==============================

      dueDate: {
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

creditTransactionSchema.index({
  customer: 1,
  createdAt: -1,
});

creditTransactionSchema.index({
  order: 1,
});

module.exports =
  mongoose.model(
    'CreditTransaction',
    creditTransactionSchema
  );