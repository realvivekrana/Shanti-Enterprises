// ============================================================
// SHANTI ENTERPRISES
// Admin Return Routes
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
  getAdminReturns,
  getAdminReturnById,
  updateAdminReturnStatus,
} = require(
  "../controllers/adminReturnController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const returnStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Return status is required"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL RETURNS
// ============================================================

// GET /api/admin/returns
router.get(
  "/",
  getAdminReturns
);

// ============================================================
// GET SINGLE RETURN
// ============================================================

// GET /api/admin/returns/:id
router.get(
  "/:id",
  getAdminReturnById
);

// ============================================================
// UPDATE RETURN STATUS
// ============================================================

// PATCH /api/admin/returns/:id/status
router.patch(
  "/:id/status",
  validate(returnStatusValidation),
  updateAdminReturnStatus
);

module.exports = router;