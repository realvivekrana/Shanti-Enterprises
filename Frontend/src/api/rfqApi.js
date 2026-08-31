// ============================================================
// SHANTI ENTERPRISES
// RFQ API
// Frontend - Wholesale RFQ
// ============================================================

import api from "./axios";

// ============================================================
// CUSTOMER RFQ APIs
// ============================================================

// ------------------------------------------------------------
// CREATE RFQ
// POST /api/rfqs
// ------------------------------------------------------------

export const createRFQ = async (payload) => {
  if (!payload) {
    throw new Error(
      "RFQ data is required."
    );
  }

  const response = await api.post(
    "/rfqs",
    payload
  );

  return response.data;
};

// ------------------------------------------------------------
// GET MY RFQs
// GET /api/rfqs
// ------------------------------------------------------------

export const getMyRFQs = async (
  params = {}
) => {
  const response = await api.get(
    "/rfqs",
    {
      params,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE CUSTOMER RFQ
// GET /api/rfqs/:id
// ------------------------------------------------------------

export const getRFQById = async (
  rfqId
) => {
  if (!rfqId) {
    throw new Error(
      "RFQ ID is required."
    );
  }

  const response = await api.get(
    `/rfqs/${rfqId}`
  );

  return response.data;
};

// ------------------------------------------------------------
// CANCEL CUSTOMER RFQ
// PATCH /api/rfqs/:id/cancel
// ------------------------------------------------------------

export const cancelRFQ = async (
  rfqId
) => {
  if (!rfqId) {
    throw new Error(
      "RFQ ID is required."
    );
  }

  const response = await api.patch(
    `/rfqs/${rfqId}/cancel`
  );

  return response.data;
};

// ============================================================
// ADMIN RFQ APIs
// ============================================================

// ------------------------------------------------------------
// GET ALL ADMIN RFQs
// GET /api/admin/rfqs
// ------------------------------------------------------------

export const getAdminRFQs = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/rfqs",
    {
      params,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE ADMIN RFQ
// GET /api/admin/rfqs/:id
// ------------------------------------------------------------

export const getAdminRFQById = async (
  rfqId
) => {
  if (!rfqId) {
    throw new Error(
      "RFQ ID is required."
    );
  }

  const response = await api.get(
    `/admin/rfqs/${rfqId}`
  );

  return response.data;
};

// ------------------------------------------------------------
// UPDATE ADMIN RFQ STATUS
// PATCH /api/admin/rfqs/:id/status
// ------------------------------------------------------------

export const updateAdminRFQStatus = async (
  rfqId,
  status
) => {
  if (!rfqId) {
    throw new Error(
      "RFQ ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "RFQ status is required."
    );
  }

  const response = await api.patch(
    `/admin/rfqs/${rfqId}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ------------------------------------------------------------
// CANCEL ADMIN RFQ
// PATCH /api/admin/rfqs/:id/cancel
// ------------------------------------------------------------

export const cancelAdminRFQ = async (
  rfqId
) => {
  if (!rfqId) {
    throw new Error(
      "RFQ ID is required."
    );
  }

  const response = await api.patch(
    `/admin/rfqs/${rfqId}/cancel`
  );

  return response.data;
};