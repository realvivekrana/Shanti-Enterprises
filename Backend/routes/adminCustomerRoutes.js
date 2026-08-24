// ============================================================
// SHANTI ENTERPRISES
// Admin Customer Routes
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
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
  updateAdminCustomer,
} = require(
  "../controllers/adminCustomerController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const customerStatusValidation = [
  body("isActive")
    .isBoolean()
    .withMessage(
      "isActive must be true or false"
    ),
];

const customerUpdateValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage(
      "Customer name cannot be empty"
    ),

  body("phone")
    .optional()
    .isString()
    .withMessage(
      "Phone must be text"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL CUSTOMERS
// ============================================================

// GET /api/admin/customers
router.get(
  "/",
  getAdminCustomers
);

// ============================================================
// GET SINGLE CUSTOMER
// ============================================================

// GET /api/admin/customers/:id
router.get(
  "/:id",
  getAdminCustomerById
);

// ============================================================
// UPDATE CUSTOMER
// ============================================================

// PATCH /api/admin/customers/:id
router.patch(
  "/:id",
  validate(customerUpdateValidation),
  updateAdminCustomer
);

// ============================================================
// UPDATE CUSTOMER STATUS
// ============================================================

// PATCH /api/admin/customers/:id/status
router.patch(
  "/:id/status",
  validate(customerStatusValidation),
  updateCustomerStatus
);

module.exports = router;