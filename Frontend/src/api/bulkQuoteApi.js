// ============================================================
// SHANTI ENTERPRISES
// Bulk Quote API
// Frontend - Wholesale Bulk Quotes
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// CREATE BULK QUOTE
// POST /api/bulk-quotes
// ------------------------------------------------------------

export const createBulkQuote = async (payload) => {
  if (!payload) {
    throw new Error("Bulk quote data is required.");
  }

  const response = await api.post("/bulk-quotes", payload);
  return response.data;
};

// ------------------------------------------------------------
// GET MY BULK QUOTES
// GET /api/bulk-quotes
// ------------------------------------------------------------

export const getMyBulkQuotes = async (params = {}) => {
  const response = await api.get("/bulk-quotes", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE BULK QUOTE
// GET /api/bulk-quotes/:id
// ------------------------------------------------------------

export const getBulkQuoteById = async (id) => {
  if (!id) {
    throw new Error("Bulk quote ID is required.");
  }

  const response = await api.get(`/bulk-quotes/${id}`);
  return response.data;
};
