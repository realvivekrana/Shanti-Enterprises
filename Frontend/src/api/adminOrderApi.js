// ============================================================
// SHANTI ENTERPRISES
// Admin Order API
// Frontend Phase 5 - Order Management
// ============================================================

import api from "./axios";

// ============================================================
// GET ALL ADMIN ORDERS
// GET /api/admin/orders
// ============================================================

export const getAdminOrders = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/orders",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET SINGLE ADMIN ORDER
// GET /api/admin/orders/:id
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
    `/admin/orders/${orderId}`
  );

  return response.data;
};

// ============================================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
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

  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ============================================================
// UPDATE PAYMENT STATUS
// PATCH /api/admin/orders/:id/payment-status
// ============================================================

export const updatePaymentStatus = async (
  orderId,
  paymentStatus
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  if (!paymentStatus) {
    throw new Error(
      "Payment status is required."
    );
  }

  const response = await api.patch(
    `/admin/orders/${orderId}/payment-status`,
    {
      paymentStatus,
    }
  );

  return response.data;
};

// ============================================================
// CANCEL ORDER
// PATCH /api/admin/orders/:id/cancel
// ============================================================

export const cancelAdminOrder = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  const response = await api.patch(
    `/admin/orders/${orderId}/cancel`
  );

  return response.data;
};