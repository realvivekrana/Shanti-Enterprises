// ============================================================
// SHANTI ENTERPRISES
// Slugify Utility
// Backend - Product Slugs
// ============================================================

// ============================================================
// CREATE SLUG
// ============================================================

const slugify = (text) => {
  if (
    text === undefined ||
    text === null
  ) {
    return "";
  }

  return String(text)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ============================================================
// EXPORT
// ============================================================

module.exports = slugify;