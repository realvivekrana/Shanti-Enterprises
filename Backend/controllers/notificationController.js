const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const Notification =
  require('../models/Notification');


// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

const getMyNotifications =
  asyncHandler(
    async (req, res) => {

      const notifications =
        await Notification.find({

          user:
            req.user._id,

        })

          .populate(
            'order',
            '_id orderNumber orderStatus'
          )

          .sort({

            createdAt:
              -1,

          })

          .limit(100);


      res.status(200).json(

        new ApiResponse(

          200,

          notifications,

          'Notifications fetched successfully'

        )

      );

    }
  );


// ======================================================
// GET UNREAD COUNT
// ======================================================

const getUnreadCount =
  asyncHandler(
    async (req, res) => {

      const count =
        await Notification.countDocuments({

          user:
            req.user._id,

          read:
            false,

        });


      res.status(200).json(

        new ApiResponse(

          200,

          {

            count,

          },

          'Unread notification count fetched'

        )

      );

    }
  );


// ======================================================
// MARK ONE AS READ
// ======================================================

const markNotificationAsRead =
  asyncHandler(
    async (req, res) => {

      const notification =
        await Notification.findOne({

          _id:
            req.params.id,

          user:
            req.user._id,

        });


      if (
        !notification
      ) {

        throw new ApiError(
          404,
          'Notification not found'
        );

      }


      notification.read =
        true;


      notification.readAt =
        new Date();


      await notification.save();


      res.status(200).json(

        new ApiResponse(

          200,

          notification,

          'Notification marked as read'

        )

      );

    }
  );


// ======================================================
// MARK ALL AS READ
// ======================================================

const markAllNotificationsAsRead =
  asyncHandler(
    async (req, res) => {

      await Notification.updateMany(

        {

          user:
            req.user._id,

          read:
            false,

        },

        {

          $set: {

            read:
              true,

            readAt:
              new Date(),

          },

        }

      );


      res.status(200).json(

        new ApiResponse(

          200,

          null,

          'All notifications marked as read'

        )

      );

    }
  );


// ======================================================
// DELETE ONE NOTIFICATION
// ======================================================

const deleteNotification =
  asyncHandler(
    async (req, res) => {

      const notification =
        await Notification.findOneAndDelete({

          _id:
            req.params.id,

          user:
            req.user._id,

        });


      if (
        !notification
      ) {

        throw new ApiError(
          404,
          'Notification not found'
        );

      }


      res.status(200).json(

        new ApiResponse(

          200,

          null,

          'Notification deleted successfully'

        )

      );

    }
  );


// ======================================================
// DELETE ALL NOTIFICATIONS
// ======================================================

const deleteAllNotifications =
  asyncHandler(
    async (req, res) => {

      await Notification.deleteMany({

        user:
          req.user._id,

      });


      res.status(200).json(

        new ApiResponse(

          200,

          null,

          'All notifications deleted successfully'

        )

      );

    }
  );


module.exports = {

  getMyNotifications,

  getUnreadCount,

  markNotificationAsRead,

  markAllNotificationsAsRead,

  deleteNotification,

  deleteAllNotifications,

};