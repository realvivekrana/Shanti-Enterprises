// ============================================================
// SHANTI ENTERPRISES
// Category API
// ============================================================

import api from "./axios";

// ============================================================
// HELPERS
// ============================================================

const createSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const prepareCategoryData = (categoryData) => {
  const name = String(categoryData?.name || "").trim();
  const slug = String(
    categoryData?.slug || createSlug(name)
  ).trim();

  return {
    ...categoryData,
    name,
    slug,
  };
};

// ============================================================
// GET ALL CATEGORIES
// GET /api/categories
// ============================================================

export const getCategories = async (params = {}) => {
  const response = await api.get("/categories", { params });

  return response.data;
};

// ============================================================
// GET SINGLE CATEGORY
// GET /api/categories/:id
// ============================================================

export const getCategoryById = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  const response = await api.get(`/categories/${categoryId}`);

  return response.data;
};

// ============================================================
// CREATE CATEGORY
// POST /api/categories (admin only)
// ============================================================

export const createCategory = async (categoryData) => {
  if (!categoryData) {
    throw new Error("Category data is required.");
  }

  const payload = prepareCategoryData(categoryData);

  if (!payload.name) {
    throw new Error("Category name is required.");
  }

  if (!payload.slug) {
    throw new Error(
      "Category name must contain letters or numbers."
    );
  }

  const response = await api.post("/categories", payload);

  return response.data;
};

// ============================================================
// UPDATE CATEGORY
// PUT /api/categories/:id (admin only)
// ============================================================

export const updateCategory = async (
  categoryId,
  categoryData
) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  if (!categoryData) {
    throw new Error("Category data is required.");
  }

  const payload = prepareCategoryData(categoryData);

  if (!payload.name) {
    throw new Error("Category name is required.");
  }

  if (!payload.slug) {
    throw new Error(
      "Category name must contain letters or numbers."
    );
  }

  const response = await api.put(
    `/categories/${categoryId}`,
    payload
  );

  return response.data;
};

// ============================================================
// DELETE CATEGORY
// DELETE /api/categories/:id (admin only)
// ============================================================

export const deleteCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  const response = await api.delete(
    `/categories/${categoryId}`
  );

  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
