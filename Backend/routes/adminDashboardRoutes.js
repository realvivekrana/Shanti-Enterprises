const express = require('express');

const router =
  express.Router();

const {
  getAdminDashboardOverview,
} = require(
  '../controllers/adminDashboardController'
);

const {
  protect,
} = require(
  '../middleware/authMiddleware'
);


// ======================================================
// ADMIN DASHBOARD OVERVIEW
// ======================================================
//
// GET /api/admin-dashboard
//
// Protected route.
// Admin authentication middleware will be added here.
// ======================================================

router.get(
  '/',
  protect,
  getAdminDashboardOverview
);


module.exports = router;