// ============================================================
// SHANTI ENTERPRISES
// Notification Routes
// Phase 3 - Customer Portal
// ============================================================

const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// ALL NOTIFICATION ROUTES REQUIRE LOGIN
// ============================================================

router.use(protect);

// GET /api/notifications
router.get(
  "/",
  getMyNotifications
);

// PATCH /api/notifications/read-all
router.patch(
  "/read-all",
  markAllNotificationsAsRead
);

// PATCH /api/notifications/:id/read
router.patch(
  "/:id/read",
  markNotificationAsRead
);

module.exports = router;