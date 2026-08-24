// ============================================================
// SHANTI ENTERPRISES
// Admin RFQ Routes
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
  getAdminRFQs,
  getAdminRFQById,
  updateAdminRFQStatus,
  cancelAdminRFQ,
} = require(
  "../controllers/adminRFQController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const rfqStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "RFQ status is required"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL RFQs
// ============================================================

// GET /api/admin/rfqs
router.get(
  "/",
  getAdminRFQs
);

// ============================================================
// GET SINGLE RFQ
// ============================================================

// GET /api/admin/rfqs/:id
router.get(
  "/:id",
  getAdminRFQById
);

// ============================================================
// UPDATE RFQ STATUS
// ============================================================

// PATCH /api/admin/rfqs/:id/status
router.patch(
  "/:id/status",
  validate(rfqStatusValidation),
  updateAdminRFQStatus
);

// ============================================================
// CANCEL RFQ
// ============================================================

// PATCH /api/admin/rfqs/:id/cancel
router.patch(
  "/:id/cancel",
  cancelAdminRFQ
);

module.exports = router;