// ============================================================
// SHANTI ENTERPRISES
// Admin Quotations Page
// Admin - Wholesale Quotation Management
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminQuotations } from "../../api/quotationApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import "./AdminQuotationsPage.css";

const STATUS_OPTIONS = ["pending", "sent", "accepted", "rejected", "expired"];

const STATUS_CONFIG = {
  pending: { label: "Pending", tone: "warning" },
  sent: { label: "Sent", tone: "info" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  expired: { label: "Expired", tone: "muted" },
};

const getQuotationId = (quotation) => quotation?._id || quotation?.id || "";
const getQuotationNumber = (quotation) => quotation?.quotationNumber || "Quotation";
const getRFQNumber = (quotation) => quotation?.rfq?.rfqNumber || quotation?.rfqNumber || "—";

const getCustomer = (quotation) =>
  quotation?.user || quotation?.customer || quotation?.createdBy || null;

const getCustomerName = (quotation) => {
  const customer = getCustomer(quotation);
  if (typeof customer === "string") return customer;
  return customer?.name || customer?.fullName || customer?.username || customer?.email || "Customer";
};

const getCustomerEmail = (quotation) => {
  const customer = getCustomer(quotation);
  if (customer && typeof customer === "object") return customer.email || "";
  return quotation?.customerEmail || quotation?.email || "";
};

const getStatus = (quotation) => quotation?.status || "pending";

const getItems = (quotation) => (Array.isArray(quotation?.items) ? quotation.items : []);

const getItemCount = (quotation) => getItems(quotation).length;

const getTotalQuantity = (quotation) =>
  getItems(quotation).reduce((total, item) => total + Number(item?.quantity || 0), 0);

const getTotalAmount = (quotation) => {
  if (quotation?.totalAmount !== undefined && quotation?.totalAmount !== null) {
    return Number(quotation.totalAmount || 0);
  }
  if (quotation?.subtotal !== undefined && quotation?.subtotal !== null) {
    return Number(quotation.subtotal || 0);
  }
  return getItems(quotation).reduce((total, item) => {
    const quantity = Number(item?.quantity || 0);
    const unitPrice = Number(item?.unitPrice || 0);
    const itemTotal = item?.totalPrice !== undefined ? Number(item.totalPrice || 0) : quantity * unitPrice;
    return total + itemTotal;
  }, 0);
};

const getFirstProductName = (quotation) => {
  const item = getItems(quotation)[0];
  return item?.product?.name || item?.product?.title || item?.productName || "No products";
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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

const getStatusLabel = (status) => STATUS_CONFIG[status]?.label || status || "Unknown";

function AdminQuotationsPage() {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalQuotations: 0,
    totalPages: 1,
  });

  const loadQuotations = useCallback(async (requestedPage = page, showRefresh = false) => {
    try {
      setError("");
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await getAdminQuotations({
        page: requestedPage,
        limit: 20,
        search: search.trim(),
        status,
      });

      const responseData = response?.data || response;
      const quotationData = Array.isArray(responseData?.quotations)
        ? responseData.quotations
        : Array.isArray(responseData?.data?.quotations)
          ? responseData.data.quotations
          : Array.isArray(responseData)
            ? responseData
            : [];

      setQuotations(quotationData);

      const serverPagination = responseData?.pagination || responseData?.data?.pagination || {};
      const nextPagination = {
        page: Number(serverPagination.page || requestedPage || 1),
        limit: Number(serverPagination.limit || 20),
        totalQuotations: Number(serverPagination.totalQuotations ?? quotationData.length),
        totalPages: Math.max(Number(serverPagination.totalPages || 1), 1),
      };

      setPagination(nextPagination);
      setPage(nextPagination.page);
    } catch (err) {
      console.error("Admin quotations fetch error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load quotations."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadQuotations(page);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [loadQuotations]);

  const summary = useMemo(() => {
    const counts = {
      total: pagination.totalQuotations,
      pending: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
    };

    quotations.forEach((quotation) => {
      const currentStatus = getStatus(quotation);
      if (counts[currentStatus] !== undefined) counts[currentStatus] += 1;
    });

    return counts;
  }, [quotations, pagination.totalQuotations]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), pagination.totalPages);
    if (safePage !== page) setPage(safePage);
  };

  if (loading) {
    return (
      <div className="app-page admin-quotations-page">
        <div className="admin-quotations-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="app-page admin-quotations-page">
      <div className="admin-quotations-hero">
        <div>
          <span className="admin-quotations-eyebrow">WHOLESALE • ADMIN</span>
          <h1>Quotations</h1>
          <p>Manage wholesale quotations, pricing proposals and customer responses.</p>
        </div>
        <div className="admin-quotations-hero-actions">
          <button
            type="button"
            className="admin-quotations-button admin-quotations-button--secondary"
            onClick={() => loadQuotations(page, true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "↻ Refresh"}
          </button>
          <Link
            to="/admin/quotations/create"
            className="admin-quotations-button admin-quotations-button--primary"
          >
            + Create Quotation
          </Link>
        </div>
      </div>

      <div className="admin-quotations-stats">
        <div className="admin-quotation-stat admin-quotation-stat--total">
          <span className="admin-quotation-stat-icon">◈</span>
          <div><strong>{summary.total}</strong><span>Total Quotations</span></div>
        </div>
        <div className="admin-quotation-stat admin-quotation-stat--pending">
          <span className="admin-quotation-stat-icon">◷</span>
          <div><strong>{summary.pending}</strong><span>Pending</span></div>
        </div>
        <div className="admin-quotation-stat admin-quotation-stat--sent">
          <span className="admin-quotation-stat-icon">↗</span>
          <div><strong>{summary.sent}</strong><span>Sent</span></div>
        </div>
        <div className="admin-quotation-stat admin-quotation-stat--accepted">
          <span className="admin-quotation-stat-icon">✓</span>
          <div><strong>{summary.accepted}</strong><span>Accepted</span></div>
        </div>
        <div className="admin-quotation-stat admin-quotation-stat--rejected">
          <span className="admin-quotation-stat-icon">×</span>
          <div><strong>{summary.rejected}</strong><span>Rejected</span></div>
        </div>
      </div>

      <section className="admin-quotations-panel admin-quotations-filters">
        <div className="admin-quotations-filter-search">
          <label htmlFor="quotation-search">Search quotations</label>
          <div className="admin-quotations-search-box">
            <span>⌕</span>
            <input
              id="quotation-search"
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by quotation number…"
            />
          </div>
        </div>

        <div className="admin-quotations-filter-field">
          <label htmlFor="quotation-status">Status</label>
          <select id="quotation-status" value={status} onChange={(event) => handleStatusChange(event.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{getStatusLabel(option)}</option>
            ))}
          </select>
        </div>

        <button type="button" className="admin-quotations-clear" onClick={clearFilters}>
          Clear filters
        </button>
      </section>

      {error && (
        <section className="admin-quotations-error">
          <ErrorMessage message={error} />
          <button type="button" onClick={() => loadQuotations(page)}>Try Again</button>
        </section>
      )}

      {quotations.length === 0 ? (
        <section className="admin-quotations-panel admin-quotations-empty">
          <EmptyState
            title="No quotations found"
            message={search || status ? "Try changing your filters or search term." : "Create your first wholesale quotation to get started."}
          />
          <Link to="/admin/quotations/create" className="admin-quotations-button admin-quotations-button--primary">
            Create Quotation
          </Link>
        </section>
      ) : (
        <section className="admin-quotations-panel admin-quotations-table-panel">
          <div className="admin-quotations-table-wrap">
            <table className="admin-quotations-table">
              <thead>
                <tr>
                  <th>Quotation</th>
                  <th>Customer</th>
                  <th>RFQ</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quotation) => {
                  const quotationId = getQuotationId(quotation);
                  const currentStatus = getStatus(quotation);
                  const statusConfig = STATUS_CONFIG[currentStatus] || { label: currentStatus, tone: "muted" };

                  return (
                    <tr key={quotationId || getQuotationNumber(quotation)}>
                      <td>
                        <Link className="admin-quotation-number" to={`/admin/quotations/${quotationId}`}>
                          {getQuotationNumber(quotation)}
                        </Link>
                        <span className="admin-quotation-product">{getFirstProductName(quotation)}</span>
                      </td>
                      <td>
                        <strong className="admin-quotation-customer">{getCustomerName(quotation)}</strong>
                        {getCustomerEmail(quotation) && <span className="admin-quotation-email">{getCustomerEmail(quotation)}</span>}
                      </td>
                      <td>
                        {quotation?.rfq?._id ? (
                          <Link to={`/admin/rfqs/${quotation.rfq._id}`} className="admin-quotation-rfq">{getRFQNumber(quotation)}</Link>
                        ) : <span>{getRFQNumber(quotation)}</span>}
                      </td>
                      <td>
                        <strong>{getItemCount(quotation)}</strong>
                        <span className="admin-quotation-subtext">{getTotalQuantity(quotation)} qty</span>
                      </td>
                      <td><strong className="admin-quotation-amount">{formatCurrency(getTotalAmount(quotation))}</strong></td>
                      <td>{formatDate(quotation?.createdAt)}</td>
                      <td><span className={`admin-quotation-status admin-quotation-status--${statusConfig.tone}`}>{statusConfig.label}</span></td>
                      <td>
                        <button
                          type="button"
                          className="admin-quotation-view"
                          onClick={() => navigate(`/admin/quotations/${quotationId}`)}
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-quotations-pagination">
            <span>
              Showing {quotations.length} of {pagination.totalQuotations} quotations
            </span>
            <div>
              <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>← Previous</button>
              <span className="admin-quotations-page-number">Page {page} of {pagination.totalPages}</span>
              <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= pagination.totalPages}>Next →</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminQuotationsPage;
