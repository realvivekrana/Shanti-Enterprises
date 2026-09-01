// ============================================================
// SHANTI ENTERPRISES
// Customer Shipment API
// Frontend - Customer Shipment Tracking
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET MY SHIPMENTS
// GET /api/shipments
// ------------------------------------------------------------

export const getMyShipments = async (params = {}) => {
  const response = await api.get("/shipments", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SHIPMENT BY ID
// GET /api/shipments/:id
// ------------------------------------------------------------

export const getShipmentById = async (id) => {
  if (!id) throw new Error("Shipment ID is required.");
  const response = await api.get(`/shipments/${id}`);
  return response.data;
};

// ------------------------------------------------------------
// TRACK SHIPMENT
// GET /api/shipments/:id/track
// ------------------------------------------------------------

export const trackShipment = async (id) => {
  if (!id) throw new Error("Shipment ID is required.");
  const response = await api.get(`/shipments/${id}/track`);
  return response.data;
};
