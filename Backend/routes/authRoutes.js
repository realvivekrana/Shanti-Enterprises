// ============================================================
// SHANTI ENTERPRISES
// Authentication Routes
// Phase 1 - Foundation
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// REGISTER VALIDATION
// ============================================================

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ============================================================
// LOGIN VALIDATION
// ============================================================

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ============================================================
// PUBLIC ROUTES
// ============================================================

router.post(
  "/register",
  validate(registerValidation),
  register
);

router.post(
  "/login",
  validate(loginValidation),
  login
);

router.post("/logout", logout);

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.get(
  "/me",
  protect,
  getCurrentUser
);

module.exports = router;