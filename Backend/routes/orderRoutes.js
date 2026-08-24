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
  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required"
    ),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage(
      "Phone is required"
    ),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage(
      "Address is required"
    ),

  body("city")
    .trim()
    .notEmpty()
    .withMessage(
      "City is required"
    ),

  body("state")
    .trim()
    .notEmpty()
    .withMessage(
      "State is required"
    ),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage(
      "Postal code is required"
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

// GET /api/orders/:id
router.get(
  "/:id",
  getOrderById
);

// ============================================================
// CHECKOUT
// ============================================================

// POST /api/orders
router.post(
  "/",
  validate(checkoutValidation),
  createOrder
);

module.exports = router;