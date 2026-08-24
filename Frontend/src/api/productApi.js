// ============================================================
// SHANTI ENTERPRISES
// Product API
// Frontend Phase 2 - Shopping
// ============================================================

import api from "./axios";

// ============================================================
// GET PRODUCTS
// ============================================================

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// ============================================================
// GET SINGLE PRODUCT
// ============================================================

export const getProductById = async (productId) => {
  const response = await api.get(
    `/products/${productId}`
  );

  return response.data;
};

// ============================================================
// SEARCH PRODUCTS
// ============================================================

export const searchProducts = async (query) => {
  const response = await api.get(
    "/products",
    {
      params: {
        search: query,
      },
    }
  );

  return response.data;
};