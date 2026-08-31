// ============================================================
// SHANTI ENTERPRISES
// Order Routes
// Phase 3 - Customer Portal
// Updated - Wholesale Quotation Order Support
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createOrder,
  createOrderFromQuotation,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// NORMAL CHECKOUT VALIDATION
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
// WHOLESALE QUOTATION ORDER VALIDATION
// ============================================================

const quotationOrderValidation = [
  // ----------------------------------------------------------
  // QUOTATION ID
  // ----------------------------------------------------------

  body("quotationId")
    .notEmpty()
    .withMessage(
      "Quotation ID is required"
    )
    .isMongoId()
    .withMessage(
      "Invalid quotation ID"
    ),

  // ----------------------------------------------------------
  // SHIPPING ADDRESS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // PAYMENT METHOD
  // ----------------------------------------------------------

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

// ------------------------------------------------------------
// GET /api/orders
// ------------------------------------------------------------

router.get(
  "/",
  getMyOrders
);

// ============================================================
// CREATE ORDER FROM ACCEPTED QUOTATION
// ============================================================

// IMPORTANT:
// This route must come BEFORE "/:id"
// otherwise Express may treat "from-quotation"
// as an order ID.

// ------------------------------------------------------------
// POST /api/orders/from-quotation
// ------------------------------------------------------------

router.post(
  "/from-quotation",
  validate(
    quotationOrderValidation
  ),
  createOrderFromQuotation
);

// ============================================================
// GET SINGLE ORDER
// ============================================================

// ------------------------------------------------------------
// GET /api/orders/:id
// ------------------------------------------------------------

router.get(
  "/:id",
  getOrderById
);

// ============================================================
// CREATE NORMAL ORDER
// ============================================================

// ------------------------------------------------------------
// POST /api/orders
// ------------------------------------------------------------

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