const express = require('express');

const router =
  express.Router();


const {

  updateShipment,

  updateShipmentStatus,

  trackShipment,

} = require(
  '../controllers/shipmentController'
);


const {

  protect,

  admin,

} = require(
  '../middleware/authMiddleware'
);


// ======================================================
// TRACK SHIPMENT
// ======================================================

// Customer can track own order
// Admin can track any order

router.get(

  '/:orderId/track',

  protect,

  trackShipment

);


// ======================================================
// UPDATE SHIPMENT DETAILS
// ======================================================

// Admin only

router.put(

  '/:orderId',

  protect,

  admin,

  updateShipment

);


// ======================================================
// UPDATE SHIPMENT STATUS
// ======================================================

// Admin only

router.patch(

  '/:orderId/status',

  protect,

  admin,

  updateShipmentStatus

);


module.exports =
  router;