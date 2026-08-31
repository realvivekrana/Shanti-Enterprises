// ============================================================
// SHANTI ENTERPRISES
// Order API
// Frontend Phase 3 - Customer Orders
// ============================================================

import api from "./axios";

// ============================================================
// CREATE NORMAL ORDER
// POST /api/orders
// ============================================================

export const createOrder = async (
  orderData
) => {
  if (!orderData) {
    throw new Error(
      "Order data is required."
    );
  }

  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};

// ============================================================
// CREATE ORDER FROM ACCEPTED QUOTATION
// POST /api/orders/from-quotation
// ============================================================

export const createOrderFromQuotation =
  async (orderData) => {
    if (!orderData) {
      throw new Error(
        "Order data is required."
      );
    }

    const response = await api.post(
      "/orders/from-quotation",
      orderData
    );

    return response.data;
  };

// ============================================================
// GET MY ORDERS
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