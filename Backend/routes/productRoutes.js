// ============================================================
// SHANTI ENTERPRISES
// Product Routes
// Phase 2 - Shopping
// ============================================================

const express = require("express");

const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

const router = express.Router();

// GET /api/products
router.get("/", getProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

module.exports = router;