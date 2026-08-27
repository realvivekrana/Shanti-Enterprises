// ============================================================
// SHANTI ENTERPRISES
// Image Upload Middleware
// Backend - Product Image Upload
// ============================================================

const multer = require("multer");

// ============================================================
// MEMORY STORAGE
// ============================================================
//
// File ko server disk par save nahi karenge.
// Multer image ko memory buffer mein rakhega,
// jise hum Cloudinary par upload karenge.
//

const storage =
  multer.memoryStorage();

// ============================================================
// ALLOWED IMAGE TYPES
// ============================================================

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (
  req,
  file,
  callback
) => {
  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    return callback(
      null,
      true
    );
  }

  const error =
    new Error(
      "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
    );

  error.statusCode = 400;

  return callback(
    error,
    false
  );
};

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const upload = multer({
  storage,

  limits: {
    // Maximum file size = 5 MB
    fileSize:
      5 * 1024 * 1024,

    // Only one image at a time
    files: 1,
  },

  fileFilter,
});

// ============================================================
// SINGLE PRODUCT IMAGE
// ============================================================
//
// Frontend field name:
// image
//
// Example:
// upload.single("image")
//

const uploadProductImage =
  upload.single("image");

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  upload,
  uploadProductImage,
};