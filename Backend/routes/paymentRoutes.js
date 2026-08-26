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
  body("razorpayOrderId")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required"),

  body("razorpayPaymentId")
    .trim()
    .notEmpty()
    .withMessage(
      "Razorpay payment ID is required"
    ),

  body("razorpaySignature")
    .trim()
    .notEmpty()
    .withMessage(
      "Razorpay signature is required"
    ),
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

// POST /api/payments/create-order

router.post(
  "/create-order",
  validate(createPaymentValidation),
  createPaymentOrder
);

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

// POST /api/payments/verify

router.post(
  "/verify",
  validate(verifyPaymentValidation),
  verifyPayment
);

// ============================================================
// GET PAYMENT BY ORDER
// ============================================================

// GET /api/payments/order/:orderId

router.get(
  "/order/:orderId",
  validate(getPaymentValidation),
  getMyPayment
);

module.exports = router;