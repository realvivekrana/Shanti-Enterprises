// ============================================================
// SHANTI ENTERPRISES
// Quotation Routes
// Phase 4 - Wholesale
// ============================================================

const express = require("express");

const {
  getMyQuotations,
  getQuotationById,
  acceptQuotation,
  rejectQuotation,
} = require("../controllers/quotationController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/quotations
router.get(
  "/",
  getMyQuotations
);

// GET /api/quotations/:id
router.get(
  "/:id",
  getQuotationById
);

// PATCH /api/quotations/:id/accept
router.patch(
  "/:id/accept",
  acceptQuotation
);

// PATCH /api/quotations/:id/reject
router.patch(
  "/:id/reject",
  rejectQuotation
);

module.exports = router;