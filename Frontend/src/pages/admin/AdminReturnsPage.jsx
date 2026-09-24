// ============================================================
// SHANTI ENTERPRISES
// Admin Returns Page
// Admin - Return / Refund Request Management
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getAdminReturns,
} from "../../api/adminReturnApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// AdminRFQsPage.css ki layout classes (filter bar, table, pagination) reuse hoti hain
import "./AdminRFQsPage.css";
import "./AdminOpsPages.css";

// ============================================================
// CONFIG
// ============================================================

const PAGE_LIMIT = 10;

const RETURN_STATUS_LABELS = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  picked_up: "Picked Up",
  received: "Received",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

// ============================================================
// HELPERS
// ============================================================

const getStatusLabel = (status) =>
  RETURN_STATUS_LABELS[status] || status || "Unknown";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const getTotalQuantity = (returnRequest) =>
  (returnRequest?.items || []).reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );

// ============================================================
// ADMIN RETURNS PAGE
// ============================================================

function AdminReturnsPage() {
  const navigate = useNavigate();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalReturns: 0,
    totalPages: 0,
  });

  // ==========================================================
  // DEBOUNCED SEARCH (server side - return number)
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ==========================================================
  // LOAD RETURNS
  // ==========================================================

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminReturns({
        page,
        limit: PAGE_LIMIT,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      });

      const received = Array.isArray(response?.returns)
        ? response.returns
        : [];

      setReturns(received);

      const receivedPagination = response?.pagination;

      setPagination({
        page: Number(receivedPagination?.page) || page,
        totalReturns:
          Number(receivedPagination?.totalReturns) ||
          received.length,
        totalPages:
          Number(receivedPagination?.totalPages) ||
          (received.length ? 1 : 0),
      });
    } catch (err) {
      console.error("Admin returns error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load return requests."
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleOpen = (returnRequest) => {
    const id = returnRequest?._id || returnRequest?.id;

    if (id) {
      navigate(`/admin/returns/${id}`);
    }
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-rfqs-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">ADMIN</span>
          <h1>Return Requests</h1>
          <p>Review, approve and refund customer return requests.</p>
        </div>

        <Link to="/admin">← Dashboard</Link>
      </div>

      {/* SUMMARY */}

      <div className="rfq-summary-grid">
        <div className="rfq-summary-card">
          <span>Total Returns</span>
          <strong>{pagination.totalReturns}</strong>
        </div>

        <div className="rfq-summary-card">
          <span>Showing</span>
          <strong>{returns.length}</strong>
        </div>

        <div className="rfq-summary-card">
          <span>Current Page</span>
          <strong>{pagination.page || page}</strong>
        </div>
      </div>

      {/* FILTERS */}

      <section className="rfq-filter-bar">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by return number..."
        />

        <select value={status} onChange={handleStatusChange}>
          <option value="">All Statuses</option>

          {Object.entries(RETURN_STATUS_LABELS).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          className="rfq-clear-btn"
          onClick={handleClearFilters}
          disabled={!searchInput && !status}
        >
          Clear
        </button>
      </section>

      {/* ERROR */}

      {error && (
        <div className="rfq-error">
          <ErrorMessage message={error} onRetry={loadReturns} />
        </div>
      )}

      {/* LOADING */}

      {loading && <Loading message="Loading return requests..." />}

      {/* EMPTY */}

      {!loading && !error && returns.length === 0 && (
        <section className="rfq-empty">
          <div className="rfq-empty-icon">↩️</div>
          <h2>No return requests found</h2>
          <p>
            {search || status
              ? "Try changing your search or filter."
              : "There are no customer return requests yet."}
          </p>
        </section>
      )}

      {/* TABLE */}

      {!loading && returns.length > 0 && (
        <section className="rfq-table-wrap">
          <div className="rfq-table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Return</th>
                  <th style={{ textAlign: "left" }}>Customer</th>
                  <th style={{ textAlign: "left" }}>Order</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "right" }}>Refund</th>
                  <th style={{ textAlign: "left" }}>Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {returns.map((returnRequest) => {
                  const id =
                    returnRequest._id || returnRequest.id;

                  return (
                    <tr key={id || returnRequest.returnNumber}>
                      <td>
                        <strong>
                          {returnRequest.returnNumber || "—"}
                        </strong>
                      </td>

                      <td>
                        <strong style={{ display: "block" }}>
                          {returnRequest.user?.name || "Customer"}
                        </strong>

                        {returnRequest.user?.email && (
                          <span className="rfq-customer-email">
                            {returnRequest.user.email}
                          </span>
                        )}
                      </td>

                      <td>
                        {returnRequest.order?.orderNumber || "—"}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <strong>
                          {getTotalQuantity(returnRequest)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`ops-status ops-status--${returnRequest.status}`}
                        >
                          {getStatusLabel(returnRequest.status)}
                        </span>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {returnRequest.status === "refunded"
                          ? formatMoney(returnRequest.refundAmount)
                          : "—"}
                      </td>

                      <td>
                        {formatDate(
                          returnRequest.requestedAt ||
                            returnRequest.createdAt
                        )}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="rfq-view-btn"
                          onClick={() => handleOpen(returnRequest)}
                          disabled={!id}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PAGINATION */}

      {pagination.totalPages > 1 && (
        <div className="rfq-pagination">
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.max(current - 1, 1))
            }
            disabled={page <= 1}
          >
            ← Previous
          </button>

          <span>
            Page <strong>{pagination.page || page}</strong> of{" "}
            <strong>{pagination.totalPages}</strong>
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((current) =>
                Math.min(current + 1, pagination.totalPages)
              )
            }
            disabled={page >= pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminReturnsPage;