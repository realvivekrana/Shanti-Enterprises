// ============================================================
// SHANTI ENTERPRISES
// Profile API
// Frontend Phase 4 - Customer
// ============================================================

import api from "./axios";

// ============================================================
// GET MY PROFILE
// ============================================================

export const getMyProfile = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

// ============================================================
// UPDATE MY PROFILE
// ============================================================

export const updateMyProfile = async (
  profileData
) => {
  const response = await api.put(
    "/auth/profile",
    profileData
  );

  return response.data;
};