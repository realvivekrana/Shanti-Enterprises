// ============================================================
// SHANTI ENTERPRISES
// Admin Reports API
// Frontend - Admin Reports
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// OVERVIEW REPORT
// GET /api/admin/reports/overview
// ------------------------------------------------------------

export const getAdminOverviewReport = async () => {
  const response = await api.get("/admin/reports/overview");
  return response.data;
};

// ------------------------------------------------------------
// ORDER STATUS REPORT
// GET /api/admin/reports/orders
// ------------------------------------------------------------

export const getOrderStatusReport = async () => {
  const response = await api.get("/admin/reports/orders");
  return response.data;
};

// ------------------------------------------------------------
// MONTHLY SALES REPORT
// GET /api/admin/reports/monthly-sales
// ------------------------------------------------------------

export const getMonthlySalesReport = async (year) => {
  const params = year ? { year } : {};
  const response = await api.get("/admin/reports/monthly-sales", { params });
  return response.data;
};

// ------------------------------------------------------------
// TOP PRODUCTS REPORT
// GET /api/admin/reports/top-products
// ------------------------------------------------------------

export const getTopProductsReport = async (limit = 10) => {
  const response = await api.get("/admin/reports/top-products", {
    params: { limit },
  });
  return response.data;
};

// ------------------------------------------------------------
// LOW STOCK REPORT
// GET /api/admin/reports/low-stock
// ------------------------------------------------------------

export const getLowStockReport = async () => {
  const response = await api.get("/admin/reports/low-stock");
  return response.data;
};
