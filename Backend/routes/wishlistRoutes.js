const express =
  require('express');

const router =
  express.Router();

const {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} =
  require('../controllers/wishlistController');

const {
  protect,
} =
  require('../middleware/authMiddleware');

// ==============================
// GET MY WISHLIST
// ==============================

router.get(
  '/',
  protect,
  getMyWishlist
);

// ==============================
// CHECK PRODUCT
// ==============================

router.get(
  '/check/:productId',
  protect,
  checkWishlist
);

// ==============================
// ADD PRODUCT
// ==============================

router.post(
  '/:productId',
  protect,
  addToWishlist
);

// ==============================
// REMOVE PRODUCT
// ==============================

router.delete(
  '/:productId',
  protect,
  removeFromWishlist
);

module.exports =
  router;