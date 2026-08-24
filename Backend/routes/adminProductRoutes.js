// ============================================================
// SHANTI ENTERPRISES
// Admin Product Routes
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
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductStatus,
} = require(
  "../controllers/adminProductController"
);

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createProductValidation = [
  body("name")
    .notEmpty()
    .withMessage(
      "Product name is required"
    ),

  body("price")
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Valid product price is required"
    ),
];

const updateProductValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage(
      "Product name cannot be empty"
    ),

  body("price")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Product price must be valid"
    ),
];

// ============================================================
// ADMIN PROTECTION
// ============================================================

router.use(protect);

router.use(adminOnly);

// ============================================================
// PRODUCTS
// ============================================================

// GET /api/admin/products
router.get(
  "/",
  getAdminProducts
);

// GET /api/admin/products/:id
router.get(
  "/:id",
  getAdminProductById
);

// POST /api/admin/products
router.post(
  "/",
  validate(createProductValidation),
  createAdminProduct
);

// PUT /api/admin/products/:id
router.put(
  "/:id",
  validate(updateProductValidation),
  updateAdminProduct
);

// DELETE /api/admin/products/:id
router.delete(
  "/:id",
  deleteAdminProduct
);

// PATCH /api/admin/products/:id/toggle-status
router.patch(
  "/:id/toggle-status",
  toggleProductStatus
);

module.exports = router;