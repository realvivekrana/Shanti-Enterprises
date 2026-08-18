const express = require('express');

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
  reorderOrder,
} = require('../controllers/orderController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');


// ======================================================
// CREATE ORDER
// ======================================================

router.post(
  '/',
  protect,
  createOrder
);


// ======================================================
// MY ORDERS
// ======================================================

router.get(
  '/myorders',
  protect,
  getMyOrders
);


// ======================================================
// ADMIN - ALL ORDERS
// ======================================================

router.get(
  '/',
  protect,
  admin,
  getAllOrders
);


// ======================================================
// GET ORDER BY ID
// ======================================================

router.get(
  '/:id',
  protect,
  getOrderById
);


// ======================================================
// MARK ORDER AS PAID
// ======================================================

router.put(
  '/:id/pay',
  protect,
  updateOrderToPaid
);


// ======================================================
// ADMIN - UPDATE ORDER STATUS
// ======================================================

router.put(
  '/:id/status',
  protect,
  admin,
  updateOrderStatus
);


// ======================================================
// REORDER
// ======================================================
// Customer previous order ko reorder kar sakta hai.
//
// POST /api/orders/:id/reorder
//
// Backend current:
// - stock
// - MOQ
// - wholesale price
// check karega.
// ======================================================

router.post(
  '/:id/reorder',
  protect,
  reorderOrder
);


module.exports = router;