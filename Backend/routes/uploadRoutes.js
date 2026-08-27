// ============================================================
// SHANTI ENTERPRISES
// Upload Routes
// Phase 6 - Admin Product Images
// ============================================================

const express = require("express");

const {
  uploadProductImage,
} = require("../controllers/uploadController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  uploadProductImage: uploadImage,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// ============================================================
// UPLOAD PRODUCT IMAGE
// ============================================================
//
// POST /api/upload/image
//
// Authentication:
// 1. User must be logged in
// 2. User must have admin role
// 3. Image field name must be "image"
// ============================================================

router.post(
  "/image",
  protect,
  adminOnly,
  uploadImage,
  uploadProductImage
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;