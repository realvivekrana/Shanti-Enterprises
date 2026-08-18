const mongoose = require('mongoose');

// ==============================
// CUSTOMER CREDIT SCHEMA
// ==============================

const customerCreditSchema = new mongoose.Schema(
  {
    // ==============================
    // CUSTOMER
    // ==============================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // ==============================
    // CREDIT LIMIT
    // ==============================

    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==============================
    // CURRENTLY USED CREDIT
    // ==============================

    usedCredit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==============================
    // TOTAL DUE AMOUNT
    // ==============================

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==============================
    // CREDIT PERIOD
    // ==============================

    creditPeriodDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==============================
    // ACCOUNT STATUS
    // ==============================

    status: {
      type: String,

      enum: [
        'active',
        'suspended',
        'blocked',
      ],

      default: 'active',
    },

    // ==============================
    // LAST PAYMENT
    // ==============================

    lastPaymentAt: {
      type: Date,
      default: null,
    },

    // ==============================
    // TOTAL PAID
    // ==============================

    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==============================
    // TOTAL CREDIT USED
    // ==============================

    totalCreditUsed: {
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
// AVAILABLE CREDIT
// ==============================

customerCreditSchema.virtual(
  'availableCredit'
).get(function () {
  return Math.max(
    this.creditLimit -
      this.usedCredit,
    0
  );
});

customerCreditSchema.set(
  'toJSON',
  {
    virtuals: true,
  }
);

customerCreditSchema.set(
  'toObject',
  {
    virtuals: true,
  }
);

module.exports =
  mongoose.model(
    'CustomerCredit',
    customerCreditSchema
  );