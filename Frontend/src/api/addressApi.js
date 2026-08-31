// ============================================================
// SHANTI ENTERPRISES
// Address API
// Frontend - Customer Saved Addresses
// ============================================================

import API from "./axios";

// ============================================================
// GET MY ADDRESSES
// GET /api/addresses
// ============================================================

export const getMyAddresses = async () => {
  const response = await API.get(
    "/addresses"
  );

  return response?.data ?? response;
};

// ============================================================
// GET ADDRESS BY ID
// GET /api/addresses/:id
// ============================================================

export const getAddressById = async (
  addressId
) => {
  if (!addressId) {
    throw new Error(
      "Address ID is required."
    );
  }

  const response = await API.get(
    `/addresses/${addressId}`
  );

  return response?.data ?? response;
};

// ============================================================
// CREATE ADDRESS
// POST /api/addresses
// ============================================================

export const createAddress = async (
  addressData
) => {
  if (!addressData) {
    throw new Error(
      "Address data is required."
    );
  }

  const response = await API.post(
    "/addresses",
    addressData
  );

  return response?.data ?? response;
};

// ============================================================
// UPDATE ADDRESS
// PUT /api/addresses/:id
// ============================================================

export const updateAddress = async (
  addressId,
  addressData
) => {
  if (!addressId) {
    throw new Error(
      "Address ID is required."
    );
  }

  if (!addressData) {
    throw new Error(
      "Address data is required."
    );
  }

  const response = await API.put(
    `/addresses/${addressId}`,
    addressData
  );

  return response?.data ?? response;
};

// ============================================================
// DELETE ADDRESS
// DELETE /api/addresses/:id
// ============================================================

export const deleteAddress = async (
  addressId
) => {
  if (!addressId) {
    throw new Error(
      "Address ID is required."
    );
  }

  const response = await API.delete(
    `/addresses/${addressId}`
  );

  return response?.data ?? response;
};

// ============================================================
// SET DEFAULT ADDRESS
// PATCH /api/addresses/:id/default
// ============================================================

export const setDefaultAddress = async (
  addressId
) => {
  if (!addressId) {
    throw new Error(
      "Address ID is required."
    );
  }

  const response = await API.patch(
    `/addresses/${addressId}/default`
  );

  return response?.data ?? response;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getMyAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};