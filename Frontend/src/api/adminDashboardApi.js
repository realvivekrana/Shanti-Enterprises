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

export const getDashboardStats =
  async () => {
    const response =
      await api.get(
        "/admin/dashboard/stats"
      );

    return response.data;
  };

// ============================================================
// GET ADMIN DASHBOARD STATS
// Compatibility alias
// Used by AdminDashboardPage.jsx
// ============================================================

export const getAdminDashboardStats =
  getDashboardStats;

// ============================================================
// GET SALES ANALYTICS
// GET /api/admin/dashboard/sales
// ============================================================

export const getSalesAnalytics =
  async (
    params = {}
  ) => {
    const response =
      await api.get(
        "/admin/dashboard/sales",
        {
          params,
        }
      );

    return response.data;
  };

// ============================================================
// GET ADMIN SALES ANALYTICS
// Compatibility alias
// Used by AdminAnalyticsPage.jsx
// ============================================================

export const getAdminSalesAnalytics =
  getSalesAnalytics;

// ============================================================
// GET DASHBOARD SUMMARY
// GET /api/admin/dashboard
// ============================================================

export const getDashboardSummary =
  async (
    params = {}
  ) => {
    const response =
      await api.get(
        "/admin/dashboard",
        {
          params,
        }
      );

    return response.data;
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getDashboardStats,
  getAdminDashboardStats,
  getSalesAnalytics,
  getAdminSalesAnalytics,
  getDashboardSummary,
};