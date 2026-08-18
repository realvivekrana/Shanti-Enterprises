const express = require('express');

const {
  getProducts,
  getProductById,
  calculateWholesalePrice,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');

const router =
  express.Router();

// ==============================
// PUBLIC PRODUCT ROUTES
// ==============================

router.get(
  '/',
  getProducts
);

// IMPORTANT:
// Keep this BEFORE /:id
router.get(
  '/:id/wholesale-price',
  calculateWholesalePrice
);

router.get(
  '/:id',
  getProductById
);

// ==============================
// ADMIN PRODUCT ROUTES
// ==============================

router.post(
  '/',
  protect,
  admin,
  createProduct
);

router.put(
  '/:id',
  protect,
  admin,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  admin,
  deleteProduct
);

module.exports = router;