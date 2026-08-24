// ============================================================
// SHANTI ENTERPRISES
// Bulk Quote Routes
// Phase 4 - Wholesale
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createBulkQuote,
  getMyBulkQuotes,
  getBulkQuoteById,
} = require("../controllers/bulkQuoteController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const bulkQuoteValidation = [
  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one product is required"
    ),

  body("message")
    .optional()
    .isString()
    .withMessage(
      "Message must be text"
    ),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/bulk-quotes
router.get(
  "/",
  getMyBulkQuotes
);

// GET /api/bulk-quotes/:id
router.get(
  "/:id",
  getBulkQuoteById
);

// POST /api/bulk-quotes
router.post(
  "/",
  validate(bulkQuoteValidation),
  createBulkQuote
);

module.exports = router;