// ============================================================
// SHANTI ENTERPRISES
// Admin Shipment API
// Frontend - Admin Shipment Management
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET ALL SHIPMENTS (ADMIN)
// GET /api/admin/shipments
// ------------------------------------------------------------

export const getAdminShipments = async (params = {}) => {
  const response = await api.get("/admin/shipments", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET SINGLE SHIPMENT (ADMIN)
// GET /api/admin/shipments/:id
// ------------------------------------------------------------

export const getAdminShipmentById = async (id) => {
  if (!id) {
    throw new Error("Shipment ID is required.");
  }

  const response = await api.get(`/admin/shipments/${id}`);
  return response.data;
};

// ------------------------------------------------------------
// UPDATE SHIPMENT STATUS (ADMIN)
// PATCH /api/admin/shipments/:id/status
// ------------------------------------------------------------

export const updateAdminShipmentStatus = async (id, status) => {
  if (!id) {
    throw new Error("Shipment ID is required.");
  }

  if (!status) {
    throw new Error("Shipment status is required.");
  }

  const response = await api.patch(`/admin/shipments/${id}/status`, {
    status,
  });
  return response.data;
};

// ------------------------------------------------------------
// UPDATE TRACKING INFO (ADMIN)
// PATCH /api/admin/shipments/:id/tracking
// ------------------------------------------------------------

export const updateAdminTracking = async (id, trackingData) => {
  if (!id) {
    throw new Error("Shipment ID is required.");
  }

  const response = await api.patch(
    `/admin/shipments/${id}/tracking`,
    trackingData
  );
  return response.data;
};
