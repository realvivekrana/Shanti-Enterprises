const express = require('express');

const router =
  express.Router();

const {
  getOrCreateInvoice,
  downloadInvoicePDF,
} = require('../controllers/invoiceController');

const {
  protect,
} = require('../middleware/authMiddleware');

// ==============================
// GET / CREATE INVOICE
// ==============================

router.get(
  '/:orderId',
  protect,
  getOrCreateInvoice
);

// ==============================
// DOWNLOAD PDF
// ==============================

router.get(
  '/:orderId/download',
  protect,
  downloadInvoicePDF
);

module.exports =
  router;