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
    "/users",
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
    `/users/${userId}`
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

  const response = await api.put(
    `/users/${userId}/role`,
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

  const response = await api.put(
    `/users/${userId}/status`,
    {
      status,
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
    `/users/${userId}`
  );

  return response.data;
};