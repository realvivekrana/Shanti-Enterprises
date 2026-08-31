// ============================================================
// SHANTI ENTERPRISES
// Quotation API
// Frontend - Wholesale Quotation
// ============================================================

import api from "./axios";

// ============================================================
// CUSTOMER QUOTATION APIs
// ============================================================

// ------------------------------------------------------------
// GET MY QUOTATIONS
// GET /api/quotations
// ------------------------------------------------------------

export const getMyQuotations = async (
  params = {}
) => {
  const response = await api.get(
    "/quotations",
    {
      params,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE QUOTATION
// GET /api/quotations/:id
// ------------------------------------------------------------

export const getQuotationById = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.get(
    `/quotations/${quotationId}`
  );

  return response.data;
};

// ------------------------------------------------------------
// ACCEPT QUOTATION
// PATCH /api/quotations/:id/accept
// ------------------------------------------------------------

export const acceptQuotation = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.patch(
    `/quotations/${quotationId}/accept`
  );

  return response.data;
};

// ------------------------------------------------------------
// REJECT QUOTATION
// PATCH /api/quotations/:id/reject
// ------------------------------------------------------------

export const rejectQuotation = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.patch(
    `/quotations/${quotationId}/reject`
  );

  return response.data;
};

// ============================================================
// ADMIN QUOTATION APIs
// ============================================================

// ------------------------------------------------------------
// GET ALL ADMIN QUOTATIONS
// GET /api/admin/quotations
// ------------------------------------------------------------

export const getAdminQuotations = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/quotations",
    {
      params,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE ADMIN QUOTATION
// GET /api/admin/quotations/:id
// ------------------------------------------------------------

export const getAdminQuotationById = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.get(
    `/admin/quotations/${quotationId}`
  );

  return response.data;
};

// ------------------------------------------------------------
// CREATE ADMIN QUOTATION
// POST /api/admin/quotations
// ------------------------------------------------------------

export const createQuotation = async (
  quotationData
) => {
  if (!quotationData) {
    throw new Error(
      "Quotation data is required."
    );
  }

  const response = await api.post(
    "/admin/quotations",
    quotationData
  );

  return response.data;
};

// ------------------------------------------------------------
// UPDATE QUOTATION STATUS
// PATCH /api/admin/quotations/:id/status
// ------------------------------------------------------------

export const updateQuotationStatus = async (
  quotationId,
  status
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "Quotation status is required."
    );
  }

  const response = await api.patch(
    `/admin/quotations/${quotationId}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// CANCEL ADMIN QUOTATION
// PATCH /api/admin/quotations/:id/cancel
// ------------------------------------------------------------

export const cancelQuotation = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.patch(
    `/admin/quotations/${quotationId}/cancel`
  );

  return response.data;
};