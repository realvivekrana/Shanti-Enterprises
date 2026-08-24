// ============================================================
// SHANTI ENTERPRISES
// Shipment Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  getMyShipments,
  getShipmentById,
  trackShipment,
  createShipment,
} = require("../controllers/shipmentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createShipmentValidation = [
  body("orderId")
    .notEmpty()
    .withMessage(
      "Order ID is required"
    ),

  body("carrier")
    .optional()
    .isString()
    .withMessage(
      "Carrier must be text"
    ),

  body("trackingNumber")
    .optional()
    .isString()
    .withMessage(
      "Tracking number must be text"
    ),
];

// ============================================================
// PROTECTED ROUTES
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

// POST /api/shipments
router.post(
  "/",
  validate(createShipmentValidation),
  createShipment
);

module.exports = router;