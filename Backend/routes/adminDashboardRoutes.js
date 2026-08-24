// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Routes
// Phase 6 - Admin
// ============================================================

const express = require("express");

const {
  getAdminDashboard,
} = require(
  "../controllers/adminDashboardController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  adminOnly,
} = require(
  "../middleware/adminMiddleware"
);

const router = express.Router();

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ADMIN DASHBOARD
// ============================================================

// GET /api/admin/dashboard
router.get(
  "/",
  getAdminDashboard
);

module.exports = router;