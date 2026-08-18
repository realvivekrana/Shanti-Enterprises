const express = require('express');

const {
  createOrder,
  verifyPayment,
  createPayment,
  useCredit,
  getMyCredit,
  getCreditHistory,
  updateCustomerCredit,
  recordCreditPayment,
} = require('../controllers/paymentController');

const {
  protect,
  admin,
} = require('../middleware/authMiddleware');

const router =
  express.Router();

// ==============================
// RAZORPAY
// ==============================

// Create Razorpay order
router.post(
  '/create-order',
  protect,
  createOrder
);

// Verify Razorpay payment
router.post(
  '/verify',
  protect,
  verifyPayment
);

// ==============================
// PAYMENT RECORD
// ==============================

router.post(
  '/',
  protect,
  createPayment
);

// ==============================
// CREDIT / PAY LATER
// ==============================

router.post(
  '/credit/use',
  protect,
  useCredit
);

router.get(
  '/credit/my',
  protect,
  getMyCredit
);

router.get(
  '/credit/history',
  protect,
  getCreditHistory
);

// ==============================
// ADMIN CREDIT MANAGEMENT
// ==============================

router.put(
  '/credit/customer',
  protect,
  admin,
  updateCustomerCredit
);

router.post(
  '/credit/payment',
  protect,
  admin,
  recordCreditPayment
);

module.exports =
  router;