// ============================================================
// SHANTI ENTERPRISES
// Product API
// Frontend Phase 5 - Product Management
// ============================================================

import api from "./axios";

// ============================================================
// GET PRODUCTS
// Public Product Listing
// GET /api/products
// ============================================================

export const getProducts = async (
  params = {}
) => {
  const response = await api.get(
    "/products",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ============================================================

export const getProductById = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const response = await api.get(
    `/products/${productId}`
  );

  return response.data;
};

// ============================================================
// SEARCH PRODUCTS
// GET /api/products?search=query
// ============================================================

export const searchProducts = async (
  query,
  params = {}
) => {
  const response = await api.get(
    "/products",
    {
      params: {
        ...params,
        search: query,
      },
    }
  );

  return response.data;
};

// ============================================================
// CREATE PRODUCT
// Admin
// POST /api/admin/products
// ============================================================

export const createProduct = async (
  productData
) => {
  if (!productData) {
    throw new Error(
      "Product data is required."
    );
  }

  const response = await api.post(
    "/admin/products",
    productData
  );

  return response.data;
};

// ============================================================
// UPDATE PRODUCT
// Admin
// PUT /api/admin/products/:id
// ============================================================

export const updateProduct = async (
  productId,
  productData
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  if (!productData) {
    throw new Error(
      "Product data is required."
    );
  }

  const response = await api.put(
    `/admin/products/${productId}`,
    productData
  );

  return response.data;
};

// ============================================================
// DELETE PRODUCT
// Admin
// DELETE /api/admin/products/:id
// ============================================================

export const deleteProduct = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const response = await api.delete(
    `/admin/products/${productId}`
  );

  return response.data;
};

// ============================================================
// TOGGLE PRODUCT STATUS
// Admin
// PATCH /api/admin/products/:id/toggle-status
// ============================================================

export const toggleProductStatus = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const response = await api.patch(
    `/admin/products/${productId}/toggle-status`
  );

  return response.data;
};