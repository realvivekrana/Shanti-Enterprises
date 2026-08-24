// ============================================================
// SHANTI ENTERPRISES
// Admin Inventory Routes
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
  getInventory,
  getInventoryItem,
  updateInventoryStock,
  adjustInventoryStock,
  updateLowStockThreshold,
} = require(
  "../controllers/adminInventoryController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const stockValidation = [
  body("stock")
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Stock must be 0 or greater"
    ),
];

const adjustmentValidation = [
  body("quantity")
    .isFloat({
      gt: 0,
    })
    .withMessage(
      "Quantity must be greater than 0"
    ),

  body("type")
    .isIn([
      "add",
      "remove",
    ])
    .withMessage(
      "Type must be add or remove"
    ),
];

const thresholdValidation = [
  body("lowStockThreshold")
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Low stock threshold must be 0 or greater"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// GET INVENTORY
// ============================================================

// GET /api/admin/inventory
router.get(
  "/",
  getInventory
);

// ============================================================
// GET SINGLE INVENTORY ITEM
// ============================================================

// GET /api/admin/inventory/:id
router.get(
  "/:id",
  getInventoryItem
);

// ============================================================
// SET EXACT STOCK
// ============================================================

// PATCH /api/admin/inventory/:id/stock
router.patch(
  "/:id/stock",
  validate(stockValidation),
  updateInventoryStock
);

// ============================================================
// ADJUST STOCK
// ============================================================

// PATCH /api/admin/inventory/:id/adjust
router.patch(
  "/:id/adjust",
  validate(adjustmentValidation),
  adjustInventoryStock
);

// ============================================================
// LOW STOCK THRESHOLD
// ============================================================

// PATCH /api/admin/inventory/:id/threshold
router.patch(
  "/:id/threshold",
  validate(thresholdValidation),
  updateLowStockThreshold
);

module.exports = router;