// ============================================================
// SHANTI ENTERPRISES
// RFQ Routes
// Phase 4 - Wholesale
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createRFQ,
  getMyRFQs,
  getRFQById,
  cancelRFQ,
} = require("../controllers/rfqController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createRFQValidation = [
  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one RFQ item is required"
    ),

  body("message")
    .optional()
    .isString()
    .withMessage(
      "Message must be text"
    ),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/rfqs
router.get(
  "/",
  getMyRFQs
);

// GET /api/rfqs/:id
router.get(
  "/:id",
  getRFQById
);

// POST /api/rfqs
router.post(
  "/",
  validate(createRFQValidation),
  createRFQ
);

// PATCH /api/rfqs/:id/cancel
router.patch(
  "/:id/cancel",
  cancelRFQ
);

module.exports = router;