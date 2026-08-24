// ============================================================
// SHANTI ENTERPRISES
// Notification Controller
// Phase 3 - Customer Portal
// ============================================================

const Notification = require("../models/Notification");

// ============================================================
// GET MY NOTIFICATIONS
// ============================================================

const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = "false",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      50
    );

    const filter = {
      user: req.user.id,
    };

    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      notifications,
      totalNotifications,
      unreadCount,
    ] = await Promise.all([
      Notification.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Notification.countDocuments(filter),

      Notification.countDocuments({
        user: req.user.id,
        isRead: false,
      }),
    ]);

    const totalPages = Math.ceil(
      totalNotifications / perPage
    );

    res.status(200).json({
      success: true,

      count: notifications.length,

      unreadCount,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalNotifications,
        totalPages,
      },

      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================

const markNotificationAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!notification) {
      const error = new Error(
        "Notification not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// MARK ALL AS READ
// ============================================================

const markAllNotificationsAsRead = async (
  req,
  res,
  next
) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};