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
// HELPER
// ============================================================

const createControllerError = (
  message,
  statusCode
) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

const createPaymentOrder = async (
  req,
  res,
  next
) => {
  try {
    // ========================================================
    // CHECK RAZORPAY PACKAGE
    // ========================================================

    if (!Razorpay) {
      return next(
        createControllerError(
          "Razorpay package is not installed",
          500
        )
      );
    }

    // ========================================================
    // CHECK RAZORPAY CONFIGURATION
    // ========================================================

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return next(
        createControllerError(
          "Razorpay configuration is missing",
          500
        )
      );
    }

    // ========================================================
    // GET ORDER ID
    // ========================================================

    const {
      orderId,
    } = req.body;

    if (!orderId) {
      return next(
        createControllerError(
          "Order ID is required",
          400
        )
      );
    }

    // ========================================================
    // FIND ORDER
    // ONLY CURRENT USER'S ORDER
    // ========================================================

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user._id,
      });

    if (!order) {
      return next(
        createControllerError(
          "Order not found",
          404
        )
      );
    }

    // ========================================================
    // ALREADY PAID CHECK
    // ========================================================

    if (order.isPaid === true) {
      return next(
        createControllerError(
          "Order has already been paid",
          400
        )
      );
    }

    // ========================================================
    // ORDER TOTAL
    //
    // IMPORTANT:
    // Existing Order model uses totalPrice.
    // ========================================================

    const amount = Number(
      order.totalPrice
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return next(
        createControllerError(
          "Invalid order amount",
          400
        )
      );
    }

    // ========================================================
    // CREATE RAZORPAY INSTANCE
    // ========================================================

    const razorpay =
      new Razorpay({
        key_id:
          process.env.RAZORPAY_KEY_ID,

        key_secret:
          process.env.RAZORPAY_KEY_SECRET,
      });

    // ========================================================
    // CREATE RAZORPAY ORDER
    // ========================================================

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

          // IMPORTANT:
          // Existing order payment verification
          // expects customerId.
          customerId:
            order.user.toString(),
        },
      });

    // ========================================================
    // CREATE / UPDATE PAYMENT RECORD
    // ========================================================

    const payment =
      await Payment.findOneAndUpdate(
        {
          order: order._id,
        },

        {
          $set: {
            user:
              req.user._id,

            amount,

            currency: "INR",

            provider: "razorpay",

            razorpayOrderId:
              razorpayOrder.id,

            status: "created",

            razorpayPaymentId:
              "",

            razorpaySignature:
              "",

            paidAt:
              null,

            failedAt:
              null,

            failureReason:
              "",
          },
        },

        {
          upsert: true,

          new: true,

          setDefaultsOnInsert: true,
        }
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(201).json({
      success: true,

      message:
        "Payment order created successfully",

      payment: {
        id:
          payment._id,

        orderId:
          order._id,

        razorpayOrderId:
          razorpayOrder.id,

        amount:
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
    // ========================================================
    // CHECK RAZORPAY CONFIGURATION
    // ========================================================

    if (
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return next(
        createControllerError(
          "Razorpay configuration is missing",
          500
        )
      );
    }

    // ========================================================
    // GET PAYMENT DATA
    // ========================================================

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
      return next(
        createControllerError(
          "Payment verification data is incomplete",
          400
        )
      );
    }

    // ========================================================
    // FIND PAYMENT
    // ========================================================

    const payment =
      await Payment.findOne({
        razorpayOrderId,

        user:
          req.user._id,
      });

    if (!payment) {
      return next(
        createControllerError(
          "Payment record not found",
          404
        )
      );
    }

    // ========================================================
    // GET ORDER
    // ========================================================

    const order =
      await Order.findOne({
        _id:
          payment.order,

        user:
          req.user._id,
      });

    if (!order) {
      return next(
        createControllerError(
          "Order not found",
          404
        )
      );
    }

    // ========================================================
    // ALREADY PAID
    // ========================================================

    if (
      payment.status === "paid" &&
      order.isPaid === true
    ) {
      return res.status(200).json({
        success: true,

        message:
          "Payment is already verified",

        payment: {
          id:
            payment._id,

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
    }

    // ========================================================
    // VERIFY RAZORPAY SIGNATURE
    // ========================================================

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

    // ========================================================
    // TIMING-SAFE SIGNATURE COMPARISON
    // ========================================================

    const generatedBuffer =
      Buffer.from(
        generatedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        razorpaySignature,
        "utf8"
      );

    const signatureValid =
      generatedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      );

    // ========================================================
    // INVALID SIGNATURE
    // ========================================================

    if (!signatureValid) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Invalid payment signature";

      await payment.save();

      return next(
        createControllerError(
          "Payment verification failed",
          400
        )
      );
    }

    // ========================================================
    // VERIFY AMOUNT
    // ========================================================

    const expectedAmount =
      Math.round(
        Number(
          order.totalPrice
        ) * 100
      );

    const paymentAmount =
      Math.round(
        Number(
          payment.amount
        ) * 100
      );

    if (
      paymentAmount !==
      expectedAmount
    ) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Payment amount does not match order amount";

      await payment.save();

      return next(
        createControllerError(
          "Payment amount does not match order amount",
          400
        )
      );
    }

    // ========================================================
    // RAZORPAY PAYMENT OBJECT
    //
    // We don't trust only the frontend response.
    // Fetch payment directly from Razorpay.
    // ========================================================

    let razorpayPayment;

    try {
      const razorpay =
        new Razorpay({
          key_id:
            process.env.RAZORPAY_KEY_ID,

          key_secret:
            process.env.RAZORPAY_KEY_SECRET,
        });

      razorpayPayment =
        await razorpay.payments.fetch(
          razorpayPaymentId
        );
    } catch (error) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Unable to verify payment with Razorpay";

      await payment.save();

      return next(
        createControllerError(
          "Unable to verify payment with Razorpay",
          400
        )
      );
    }

    // ========================================================
    // RAZORPAY ORDER ID CHECK
    // ========================================================

    if (
      razorpayPayment.order_id !==
      razorpayOrderId
    ) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Razorpay order ID does not match";

      await payment.save();

      return next(
        createControllerError(
          "Razorpay order ID does not match",
          400
        )
      );
    }

    // ========================================================
    // CAPTURED CHECK
    // ========================================================

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        `Payment is not captured. Current status: ${razorpayPayment.status}`;

      await payment.save();

      return next(
        createControllerError(
          `Payment is not captured. Current status: ${razorpayPayment.status}`,
          400
        )
      );
    }

    // ========================================================
    // RAZORPAY AMOUNT CHECK
    // ========================================================

    if (
      Number(
        razorpayPayment.amount
      ) !== expectedAmount
    ) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        "Razorpay payment amount does not match order amount";

      await payment.save();

      return next(
        createControllerError(
          "Razorpay payment amount does not match order amount",
          400
        )
      );
    }

    // ========================================================
    // SAVE PAYMENT
    // ========================================================

    payment.razorpayPaymentId =
      razorpayPaymentId;

    payment.razorpaySignature =
      razorpaySignature;

    payment.status =
      "paid";

    payment.paidAt =
      new Date();

    payment.failedAt =
      null;

    payment.failureReason =
      "";

    await payment.save();

    // ========================================================
    // UPDATE ORDER
    //
    // Existing Order system uses:
    // isPaid
    // paidAt
    // paymentResult
    // ========================================================

    order.isPaid =
      true;

    order.paidAt =
      new Date();

    order.paymentResult = {
      id:
        razorpayPaymentId,

      status:
        "success",

      updateTime:
        new Date().toISOString(),
    };

    await order.save();

    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(200).json({
      success: true,

      message:
        "Payment verified successfully",

      payment: {
        id:
          payment._id,

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

      order: {
        id:
          order._id,

        isPaid:
          order.isPaid,

        paidAt:
          order.paidAt,
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
    // ========================================================
    // FIND PAYMENT
    // ========================================================

    const payment =
      await Payment.findOne({
        order:
          req.params.orderId,

        user:
          req.user._id,
      }).populate(
        "order",
        "orderNumber totalPrice isPaid paidAt orderStatus"
      );

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!payment) {
      return next(
        createControllerError(
          "Payment not found",
          404
        )
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(200).json({
      success: true,

      payment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMyPayment,
};