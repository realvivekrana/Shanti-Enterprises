// ============================================================
// SHANTI ENTERPRISES
// Category Routes
// Phase 2 - Shopping + Admin CRUD
// ============================================================

const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/categories
router.get(
  "/",
  getCategories
);

// GET /api/categories/:id
router.get(
  "/:id",
  getCategoryById
);

// ============================================================
// ADMIN ROUTES
// ============================================================

// POST /api/categories
router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// PUT /api/categories/:id
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// DELETE /api/categories/:id
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

module.exports = router;