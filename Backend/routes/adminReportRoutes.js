// ============================================================
// SHANTI ENTERPRISES
// Admin Reports Routes
// Phase 6 - Admin
// ============================================================

const express = require("express");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const {
  getAdminOverviewReport,
  getOrderStatusReport,
  getMonthlySalesReport,
  getTopProductsReport,
  getLowStockReport,
} = require(
  "../controllers/adminReportController"
);

const router = express.Router();

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// OVERVIEW REPORT
// ============================================================

// GET /api/admin/reports/overview
router.get(
  "/overview",
  getAdminOverviewReport
);

// ============================================================
// ORDER STATUS REPORT
// ============================================================

// GET /api/admin/reports/orders
router.get(
  "/orders",
  getOrderStatusReport
);

// ============================================================
// MONTHLY SALES REPORT
// ============================================================

// GET /api/admin/reports/monthly-sales
router.get(
  "/monthly-sales",
  getMonthlySalesReport
);

// ============================================================
// TOP PRODUCTS REPORT
// ============================================================

// GET /api/admin/reports/top-products
router.get(
  "/top-products",
  getTopProductsReport
);

// ============================================================
// LOW STOCK REPORT
// ============================================================

// GET /api/admin/reports/low-stock
router.get(
  "/low-stock",
  getLowStockReport
);

module.exports = router;