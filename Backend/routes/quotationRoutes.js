const express = require('express');

const {
  createQuotation,
  getMyQuotations,
  getSupplierQuotations,
  getQuotationById,
  counterOffer,
  acceptQuotation,
  rejectQuotation,
} = require('../controllers/quotationController');

const {
  protect,
  admin,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router =
  express.Router();

// ==============================
// CUSTOMER
// ==============================

// Get customer's quotations

router.get(
  '/my',
  protect,
  getMyQuotations
);


// Accept quotation

router.put(
  '/:id/accept',
  protect,
  acceptQuotation
);


// Reject quotation

router.put(
  '/:id/reject',
  protect,
  rejectQuotation
);


// ==============================
// SUPPLIER / ADMIN
// ==============================

// Supplier/Admin creates quotation

router.post(
  '/',
  protect,
  authorizeRoles(
    'supplier',
    'admin'
  ),
  createQuotation
);


// Supplier quotations

router.get(
  '/supplier',
  protect,
  authorizeRoles(
    'supplier',
    'admin'
  ),
  getSupplierQuotations
);


// ==============================
// NEGOTIATION
// ==============================

// Customer or supplier counter offer

router.put(
  '/:id/counter',
  protect,
  counterOffer
);


// ==============================
// COMMON
// ==============================

// Get quotation by ID

router.get(
  '/:id',
  protect,
  getQuotationById
);


module.exports =
  router;