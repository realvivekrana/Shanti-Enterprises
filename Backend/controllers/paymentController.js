// ============================================================
// SHANTI ENTERPRISES
// Payment Controller
// Razorpay Payment Integration
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
  statusCode = 500
) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

// ============================================================
// GET RAZORPAY INSTANCE
// ============================================================

const getRazorpayInstance = () => {
  if (!Razorpay) {
    throw createControllerError(
      "Razorpay package is not installed",
      500
    );
  }

  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw createControllerError(
      "Razorpay configuration is missing",
      500
    );
  }

  return new Razorpay({
    key_id:
      process.env.RAZORPAY_KEY_ID,

    key_secret:
      process.env.RAZORPAY_KEY_SECRET,
  });
};

// ============================================================
// GET ORDER AMOUNT
// ============================================================

const getOrderAmount = (order) => {
  const amount = Number(
    order?.totalPrice
  );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return amount;
};

// ============================================================
// CREATE RAZORPAY ORDER
//
// POST /api/payment/create-order
//
// Body:
// {
//   "orderId": "MONGODB_ORDER_ID"
// }
//
// IMPORTANT:
// Order must already exist in database.
// ============================================================

const createPaymentOrder = async (
  req,
  res,
  next
) => {
  try {
    // ========================================================
    // CHECK RAZORPAY
    // ========================================================

    if (!Razorpay) {
      return next(
        createControllerError(
          "Razorpay package is not installed",
          500
        )
      );
    }

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

    const orderId =
      req.body?.orderId;

    if (!orderId) {
      return next(
        createControllerError(
          "Order ID is required. Create the order first, then start Razorpay payment.",
          400
        )
      );
    }

    // ========================================================
    // FIND CURRENT USER ORDER
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

    if (
      order.isPaid === true
    ) {
      return next(
        createControllerError(
          "Order has already been paid",
          400
        )
      );
    }

    // ========================================================
    // GET ORDER AMOUNT
    // ========================================================

    const amount =
      getOrderAmount(order);

    if (amount === null) {
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
      getRazorpayInstance();

    // ========================================================
    // CREATE RAZORPAY ORDER
    // ========================================================

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          Math.round(
            amount * 100
          ),

        currency:
          "INR",

        receipt:
          `order_${order._id}`,

        notes: {
          orderId:
            order._id.toString(),

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
          order:
            order._id,
        },

        {
          $set: {
            user:
              req.user._id,

            amount,

            currency:
              "INR",

            provider:
              "razorpay",

            razorpayOrderId:
              razorpayOrder.id,

            status:
              "created",

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

          setDefaultsOnInsert:
            true,
        }
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res
      .status(201)
      .json({
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
    console.error(
      "Create Razorpay order error:",
      error
    );

    next(error);
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
//
// POST /api/payment/verify
//
// Razorpay frontend response normally:
//
// {
//   razorpay_payment_id,
//   razorpay_order_id,
//   razorpay_signature
// }
//
// We also support camelCase names.
// ============================================================

const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    // ========================================================
    // CHECK CONFIG
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
    // GET PAYMENT DATA
    // ========================================================

    const razorpayOrderId =
      req.body?.razorpay_order_id ||
      req.body?.razorpayOrderId;

    const razorpayPaymentId =
      req.body?.razorpay_payment_id ||
      req.body?.razorpayPaymentId;

    const razorpaySignature =
      req.body?.razorpay_signature ||
      req.body?.razorpaySignature;

    // ========================================================
    // VALIDATION
    // ========================================================

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
    // FIND ORDER
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
      return res
        .status(200)
        .json({
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

          order: {
            id:
              order._id,

            isPaid:
              order.isPaid,

            paidAt:
              order.paidAt,
          },
        });
    }

    // ========================================================
    // VERIFY SIGNATURE
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
    // TIMING SAFE COMPARISON
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
    // EXPECTED ORDER AMOUNT
    // ========================================================

    const orderAmount =
      getOrderAmount(order);

    if (
      orderAmount === null
    ) {
      return next(
        createControllerError(
          "Invalid order amount",
          400
        )
      );
    }

    const expectedAmount =
      Math.round(
        orderAmount * 100
      );

    // ========================================================
    // PAYMENT RECORD AMOUNT
    // ========================================================

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
    // FETCH PAYMENT DIRECTLY FROM RAZORPAY
    //
    // Do not trust only frontend response.
    // ========================================================

    let razorpayPayment;

    try {
      const razorpay =
        getRazorpayInstance();

      razorpayPayment =
        await razorpay.payments.fetch(
          razorpayPaymentId
        );
    } catch (error) {
      console.error(
        "Razorpay payment fetch error:",
        error
      );

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
      razorpayPayment?.order_id !==
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
      razorpayPayment?.status !==
      "captured"
    ) {
      payment.status =
        "failed";

      payment.failedAt =
        new Date();

      payment.failureReason =
        `Payment is not captured. Current status: ${razorpayPayment?.status}`;

      await payment.save();

      return next(
        createControllerError(
          `Payment is not captured. Current status: ${razorpayPayment?.status}`,
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
      ) !==
      expectedAmount
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
    // Current Order system uses:
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

    return res
      .status(200)
      .json({
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
    console.error(
      "Payment verification error:",
      error
    );

    next(error);
  }
};

// ============================================================
// GET MY PAYMENT
//
// GET /api/payment/:orderId
// ============================================================

const getMyPayment = async (
  req,
  res,
  next
) => {
  try {
    const payment =
      await Payment.findOne({
        order:
          req.params.orderId,

        user:
          req.user._id,
      }).populate(
        "order",
        "orderNumber totalPrice isPaid paidAt orderStatus paymentMethod shippingPrice itemsPrice"
      );

    if (!payment) {
      return next(
        createControllerError(
          "Payment not found",
          404
        )
      );
    }

    return res
      .status(200)
      .json({
        success: true,

        payment,
      });
  } catch (error) {
    console.error(
      "Get payment error:",
      error
    );

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