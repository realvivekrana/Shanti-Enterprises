const express = require('express');

const router = express.Router();

const {
  updateShipment,
  updateShipmentStatus,
  trackShipment,
} = require('../controllers/shipmentController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');

// ==============================
// TRACK SHIPMENT
// ==============================

router.get(
  '/:orderId/track',
  protect,
  trackShipment
);

// ==============================
// UPDATE SHIPMENT
// ==============================

router.put(
  '/:orderId',
  protect,
  admin,
  updateShipment
);

// ==============================
// UPDATE SHIPMENT STATUS
// ==============================

router.patch(
  '/:orderId/status',
  protect,
  admin,
  updateShipmentStatus
);

module.exports = router;