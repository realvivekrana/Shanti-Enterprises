import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';


// ======================================================
// NOTIFICATIONS PAGE
// ======================================================

const Notifications = () => {

  const navigate =
    useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  // ====================================================
  // FETCH NOTIFICATIONS
  // ====================================================

  const fetchNotifications =
    async () => {

      try {

        setLoading(
          true
        );

        setError('');


        const response =
          await API.get(
            '/notifications'
          );


        const data =
          response.data?.data ||
          response.data;


        if (
          Array.isArray(data)
        ) {

          setNotifications(
            data
          );

        } else {

          setNotifications(
            []
          );

        }

      } catch (error) {

        console.error(
          'Failed to fetch notifications:',
          error
        );


        if (
          error.response?.status === 401
        ) {

          navigate(
            '/login'
          );

          return;

        }


        setError(
          error.response?.data?.message ||
          'Failed to load notifications'
        );

      } finally {

        setLoading(
          false
        );

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchNotifications();

  }, []);


  // ====================================================
  // MARK ONE AS READ
  // ====================================================

  const markAsRead =
    async (
      notificationId
    ) => {

      try {

        await API.put(

          `/notifications/${notificationId}/read`

        );


        setNotifications(

          (previous) =>

            previous.map(
              (notification) =>

                notification._id ===
                notificationId

                  ? {

                      ...notification,

                      read:
                        true,

                    }

                  : notification

            )

        );

      } catch (error) {

        console.error(
          'Failed to mark notification as read:',
          error
        );

      }

    };


  // ====================================================
  // MARK ALL AS READ
  // ====================================================

  const markAllAsRead =
    async () => {

      try {

        setActionLoading(
          true
        );


        await API.put(
          '/notifications/read-all'
        );


        setNotifications(

          (previous) =>

            previous.map(
              (notification) => ({

                ...notification,

                read:
                  true,

              })

            )

        );

      } catch (error) {

        console.error(
          'Failed to mark all notifications as read:',
          error
        );

      } finally {

        setActionLoading(
          false
        );

      }

    };


  // ====================================================
  // DELETE ONE
  // ====================================================

  const deleteNotification =
    async (
      notificationId
    ) => {

      try {

        setActionLoading(
          true
        );


        await API.delete(

          `/notifications/${notificationId}`

        );


        setNotifications(

          (previous) =>

            previous.filter(

              (notification) =>

                notification._id !==
                notificationId

            )

        );

      } catch (error) {

        console.error(
          'Failed to delete notification:',
          error
        );

      } finally {

        setActionLoading(
          false
        );

      }

    };


  // ====================================================
  // DELETE ALL
  // ====================================================

  const deleteAll =
    async () => {

      const confirmed =
        window.confirm(

          'Are you sure you want to delete all notifications?'

        );


      if (
        !confirmed
      ) {

        return;

      }


      try {

        setActionLoading(
          true
        );


        await API.delete(
          '/notifications/all'
        );


        setNotifications(
          []
        );

      } catch (error) {

        console.error(
          'Failed to delete all notifications:',
          error
        );

      } finally {

        setActionLoading(
          false
        );

      }

    };


  // ====================================================
  // ICON
  // ====================================================

  const getNotificationIcon =
    (type) => {

      switch (
        type
      ) {

        case 'order_confirmation':

          return '📦';


        case 'payment_confirmation':

          return '💳';


        case 'shipment_update':

          return '🚚';


        case 'delivery_update':

          return '📍';


        case 'return_update':

          return '↩️';


        case 'refund_update':

          return '💰';


        default:

          return '🔔';

      }

    };


  // ====================================================
  // DATE
  // ====================================================

  const formatDate =
    (date) => {

      if (!date) {

        return '';

      }


      const parsedDate =
        new Date(
          date
        );


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return '';

      }


      return parsedDate.toLocaleString(
        'en-IN',
        {

          day:
            '2-digit',

          month:
            'short',

          year:
            'numeric',

          hour:
            '2-digit',

          minute:
            '2-digit',

        }

      );

    };


  // ====================================================
  // NOTIFICATION CLICK
  // ====================================================

  const handleNotificationClick =
    async (
      notification
    ) => {

      if (
        !notification.read
      ) {

        await markAsRead(
          notification._id
        );

      }


      if (
        notification.order
      ) {

        navigate(
          '/orders'
        );

      }

    };


  // ====================================================
  // UNREAD COUNT
  // ====================================================

  const unreadCount =
    notifications.filter(

      (notification) =>
        !notification.read

    ).length;


  // ====================================================
  // LOADING
  // ====================================================

  if (
    loading
  ) {

    return (

      <div
        className="
          min-h-[60vh]
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-sm
            text-slate-500
          "
        >

          Loading notifications...

        </div>

      </div>

    );

  }


  // ====================================================
  // PAGE
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        py-8
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
          px-4
        "
      >


        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            px-5
            py-5
            mb-5
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >

                Notifications

              </h1>


              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >

                {notifications.length === 0

                  ? 'No notifications yet'

                  : `${notifications.length} notification${
                      notifications.length !== 1
                        ? 's'
                        : ''
                    }`

                }

                {unreadCount > 0 && (

                  <span>
                    {' '}• {unreadCount} unread
                  </span>

                )}

              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              {unreadCount > 0 && (

                <button

                  type="button"

                  onClick={
                    markAllAsRead
                  }

                  disabled={
                    actionLoading
                  }

                  className="
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-teal-700
                    bg-teal-50
                    hover:bg-teal-100
                    rounded-lg
                    transition-colors
                    disabled:opacity-50
                  "
                >

                  Mark all as read

                </button>

              )}


              {notifications.length > 0 && (

                <button

                  type="button"

                  onClick={
                    deleteAll
                  }

                  disabled={
                    actionLoading
                  }

                  className="
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-red-600
                    bg-red-50
                    hover:bg-red-100
                    rounded-lg
                    transition-colors
                    disabled:opacity-50
                  "
                >

                  Delete all

                </button>

              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            className="
              bg-red-50
              border
              border-red-200
              text-red-700
              rounded-xl
              px-4
              py-3
              mb-5
              text-sm
            "
          >

            {error}

          </div>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {notifications.length === 0 && !error && (

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              px-6
              py-16
              text-center
            "
          >

            <div
              className="
                text-5xl
                mb-4
              "
            >

              🔔

            </div>


            <h2
              className="
                text-lg
                font-semibold
                text-slate-800
              "
            >

              You're all caught up

            </h2>


            <p
              className="
                text-sm
                text-slate-500
                mt-2
              "
            >

              New order, payment, shipment and
              delivery updates will appear here.

            </p>


            <button

              type="button"

              onClick={() =>
                navigate('/')
              }

              className="
                mt-5
                px-5
                py-2.5
                bg-teal-600
                hover:bg-teal-700
                text-white
                text-sm
                font-medium
                rounded-lg
                transition-colors
              "
            >

              Continue Shopping

            </button>

          </div>

        )}


        {/* ==================================================
            NOTIFICATIONS LIST
        ================================================== */}

        {notifications.length > 0 && (

          <div
            className="
              space-y-3
            "
          >

            {notifications.map(
              (
                notification
              ) => (

                <div

                  key={
                    notification._id
                  }

                  className={`
                    bg-white
                    border
                    rounded-2xl
                    p-4
                    sm:p-5
                    transition-colors
                    ${
                      notification.read
                        ? 'border-slate-200'
                        : 'border-teal-200 bg-teal-50/30'
                    }
                  `}

                >

                  <div
                    className="
                      flex
                      gap-4
                    "
                  >


                    {/* ==================================================
                        ICON
                    ================================================== */}

                    <div
                      className="
                        w-11
                        h-11
                        shrink-0
                        rounded-full
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                        text-xl
                      "
                    >

                      {getNotificationIcon(
                        notification.type
                      )}

                    </div>


                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <h3
                              className={`
                                text-sm
                                sm:text-base
                                ${
                                  notification.read
                                    ? 'font-medium text-slate-700'
                                    : 'font-bold text-slate-800'
                                }
                              `}
                            >

                              {
                                notification.title
                              }

                            </h3>


                            {!notification.read && (

                              <span
                                className="
                                  w-2
                                  h-2
                                  rounded-full
                                  bg-teal-600
                                  shrink-0
                                "
                              />

                            )}

                          </div>


                          <p
                            className="
                              text-xs
                              text-slate-400
                              mt-1
                            "
                          >

                            {formatDate(
                              notification.createdAt
                            )}

                          </p>

                        </div>


                        {/* ==================================================
                            DELETE
                        ================================================== */}

                        <button

                          type="button"

                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }

                          disabled={
                            actionLoading
                          }

                          className="
                            shrink-0
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:text-red-600
                            hover:bg-red-50
                            transition-colors
                            disabled:opacity-50
                          "

                          title="Delete notification"

                        >

                          🗑️

                        </button>

                      </div>


                      {/* Message */}

                      <p
                        className="
                          text-sm
                          text-slate-600
                          leading-6
                          mt-2
                        "
                      >

                        {
                          notification.message
                        }

                      </p>


                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          mt-3
                        "
                      >

                        {!notification.read && (

                          <button

                            type="button"

                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }

                            className="
                              text-xs
                              font-medium
                              text-teal-700
                              bg-teal-50
                              hover:bg-teal-100
                              px-3
                              py-1.5
                              rounded-lg
                            "
                          >

                            Mark as read

                          </button>

                        )}


                        {notification.order && (

                          <button

                            type="button"

                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }

                            className="
                              text-xs
                              font-medium
                              text-slate-700
                              bg-slate-100
                              hover:bg-slate-200
                              px-3
                              py-1.5
                              rounded-lg
                            "
                          >

                            View Order

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default Notifications;