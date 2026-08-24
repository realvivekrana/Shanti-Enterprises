// ============================================================
// SHANTI ENTERPRISES
// Category Routes
// Phase 2 - Shopping
// ============================================================

const express = require("express");

const {
  getCategories,
  getCategoryById,
} = require("../controllers/categoryController");

const router = express.Router();

// GET /api/categories
router.get("/", getCategories);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

module.exports = router;