// ============================================================
// SHANTI ENTERPRISES
// Payment API
// Frontend Phase 3 - Checkout
// ============================================================

import api from "./axios";

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

export const createPaymentOrder = async (
  orderId
) => {
  const response = await api.post(
    "/payment/create-order",
    {
      orderId,
    }
  );

  return response.data;
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

export const verifyPayment = async (
  paymentData
) => {
  const response = await api.post(
    "/payment/verify",
    paymentData
  );

  return response.data;
};