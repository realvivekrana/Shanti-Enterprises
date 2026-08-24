// ============================================================
// SHANTI ENTERPRISES
// Payment Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  body,
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
    .notEmpty()
    .withMessage(
      "Order ID is required"
    ),
];

const verifyPaymentValidation = [
  body("razorpayOrderId")
    .notEmpty()
    .withMessage(
      "Razorpay order ID is required"
    ),

  body("razorpayPaymentId")
    .notEmpty()
    .withMessage(
      "Razorpay payment ID is required"
    ),

  body("razorpaySignature")
    .notEmpty()
    .withMessage(
      "Razorpay signature is required"
    ),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// POST /api/payments/create-order
router.post(
  "/create-order",
  validate(createPaymentValidation),
  createPaymentOrder
);

// POST /api/payments/verify
router.post(
  "/verify",
  validate(verifyPaymentValidation),
  verifyPayment
);

// GET /api/payments/order/:orderId
router.get(
  "/order/:orderId",
  getMyPayment
);

module.exports = router;