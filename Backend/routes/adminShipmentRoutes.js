// ============================================================
// SHANTI ENTERPRISES
// Admin Shipment Routes
// Phase 6 - Admin
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const validate = require("../middleware/validate");

const {
  getAdminShipments,
  getAdminShipmentById,
  updateAdminShipmentStatus,
  updateAdminTracking,
} = require(
  "../controllers/adminShipmentController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const shipmentStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Shipment status is required"
    ),
];

const trackingValidation = [
  body("trackingNumber")
    .optional()
    .isString()
    .withMessage(
      "Tracking number must be text"
    ),

  body("carrier")
    .optional()
    .isString()
    .withMessage(
      "Carrier must be text"
    ),

  body("trackingUrl")
    .optional()
    .isURL({
      require_protocol: true,
    })
    .withMessage(
      "Tracking URL must be a valid URL"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET ALL SHIPMENTS
// ============================================================

// GET /api/admin/shipments
router.get(
  "/",
  getAdminShipments
);

// ============================================================
// GET SINGLE SHIPMENT
// ============================================================

// GET /api/admin/shipments/:id
router.get(
  "/:id",
  getAdminShipmentById
);

// ============================================================
// UPDATE SHIPMENT STATUS
// ============================================================

// PATCH /api/admin/shipments/:id/status
router.patch(
  "/:id/status",
  validate(
    shipmentStatusValidation
  ),
  updateAdminShipmentStatus
);

// ============================================================
// UPDATE TRACKING
// ============================================================

// PATCH /api/admin/shipments/:id/tracking
router.patch(
  "/:id/tracking",
  validate(
    trackingValidation
  ),
  updateAdminTracking
);

module.exports = router;