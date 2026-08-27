// ============================================================
// SHANTI ENTERPRISES
// Order API
// Frontend Phase 3 - Customer
// ============================================================

import api from "./axios";

// ============================================================
// CREATE ORDER
// ============================================================

export const createOrder = async (
  orderData
) => {
  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};

// ============================================================
// GET MY ORDERS
// Backend Route:
// GET /api/orders
// ============================================================

export const getMyOrders = async (
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
// GET ORDER BY ID
// Backend Route:
// GET /api/orders/:id
// ============================================================

export const getOrderById = async (
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