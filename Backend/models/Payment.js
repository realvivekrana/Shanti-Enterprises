const mongoose = require('mongoose');

// ==============================
// PAYMENT SCHEMA
// ==============================

const paymentSchema = new mongoose.Schema(
  {

    // ==============================
    // CUSTOMER
    // ==============================

    customer: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        'User',

      required:
        true,

    },


    // ==============================
    // ORDER
    // ==============================

    order: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        'Order',

      required:
        true,

    },


    // ==============================
    // PAYMENT AMOUNT
    // ==============================

    amount: {

      type:
        Number,

      required:
        true,

      min:
        0,

    },


    // ==============================
    // PAYMENT METHOD
    // ==============================

    method: {

      type:
        String,

      enum: [

        'razorpay',

        'upi',

        'card',

        'netbanking',

        'wallet',

        'cod',

        'partial',

        'credit',

      ],

      required:
        true,

    },


    // ==============================
    // PAYMENT STATUS
    // ==============================

    status: {

      type:
        String,

      enum: [

        'pending',

        'processing',

        'success',

        'failed',

        'refunded',

        'partially_refunded',

      ],

      default:
        'pending',

    },


    // ==============================
    // GATEWAY
    // ==============================

    gateway: {

      type:
        String,

      enum: [

        'razorpay',

        'cod',

        'credit',

        'manual',

      ],

      default:
        'razorpay',

    },


    // ==============================
    // RAZORPAY DETAILS
    // ==============================

    razorpayOrderId: {

      type:
        String,

      default:
        null,

    },


    razorpayPaymentId: {

      type:
        String,

      default:
        null,

    },


    razorpaySignature: {

      type:
        String,

      default:
        null,

    },


    // ==============================
    // TRANSACTION ID
    // ==============================

    transactionId: {

      type:
        String,

      default:
        null,

    },


    // ==============================
    // FAILURE
    // ==============================

    failureReason: {

      type:
        String,

      default:
        null,

    },


    // ==============================
    // PAYMENT DATE
    // ==============================

    paidAt: {

      type:
        Date,

      default:
        null,

    },

  },

  {

    timestamps:
      true,

  }

);


// ==============================
// INDEXES
// ==============================

paymentSchema.index({

  customer:
    1,

  createdAt:
    -1,

});


paymentSchema.index({

  order:
    1,

  createdAt:
    -1,

});


paymentSchema.index({

  transactionId:
    1,

});


module.exports =
  mongoose.model(
    'Payment',
    paymentSchema
  );