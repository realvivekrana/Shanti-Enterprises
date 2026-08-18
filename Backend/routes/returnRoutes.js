const express = require('express');

const router =
  express.Router();

const {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnStatus,
  updatePickupDetails,
  updateInspection,
  processRefund,
} = require('../controllers/returnController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');

// ==============================
// CUSTOMER
// ==============================

// Create return/refund request
router.post(
  '/:orderId',
  protect,
  createReturnRequest
);

// My return requests
router.get(
  '/mine',
  protect,
  getMyReturnRequests
);

// ==============================
// ADMIN
// ==============================

// Get all return requests
router.get(
  '/',
  protect,
  admin,
  getAllReturnRequests
);

// Update return status
router.patch(
  '/:id',
  protect,
  admin,
  updateReturnStatus
);

// Reverse pickup details
router.patch(
  '/:id/pickup',
  protect,
  admin,
  updatePickupDetails
);

// Product inspection
router.patch(
  '/:id/inspection',
  protect,
  admin,
  updateInspection
);

// Process refund
router.patch(
  '/:id/refund',
  protect,
  admin,
  processRefund
);

module.exports =
  router;