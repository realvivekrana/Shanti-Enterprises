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
// HELPER - CREATE ERROR
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
// HELPER - RAZORPAY INSTANCE
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
// HELPER - GET USER ID
// ============================================================

const getUserId = (req) => {
  if (!req.user) {
    return null;
  }

  return (
    req.user._id ||
    req.user.id
  );
};

// ============================================================
// HELPER - GET ORDER AMOUNT
//
// Current orderController uses:
// totalAmount
//
// Older order structures may use:
// totalPrice
//
// totalAmount gets priority.
// ============================================================

const getOrderAmount = (order) => {
  const amount = Number(
    order?.totalAmount ??
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
// HELPER - GET PAYMENT STATUS
// ============================================================

const getPaymentStatus = (order) => {
  if (
    order?.paymentStatus
  ) {
    return order.paymentStatus;
  }

  if (
    order?.isPaid === true
  ) {
    return "paid";
  }

  return "pending";
};

// ============================================================
// CREATE RAZORPAY ORDER
//
// POST /api/payments/create-order
//
// Body:
//
// {
//   "orderId": "MONGODB_ORDER_ID"
// }
//
// ============================================================

const createPaymentOrder = async (
  req,
  res,
  next
) => {
  try {
    console.log("");
    console.log(
      "================================================"
    );
    console.log(
      "        CREATE RAZORPAY PAYMENT ORDER"
    );
    console.log(
      "================================================"
    );

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
    // CHECK ENVIRONMENT VARIABLES
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
    // USER CHECK
    // ========================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return next(
        createControllerError(
          "Authentication required",
          401
        )
      );
    }

    // ========================================================
    // GET ORDER ID
    // ========================================================

    const orderId =
      req.body?.orderId;

    console.log(
      "Order ID:",
      orderId
    );

    if (!orderId) {
      return next(
        createControllerError(
          "Order ID is required. Create the order first, then start Razorpay payment.",
          400
        )
      );
    }

    // ========================================================
    // FIND ORDER
    // ========================================================

    const order =
      await Order.findOne({
        _id: orderId,
        user: userId,
      });

    if (!order) {
      console.log(
        "Order not found for user:",
        userId
      );

      return next(
        createControllerError(
          "Order not found",
          404
        )
      );
    }

    console.log(
      "Order found:",
      order._id.toString()
    );

    console.log(
      "Order Number:",
      order.orderNumber
    );

    // ========================================================
    // ALREADY PAID CHECK
    // ========================================================

    const currentPaymentStatus =
      getPaymentStatus(order);

    if (
      currentPaymentStatus ===
        "paid" ||
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

    console.log(
      "Order Amount:",
      amount
    );

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
    // AMOUNT IN PAISE
    // ========================================================

    const amountInPaise =
      Math.round(
        amount * 100
      );

    console.log(
      "Amount in Paise:",
      amountInPaise
    );

    // ========================================================
    // CREATE RAZORPAY ORDER
    // ========================================================

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          amountInPaise,

        currency:
          "INR",

        receipt:
          `order_${order._id}`,

        notes: {
          orderId:
            order._id.toString(),

          orderNumber:
            order.orderNumber ||
            "",

          userId:
            userId.toString(),
        },
      });

    console.log(
      "Razorpay Order ID:",
      razorpayOrder.id
    );

    // ========================================================
    // CREATE / UPDATE PAYMENT
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
              userId,

            order:
              order._id,

            amount:
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
          upsert:
            true,

          new:
            true,

          setDefaultsOnInsert:
            true,
        }
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    console.log(
      "Payment record:",
      payment._id.toString()
    );

    console.log(
      "================================================"
    );

    return res
      .status(201)
      .json({
        success:
          true,

        message:
          "Payment order created successfully",

        payment: {
          id:
            payment._id,

          orderId:
            order._id,

          orderNumber:
            order.orderNumber,

          razorpayOrderId:
            razorpayOrder.id,

          amount:
            amount,

          amountInPaise:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

          keyId:
            process.env
              .RAZORPAY_KEY_ID,
        },
      });
  } catch (error) {
    console.error("");
    console.error(
      "================================================"
    );
    console.error(
      "      CREATE RAZORPAY ORDER ERROR"
    );
    console.error(
      "================================================"
    );
    console.error(error);
    console.error(
      "================================================"
    );

    next(error);
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
//
// POST /api/payments/verify
//
// Body:
//
// {
//   "razorpayOrderId": "...",
//   "razorpayPaymentId": "...",
//   "razorpaySignature": "..."
// }
//
// Also supports Razorpay's default snake_case names.
//
// ============================================================

const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    console.log("");
    console.log(
      "================================================"
    );
    console.log(
      "          VERIFY RAZORPAY PAYMENT"
    );
    console.log(
      "================================================"
    );

    // ========================================================
    // CONFIG CHECK
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
    // USER CHECK
    // ========================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return next(
        createControllerError(
          "Authentication required",
          401
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

    console.log(
      "Razorpay Order ID:",
      razorpayOrderId
    );

    console.log(
      "Razorpay Payment ID:",
      razorpayPaymentId
    );

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
        razorpayOrderId:

          razorpayOrderId,

        user:
          userId,
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
          userId,
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
      payment.status ===
        "paid" &&
      (
        order.isPaid === true ||
        order.paymentStatus ===
          "paid"
      )
    ) {
      return res
        .status(200)
        .json({
          success:
            true,

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

            orderNumber:
              order.orderNumber,

            isPaid:
              order.isPaid,

            paymentStatus:
              order.paymentStatus,

            paidAt:
              order.paidAt,

            orderStatus:
              order.orderStatus,
          },
        });
    }

    // ========================================================
    // GENERATE SIGNATURE
    // ========================================================

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    // ========================================================
    // SAFE SIGNATURE COMPARISON
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

    let signatureValid =
      false;

    if (
      generatedBuffer.length ===
      receivedBuffer.length
    ) {
      signatureValid =
        crypto.timingSafeEqual(
          generatedBuffer,
          receivedBuffer
        );
    }

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
    // GET ORDER AMOUNT
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
    // PAYMENT RECORD AMOUNT CHECK
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
    // FETCH PAYMENT FROM RAZORPAY
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
    // RAZORPAY PAYMENT AMOUNT CHECK
    // ========================================================

    if (
      Number(
        razorpayPayment?.amount
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
    // PAYMENT STATUS CHECK
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
    // Support current structure:
    //
    // paymentStatus
    // orderStatus
    //
    // Also keep:
    //
    // isPaid
    // paidAt
    // paymentResult
    // ========================================================

    order.isPaid =
      true;

    order.paidAt =
      new Date();

    order.paymentStatus =
      "paid";

    order.paymentResult = {
      id:
        razorpayPaymentId,

      orderId:
        razorpayOrderId,

      signature:
        razorpaySignature,

      status:
        "success",

      updateTime:
        new Date().toISOString(),
    };

    if (
      order.orderStatus ===
      "pending"
    ) {
      order.orderStatus =
        "confirmed";
    }

    await order.save();

    // ========================================================
    // SUCCESS RESPONSE
    // ========================================================

    console.log(
      "Payment successfully verified"
    );

    console.log(
      "Order:",
      order._id.toString()
    );

    console.log(
      "================================================"
    );

    return res
      .status(200)
      .json({
        success:
          true,

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

          orderNumber:
            order.orderNumber,

          totalAmount:
            order.totalAmount,

          paymentStatus:
            order.paymentStatus,

          isPaid:
            order.isPaid,

          paidAt:
            order.paidAt,

          orderStatus:
            order.orderStatus,
        },
      });
  } catch (error) {
    console.error("");
    console.error(
      "================================================"
    );
    console.error(
      "       PAYMENT VERIFICATION ERROR"
    );
    console.error(
      "================================================"
    );
    console.error(error);
    console.error(
      "================================================"
    );

    next(error);
  }
};

// ============================================================
// GET MY PAYMENT
//
// GET /api/payments/order/:orderId
// ============================================================

const getMyPayment = async (
  req,
  res,
  next
) => {
  try {
    // ========================================================
    // USER CHECK
    // ========================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return next(
        createControllerError(
          "Authentication required",
          401
        )
      );
    }

    // ========================================================
    // ORDER ID
    // ========================================================

    const orderId =
      req.params.orderId;

    if (!orderId) {
      return next(
        createControllerError(
          "Order ID is required",
          400
        )
      );
    }

    // ========================================================
    // FIND PAYMENT
    // ========================================================

    const payment =
      await Payment.findOne({
        order:
          orderId,

        user:
          userId,
      }).populate(
        "order",
        "orderNumber totalAmount totalPrice isPaid paidAt paymentStatus orderStatus paymentMethod shippingPrice itemsPrice subtotal"
      );

    // ========================================================
    // PAYMENT NOT FOUND
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

    return res
      .status(200)
      .json({
        success:
          true,

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