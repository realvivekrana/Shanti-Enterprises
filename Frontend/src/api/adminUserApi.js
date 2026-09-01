// ============================================================
// SHANTI ENTERPRISES
// Admin User API
// Frontend Phase 5 - User Management
// ============================================================

import api from "./axios";

// ============================================================
// GET ALL USERS
// ============================================================

export const getAdminUsers = async (
  params = {}
) => {
  const response = await api.get(
    "/admin/customers",
    {
      params,
    }
  );

  return response.data;
};

// ============================================================
// GET SINGLE USER
// ============================================================

export const getAdminUserById = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const response = await api.get(
    `/admin/customers/${userId}`
  );

  return response.data;
};

// ============================================================
// UPDATE USER ROLE
// ============================================================

export const updateUserRole = async (
  userId,
  role
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (!role) {
    throw new Error(
      "User role is required."
    );
  }

  const response = await api.patch(
    `/admin/customers/${userId}`,
    {
      role,
    }
  );

  return response.data;
};

// ============================================================
// UPDATE USER STATUS
// ============================================================

export const updateUserStatus = async (
  userId,
  status
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "User status is required."
    );
  }

  const response = await api.patch(
    `/admin/customers/${userId}/status`,
    {
      isActive:
        status === "active",
    }
  );

  return response.data;
};

// ============================================================
// DELETE USER
// ============================================================

export const deleteAdminUser = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const response = await api.delete(
    `/admin/customers/${userId}`
  );

  return response.data;
};

// ============================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================

export const updateAdminUserRole =
  updateUserRole;

export const updateAdminUserStatus =
  updateUserStatus;
