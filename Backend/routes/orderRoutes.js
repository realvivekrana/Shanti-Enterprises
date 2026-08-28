// ============================================================
// SHANTI ENTERPRISES
// Order Routes
// Phase 3 - Customer Portal
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// CHECKOUT VALIDATION
// ============================================================

const checkoutValidation = [
  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one order item is required"
    ),

  body("shippingAddress")
    .isObject()
    .withMessage(
      "Shipping address is required"
    ),

  body("shippingAddress.name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required"
    ),

  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage(
      "Phone is required"
    ),

  body("shippingAddress.addressLine1")
    .trim()
    .notEmpty()
    .withMessage(
      "Address is required"
    ),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage(
      "City is required"
    ),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage(
      "State is required"
    ),

  body("shippingAddress.postalCode")
    .trim()
    .notEmpty()
    .withMessage(
      "Postal code is required"
    ),

  body("paymentMethod")
    .optional()
    .isIn([
      "razorpay",
      "cod",
    ])
    .withMessage(
      "Invalid payment method"
    ),
];

// ============================================================
// ALL ORDER ROUTES REQUIRE LOGIN
// ============================================================

router.use(protect);

// ============================================================
// CUSTOMER ORDERS
// ============================================================

// GET /api/orders

router.get(
  "/",
  getMyOrders
);

// ============================================================
// GET SINGLE ORDER
// ============================================================

// GET /api/orders/:id

router.get(
  "/:id",
  getOrderById
);

// ============================================================
// CREATE ORDER
// ============================================================

// POST /api/orders

router.post(
  "/",
  validate(
    checkoutValidation
  ),
  createOrder
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;