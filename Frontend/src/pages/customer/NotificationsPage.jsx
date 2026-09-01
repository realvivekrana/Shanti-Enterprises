// ============================================================
// SHANTI ENTERPRISES
// Customer Notifications Page
// Frontend - Notifications
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  const loadNotifications = async (
    requestedPage = 1,
    filterUnread = unreadOnly
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyNotifications({
        page: requestedPage,
        limit: 20,
        unreadOnly: filterUnread ? "true" : "false",
      });

      setNotifications(response?.notifications || []);
      setUnreadCount(response?.unreadCount || 0);
      setTotalPages(response?.pagination?.totalPages || 1);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(1, unreadOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  // ==========================================================
  // MARK ONE AS READ
  // ==========================================================

  const handleMarkRead = async (notificationId) => {
    try {
      setMarkingId(notificationId);
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message || "Failed to mark notification as read.");
    } finally {
      setMarkingId("");
    }
  };

  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      setSuccessMsg("");

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      setSuccessMsg("All notifications marked as read.");
    } catch (err) {
      setError(err.message || "Failed to mark all notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && notifications.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading notifications..." />
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR (no data)
  // ==========================================================

  if (error && notifications.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage
            message={error}
            onRetry={() => loadNotifications(1)}
          />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="app-page">
      <div className="page-container">

        {/* ====================================================
            HEADER
            ==================================================== */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>Notifications</h1>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="btn-secondary">
              ← Dashboard
            </Link>

            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleMarkAllRead}
                disabled={markingAll}
              >
                {markingAll ? "Marking..." : "Mark All as Read"}
              </button>
            )}
          </div>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div
            className="alert-success"
            role="status"
            style={{ marginBottom: "16px" }}
          >
            {successMsg}
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <div
            className="alert-error"
            role="alert"
            style={{ marginBottom: "16px" }}
          >
            {error}
          </div>
        )}

        {/* ====================================================
            FILTER TOGGLE
            ==================================================== */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            className={!unreadOnly ? "btn-primary" : "btn-secondary"}
            onClick={() => setUnreadOnly(false)}
          >
            All
          </button>

          <button
            type="button"
            className={unreadOnly ? "btn-primary" : "btn-secondary"}
            onClick={() => setUnreadOnly(true)}
          >
            Unread
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "6px",
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "0 7px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* ====================================================
            EMPTY
            ==================================================== */}
        {notifications.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
            <h2>No notifications</h2>
            <p>
              {unreadOnly
                ? "You have no unread notifications."
                : "You have no notifications yet."}
            </p>
            {unreadOnly && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setUnreadOnly(false)}
              >
                Show all notifications
              </button>
            )}
          </div>
        )}

        {/* ====================================================
            NOTIFICATION LIST
            ==================================================== */}
        {notifications.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {notifications.map((notification) => {
              const nId = notification?._id || notification?.id;
              const isRead = notification?.isRead === true;
              const title =
                notification?.title || notification?.type || "Notification";
              const message =
                notification?.message || notification?.body || "";
              const createdAt = notification?.createdAt;

              return (
                <article
                  key={nId}
                  style={{
                    background: isRead
                      ? "var(--card-bg, #fff)"
                      : "var(--primary-light, #eff6ff)",
                    border: isRead
                      ? "1px solid var(--border, #e5e7eb)"
                      : "1px solid var(--primary, #2563eb)",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      fontSize: "24px",
                      flexShrink: 0,
                      lineHeight: 1,
                      marginTop: "2px",
                    }}
                  >
                    {isRead ? "🔔" : "🔴"}
                  </div>

                  {/* CONTENT */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "4px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: isRead ? 500 : 700,
                        }}
                      >
                        {title}
                      </h3>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(createdAt)}{" "}
                        {formatTime(createdAt)}
                      </span>
                    </div>

                    {message && (
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: 1.5,
                        }}
                      >
                        {message}
                      </p>
                    )}

                    {!isRead && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ fontSize: "13px", padding: "4px 12px" }}
                        onClick={() => handleMarkRead(nId)}
                        disabled={markingId === nId}
                      >
                        {markingId === nId ? "Marking..." : "Mark as Read"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ====================================================
            PAGINATION
            ==================================================== */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              disabled={page <= 1 || loading}
              onClick={() => loadNotifications(page - 1)}
            >
              ← Previous
            </button>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              className="btn-secondary"
              disabled={page >= totalPages || loading}
              onClick={() => loadNotifications(page + 1)}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default NotificationsPage;
