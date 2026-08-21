const express = require('express');

const router = express.Router();

const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require('../controllers/authController');

// authRateLimiter pehle securityMiddleware.js mein bana hua tha
// lekin kahin bhi use nahi ho raha tha, isliye brute-force
// protection actually kaam hi nahi kar raha tha. Ab yahan wire kiya.
const {
  authRateLimiter,
} = require('../middleware/securityMiddleware');

// validateRegister/validateLogin bhi pehle se bane the
// lekin routes mein kabhi attach hi nahi kiye gaye the.
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validationMiddleware');

// ======================================================
// CUSTOMER AUTH
// ======================================================

// Customer Register
router.post(
  '/register',
  authRateLimiter,
  validateRegister,
  registerUser
);

// Customer Login
router.post(
  '/login',
  authRateLimiter,
  validateLogin,
  loginUser
);

// ======================================================
// ADMIN AUTH
// ======================================================

// Admin Register
// (ADMIN_REGISTER_CODE brute-force na ho isliye rate limiter zaroori hai)
router.post(
  '/admin/register',
  authRateLimiter,
  registerAdmin
);

// Admin Login
router.post(
  '/admin/login',
  authRateLimiter,
  loginAdmin
);

module.exports = router;