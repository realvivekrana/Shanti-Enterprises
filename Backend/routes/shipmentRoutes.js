// ============================================================
// SHANTI ENTERPRISES
// Shipment Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  getMyShipments,
  getShipmentById,
  trackShipment,
} = require("../controllers/shipmentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// PROTECTED ROUTES
// (Shipments sirf admin order status se banti hain,
//  customer apna shipment khud create nahi kar sakta)
// ============================================================

router.use(protect);

// GET /api/shipments
router.get(
  "/",
  getMyShipments
);

// GET /api/shipments/:id/track
router.get(
  "/:id/track",
  trackShipment
);

// GET /api/shipments/:id
router.get(
  "/:id",
  getShipmentById
);

module.exports = router;