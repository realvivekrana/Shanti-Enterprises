// ============================================================
// SHANTI ENTERPRISES
// Admin Bulk Quote Routes
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
  getAdminBulkQuotes,
  getAdminBulkQuoteById,
  respondToBulkQuote,
  updateAdminBulkQuoteStatus,
} = require(
  "../controllers/adminBulkQuoteController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const respondValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage(
      "At least one priced item is required"
    ),
];

const statusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Bulk quote status is required"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL BULK QUOTES
// ============================================================

// GET /api/admin/bulk-quotes
router.get(
  "/",
  getAdminBulkQuotes
);

// ============================================================
// GET SINGLE BULK QUOTE
// ============================================================

// GET /api/admin/bulk-quotes/:id
router.get(
  "/:id",
  getAdminBulkQuoteById
);

// ============================================================
// RESPOND WITH PRICING
// ============================================================

// PATCH /api/admin/bulk-quotes/:id/respond
router.patch(
  "/:id/respond",
  validate(respondValidation),
  respondToBulkQuote
);

// ============================================================
// UPDATE STATUS (reviewing / rejected / cancelled)
// ============================================================

// PATCH /api/admin/bulk-quotes/:id/status
router.patch(
  "/:id/status",
  validate(statusValidation),
  updateAdminBulkQuoteStatus
);

module.exports = router;