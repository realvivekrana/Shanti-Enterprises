// ============================================================
// SHANTI ENTERPRISES
// Payment Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  body,
  param,
} = require("express-validator");

const {
  createPaymentOrder,
  verifyPayment,
  getMyPayment,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createPaymentValidation = [
  body("orderId")
    .trim()
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID"),
];

const verifyPaymentValidation = [
  body()
    .custom((value, { req }) => {
      const razorpayOrderId =
        req.body?.razorpay_order_id ||
        req.body?.razorpayOrderId;

      const razorpayPaymentId =
        req.body?.razorpay_payment_id ||
        req.body?.razorpayPaymentId;

      const razorpaySignature =
        req.body?.razorpay_signature ||
        req.body?.razorpaySignature;

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay order ID is required"
        );
      }

      if (!razorpayPaymentId) {
        throw new Error(
          "Razorpay payment ID is required"
        );
      }

      if (!razorpaySignature) {
        throw new Error(
          "Razorpay signature is required"
        );
      }

      return true;
    }),
];

const getPaymentValidation = [
  param("orderId")
    .trim()
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID"),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

router.post(
  "/create-order",
  validate(createPaymentValidation),
  createPaymentOrder
);

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

router.post(
  "/verify",
  validate(verifyPaymentValidation),
  verifyPayment
);

// ============================================================
// GET PAYMENT BY ORDER
// ============================================================

router.get(
  "/order/:orderId",
  validate(getPaymentValidation),
  getMyPayment
);

module.exports = router;