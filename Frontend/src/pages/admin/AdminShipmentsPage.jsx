// ============================================================
// SHANTI ENTERPRISES
// Admin Shipments Page
// Premium UI/UX — Shipment & Tracking Management
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getAdminShipments,
  getAdminShipmentById,
  updateAdminShipmentStatus,
  updateAdminTracking,
} from "../../api/shipmentApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import PipelineStageNav from "./PipelineStageNav";

import "./AdminShipmentsPage.css";

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

const SHIPMENT_STATUSES = [
  "pending",
  "processing",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
  "cancelled",
  "returned",
];

const statusClass = (status) =>
  String(status || "pending")
    .toLowerCase()
    .replace(/[^a-z]+/g, "_");

const fmtLabel = (s) =>
  String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ============================================================
// SHIPMENT DETAIL VIEW
// ============================================================

function ShipmentDetailView({ shipmentId }) {
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [trackingData, setTrackingData] = useState({
    trackingNumber: "",
    carrier: "",
    trackingUrl: "",
  });
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminShipmentById(shipmentId);
        const s = response?.shipment;
        setShipment(s);
        setNewStatus(s?.status || "");
        setTrackingData({
          trackingNumber: s?.trackingNumber || "",
          carrier: s?.carrier || "",
          trackingUrl: s?.trackingUrl || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load shipment.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shipmentId]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      setSaving(true);
      setSaveError("");
      await updateAdminShipmentStatus(shipmentId, newStatus);
      setShipment((prev) => ({ ...prev, status: newStatus }));
      setSuccessMsg("Shipment status updated.");
    } catch (err) {
      setSaveError(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTracking = async () => {
    try {
      setSaving(true);
      setSaveError("");
      await updateAdminTracking(shipmentId, trackingData);
      setShipment((prev) => ({ ...prev, ...trackingData }));
      setSuccessMsg("Tracking information updated.");
    } catch (err) {
      setSaveError(err.message || "Failed to update tracking.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-shipment-detail-page">
        <div className="admin-shipment-detail-container">
          <Loading message="Loading shipment..." />
        </div>
      </section>
    );
  }

  if (error || !shipment) {
    return (
      <section className="admin-shipment-detail-page">
        <div className="admin-shipment-detail-container">
          <Link to="/admin/shipments" className="admin-shipments-back">
            <span aria-hidden="true">←</span>
            All Shipments
          </Link>
          <ErrorMessage message={error || "Shipment not found."} />
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shipment-detail-page">
      <div className="admin-shipment-detail-container">
        <header className="admin-shipments-header">
          <div className="admin-shipments-heading">
            <Link to="/admin/shipments" className="admin-shipments-back">
              <span aria-hidden="true">←</span>
              All Shipments
            </Link>

            <span className="admin-shipments-eyebrow">SHIPMENT DETAILS</span>

            <h1>{shipment?.shipmentNumber || `SHP-${shipmentId}`}</h1>

            <p>
              Order #{shipment?.order?.orderNumber || "—"} · Customer:{" "}
              {shipment?.user?.name || "—"}
            </p>
          </div>
        </header>

        {(successMsg || saveError) && (
          <div className="admin-shipment-detail-alerts">
            {successMsg && (
              <div className="alert alert-success" role="status">
                {successMsg}
              </div>
            )}
            {saveError && (
              <div className="alert alert-danger" role="alert">
                {saveError}
              </div>
            )}
          </div>
        )}

        <div className="admin-shipment-detail-grid">
          {/* STATUS PANEL */}
          <div className="admin-shipment-panel">
            <h2>Update Status</h2>

            <span
              className={`admin-shipment-current-pill admin-shipment-current-pill--${statusClass(
                shipment?.status
              )}`}
            >
              <span />
              Current: {fmtLabel(shipment?.status)}
            </span>

            <div className="form-group">
              <label className="form-label" htmlFor="shipmentStatus">
                New Status
              </label>
              <select
                id="shipmentStatus"
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {SHIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {fmtLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-shipment-panel-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateStatus}
                disabled={saving || newStatus === shipment?.status}
              >
                {saving ? "Saving..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* TRACKING PANEL */}
          <div className="admin-shipment-panel">
            <h2>Tracking Information</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="trackingNumber">
                Tracking Number
              </label>
              <input
                id="trackingNumber"
                type="text"
                className="form-input"
                value={trackingData.trackingNumber}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    trackingNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="carrier">
                Carrier
              </label>
              <input
                id="carrier"
                type="text"
                className="form-input"
                value={trackingData.carrier}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    carrier: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="trackingUrl">
                Tracking URL
              </label>
              <input
                id="trackingUrl"
                type="url"
                className="form-input"
                placeholder="https://..."
                value={trackingData.trackingUrl}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    trackingUrl: e.target.value,
                  }))
                }
              />
            </div>

            <div className="admin-shipment-panel-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateTracking}
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Tracking"}
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="admin-shipment-panel">
          <h2>Shipment Details</h2>

          <div className="admin-shipment-details-list">
            {[
              ["Shipment No.", shipment?.shipmentNumber],
              ["Order No.", `#${shipment?.order?.orderNumber || "—"}`],
              ["Customer", shipment?.user?.name || "—"],
              ["Email", shipment?.user?.email || "—"],
              ["Phone", shipment?.user?.phone || "—"],
              ["Shipped On", formatDate(shipment?.shippedAt)],
              ["Delivered On", formatDate(shipment?.deliveredAt)],
              ["Created", formatDate(shipment?.createdAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SHIPMENTS LIST VIEW
// ============================================================

function ShipmentsListView() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const loadShipments = async (
    requestedPage = 1,
    s = search,
    sf = statusFilter
  ) => {
    try {
      setLoading(true);
      setError("");
      const params = { page: requestedPage, limit: 20 };
      if (s.trim()) params.search = s.trim();
      if (sf) params.status = sf;
      const response = await getAdminShipments(params);
      setShipments(response?.shipments || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setTotal(response?.pagination?.totalShipments || 0);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadShipments(1, search, statusFilter); }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => loadShipments(1, search, statusFilter), 400);
    return () => clearTimeout(t);
  }, [search]);

  if (loading && shipments.length === 0) {
    return <Loading message="Loading shipments..." />;
  }

  if (error && shipments.length === 0) {
    return (
      <section className="admin-shipments-page">
        <div className="admin-shipments-container">
          <ErrorMessage message={error} onRetry={() => loadShipments(1)} />
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shipments-page">
      <div className="admin-shipments-container">
        <PipelineStageNav active="shipments" />

        {/* HEADER */}
        <header className="admin-shipments-header">
          <div className="admin-shipments-heading">
            <Link to="/admin" className="admin-shipments-back">
              <span aria-hidden="true">←</span>
              Admin Dashboard
            </Link>

            <span className="admin-shipments-eyebrow">SHIPMENT TRACKING</span>

            <h1>Shipments</h1>

            <p>
              Track fulfillment, manage carriers and keep customers updated
              on delivery status.
            </p>
          </div>

          <div className="admin-shipments-total-badge">
            <div>
              <strong>{total}</strong>
              <span>Total Shipments</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="admin-orders-error">
            <ErrorMessage message={error} onRetry={() => loadShipments(page)} />
          </div>
        )}

        {/* TOOLBAR */}
        <section className="admin-shipments-toolbar">
          <div className="admin-shipments-search">
            <label htmlFor="shipmentSearch">Search Shipments</label>
            <div className="admin-shipments-search-box">
              <span className="admin-shipments-search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                id="shipmentSearch"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tracking number or shipment number"
              />
            </div>
          </div>

          <div className="admin-shipments-filter">
            <label htmlFor="shipmentStatusFilter">Status</label>
            <select
              id="shipmentStatusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {fmtLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-shipments-result-count">
            <strong>{shipments.length}</strong>
            <span>of {total} shipments</span>
          </div>
        </section>

        {/* EMPTY */}
        {shipments.length === 0 ? (
          <div className="admin-shipments-empty">
            <EmptyState
              title="No shipments found"
              message="No shipments match the current search or filter."
            />
          </div>
        ) : (
          <section className="admin-shipments-list">
            {shipments.map((s, index) => {
              const sId = s?._id || s?.id;
              const status = s?.status || "pending";

              return (
                <article className="admin-shipment-card" key={sId}>
                  <div className="admin-shipment-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="admin-shipment-main">
                    <div className="admin-shipment-top">
                      <div>
                        <span className="admin-shipment-label">
                          SHIPMENT NO.
                        </span>
                        <h2>{s?.shipmentNumber || `SHP-${sId}`}</h2>
                      </div>

                      <span
                        className={`admin-shipment-status admin-shipment-status--${statusClass(
                          status
                        )}`}
                      >
                        <span />
                        {fmtLabel(status)}
                      </span>
                    </div>

                    <div className="admin-shipment-details">
                      <div className="admin-shipment-detail">
                        <span>Order</span>
                        <strong>#{s?.order?.orderNumber || "—"}</strong>
                      </div>

                      <div className="admin-shipment-detail">
                        <span>Customer</span>
                        <strong>{s?.user?.name || "—"}</strong>
                      </div>

                      <div className="admin-shipment-detail">
                        <span>Tracking No.</span>
                        <strong className="mono">
                          {s?.trackingNumber || "—"}
                        </strong>
                      </div>

                      <div className="admin-shipment-detail">
                        <span>Shipped On</span>
                        <strong>{formatDate(s?.shippedAt)}</strong>
                      </div>
                    </div>

                    <div className="admin-shipment-actions">
                      <button
                        type="button"
                        className="admin-shipment-view"
                        onClick={() => navigate(`/admin/shipments/${sId}`)}
                      >
                        Manage
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="admin-shipments-pagination">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => loadShipments(page - 1)}
            >
              ← Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => loadShipments(page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================

function AdminShipmentsPage() {
  const { shipmentId } = useParams();
  if (shipmentId) return <ShipmentDetailView shipmentId={shipmentId} />;
  return <ShipmentsListView />;
}

export default AdminShipmentsPage;