const express = require('express');

const {
  createRFQ,
  getMyRFQs,
  getRFQById,
  getAllRFQs,
  quoteRFQ,
  acceptRFQ,
  rejectRFQ,
} = require('../controllers/rfqController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');

const router =
  express.Router();

// ==============================
// CUSTOMER ROUTES
// ==============================

// Create RFQ
router.post(
  '/',
  protect,
  createRFQ
);

// My RFQs
router.get(
  '/my',
  protect,
  getMyRFQs
);

// Get single RFQ
router.get(
  '/:id',
  protect,
  getRFQById
);

// Accept quotation
router.put(
  '/:id/accept',
  protect,
  acceptRFQ
);

// Reject quotation
router.put(
  '/:id/reject',
  protect,
  rejectRFQ
);

// ==============================
// ADMIN ROUTES
// ==============================

// Get all RFQs
router.get(
  '/',
  protect,
  admin,
  getAllRFQs
);

// Send quotation
router.put(
  '/:id/quote',
  protect,
  admin,
  quoteRFQ
);

module.exports = router;