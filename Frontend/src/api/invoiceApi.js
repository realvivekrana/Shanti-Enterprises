// ============================================================
// SHANTI ENTERPRISES
// Invoice API
// Frontend - Customer Invoices
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET MY INVOICES
// GET /api/invoices
// ------------------------------------------------------------

export const getMyInvoices = async (params = {}) => {
  const response = await api.get("/invoices", { params });
  return response.data;
};

// ------------------------------------------------------------
// GET INVOICE BY ID
// GET /api/invoices/:id
// ------------------------------------------------------------

export const getMyInvoice = async (id) => {
  if (!id) throw new Error("Invoice ID is required.");
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

// ------------------------------------------------------------
// GET INVOICE BY ORDER
// GET /api/invoices/order/:orderId
// ------------------------------------------------------------

export const getInvoiceByOrder = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  const response = await api.get(`/invoices/order/${orderId}`);
  return response.data;
};

// ------------------------------------------------------------
// CREATE INVOICE FROM ORDER
// POST /api/invoices
// ------------------------------------------------------------

export const createInvoice = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  const response = await api.post("/invoices", { orderId });
  return response.data;
};
