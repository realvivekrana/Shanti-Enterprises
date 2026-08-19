import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';


// ======================================================
// NOTIFICATION BELL
// ======================================================

const NotificationBell = () => {

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
    unreadCount,
    setUnreadCount,
  ] = useState(0);


  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ====================================================
  // FETCH NOTIFICATIONS
  // ====================================================

  const fetchNotifications =
    async () => {

      try {

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
            data.slice(0, 5)
          );

        }

      } catch (error) {

        console.error(
          'Failed to fetch notifications:',
          error
        );

      }

    };


  // ====================================================
  // FETCH UNREAD COUNT
  // ====================================================

  const fetchUnreadCount =
    async () => {

      try {

        const response =
          await API.get(
            '/notifications/unread-count'
          );


        const data =
          response.data?.data ||
          response.data;


        setUnreadCount(
          Number(
            data?.count || 0
          )
        );

      } catch (error) {

        console.error(
          'Failed to fetch unread count:',
          error
        );

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchNotifications();

    fetchUnreadCount();

    // Refresh notification count
    // every 30 seconds

    const interval =
      setInterval(() => {

        fetchUnreadCount();

      }, 30000);


    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  // ====================================================
  // TOGGLE DROPDOWN
  // ====================================================

  const handleToggle =
    async () => {

      setOpen(
        (previous) =>
          !previous
      );


      if (!open) {

        setLoading(
          true
        );


        await fetchNotifications();


        await fetchUnreadCount();


        setLoading(
          false
        );

      }

    };


  // ====================================================
  // MARK AS READ
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


        setUnreadCount(
          (previous) =>
            Math.max(
              0,
              previous - 1
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
  // NOTIFICATION ICON
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
  // FORMAT DATE
  // ====================================================

  const formatDate =
    (date) => {

      if (!date) {

        return '';

      }


      const notificationDate =
        new Date(
          date
        );


      if (
        Number.isNaN(
          notificationDate.getTime()
        )
      ) {

        return '';

      }


      return notificationDate.toLocaleString(
        'en-IN',
        {

          day:
            '2-digit',

          month:
            'short',

          hour:
            '2-digit',

          minute:
            '2-digit',

        }

      );

    };


  // ====================================================
  // GO TO NOTIFICATION
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


      // Close dropdown

      setOpen(
        false
      );


      // If notification has
      // an order, open orders page

      if (
        notification.order
      ) {

        navigate(
          '/orders'
        );

      }

    };


  return (

    <div
      className="relative"
    >


      {/* ==================================================
          BELL BUTTON
      ================================================== */}

      <button

        type="button"

        onClick={
          handleToggle
        }

        className="
          relative
          flex
          items-center
          justify-center
          w-10
          h-10
          rounded-lg
          hover:bg-slate-100
          transition-colors
        "

        title="Notifications"

        aria-label="Notifications"

      >

        {/* Bell SVG */}

        <svg

          className="w-5 h-5 text-slate-700"

          fill="none"

          viewBox="0 0 24 24"

          stroke="currentColor"

          strokeWidth={1.8}

        >

          <path

            strokeLinecap="round"

            strokeLinejoin="round"

            d="
              M14.857 17.082
              a23.848 23.848 0 005.454-1.31
              A8.967 8.967 0 0118 9.75
              V9A6 6 0 006 9v.75
              a8.967 8.967 0 01-2.312 6.022
              c1.733.64 3.56 1.085 5.455 1.31
              m5.714 0
              a24.255 24.255 0 01-5.714 0
              m5.714 0
              a3 3 0 11-5.714 0
            "

          />

        </svg>


        {/* ==================================================
            UNREAD BADGE
        ================================================== */}

        {unreadCount > 0 && (

          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-5
              h-5
              px-1
              bg-red-500
              text-white
              text-[10px]
              font-bold
              rounded-full
              flex
              items-center
              justify-center
              border-2
              border-white
            "
          >

            {unreadCount > 99
              ? '99+'
              : unreadCount}

          </span>

        )}

      </button>


      {/* ==================================================
          DROPDOWN
      ================================================== */}

      {open && (

        <>

          {/* Invisible overlay */}

          <button

            type="button"

            aria-label="Close notifications"

            onClick={() =>
              setOpen(false)
            }

            className="
              fixed
              inset-0
              z-40
              cursor-default
            "

          />


          <div
            className="
              absolute
              right-0
              top-12
              z-50
              w-[350px]
              max-w-[calc(100vw-2rem)]
              bg-white
              rounded-xl
              border
              border-slate-200
              shadow-xl
              overflow-hidden
            "
          >


            {/* ==================================================
                HEADER
            ================================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                px-4
                py-3
                border-b
                border-slate-100
              "
            >

              <div>

                <h3
                  className="
                    font-semibold
                    text-slate-800
                  "
                >

                  Notifications

                </h3>


                {unreadCount > 0 && (

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    "
                  >

                    {unreadCount} unread notification
                    {unreadCount !== 1
                      ? 's'
                      : ''}

                  </p>

                )}

              </div>


              <Link

                to="/notifications"

                onClick={() =>
                  setOpen(false)
                }

                className="
                  text-xs
                  font-medium
                  text-teal-600
                  hover:text-teal-700
                "

              >

                View All

              </Link>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

              <div
                className="
                  px-4
                  py-8
                  text-center
                  text-sm
                  text-slate-500
                "
              >

                Loading notifications...

              </div>

            )}


            {/* ==================================================
                EMPTY
            ================================================== */}

            {!loading &&
              notifications.length === 0 && (

                <div
                  className="
                    px-4
                    py-10
                    text-center
                  "
                >

                  <div
                    className="
                      text-3xl
                      mb-2
                    "
                  >

                    🔔

                  </div>


                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    No notifications

                  </p>


                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                  >

                    You're all caught up.

                  </p>

                </div>

              )}


            {/* ==================================================
                NOTIFICATION LIST
            ================================================== */}

            {!loading &&
              notifications.length > 0 && (

                <div
                  className="
                    max-h-[360px]
                    overflow-y-auto
                  "
                >

                  {notifications.map(
                    (
                      notification
                    ) => (

                      <button

                        key={
                          notification._id
                        }

                        type="button"

                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }

                        className={`
                          w-full
                          text-left
                          flex
                          gap-3
                          px-4
                          py-3
                          border-b
                          border-slate-100
                          hover:bg-slate-50
                          transition-colors
                          ${
                            !notification.read
                              ? 'bg-teal-50/50'
                              : ''
                          }
                        `}

                      >

                        {/* Icon */}

                        <div
                          className="
                            w-9
                            h-9
                            shrink-0
                            rounded-full
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                            text-base
                          "
                        >

                          {getNotificationIcon(
                            notification.type
                          )}

                        </div>


                        {/* Content */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            "
                          >

                            <p
                              className={`
                                text-sm
                                ${
                                  !notification.read
                                    ? 'font-semibold text-slate-800'
                                    : 'font-medium text-slate-700'
                                }
                              `}
                            >

                              {
                                notification.title
                              }

                            </p>


                            {!notification.read && (

                              <span
                                className="
                                  w-2
                                  h-2
                                  rounded-full
                                  bg-teal-600
                                  mt-1.5
                                  shrink-0
                                "
                              />

                            )}

                          </div>


                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                              line-clamp-2
                            "
                          >

                            {
                              notification.message
                            }

                          </p>


                          <p
                            className="
                              text-[10px]
                              text-slate-400
                              mt-1.5
                            "
                          >

                            {formatDate(
                              notification.createdAt
                            )}

                          </p>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}


            {/* ==================================================
                FOOTER
            ================================================== */}

            {notifications.length > 0 && (

              <div
                className="
                  px-4
                  py-2.5
                  border-t
                  border-slate-100
                  text-center
                "
              >

                <Link

                  to="/notifications"

                  onClick={() =>
                    setOpen(false)
                  }

                  className="
                    text-sm
                    font-medium
                    text-teal-600
                    hover:text-teal-700
                  "

                >

                  See all notifications

                </Link>

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

};


export default NotificationBell;