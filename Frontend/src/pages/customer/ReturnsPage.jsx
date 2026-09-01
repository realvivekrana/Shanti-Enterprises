// ============================================================
// SHANTI ENTERPRISES
// Customer Returns Page
// Frontend - Returns Management
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyReturns,
  cancelReturnRequest,
} from "../../api/returnApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STATUS_LABELS = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  picked_up: "Picked Up",
  received: "Received",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

const STATUS_COLORS = {
  requested: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  approved:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  rejected:  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  picked_up: { bg: "#fefce8", color: "#a16207", border: "#fef08a" },
  received:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  refunded:  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  cancelled: { bg: "#f9fafb", color: "#6b7280", border: "#e5e7eb" },
};

const getStatusStyle = (status) =>
  STATUS_COLORS[status] || {
    bg: "#f9fafb",
    color: "#374151",
    border: "#e5e7eb",
  };

// ============================================================
// RETURNS PAGE
// ============================================================

function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================================================
  // LOAD RETURNS
  // ==========================================================

  const loadReturns = async (requestedPage = 1, filter = statusFilter) => {
    try {
      setLoading(true);
      setError("");

      const params = { page: requestedPage, limit: 10 };
      if (filter !== "all") params.status = filter;

      const response = await getMyReturns(params);
      setReturns(response?.returns || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load your return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns(1, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // ==========================================================
  // CANCEL RETURN
  // ==========================================================

  const handleCancel = async (returnId) => {
    if (!window.confirm("Are you sure you want to cancel this return request?")) {
      return;
    }

    try {
      setCancellingId(returnId);
      setSuccessMsg("");

      await cancelReturnRequest(returnId);

      setReturns((prev) =>
        prev.map((r) =>
          (r._id || r.id) === returnId
            ? { ...r, status: "cancelled" }
            : r
        )
      );
      setSuccessMsg("Return request cancelled successfully.");
    } catch (err) {
      setError(err.message || "Failed to cancel return request.");
    } finally {
      setCancellingId("");
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && returns.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading your returns..." />
        </div>
      </section>
    );
  }

  if (error && returns.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage message={error} onRetry={() => loadReturns(1)} />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  const statusFilters = [
    { key: "all", label: "All" },
    { key: "requested", label: "Requested" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "refunded", label: "Refunded" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <section className="app-page">
      <div className="page-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>My Returns</h1>
            <p>Track and manage your return requests.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/orders" className="btn-secondary">
              ← My Orders
            </Link>
          </div>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
            {successMsg}
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* STATUS FILTERS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {statusFilters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={statusFilter === key ? "btn-primary" : "btn-secondary"}
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* EMPTY */}
        {returns.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <h2>No return requests</h2>
            <p>
              {statusFilter !== "all"
                ? `No ${STATUS_LABELS[statusFilter] || statusFilter} return requests found.`
                : "You haven't made any return requests yet."}
            </p>
            <Link to="/orders" className="btn-primary">
              View My Orders →
            </Link>
          </div>
        )}

        {/* RETURNS LIST */}
        {returns.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {returns.map((ret) => {
              const retId = ret?._id || ret?.id;
              const status = ret?.status || "requested";
              const style = getStatusStyle(status);
              const orderNumber =
                ret?.order?.orderNumber || ret?.orderId || "—";
              const reason = ret?.reason || "—";
              const itemCount = Array.isArray(ret?.items)
                ? ret.items.length
                : 0;

              return (
                <article
                  key={retId}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  {/* TOP ROW */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#6b7280",
                        }}
                      >
                        RETURN REQUEST
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 700 }}>
                        #{ret?.returnNumber || retId}
                      </h3>
                    </div>

                    <span
                      style={{
                        background: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                        borderRadius: "999px",
                        padding: "4px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>

                  {/* META */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Order
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        #{orderNumber}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Items
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        {itemCount}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Reason
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        {reason}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Requested On
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        {formatDate(ret?.requestedAt || ret?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {ret?.order?._id && (
                      <Link
                        to={`/orders/${ret.order._id}`}
                        className="btn-secondary"
                        style={{ fontSize: "13px" }}
                      >
                        View Order
                      </Link>
                    )}

                    {status === "requested" && (
                      <button
                        type="button"
                        className="btn-danger"
                        style={{ fontSize: "13px" }}
                        onClick={() => handleCancel(retId)}
                        disabled={cancellingId === retId}
                      >
                        {cancellingId === retId ? "Cancelling..." : "Cancel Request"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
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
              onClick={() => loadReturns(page - 1)}
            >
              ← Previous
            </button>

            <span style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              className="btn-secondary"
              disabled={page >= totalPages || loading}
              onClick={() => loadReturns(page + 1)}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default ReturnsPage;
