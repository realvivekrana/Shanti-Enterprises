// ============================================================
// SHANTI ENTERPRISES
// Category API
// Frontend Phase 5 - Category Management
// ============================================================

import api from "./axios";

// ============================================================
// GET ALL CATEGORIES
// GET /api/categories
// ============================================================

export const getCategories = async (
  params = {}
) => {
  const response = await api.get(
    "/categories",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET SINGLE CATEGORY
// GET /api/categories/:id
// ============================================================

export const getCategoryById = async (
  categoryId
) => {
  if (!categoryId) {
    throw new Error(
      "Category ID is required."
    );
  }

  const response = await api.get(
    `/categories/${categoryId}`
  );

  return response.data;
};

// ============================================================
// CREATE CATEGORY
// POST /api/admin/categories
// ============================================================

export const createCategory = async (
  categoryData
) => {
  if (!categoryData) {
    throw new Error(
      "Category data is required."
    );
  }

  const response = await api.post(
    "/admin/categories",
    categoryData
  );

  return response.data;
};

// ============================================================
// UPDATE CATEGORY
// PUT /api/admin/categories/:id
// ============================================================

export const updateCategory = async (
  categoryId,
  categoryData
) => {
  if (!categoryId) {
    throw new Error(
      "Category ID is required."
    );
  }

  if (!categoryData) {
    throw new Error(
      "Category data is required."
    );
  }

  const response = await api.put(
    `/admin/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};

// ============================================================
// DELETE CATEGORY
// DELETE /api/admin/categories/:id
// ============================================================

export const deleteCategory = async (
  categoryId
) => {
  if (!categoryId) {
    throw new Error(
      "Category ID is required."
    );
  }

  const response = await api.delete(
    `/admin/categories/${categoryId}`
  );

  return response.data;
};