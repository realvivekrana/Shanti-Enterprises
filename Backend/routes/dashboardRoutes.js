const express = require('express');
const router = express.Router();
const { getDashboardSummary, getSalesReport } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/summary', protect, admin, getDashboardSummary);
router.get('/sales-report', protect, admin, getSalesReport);

module.exports = router;