// ============================================================
// SHANTI ENTERPRISES
// Admin Order Routes
// Phase 6 - Admin
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const validate = require("../middleware/validate");

const {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  cancelAdminOrder,
} = require(
  "../controllers/adminOrderController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const orderStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Order status is required"
    ),
];

const paymentStatusValidation = [
  body("paymentStatus")
    .notEmpty()
    .withMessage(
      "Payment status is required"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL ORDERS
// ============================================================

// GET /api/admin/orders
router.get(
  "/",
  getAdminOrders
);

// ============================================================
// GET SINGLE ORDER
// ============================================================

// GET /api/admin/orders/:id
router.get(
  "/:id",
  getAdminOrderById
);

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

// PATCH /api/admin/orders/:id/status
router.patch(
  "/:id/status",
  validate(orderStatusValidation),
  updateAdminOrderStatus
);

// ============================================================
// UPDATE PAYMENT STATUS
// ============================================================

// PATCH /api/admin/orders/:id/payment-status
router.patch(
  "/:id/payment-status",
  validate(paymentStatusValidation),
  updateAdminPaymentStatus
);

// ============================================================
// CANCEL ORDER
// ============================================================

// PATCH /api/admin/orders/:id/cancel
router.patch(
  "/:id/cancel",
  cancelAdminOrder
);

module.exports = router;