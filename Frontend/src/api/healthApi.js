// ============================================================
// SHANTI ENTERPRISES
// Health API
// Frontend Phase 1 - Foundation
// ============================================================

import api from "./axios";

// ============================================================
// CHECK BACKEND HEALTH
// ============================================================

export const checkBackendHealth =
  async () => {
    const response =
      await api.get("/health");

    return response.data;
  };