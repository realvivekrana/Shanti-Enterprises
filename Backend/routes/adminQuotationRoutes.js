// ============================================================
// SHANTI ENTERPRISES
// Admin Quotation Routes
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
  getAdminQuotations,
  getAdminQuotationById,
  createAdminQuotation,
  updateAdminQuotationStatus,
  cancelAdminQuotation,
} = require(
  "../controllers/adminQuotationController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createQuotationValidation = [
  body("rfqId")
    .notEmpty()
    .withMessage(
      "RFQ ID is required"
    ),

  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one quotation item is required"
    ),

  body("note")
    .optional()
    .isString()
    .withMessage(
      "Quotation note must be text"
    ),

  body("validUntil")
    .optional()
    .isISO8601()
    .withMessage(
      "Valid quotation expiry date is required"
    ),
];

const quotationStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Quotation status is required"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL QUOTATIONS
// ============================================================

// GET /api/admin/quotations

router.get(
  "/",
  getAdminQuotations
);

// ============================================================
// CREATE QUOTATION
// ============================================================

// POST /api/admin/quotations

router.post(
  "/",
  validate(
    createQuotationValidation
  ),
  createAdminQuotation
);

// ============================================================
// GET SINGLE QUOTATION
// ============================================================

// GET /api/admin/quotations/:id

router.get(
  "/:id",
  getAdminQuotationById
);

// ============================================================
// UPDATE QUOTATION STATUS
// ============================================================

// PATCH /api/admin/quotations/:id/status

router.patch(
  "/:id/status",
  validate(
    quotationStatusValidation
  ),
  updateAdminQuotationStatus
);

// ============================================================
// CANCEL QUOTATION
// ============================================================

// PATCH /api/admin/quotations/:id/cancel

router.patch(
  "/:id/cancel",
  cancelAdminQuotation
);

module.exports = router;