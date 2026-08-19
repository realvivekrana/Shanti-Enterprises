const crypto = require('crypto');

const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const razorpay =
  require('../config/razorpay');

const Payment =
  require('../models/Payment');

const CustomerCredit =
  require('../models/CustomerCredit');

const CreditTransaction =
  require('../models/CreditTransaction');

const Order =
  require('../models/Order');

// ==============================
// CREATE RAZORPAY ORDER
// ==============================

const createOrder =
  asyncHandler(async (req, res) => {

    const {
      amount,
    } = req.body;


    const paymentAmount =
      Number(amount);


    if (
      !Number.isFinite(
        paymentAmount
      ) ||
      paymentAmount <= 0
    ) {

      throw new ApiError(
        400,
        'Valid payment amount is required'
      );

    }


    // Razorpay amount must be in paise

    const amountInPaise =
      Math.round(
        paymentAmount * 100
      );


    const options = {

      amount:
        amountInPaise,

      currency:
        'INR',

      receipt:
        `receipt_${Date.now()}`,

      notes: {

        customerId:
          req.user._id.toString(),

      },

    };


    const razorpayOrder =
      await razorpay.orders.create(
        options
      );


    res.status(200).json({

      success:
        true,

      id:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      receipt:
        razorpayOrder.receipt,

    });

  });


// ==============================
// VERIFY RAZORPAY PAYMENT
// ==============================

const verifyPayment =
  asyncHandler(async (req, res) => {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = req.body;


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {

      throw new ApiError(
        400,
        'Incomplete Razorpay payment details'
      );

    }


    // ==============================
    // CREATE SIGNATURE
    // ==============================

    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest('hex');


    // ==============================
    // TIMING-SAFE SIGNATURE CHECK
    // ==============================

    let signaturesMatch =
      false;


    try {

      const expectedBuffer =
        Buffer.from(
          generatedSignature,
          'hex'
        );


      const receivedBuffer =
        Buffer.from(
          razorpay_signature,
          'hex'
        );


      if (
        expectedBuffer.length ===
        receivedBuffer.length
      ) {

        signaturesMatch =
          crypto.timingSafeEqual(
            expectedBuffer,
            receivedBuffer
          );

      }

    } catch (error) {

      signaturesMatch =
        false;

    }


    if (
      !signaturesMatch
    ) {

      throw new ApiError(
        400,
        'Payment verification failed'
      );

    }


    // ==============================
    // VERIFY RAZORPAY ORDER OWNER
    // ==============================

    let razorpayOrder;


    try {

      razorpayOrder =
        await razorpay.orders.fetch(
          razorpay_order_id
        );

    } catch (error) {

      throw new ApiError(
        400,
        'Unable to verify Razorpay order'
      );

    }


    const customerId =
      razorpayOrder?.notes?.customerId;


    if (
      !customerId ||
      customerId !==
        req.user._id.toString()
    ) {

      throw new ApiError(
        403,
        'This payment does not belong to the authenticated customer'
      );

    }


    // ==============================
    // VERIFY PAYMENT FROM RAZORPAY
    // ==============================

    let razorpayPayment;


    try {

      razorpayPayment =
        await razorpay.payments.fetch(
          razorpay_payment_id
        );

    } catch (error) {

      throw new ApiError(
        400,
        'Unable to verify Razorpay payment'
      );

    }


    // ==============================
    // PAYMENT → ORDER CHECK
    // ==============================

    if (
      razorpayPayment?.order_id !==
      razorpay_order_id
    ) {

      throw new ApiError(
        400,
        'Payment does not belong to the Razorpay order'
      );

    }


    // ==============================
    // CAPTURED CHECK
    // ==============================

    if (
      razorpayPayment?.status !==
      'captured'
    ) {

      throw new ApiError(
        400,
        `Payment is not captured. Current status: ${
          razorpayPayment?.status ||
          'unknown'
        }`
      );

    }


    // ==============================
    // SUCCESS
    // ==============================

    res.status(200).json({

      success:
        true,

      message:
        'Payment verified successfully',

      razorpay_order_id,

      razorpay_payment_id,

      amount:
        razorpayPayment.amount,

      currency:
        razorpayPayment.currency,

      status:
        razorpayPayment.status,

    });

  });


// ==============================
// CREATE PAYMENT RECORD
// ==============================

const createPayment =
  asyncHandler(async (req, res) => {

    const {

      orderId,

      amount,

      method,

      gateway,

      transactionId,

    } = req.body;


    if (!orderId) {

      throw new ApiError(
        400,
        'Order ID is required'
      );

    }


    const order =
      await Order.findById(
        orderId
      );


    if (!order) {

      throw new ApiError(
        404,
        'Order not found'
      );

    }


    // ==============================
    // CUSTOMER CHECK
    // ==============================

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {

      throw new ApiError(
        403,
        'You are not authorized for this order'
      );

    }


    // ==============================
    // AMOUNT
    // ==============================

    const paymentAmount =
      Number(amount);


    if (
      !Number.isFinite(
        paymentAmount
      ) ||
      paymentAmount <= 0
    ) {

      throw new ApiError(
        400,
        'Payment amount must be greater than zero'
      );

    }


    // Payment cannot exceed order total

    if (
      paymentAmount >
      Number(order.totalPrice)
    ) {

      throw new ApiError(
        400,
        'Payment amount cannot exceed the order total'
      );

    }


    // Already paid order

    if (
      order.isPaid
    ) {

      throw new ApiError(
        400,
        'This order is already paid'
      );

    }


    // ==============================
    // PAYMENT METHOD
    // ==============================

    const allowedMethods = [

      'upi',

      'card',

      'netbanking',

      'wallet',

      'cod',

      'partial',

      'credit',

      'razorpay',

    ];


    if (
      !allowedMethods.includes(
        method
      )
    ) {

      throw new ApiError(
        400,
        'Invalid payment method'
      );

    }


    // ==============================
    // CREATE PAYMENT
    // ==============================

    const payment =
      await Payment.create({

        customer:
          req.user._id,

        order:
          order._id,

        amount:
          paymentAmount,

        method,

        gateway:
          gateway ||
          (
            method === 'credit'
              ? 'credit'
              : method === 'cod'
                ? 'cod'
                : 'razorpay'
          ),

        transactionId:
          transactionId ||
          null,

        status:
          method === 'cod'
            ? 'pending'
            : 'processing',

      });


    res.status(201).json(

      new ApiResponse(

        201,

        payment,

        'Payment record created successfully'

      )

    );

  });


// ==============================
// USE CREDIT
// ==============================

const useCredit =
  asyncHandler(async (req, res) => {

    const {

      orderId,

      amount,

    } = req.body;


    if (!orderId) {

      throw new ApiError(
        400,
        'Order ID is required'
      );

    }


    const creditAmount =
      Number(amount);


    if (
      !Number.isFinite(
        creditAmount
      ) ||
      creditAmount <= 0
    ) {

      throw new ApiError(
        400,
        'Credit amount must be greater than zero'
      );

    }


    // ==============================
    // GET CREDIT ACCOUNT
    // ==============================

    const credit =
      await CustomerCredit.findOne({

        customer:
          req.user._id,

      });


    if (!credit) {

      throw new ApiError(
        404,
        'Credit account not found'
      );

    }


    if (
      credit.status !==
      'active'
    ) {

      throw new ApiError(
        400,
        'Your credit account is not active'
      );

    }


    // ==============================
    // AVAILABLE CREDIT
    // ==============================

    const availableCredit =
      Math.max(

        credit.creditLimit -
          credit.usedCredit,

        0

      );


    if (
      creditAmount >
      availableCredit
    ) {

      throw new ApiError(
        400,
        `Credit limit exceeded. Available credit: ₹${availableCredit}`
      );

    }


    // ==============================
    // ORDER
    // ==============================

    const order =
      await Order.findById(
        orderId
      );


    if (!order) {

      throw new ApiError(
        404,
        'Order not found'
      );

    }


    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {

      throw new ApiError(
        403,
        'You are not authorized for this order'
      );

    }


    // Credit cannot exceed order total

    if (
      creditAmount >
      Number(order.totalPrice)
    ) {

      throw new ApiError(
        400,
        'Credit amount cannot exceed the order total'
      );

    }


    if (
      order.isPaid
    ) {

      throw new ApiError(
        400,
        'This order is already paid'
      );

    }


    // ==============================
    // UPDATE CREDIT
    // ==============================

    credit.usedCredit +=
      creditAmount;

    credit.dueAmount +=
      creditAmount;

    credit.totalCreditUsed +=
      creditAmount;


    const dueDate =
      new Date();


    dueDate.setDate(

      dueDate.getDate() +
        credit.creditPeriodDays

    );


    await credit.save();


    // ==============================
    // PAYMENT RECORD
    // ==============================

    const payment =
      await Payment.create({

        customer:
          req.user._id,

        order:
          order._id,

        amount:
          creditAmount,

        method:
          'credit',

        gateway:
          'credit',

        status:
          'success',

        paidAt:
          new Date(),

      });


    // ==============================
    // CREDIT TRANSACTION
    // ==============================

    await CreditTransaction.create({

      customer:
        req.user._id,

      order:
        order._id,

      type:
        'credit_used',

      amount:
        creditAmount,

      balanceAfter:
        credit.usedCredit,

      description:
        'Credit used for order',

      payment:
        payment._id,

      dueDate,

    });


    res.status(200).json(

      new ApiResponse(

        200,

        {

          payment,

          credit,

          dueDate,

        },

        'Credit applied successfully'

      )

    );

  });


// ==============================
// GET MY CREDIT
// ==============================

const getMyCredit =
  asyncHandler(async (req, res) => {

    let credit =
      await CustomerCredit.findOne({

        customer:
          req.user._id,

      });


    if (!credit) {

      credit =
        await CustomerCredit.create({

          customer:
            req.user._id,

        });

    }


    const availableCredit =
      Math.max(

        credit.creditLimit -
          credit.usedCredit,

        0

      );


    res.status(200).json(

      new ApiResponse(

        200,

        {

          ...credit.toObject(),

          availableCredit,

        },

        'Credit information fetched'

      )

    );

  });


// ==============================
// GET CREDIT HISTORY
// ==============================

const getCreditHistory =
  asyncHandler(async (req, res) => {

    const history =
      await CreditTransaction.find({

        customer:
          req.user._id,

      })

        .populate(
          'order',
          '_id'
        )

        .populate(
          'payment',
          'amount method status transactionId'
        )

        .sort({
          createdAt: -1,
        });


    res.status(200).json(

      new ApiResponse(

        200,

        history,

        'Credit history fetched'

      )

    );

  });


// ==============================
// ADMIN: UPDATE CREDIT
// ==============================

const updateCustomerCredit =
  asyncHandler(async (req, res) => {

    const {

      customerId,

      creditLimit,

      creditPeriodDays,

      status,

    } = req.body;


    if (!customerId) {

      throw new ApiError(
        400,
        'Customer ID is required'
      );

    }


    const limit =
      Number(
        creditLimit
      );


    const period =
      Number(
        creditPeriodDays
      );


    if (
      !Number.isFinite(
        limit
      ) ||
      limit < 0
    ) {

      throw new ApiError(
        400,
        'Invalid credit limit'
      );

    }


    if (
      !Number.isInteger(
        period
      ) ||
      period < 0
    ) {

      throw new ApiError(
        400,
        'Invalid credit period'
      );

    }


    let credit =
      await CustomerCredit.findOne({

        customer:
          customerId,

      });


    if (!credit) {

      credit =
        new CustomerCredit({

          customer:
            customerId,

        });

    }


    credit.creditLimit =
      limit;


    credit.creditPeriodDays =
      period;


    if (status) {

      credit.status =
        status;

    }


    await credit.save();


    res.status(200).json(

      new ApiResponse(

        200,

        credit,

        'Customer credit updated successfully'

      )

    );

  });


// ==============================
// ADMIN: RECORD CREDIT PAYMENT
// ==============================

const recordCreditPayment =
  asyncHandler(async (req, res) => {

    const {

      customerId,

      orderId,

      amount,

      description,

    } = req.body;


    const paymentAmount =
      Number(amount);


    if (
      !customerId ||
      !Number.isFinite(
        paymentAmount
      ) ||
      paymentAmount <= 0
    ) {

      throw new ApiError(
        400,
        'Customer ID and valid payment amount are required'
      );

    }


    const credit =
      await CustomerCredit.findOne({

        customer:
          customerId,

      });


    if (!credit) {

      throw new ApiError(
        404,
        'Credit account not found'
      );

    }


    if (
      paymentAmount >
      credit.dueAmount
    ) {

      throw new ApiError(
        400,
        'Payment cannot be greater than due amount'
      );

    }


    // ==============================
    // UPDATE CREDIT
    // ==============================

    credit.usedCredit =
      Math.max(

        credit.usedCredit -
          paymentAmount,

        0

      );


    credit.dueAmount =
      Math.max(

        credit.dueAmount -
          paymentAmount,

        0

      );


    credit.totalPaid +=
      paymentAmount;


    credit.lastPaymentAt =
      new Date();


    await credit.save();


    // ==============================
    // TRANSACTION
    // ==============================

    const transaction =
      await CreditTransaction.create({

        customer:
          customerId,

        order:
          orderId ||
          null,

        type:
          'payment',

        amount:
          paymentAmount,

        balanceAfter:
          credit.usedCredit,

        description:
          description ||
          'Credit payment received',

      });


    res.status(200).json(

      new ApiResponse(

        200,

        {

          credit,

          transaction,

        },

        'Credit payment recorded successfully'

      )

    );

  });


// ==============================
// EXPORT
// ==============================

module.exports = {

  createOrder,

  verifyPayment,

  createPayment,

  useCredit,

  getMyCredit,

  getCreditHistory,

  updateCustomerCredit,

  recordCreditPayment,

};