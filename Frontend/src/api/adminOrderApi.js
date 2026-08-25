// ============================================================
// SHANTI ENTERPRISES
// Admin Order API
// Frontend Phase 5 - Order Management
// ============================================================

import api from "./axios";

// ============================================================
// GET ALL ORDERS
// ============================================================

export const getAdminOrders = async (
  params = {}
) => {
  const response = await api.get(
    "/orders",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getAdminOrderById = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export const updateOrderStatus = async (
  orderId,
  status
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "Order status is required."
    );
  }

  const response = await api.put(
    `/orders/${orderId}/status`,
    {
      status,
    }
  );

  return response.data;
};