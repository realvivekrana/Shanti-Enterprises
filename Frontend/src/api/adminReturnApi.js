// ============================================================
// SHANTI ENTERPRISES
// Admin Return API
// Frontend - Admin Returns Management
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET ALL RETURNS
// GET /api/admin/returns
// ------------------------------------------------------------

export const getAdminReturns = async (params = {}) => {
  const response = await api.get("/admin/returns", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE RETURN
// GET /api/admin/returns/:id
// ------------------------------------------------------------

export const getAdminReturnById = async (returnId) => {
  if (!returnId) {
    throw new Error("Return ID is required.");
  }

  const response = await api.get(`/admin/returns/${returnId}`);
  return response.data;
};

// ------------------------------------------------------------
// UPDATE RETURN STATUS
// PATCH /api/admin/returns/:id/status
// payload: { status, refundAmount? }
// ------------------------------------------------------------

export const updateAdminReturnStatus = async (returnId, payload) => {
  if (!returnId) {
    throw new Error("Return ID is required.");
  }

  if (!payload?.status) {
    throw new Error("Return status is required.");
  }

  const response = await api.patch(
    `/admin/returns/${returnId}/status`,
    payload
  );

  return response.data;
};