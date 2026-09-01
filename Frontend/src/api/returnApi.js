// ============================================================
// SHANTI ENTERPRISES
// Return Request API
// Frontend - Customer Returns
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET MY RETURNS
// GET /api/returns
// ------------------------------------------------------------

export const getMyReturns = async (params = {}) => {
  const response = await api.get("/returns", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET RETURN BY ID
// GET /api/returns/:id
// ------------------------------------------------------------

export const getReturnById = async (id) => {
  if (!id) throw new Error("Return ID is required.");
  const response = await api.get(`/returns/${id}`);
  return response.data;
};

// ------------------------------------------------------------
// CREATE RETURN REQUEST
// POST /api/returns
// ------------------------------------------------------------

export const createReturnRequest = async (payload) => {
  if (!payload) throw new Error("Return data is required.");
  const response = await api.post("/returns", payload);
  return response.data;
};

// ------------------------------------------------------------
// CANCEL RETURN REQUEST
// PATCH /api/returns/:id/cancel
// ------------------------------------------------------------

export const cancelReturnRequest = async (id) => {
  if (!id) throw new Error("Return ID is required.");
  const response = await api.patch(`/returns/${id}/cancel`);
  return response.data;
};
