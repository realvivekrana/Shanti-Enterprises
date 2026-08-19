const express =
  require('express');

const router =
  express.Router();


// ======================================================
// CONTROLLER
// ======================================================

const {

  // Existing
  updateShipment,
  updateShipmentStatus,
  trackShipment,

  // Shiprocket
  createShiprocketShipment,
  assignShiprocketAWB,
  pickupShiprocketShipment,
  trackShiprocketShipment,
  generateShiprocketLabel,
  generateShiprocketInvoice,
  cancelShiprocketShipment,

} = require(
  '../controllers/shipmentController'
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
// EXISTING SHIPMENT ROUTES
// ======================================================


// ======================================================
// UPDATE SHIPMENT DETAILS
// ======================================================
//
// PUT
// /api/shipments/:orderId
//
// Admin:
// carrier
// tracking ID
// tracking URL
// estimated delivery
//
// ======================================================

router.put(

  '/:orderId',

  protect,

  admin,

  updateShipment

);


// ======================================================
// UPDATE SHIPMENT STATUS
// ======================================================
//
// PATCH
// /api/shipments/:orderId/status
//
// ======================================================

router.patch(

  '/:orderId/status',

  protect,

  admin,

  updateShipmentStatus

);


// ======================================================
// TRACK SHIPMENT
// ======================================================
//
// GET
// /api/shipments/:orderId/track
//
// Customer:
// Own order
//
// Admin:
// Any order
//
// ======================================================

router.get(

  '/:orderId/track',

  protect,

  trackShipment

);


// ======================================================
// SHIPROCKET
// ======================================================


// ======================================================
// CREATE SHIPROCKET ORDER
// ======================================================
//
// POST
// /api/shipments/:orderId/shiprocket/create
//
// Flow:
//
// Order
//   ↓
// Shiprocket
//   ↓
// Shiprocket Order ID
//   ↓
// Shipment ID
//   ↓
// MongoDB
//
// Admin only
//
// ======================================================

router.post(

  '/:orderId/shiprocket/create',

  protect,

  admin,

  createShiprocketShipment

);


// ======================================================
// ASSIGN AWB
// ======================================================
//
// POST
// /api/shipments/:orderId/shiprocket/awb
//
// Optional body:
//
// {
//   "courierId": 123
// }
//
// If courierId is not provided,
// Shiprocket can select courier
// according to its rules.
//
// Admin only
//
// ======================================================

router.post(

  '/:orderId/shiprocket/awb',

  protect,

  admin,

  assignShiprocketAWB

);


// ======================================================
// REQUEST PICKUP
// ======================================================
//
// POST
// /api/shipments/:orderId/shiprocket/pickup
//
// Optional body:
//
// {
//   "pickupDate": "2026-08-20"
// }
//
// Admin only
//
// ======================================================

router.post(

  '/:orderId/shiprocket/pickup',

  protect,

  admin,

  pickupShiprocketShipment

);


// ======================================================
// LIVE TRACKING
// ======================================================
//
// GET
// /api/shipments/:orderId/shiprocket/track
//
// Customer:
// Own order
//
// Admin:
// Any order
//
// Shiprocket se live tracking
// fetch karega.
//
// ======================================================

router.get(

  '/:orderId/shiprocket/track',

  protect,

  trackShiprocketShipment

);


// ======================================================
// SHIPPING LABEL
// ======================================================
//
// POST
// /api/shipments/:orderId/shiprocket/label
//
// Admin only
//
// ======================================================

router.post(

  '/:orderId/shiprocket/label',

  protect,

  admin,

  generateShiprocketLabel

);


// ======================================================
// SHIPPING INVOICE
// ======================================================
//
// POST
// /api/shipments/:orderId/shiprocket/invoice
//
// Admin only
//
// ======================================================

router.post(

  '/:orderId/shiprocket/invoice',

  protect,

  admin,

  generateShiprocketInvoice

);


// ======================================================
// CANCEL SHIPROCKET SHIPMENT
// ======================================================
//
// DELETE
// /api/shipments/:orderId/shiprocket
//
// Admin only
//
// ======================================================

router.delete(

  '/:orderId/shiprocket',

  protect,

  admin,

  cancelShiprocketShipment

);


// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;