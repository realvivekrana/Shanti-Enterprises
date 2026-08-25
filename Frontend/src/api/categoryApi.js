// ============================================================
// SHANTI ENTERPRISES
// Category API
// Frontend Phase 5 - Category Management
// ============================================================

import api from "./axios";

// ============================================================
// GET CATEGORIES
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
// ============================================================

export const createCategory = async (
  categoryData
) => {
  const response = await api.post(
    "/categories",
    categoryData
  );

  return response.data;
};

// ============================================================
// UPDATE CATEGORY
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

  const response = await api.put(
    `/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};

// ============================================================
// DELETE CATEGORY
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
    `/categories/${categoryId}`
  );

  return response.data;
};