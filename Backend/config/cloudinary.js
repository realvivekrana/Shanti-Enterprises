// ============================================================
// SHANTI ENTERPRISES
// Cloudinary Configuration
// Backend - Product Image Upload
// ============================================================

const cloudinary = require("cloudinary").v2;

// ============================================================
// CLOUDINARY CONFIGURATION
// ============================================================

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

// ============================================================
// CONFIGURATION CHECK
// ============================================================

const isCloudinaryConfigured =
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

// ============================================================
// DEVELOPMENT LOG
// ============================================================

if (
  process.env.NODE_ENV !==
  "production"
) {
  console.log(
    "================================================"
  );

  console.log(
    "        CLOUDINARY CONFIGURATION"
  );

  console.log(
    "================================================"
  );

  console.log(
    `Cloud Name : ${
      process.env.CLOUDINARY_CLOUD_NAME
        ? "Configured"
        : "Missing"
    }`
  );

  console.log(
    `API Key    : ${
      process.env.CLOUDINARY_API_KEY
        ? "Configured"
        : "Missing"
    }`
  );

  console.log(
    `API Secret : ${
      process.env.CLOUDINARY_API_SECRET
        ? "Configured"
        : "Missing"
    }`
  );

  console.log(
    `Status     : ${
      isCloudinaryConfigured
        ? "Ready"
        : "Not configured"
    }`
  );

  console.log(
    "================================================"
  );
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};