// ============================================================
// SHANTI ENTERPRISES
// Profile Routes
// Phase 3 - Customer Portal
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// PROFILE VALIDATION
// ============================================================

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 80,
    })
    .withMessage(
      "Name must be between 2 and 80 characters"
    ),

  body("phone")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) {
        return true;
      }

      if (
        value.length < 10 ||
        value.length > 15
      ) {
        throw new Error(
          "Phone number must be between 10 and 15 characters"
        );
      }

      return true;
    }),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/profile
router.get(
  "/",
  getMyProfile
);

// PUT /api/profile
router.put(
  "/",
  validate(updateProfileValidation),
  updateMyProfile
);

module.exports = router;