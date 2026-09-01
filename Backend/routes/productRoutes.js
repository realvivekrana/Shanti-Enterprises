// ============================================================
// SHANTI ENTERPRISES
// Product Routes
// Phase 2 - Shopping + Admin CRUD
// ============================================================

const express = require("express");

const {
  getProducts,
  getProductById,
  getWholesalePriceForProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/products
router.get(
  "/",
  getProducts
);

// GET /api/products/:id/wholesale-price?quantity=N
// Must be registered BEFORE /:id to avoid route shadowing
router.get(
  "/:id/wholesale-price",
  getWholesalePriceForProduct
);

// GET /api/products/:id
router.get(
  "/:id",
  getProductById
);

// ============================================================
// ADMIN ROUTES
// ============================================================

// POST /api/products
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// PUT /api/products/:id
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// DELETE /api/products/:id
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;