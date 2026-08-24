// ============================================================
// SHANTI ENTERPRISES
// Order API
// Frontend Phase 3 - Checkout
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
// ============================================================

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders/my"
  );

  return response.data;
};

// ============================================================
// GET ORDER BY ID
// ============================================================

export const getOrderById = async (
  orderId
) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};