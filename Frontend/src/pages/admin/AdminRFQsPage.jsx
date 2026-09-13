// ============================================================
// SHANTI ENTERPRISES
// Admin RFQs Page
// Admin - Wholesale RFQ Management
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
  getAdminRFQs,
} from "../../api/rfqApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import PipelineStageNav from "./PipelineStageNav";

import "./AdminRFQsPage.css";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
  },

  reviewing: {
    label: "Under Review",
  },

  quoted: {
    label: "Quoted",
  },

  accepted: {
    label: "Accepted",
  },

  rejected: {
    label: "Rejected",
  },

  cancelled: {
    label: "Cancelled",
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatusLabel = (status) => {
  return STATUS_CONFIG[status]?.label || status || "Unknown";
};

const getStatusClass = (status) => {
  return `rfq-status rfq-status--${status || "pending"}`;
};

const getRFQId = (rfq) => {
  return rfq?._id || rfq?.id || "";
};

const getRFQNumber = (rfq) => {
  return rfq?.rfqNumber || "RFQ";
};

const getCustomerName = (rfq) => {
  const customer = rfq?.customer || rfq?.user || rfq?.createdBy;

  if (typeof customer === "string") {
    return customer;
  }

  return (
    customer?.name ||
    customer?.fullName ||
    customer?.username ||
    customer?.email ||
    "Customer"
  );
};

const getCustomerEmail = (rfq) => {
  const customer = rfq?.customer || rfq?.user || rfq?.createdBy;

  if (typeof customer === "object" && customer) {
    return customer.email || "";
  }

  return rfq?.customerEmail || rfq?.email || "";
};

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

const getItemCount = (rfq) => {
  if (!Array.isArray(rfq?.items)) {
    return 0;
  }

  return rfq.items.length;
};

const getTotalQuantity = (rfq) => {
  if (!Array.isArray(rfq?.items)) {
    return 0;
  }

  return rfq.items.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );
};

const getFirstProductName = (rfq) => {
  const firstItem = rfq?.items?.[0];

  return (
    firstItem?.product?.name ||
    firstItem?.product?.title ||
    firstItem?.productName ||
    "Product"
  );
};

// ============================================================
// ADMIN RFQS PAGE
// ============================================================

function AdminRFQsPage() {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRFQs: 0,
    totalPages: 0,
  });

  // ==========================================================
  // LOAD RFQS
  // ==========================================================

  const loadRFQs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminRFQs({
        page,
        limit: 10,
        ...(status ? { status } : {}),
      });

      const receivedRFQs = Array.isArray(response?.rfqs)
        ? response.rfqs
        : Array.isArray(response?.data?.rfqs)
        ? response.data.rfqs
        : [];

      setRFQs(receivedRFQs);

      const receivedPagination =
        response?.pagination || response?.data?.pagination;

      if (receivedPagination) {
        setPagination({
          page: Number(receivedPagination.page) || page,
          limit: Number(receivedPagination.limit) || 10,
          totalRFQs: Number(receivedPagination.totalRFQs) || 0,
          totalPages: Number(receivedPagination.totalPages) || 0,
        });
      } else {
        setPagination({
          page,
          limit: 10,
          totalRFQs: receivedRFQs.length,
          totalPages: receivedRFQs.length ? 1 : 0,
        });
      }
    } catch (err) {
      console.error("Admin RFQs error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load RFQs."
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    loadRFQs();
  }, [loadRFQs]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRFQs = normalizedSearch
    ? rfqs.filter((rfq) => {
        const rfqNumber = getRFQNumber(rfq).toLowerCase();
        const customerName = getCustomerName(rfq).toLowerCase();
        const customerEmail = getCustomerEmail(rfq).toLowerCase();
        const productName = getFirstProductName(rfq).toLowerCase();

        return (
          rfqNumber.includes(normalizedSearch) ||
          customerName.includes(normalizedSearch) ||
          customerEmail.includes(normalizedSearch) ||
          productName.includes(normalizedSearch)
        );
      })
    : rfqs;

  // ==========================================================
  // SEARCH CHANGE
  // ==========================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  // ==========================================================
  // OPEN RFQ
  // ==========================================================

  const handleOpenRFQ = (rfq) => {
    const rfqId = getRFQId(rfq);

    if (!rfqId) {
      return;
    }

    navigate(`/admin/rfqs/${rfqId}`);
  };

  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  // ==========================================================
  // NEXT
  // ==========================================================

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, pagination.totalPages || currentPage)
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="app-page admin-rfqs-page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>
            <h1>RFQ Management</h1>
            <p>Manage customer wholesale quotation requests.</p>
          </div>
        </div>

        <Loading message="Loading RFQs..." />
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-rfqs-page">
      <PipelineStageNav active="rfqs" />

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="page-header">
        <div>
          <span className="page-eyebrow">ADMIN</span>
          <h1>RFQ Management</h1>
          <p>Manage customer wholesale requests for quotation.</p>
        </div>

        <Link to="/admin">← Dashboard</Link>
      </div>

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div className="rfq-summary-grid">
        <div className="rfq-summary-card">
          <span>Total RFQs</span>
          <strong>{pagination.totalRFQs}</strong>
        </div>

        <div className="rfq-summary-card">
          <span>Showing</span>
          <strong>{filteredRFQs.length}</strong>
        </div>

        <div className="rfq-summary-card">
          <span>Current Page</span>
          <strong>{pagination.page || page}</strong>
        </div>
      </div>

      {/* ======================================================
          FILTER BAR
          ====================================================== */}

      <section className="rfq-filter-bar">
        {/* SEARCH */}
        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by RFQ number, customer, email or product..."
        />

        {/* STATUS */}
        <select value={status} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Under Review</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* CLEAR */}
        <button
          type="button"
          className="rfq-clear-btn"
          onClick={handleClearFilters}
          disabled={!search && !status}
        >
          Clear
        </button>
      </section>

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div className="rfq-error">
          <ErrorMessage message={error} onRetry={loadRFQs} />
        </div>
      )}

      {/* ======================================================
          EMPTY
          ====================================================== */}

      {!error && filteredRFQs.length === 0 && (
        <section className="rfq-empty">
          <div className="rfq-empty-icon">📋</div>
          <h2>No RFQs found</h2>
          <p>
            {search || status
              ? "Try changing your search or filter."
              : "There are no customer RFQs yet."}
          </p>
        </section>
      )}

      {/* ======================================================
          RFQ TABLE
          ====================================================== */}

      {filteredRFQs.length > 0 && (
        <section className="rfq-table-wrap">
          <div className="rfq-table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>RFQ</th>
                  <th style={{ textAlign: "left" }}>Customer</th>
                  <th style={{ textAlign: "left" }}>Product</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "left" }}>Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRFQs.map((rfq) => {
                  const rfqId = getRFQId(rfq);

                  return (
                    <tr key={rfqId || getRFQNumber(rfq)}>
                      {/* RFQ */}
                      <td>
                        <strong>{getRFQNumber(rfq)}</strong>
                      </td>

                      {/* CUSTOMER */}
                      <td>
                        <strong style={{ display: "block" }}>
                          {getCustomerName(rfq)}
                        </strong>

                        {getCustomerEmail(rfq) && (
                          <span className="rfq-customer-email">
                            {getCustomerEmail(rfq)}
                          </span>
                        )}
                      </td>

                      {/* PRODUCT */}
                      <td>
                        <strong style={{ display: "block" }}>
                          {getFirstProductName(rfq)}
                        </strong>

                        {getItemCount(rfq) > 1 && (
                          <span className="rfq-product-more">
                            + {getItemCount(rfq) - 1} more product
                            {getItemCount(rfq) - 1 !== 1 ? "s" : ""}
                          </span>
                        )}
                      </td>

                      {/* QUANTITY */}
                      <td style={{ textAlign: "center" }}>
                        <strong>{getTotalQuantity(rfq)}</strong>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className={getStatusClass(rfq.status)}>
                          {getStatusLabel(rfq.status)}
                        </span>
                      </td>

                      {/* DATE */}
                      <td>{formatDate(rfq.createdAt)}</td>

                      {/* ACTION */}
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="rfq-view-btn"
                          onClick={() => handleOpenRFQ(rfq)}
                          disabled={!rfqId}
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

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      {pagination.totalPages > 1 && (
        <div className="rfq-pagination">
          <button
            type="button"
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
            disabled={page >= pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminRFQsPage;