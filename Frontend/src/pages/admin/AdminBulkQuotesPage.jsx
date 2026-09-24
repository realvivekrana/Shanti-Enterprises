// ============================================================
// SHANTI ENTERPRISES
// Admin Bulk Quotes Page
// Admin - Bulk Quote (RFQ-style) Management
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
  getAdminBulkQuotes,
} from "../../api/adminBulkQuoteApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// AdminRFQsPage.css ki layout classes (filter bar, table, pagination) reuse hoti hain
import "./AdminRFQsPage.css";
import "./AdminOpsPages.css";

// ============================================================
// CONFIG
// ============================================================

const PAGE_LIMIT = 10;

const QUOTE_STATUS_LABELS = {
  pending: "Pending",
  reviewing: "Under Review",
  quoted: "Quoted",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

// ============================================================
// HELPERS
// ============================================================

const getStatusLabel = (status) =>
  QUOTE_STATUS_LABELS[status] || status || "Unknown";

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

const getTotalQuantity = (quote) =>
  (quote?.items || []).reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );

const getFirstProductName = (quote) =>
  quote?.items?.[0]?.productName || "Product";

// ============================================================
// ADMIN BULK QUOTES PAGE
// ============================================================

function AdminBulkQuotesPage() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalBulkQuotes: 0,
    totalPages: 0,
  });

  // ==========================================================
  // DEBOUNCED SEARCH (server side - quote number)
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ==========================================================
  // LOAD BULK QUOTES
  // ==========================================================

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminBulkQuotes({
        page,
        limit: PAGE_LIMIT,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      });

      const received = Array.isArray(response?.bulkQuotes)
        ? response.bulkQuotes
        : [];

      setQuotes(received);

      const receivedPagination = response?.pagination;

      setPagination({
        page: Number(receivedPagination?.page) || page,
        totalBulkQuotes:
          Number(receivedPagination?.totalBulkQuotes) ||
          received.length,
        totalPages:
          Number(receivedPagination?.totalPages) ||
          (received.length ? 1 : 0),
      });
    } catch (err) {
      console.error("Admin bulk quotes error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load bulk quotes."
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

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

  const handleOpen = (quote) => {
    const id = quote?._id || quote?.id;

    if (id) {
      navigate(`/admin/bulk-quotes/${id}`);
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
          <h1>Bulk Quotes</h1>
          <p>Review wholesale bulk quote requests and send pricing to customers.</p>
        </div>

        <Link to="/admin">← Dashboard</Link>
      </div>

      {/* SUMMARY */}

      <div className="rfq-summary-grid">
        <div className="rfq-summary-card">
          <span>Total Quotes</span>
          <strong>{pagination.totalBulkQuotes}</strong>
        </div>

        <div className="rfq-summary-card">
          <span>Showing</span>
          <strong>{quotes.length}</strong>
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
          placeholder="Search by quote number..."
        />

        <select value={status} onChange={handleStatusChange}>
          <option value="">All Statuses</option>

          {Object.entries(QUOTE_STATUS_LABELS).map(
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
          <ErrorMessage message={error} onRetry={loadQuotes} />
        </div>
      )}

      {/* LOADING */}

      {loading && <Loading message="Loading bulk quotes..." />}

      {/* EMPTY */}

      {!loading && !error && quotes.length === 0 && (
        <section className="rfq-empty">
          <div className="rfq-empty-icon">📦</div>
          <h2>No bulk quotes found</h2>
          <p>
            {search || status
              ? "Try changing your search or filter."
              : "There are no customer bulk quote requests yet."}
          </p>
        </section>
      )}

      {/* TABLE */}

      {!loading && quotes.length > 0 && (
        <section className="rfq-table-wrap">
          <div className="rfq-table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Quote</th>
                  <th style={{ textAlign: "left" }}>Customer</th>
                  <th style={{ textAlign: "left" }}>Products</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "right" }}>Quoted Total</th>
                  <th style={{ textAlign: "left" }}>Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((quote) => {
                  const id =
                    quote._id || quote.id;

                  return (
                    <tr key={id || quote.quoteNumber}>
                      <td>
                        <strong>
                          {quote.quoteNumber || "—"}
                        </strong>
                      </td>

                      <td>
                        <strong style={{ display: "block" }}>
                          {quote.user?.name || "Customer"}
                        </strong>

                        {quote.user?.email && (
                          <span className="rfq-customer-email">
                            {quote.user.email}
                          </span>
                        )}
                      </td>

                      <td>
                        <strong style={{ display: "block" }}>
                          {getFirstProductName(quote)}
                        </strong>

                        {(quote.items?.length || 0) > 1 && (
                          <span className="rfq-product-more">
                            + {quote.items.length - 1} more
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <strong>
                          {getTotalQuantity(quote)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`ops-status ops-status--${quote.status}`}
                        >
                          {getStatusLabel(quote.status)}
                        </span>
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {quote.totalAmount !== null &&
                        quote.totalAmount !== undefined
                          ? formatMoney(quote.totalAmount)
                          : "—"}
                      </td>

                      <td>
                        {formatDate(quote.createdAt)}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="rfq-view-btn"
                          onClick={() => handleOpen(quote)}
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

export default AdminBulkQuotesPage;