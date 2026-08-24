// ============================================================
// SHANTI ENTERPRISES
// Cart Routes
// Phase 2 - Shopping
// ============================================================

const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// ALL CART ROUTES REQUIRE LOGIN
// ============================================================

router.use(protect);

// GET /api/cart
router.get("/", getCart);

// POST /api/cart
router.post("/", addToCart);

// PUT /api/cart/:productId
router.put("/:productId", updateCartItem);

// DELETE /api/cart/:productId
router.delete(
  "/:productId",
  removeFromCart
);

// DELETE /api/cart
router.delete("/", clearCart);

module.exports = router;