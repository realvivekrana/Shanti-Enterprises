import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyRFQs } from "../../api/rfqApi";
import "./RFQsPage.css";

const STATUS_CONFIG = {
  pending: { label: "Pending", className: "pending" },
  reviewing: { label: "Under Review", className: "reviewing" },
  quoted: { label: "Quoted", className: "quoted" },
  accepted: { label: "Accepted", className: "accepted" },
  rejected: { label: "Rejected", className: "rejected" },
  cancelled: { label: "Cancelled", className: "cancelled" },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] || { label: status || "Unknown", className: "unknown" };
const getRFQId = (rfq) => rfq?._id || rfq?.id || "";
const getRFQNumber = (rfq) => rfq?.rfqNumber || "RFQ";
const getProductName = (item) => item?.product?.name || item?.productName || "Product";
const getProductImage = (item) => {
  const product = item?.product;
  if (!product) return "";
  if (Array.isArray(product.images) && product.images.length) {
    const firstImage = product.images[0];
    if (typeof firstImage === "string") return firstImage;
    return firstImage?.url || firstImage?.secure_url || "";
  }
  if (typeof product.image === "string") return product.image;
  return product.image?.url || product.image?.secure_url || "";
};
const formatDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";
  return parsedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const getTotalQuantity = (items = []) => items.reduce((total, item) => total + Number(item?.quantity || 0), 0);

function RFQsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalRFQs: 0, totalPages: 0 });
  const [successMessage, setSuccessMessage] = useState("");

  const loadRFQs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyRFQs({ page, limit: 10, ...(status ? { status } : {}) });
      const receivedRFQs = Array.isArray(response?.rfqs)
        ? response.rfqs
        : Array.isArray(response?.data?.rfqs) ? response.data.rfqs : [];
      setRFQs(receivedRFQs);
      const receivedPagination = response?.pagination || response?.data?.pagination;
      if (receivedPagination) {
        setPagination({
          page: Number(receivedPagination.page) || page,
          limit: Number(receivedPagination.limit) || 10,
          totalRFQs: Number(receivedPagination.totalRFQs) || 0,
          totalPages: Number(receivedPagination.totalPages) || 0,
        });
      } else {
        setPagination({ page, limit: 10, totalRFQs: receivedRFQs.length, totalPages: receivedRFQs.length ? 1 : 0 });
      }
    } catch (err) {
      console.error("Get RFQs error:", err);
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Unable to load your RFQs.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { loadRFQs(); }, [loadRFQs]);

  useEffect(() => {
    const message = location.state?.successMessage;
    if (!message) return;
    setSuccessMessage(message);
    window.history.replaceState({}, document.title);
    const timer = window.setTimeout(() => setSuccessMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [location.state]);

  const handleStatusChange = (event) => { setStatus(event.target.value); setPage(1); };
  const handleClearFilter = () => { setStatus(""); setPage(1); };
  const handleOpenRFQ = (rfq) => {
    const rfqId = getRFQId(rfq);
    if (rfqId) navigate(`/rfq/${rfqId}`);
  };
  const handlePreviousPage = () => setPage((currentPage) => Math.max(currentPage - 1, 1));
  const handleNextPage = () => setPage((currentPage) => Math.min(currentPage + 1, pagination.totalPages || currentPage));

  if (loading) {
    return (
      <div className="app-page rfqs-page">
        <div className="rfqs-header page-header">
          <div><span className="page-eyebrow">WHOLESALE</span><h1>My RFQs</h1><p>Manage your wholesale requests for quotation.</p></div>
        </div>
        <div className="rfqs-loading"><div className="rfq-spinner" /><p>Loading your RFQs...</p></div>
      </div>
    );
  }

  return (
    <div className="app-page rfqs-page">
      <div className="rfqs-header page-header">
        <div className="rfqs-title-block">
          <span className="page-eyebrow">WHOLESALE</span>
          <h1>My RFQs</h1>
          <p>Track and manage your wholesale requests for quotation.</p>
        </div>
        <div className="rfqs-header-actions">
          <Link to="/products" className="rfqs-primary-button">Browse Products <span>↗</span></Link>
        </div>
      </div>

      {successMessage && <div className="rfqs-alert rfqs-success" role="status"><span className="alert-icon">✓</span><span>{successMessage}</span></div>}

      <div className="rfqs-filter-card">
        <div className="rfqs-filter-summary">
          <div className="rfqs-filter-icon">⌁</div>
          <div><strong>RFQ Requests</strong><p>{pagination.totalRFQs} total request{pagination.totalRFQs !== 1 ? "s" : ""}</p></div>
        </div>
        <div className="rfqs-filter-controls">
          <label htmlFor="rfq-status-filter">Status</label>
          <select id="rfq-status-filter" value={status} onChange={handleStatusChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Under Review</option>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {status && <button type="button" className="rfqs-clear-button" onClick={handleClearFilter}>Clear</button>}
        </div>
      </div>

      {error && (
        <div className="rfqs-alert rfqs-error" role="alert">
          <div><span className="alert-icon">!</span><span>{error}</span></div>
          <button type="button" onClick={loadRFQs}>Try Again</button>
        </div>
      )}

      {!error && rfqs.length === 0 && (
        <div className="rfqs-empty-card">
          <div className="rfqs-empty-icon">⌁</div>
          <span className="rfqs-empty-kicker">NO REQUESTS YET</span>
          <h2>{status ? "No RFQs found" : "You haven't submitted any RFQs yet"}</h2>
          <p>{status ? `There are no RFQs with the "${getStatusConfig(status).label}" status.` : "Request a wholesale quote for products you're interested in and your requests will appear here."}</p>
          <Link to="/products" className="rfqs-primary-button">Browse Products <span>↗</span></Link>
        </div>
      )}

      {rfqs.length > 0 && (
        <div className="rfqs-list">
          {rfqs.map((rfq) => {
            const rfqId = getRFQId(rfq);
            const rfqNumber = getRFQNumber(rfq);
            const statusConfig = getStatusConfig(rfq.status);
            const items = Array.isArray(rfq.items) ? rfq.items : [];
            const totalQuantity = getTotalQuantity(items);
            const firstItem = items[0];
            const remainingItems = Math.max(items.length - 1, 0);
            return (
              <article className="rfq-card" key={rfqId || rfqNumber}>
                <div className="rfq-card-top">
                  <div><span className="rfq-label">RFQ NUMBER</span><h2>{rfqNumber}</h2></div>
                  <span className={`rfq-status rfq-status-${statusConfig.className}`}><i />{statusConfig.label}</span>
                </div>
                <div className="rfq-meta-grid">
                  <div className="rfq-meta-box"><span>Submitted</span><strong>{formatDate(rfq.createdAt)}</strong></div>
                  <div className="rfq-meta-box"><span>Products</span><strong>{items.length}</strong></div>
                  <div className="rfq-meta-box"><span>Total Quantity</span><strong>{totalQuantity}</strong></div>
                </div>
                {firstItem && (
                  <div className="rfq-product-row">
                    <div className="rfq-product-image">
                      {getProductImage(firstItem) ? <img src={getProductImage(firstItem)} alt={getProductName(firstItem)} /> : <span>NO IMAGE</span>}
                    </div>
                    <div className="rfq-product-info">
                      <strong>{getProductName(firstItem)}</strong>
                      <span>Quantity: {firstItem.quantity}{firstItem.unit ? ` ${firstItem.unit}` : ""}</span>
                    </div>
                    {remainingItems > 0 && <span className="rfq-more-items">+{remainingItems} more</span>}
                  </div>
                )}
                {rfq.message && <div className="rfq-requirement"><span>Requirement</span><p>{rfq.message}</p></div>}
                <div className="rfq-card-footer">
                  <button type="button" className="rfq-view-button" onClick={() => handleOpenRFQ(rfq)} disabled={!rfqId}>View RFQ Details <span>→</span></button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {rfqs.length > 0 && pagination.totalPages > 1 && (
        <div className="rfqs-pagination">
          <button type="button" onClick={handlePreviousPage} disabled={page <= 1}>← Previous</button>
          <span>Page <strong>{pagination.page || page}</strong> of <strong>{pagination.totalPages}</strong></span>
          <button type="button" onClick={handleNextPage} disabled={page >= pagination.totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}

export default RFQsPage;
