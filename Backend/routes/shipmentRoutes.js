const express = require('express');
const router = express.Router();
const { updateShipment, updateShipmentStatus, trackShipment } = require('../controllers/shipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:orderId/track', protect, trackShipment);
router.put('/:orderId', protect, admin, updateShipment);
router.patch('/:orderId/status', protect, admin, updateShipmentStatus);

module.exports = router;