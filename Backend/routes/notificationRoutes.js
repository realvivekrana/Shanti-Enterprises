const express =
  require('express');

const router =
  express.Router();

const {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} =
  require(
    '../controllers/notificationController'
  );

const {
  protect,
} =
  require(
    '../middleware/authMiddleware'
  );


// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

router.get(
  '/',
  protect,
  getMyNotifications
);


// ======================================================
// UNREAD COUNT
// ======================================================

router.get(
  '/unread-count',
  protect,
  getUnreadCount
);


// ======================================================
// MARK ALL READ
// ======================================================

router.put(
  '/read-all',
  protect,
  markAllNotificationsAsRead
);


// ======================================================
// DELETE ALL
// ======================================================

router.delete(
  '/all',
  protect,
  deleteAllNotifications
);


// ======================================================
// MARK ONE READ
// ======================================================

router.put(
  '/:id/read',
  protect,
  markNotificationAsRead
);


// ======================================================
// DELETE ONE
// ======================================================

router.delete(
  '/:id',
  protect,
  deleteNotification
);


module.exports =
  router;