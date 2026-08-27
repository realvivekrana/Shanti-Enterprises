// ============================================================
// SHANTI ENTERPRISES
// Upload Routes
// Phase 6 - Admin Product Images
// ============================================================

const express = require("express");
const multer = require("multer");

const {
  uploadImage,
} = require("../controllers/uploadController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const storage =
  multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    callback
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      return callback(
        null,
        true
      );
    }

    const error = new Error(
      "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
    );

    error.statusCode = 400;

    callback(error);
  },
});

// ============================================================
// UPLOAD PRODUCT IMAGE
// ============================================================

// POST /api/upload/image

router.post(
  "/image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadImage
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;