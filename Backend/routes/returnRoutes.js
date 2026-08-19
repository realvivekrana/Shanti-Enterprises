const express =
  require('express');

const router =
  express.Router();


// ======================================================
// CONTROLLERS
// ======================================================

const {

  createReturnRequest,

  getMyReturnRequests,

  getAllReturnRequests,

  updateReturnStatus,

  updatePickupDetails,

  updateInspection,

  processRefund,

} = require(
  '../controllers/returnController'
);


// ======================================================
// AUTH
// ======================================================

const {

  protect,

  admin,

} = require(
  '../middleware/authMiddleware'
);


// ======================================================
// CUSTOMER
// ======================================================

// Create return / refund request

router.post(

  '/:orderId',

  protect,

  createReturnRequest

);


// Get customer's return requests

router.get(

  '/mine',

  protect,

  getMyReturnRequests

);


// ======================================================
// ADMIN
// ======================================================

// Get all return requests

router.get(

  '/',

  protect,

  admin,

  getAllReturnRequests

);


// Update return status

router.patch(

  '/:id',

  protect,

  admin,

  updateReturnStatus

);


// Update reverse pickup details

router.patch(

  '/:id/pickup',

  protect,

  admin,

  updatePickupDetails

);


// Update product inspection

router.patch(

  '/:id/inspection',

  protect,

  admin,

  updateInspection

);


// Process refund

router.patch(

  '/:id/refund',

  protect,

  admin,

  processRefund

);


// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;