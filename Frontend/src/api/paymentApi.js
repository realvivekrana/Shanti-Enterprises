// ============================================================
// SHANTI ENTERPRISES
// Payment API
// Frontend Phase 3 - Checkout
// Updated - Razorpay Payment Handling
// ============================================================

import api from "./axios";

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================
// Backend:
// POST /api/payments/create-order
//
// Body:
// {
//   orderId: "MONGODB_ORDER_ID"
// }
// ============================================================

export const createPaymentOrder = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required to start payment."
    );
  }

  try {
    const response = await api.post(
      "/payments/create-order",
      {
        orderId,
      }
    );

    // ----------------------------------------------------------
    // BACKEND SUCCESS CHECK
    // ----------------------------------------------------------

    if (
      response?.data?.success === false
    ) {
      throw new Error(
        response?.data?.message ||
          "Unable to create Razorpay order."
      );
    }

    return response.data;
  } catch (error) {
    // ----------------------------------------------------------
    // EXTRACT BACKEND ERROR
    // ----------------------------------------------------------

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unable to create Razorpay order.";

    console.error(
      "Create payment order error:",
      error
    );

    throw new Error(message);
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================
// Backend:
// POST /api/payments/verify
//
// Body:
// {
//   orderId,
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature
// }
// ============================================================

export const verifyPayment = async (
  paymentData
) => {
  if (!paymentData) {
    throw new Error(
      "Payment verification data is required."
    );
  }

  if (
    !paymentData.razorpay_order_id &&
    !paymentData.razorpayOrderId
  ) {
    throw new Error(
      "Razorpay Order ID is missing."
    );
  }

  if (
    !paymentData.razorpay_payment_id &&
    !paymentData.razorpayPaymentId
  ) {
    throw new Error(
      "Razorpay Payment ID is missing."
    );
  }

  if (
    !paymentData.razorpay_signature &&
    !paymentData.razorpaySignature
  ) {
    throw new Error(
      "Razorpay payment signature is missing."
    );
  }

  try {
    const response = await api.post(
      "/payments/verify",
      paymentData
    );

    // ----------------------------------------------------------
    // BACKEND SUCCESS CHECK
    // ----------------------------------------------------------

    if (
      response?.data?.success === false
    ) {
      throw new Error(
        response?.data?.message ||
          "Payment verification failed."
      );
    }

    return response.data;
  } catch (error) {
    // ----------------------------------------------------------
    // EXTRACT BACKEND ERROR
    // ----------------------------------------------------------

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Payment verification failed.";

    console.error(
      "Verify payment error:",
      error
    );

    throw new Error(message);
  }
};