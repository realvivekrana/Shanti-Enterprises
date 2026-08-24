// ============================================================
// SHANTI ENTERPRISES
// Return Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createReturnRequest,
  getMyReturns,
  getReturnById,
  cancelReturnRequest,
} = require("../controllers/returnController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createReturnValidation = [
  body("orderId")
    .notEmpty()
    .withMessage(
      "Order ID is required"
    ),

  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one return item is required"
    ),

  body("reason")
    .notEmpty()
    .withMessage(
      "Return reason is required"
    ),

  body("description")
    .optional()
    .isString()
    .withMessage(
      "Description must be text"
    ),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/returns
router.get(
  "/",
  getMyReturns
);

// GET /api/returns/:id
router.get(
  "/:id",
  getReturnById
);

// POST /api/returns
router.post(
  "/",
  validate(createReturnValidation),
  createReturnRequest
);

// PATCH /api/returns/:id/cancel
router.patch(
  "/:id/cancel",
  cancelReturnRequest
);

module.exports = router;