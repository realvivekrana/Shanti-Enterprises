// ============================================================
// SHANTI ENTERPRISES
// Wishlist API
// Frontend - Customer Wishlist
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET WISHLIST
// GET /api/wishlist
// ------------------------------------------------------------

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

// ------------------------------------------------------------
// ADD TO WISHLIST
// POST /api/wishlist
// ------------------------------------------------------------

export const addToWishlist = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const response = await api.post("/wishlist", { productId });
  return response.data;
};

// ------------------------------------------------------------
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:productId
// ------------------------------------------------------------

export const removeFromWishlist = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// ------------------------------------------------------------
// CLEAR WISHLIST
// DELETE /api/wishlist
// ------------------------------------------------------------

export const clearWishlist = async () => {
  const response = await api.delete("/wishlist");
  return response.data;
};
