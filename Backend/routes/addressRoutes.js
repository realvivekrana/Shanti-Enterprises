
// ============================================================
// SHANTI ENTERPRISES
// Address Routes
// Backend - Customer Saved Addresses
// ============================================================

const express = require("express");

const {
  getMyAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
//
// IMPORTANT:
// Apne project me jo existing authentication middleware use
// ho raha hai, usi ko yahan import karo.
//
// Agar tumhare project me authMiddleware.js hai:
//
// const { protect } = require("../middleware/authMiddleware");
//
// Agar export default/function different hai to existing
// project ke according import adjust karna hoga.
// ============================================================

const {
  protect,
} = require("../middleware/authMiddleware");

// ============================================================
// ROUTER
// ============================================================

const router =
  express.Router();

// ============================================================
// GET ALL MY ADDRESSES
// GET /api/addresses
// ============================================================

router.get(
  "/",
  protect,
  getMyAddresses
);

// ============================================================
// GET SINGLE ADDRESS
// GET /api/addresses/:id
// ============================================================

router.get(
  "/:id",
  protect,
  getAddressById
);

// ============================================================
// CREATE ADDRESS
// POST /api/addresses
// ============================================================

router.post(
  "/",
  protect,
  createAddress
);

// ============================================================
// UPDATE ADDRESS
// PUT /api/addresses/:id
// ============================================================

router.put(
  "/:id",
  protect,
  updateAddress
);

// ============================================================
// DELETE ADDRESS
// DELETE /api/addresses/:id
// ============================================================

router.delete(
  "/:id",
  protect,
  deleteAddress
);

// ============================================================
// SET DEFAULT ADDRESS
// PATCH /api/addresses/:id/default
// ============================================================

router.patch(
  "/:id/default",
  protect,
  setDefaultAddress
);

// ============================================================
// EXPORT
// ============================================================

module.exports =
  router;
