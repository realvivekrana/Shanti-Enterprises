// ============================================================
// SHANTI ENTERPRISES
// Invoice Routes
// Phase 5 - Operations
// ============================================================

const express = require("express");

const {
  body,
} = require("express-validator");

const {
  createInvoice,
  getMyInvoice,
  getInvoiceByOrder,
  getMyInvoices,
} = require("../controllers/invoiceController");

const {
  protect,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");

const router = express.Router();

// ============================================================
// VALIDATION
// ============================================================

const createInvoiceValidation = [
  body("orderId")
    .notEmpty()
    .withMessage(
      "Order ID is required"
    ),
];

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.use(protect);

// GET /api/invoices
router.get(
  "/",
  getMyInvoices
);

// GET /api/invoices/order/:orderId
router.get(
  "/order/:orderId",
  getInvoiceByOrder
);

// GET /api/invoices/:id
router.get(
  "/:id",
  getMyInvoice
);

// POST /api/invoices
router.post(
  "/",
  validate(createInvoiceValidation),
  createInvoice
);

module.exports = router;