// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard API
// Frontend Phase 5 - Dashboard & Analytics
// ============================================================

import api from "./axios";

// ============================================================
// GET DASHBOARD STATS
// GET /api/admin/dashboard/stats
// ============================================================

export const getDashboardStats = async () => {
  const response = await api.get(
    "/admin/dashboard/stats"
  );

  return response.data;
};

// ============================================================
// GET SALES ANALYTICS
// GET /api/admin/dashboard/sales
// ============================================================

export const getSalesAnalytics = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/dashboard/sales",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET DASHBOARD SUMMARY
// ============================================================

export const getDashboardSummary = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/dashboard",
    {
      params,
    }
  );

  return response.data;
};