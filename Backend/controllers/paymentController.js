// ============================================================
// SHANTI ENTERPRISES
// Payment Controller
// Phase 5 - Operations
// ============================================================

const crypto = require("crypto");

const Payment = require("../models/Payment");
const Order = require("../models/Order");

// ============================================================
// RAZORPAY
// ============================================================

let Razorpay;

try {
  Razorpay = require("razorpay");
} catch (error) {
  Razorpay = null;
}

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

const createPaymentOrder = async (
  req,
  res,
  next
) => {
  try {
    if (!Razorpay) {
      const error = new Error(
        "Razorpay package is not installed"
      );

      error.statusCode = 500;

      return next(error);
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      const error = new Error(
        "Razorpay configuration is missing"
      );

      error.statusCode = 500;

      return next(error);
    }

    const {
      orderId,
    } = req.body;

    if (!orderId) {
      const error = new Error(
        "Order ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user.id,
      });

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      order.paymentStatus === "paid"
    ) {
      const error = new Error(
        "Order has already been paid"
      );

      error.statusCode = 400;

      return next(error);
    }

    const amount = Number(
      order.totalAmount
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      const error = new Error(
        "Invalid order amount"
      );

      error.statusCode = 400;

      return next(error);
    }

    const razorpay =
      new Razorpay({
        key_id:
          process.env.RAZORPAY_KEY_ID,

        key_secret:
          process.env.RAZORPAY_KEY_SECRET,
      });

    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(
          amount * 100
        ),

        currency: "INR",

        receipt:
          `order_${order._id}`,

        notes: {
          orderId:
            order._id.toString(),

          userId:
            req.user.id.toString(),
        },
      });

    await Payment.findOneAndUpdate(
      {
        order: order._id,
      },
      {
        $set: {
          user: req.user.id,

          amount,

          currency: "INR",

          provider: "razorpay",

          razorpayOrderId:
            razorpayOrder.id,

          status: "created",
        },
      },
      {
        upsert: true,

        new: true,

        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      success: true,

      message:
        "Payment order created successfully",

      payment: {
        razorpayOrderId:
          razorpayOrder.id,

        amount,

        amountInPaise:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        keyId:
          process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      const error = new Error(
        "Payment verification data is incomplete"
      );

      error.statusCode = 400;

      return next(error);
    }

    const payment =
      await Payment.findOne({
        razorpayOrderId,
        user: req.user.id,
      });

    if (!payment) {
      const error = new Error(
        "Payment record not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpaySignature
    ) {
      payment.status = "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Invalid payment signature";

      await payment.save();

      const error = new Error(
        "Payment verification failed"
      );

      error.statusCode = 400;

      return next(error);
    }

    payment.razorpayPaymentId =
      razorpayPaymentId;

    payment.razorpaySignature =
      razorpaySignature;

    payment.status = "paid";

    payment.paidAt =
      new Date();

    payment.failureReason = "";

    await payment.save();

    const order =
      await Order.findOne({
        _id: payment.order,
        user: req.user.id,
      });

    if (order) {
      order.paymentStatus = "paid";

      await order.save();
    }

    res.status(200).json({
      success: true,

      message:
        "Payment verified successfully",

      payment: {
        id: payment._id,

        orderId:
          payment.order,

        razorpayOrderId:
          payment.razorpayOrderId,

        razorpayPaymentId:
          payment.razorpayPaymentId,

        status:
          payment.status,

        paidAt:
          payment.paidAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY PAYMENT
// ============================================================

const getMyPayment = async (
  req,
  res,
  next
) => {
  try {
    const payment =
      await Payment.findOne({
        order: req.params.orderId,

        user: req.user.id,
      }).populate(
        "order",
        "orderNumber totalAmount paymentStatus status"
      );

    if (!payment) {
      const error = new Error(
        "Payment not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMyPayment,
};