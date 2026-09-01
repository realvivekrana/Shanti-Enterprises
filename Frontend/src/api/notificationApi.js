// ============================================================
// SHANTI ENTERPRISES
// Notification API
// Frontend - Customer Notifications
// ============================================================

import api from "./axios";

// ------------------------------------------------------------
// GET MY NOTIFICATIONS
// GET /api/notifications
// ------------------------------------------------------------

export const getMyNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

// ------------------------------------------------------------
// MARK ONE AS READ
// PATCH /api/notifications/:id/read
// ------------------------------------------------------------

export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data;
};

// ------------------------------------------------------------
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// ------------------------------------------------------------

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
