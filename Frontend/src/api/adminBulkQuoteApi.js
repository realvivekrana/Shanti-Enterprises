// ============================================================
// SHANTI ENTERPRISES
// Admin Bulk Quote API
// Frontend - Admin Bulk Quote (RFQ-style) Management
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET ALL BULK QUOTES
// GET /api/admin/bulk-quotes
// ------------------------------------------------------------

export const getAdminBulkQuotes = async (params = {}) => {
  const response = await api.get("/admin/bulk-quotes", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE BULK QUOTE
// GET /api/admin/bulk-quotes/:id
// ------------------------------------------------------------

export const getAdminBulkQuoteById = async (quoteId) => {
  if (!quoteId) {
    throw new Error("Bulk quote ID is required.");
  }

  const response = await api.get(`/admin/bulk-quotes/${quoteId}`);
  return response.data;
};

// ------------------------------------------------------------
// SEND PRICING TO CUSTOMER
// PATCH /api/admin/bulk-quotes/:id/respond
// payload: { items: [{ productId, quotedPrice }], adminNote, validUntil }
// ------------------------------------------------------------

export const respondToAdminBulkQuote = async (quoteId, payload) => {
  if (!quoteId) {
    throw new Error("Bulk quote ID is required.");
  }

  if (!payload) {
    throw new Error("Pricing data is required.");
  }

  const response = await api.patch(
    `/admin/bulk-quotes/${quoteId}/respond`,
    payload
  );

  return response.data;
};

// ------------------------------------------------------------
// UPDATE STATUS (reviewing / rejected / cancelled)
// PATCH /api/admin/bulk-quotes/:id/status
// ------------------------------------------------------------

export const updateAdminBulkQuoteStatus = async (quoteId, status) => {
  if (!quoteId) {
    throw new Error("Bulk quote ID is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  const response = await api.patch(
    `/admin/bulk-quotes/${quoteId}/status`,
    { status }
  );

  return response.data;
};