// ============================================================
// SHANTI ENTERPRISES
// Admin Inventory API
// Frontend - Admin Inventory Management
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET INVENTORY LIST
// GET /api/admin/inventory
// ------------------------------------------------------------

export const getInventory = async (params = {}) => {
  const response = await api.get("/admin/inventory", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE INVENTORY ITEM
// GET /api/admin/inventory/:id
// ------------------------------------------------------------

export const getInventoryItem = async (id) => {
  if (!id) {
    throw new Error("Product ID is required.");
  }

  const response = await api.get(`/admin/inventory/${id}`);
  return response.data;
};

// ------------------------------------------------------------
// SET EXACT STOCK
// PATCH /api/admin/inventory/:id/stock
// ------------------------------------------------------------

export const updateInventoryStock = async (id, stock) => {
  if (!id) {
    throw new Error("Product ID is required.");
  }

  const response = await api.patch(`/admin/inventory/${id}/stock`, {
    stock,
  });
  return response.data;
};

// ------------------------------------------------------------
// ADJUST STOCK (ADD / REMOVE)
// PATCH /api/admin/inventory/:id/adjust
// ------------------------------------------------------------

export const adjustInventoryStock = async (id, quantity, type) => {
  if (!id) {
    throw new Error("Product ID is required.");
  }

  if (!type || !["add", "remove"].includes(type)) {
    throw new Error("Adjustment type must be 'add' or 'remove'.");
  }

  const response = await api.patch(`/admin/inventory/${id}/adjust`, {
    quantity,
    type,
  });
  return response.data;
};

// ------------------------------------------------------------
// UPDATE LOW STOCK THRESHOLD
// PATCH /api/admin/inventory/:id/threshold
// ------------------------------------------------------------

export const updateLowStockThreshold = async (id, lowStockThreshold) => {
  if (!id) {
    throw new Error("Product ID is required.");
  }

  const response = await api.patch(
    `/admin/inventory/${id}/threshold`,
    { lowStockThreshold }
  );
  return response.data;
};
