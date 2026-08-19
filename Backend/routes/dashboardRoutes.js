const express =
  require('express');

const router =
  express.Router();


// ======================================================
// CONTROLLERS
// ======================================================

const {

  getDashboardSummary,

  getSalesReport,

  getReportsAnalytics,

} = require(
  '../controllers/dashboardController'
);


// ======================================================
// AUTH
// ======================================================

const {

  protect,

  admin,

} = require(
  '../middleware/authMiddleware'
);


// ======================================================
// DASHBOARD SUMMARY
// ======================================================

router.get(

  '/summary',

  protect,

  admin,

  getDashboardSummary

);


// ======================================================
// SALES REPORT
// ======================================================

router.get(

  '/sales-report',

  protect,

  admin,

  getSalesReport

);


// ======================================================
// REPORTS & ANALYTICS
// ======================================================
//
// GET
// /api/dashboard/reports
//
// Example:
//
// /api/dashboard/reports?months=12
//
// ======================================================

router.get(

  '/reports',

  protect,

  admin,

  getReportsAnalytics

);


// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;