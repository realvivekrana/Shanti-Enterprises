const express = require('express');

const router =
  express.Router();

const {

  getAllSuppliers,

  getSupplierById,

  createSupplier,

  updateSupplier,

  getSupplierProducts,

  getMyProducts,

  getMyOrders,

  getSupplierDashboard,

} = require('../controllers/supplierController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');


// ==================================================
// ADMIN
// ==================================================

// Get all suppliers

router.get(
  '/',
  protect,
  admin,
  getAllSuppliers
);


// Create supplier

router.post(
  '/',
  protect,
  admin,
  createSupplier
);


// Get supplier details

router.get(
  '/:id',
  protect,
  admin,
  getSupplierById
);


// Update supplier

router.patch(
  '/:id',
  protect,
  admin,
  updateSupplier
);


// Get supplier products

router.get(
  '/:id/products',
  protect,
  admin,
  getSupplierProducts
);


// ==================================================
// SUPPLIER
// ==================================================

// Supplier dashboard

router.get(
  '/me/dashboard',
  protect,
  getSupplierDashboard
);


// Supplier's products

router.get(
  '/me/products',
  protect,
  getMyProducts
);


// Supplier's orders

router.get(
  '/me/orders',
  protect,
  getMyOrders
);


module.exports = router;