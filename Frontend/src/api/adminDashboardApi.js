// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard API
// Frontend Phase 5 - Analytics
// ============================================================

import api from "./axios";

// ============================================================
// GET DASHBOARD STATISTICS
// ============================================================

export const getAdminDashboardStats =
  async () => {
    const response =
      await api.get(
        "/dashboard"
      );

    return response.data;
  };

// ============================================================
// GET SALES ANALYTICS
// ============================================================

export const getAdminSalesAnalytics =
  async (params = {}) => {
    const response =
      await api.get(
        "/dashboard/sales",
        {
          params,
        }
      );

    return response.data;
  };