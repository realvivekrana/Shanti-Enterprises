// ============================================================
// SHANTI ENTERPRISES
// Category API
// Frontend Phase 2 - Shopping
// ============================================================

import api from "./axios";

// ============================================================
// GET ALL CATEGORIES
// ============================================================

export const getCategories = async () => {
  const response = await api.get(
    "/categories"
  );

  return response.data;
};

// ============================================================
// GET CATEGORY BY ID
// ============================================================

export const getCategoryById = async (
  categoryId
) => {
  const response = await api.get(
    `/categories/${categoryId}`
  );

  return response.data;
};