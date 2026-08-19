const express = require('express');

const router = express.Router();

const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require('../controllers/authController');

// ======================================================
// CUSTOMER AUTH
// ======================================================

// Customer Register
router.post(
  '/register',
  registerUser
);

// Customer Login
router.post(
  '/login',
  loginUser
);

// ======================================================
// ADMIN AUTH
// ======================================================

// Admin Register
router.post(
  '/admin/register',
  registerAdmin
);

// Admin Login
router.post(
  '/admin/login',
  loginAdmin
);

module.exports = router;