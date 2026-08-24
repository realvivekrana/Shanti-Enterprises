// ============================================================
// SHANTI ENTERPRISES
// Wishlist Routes
// Phase 3 - Customer Portal
// ============================================================

const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/wishlist
router.get(
  "/",
  getWishlist
);

// POST /api/wishlist
router.post(
  "/",
  addToWishlist
);

// DELETE /api/wishlist/:productId
router.delete(
  "/:productId",
  removeFromWishlist
);

// DELETE /api/wishlist
router.delete(
  "/",
  clearWishlist
);

module.exports = router;