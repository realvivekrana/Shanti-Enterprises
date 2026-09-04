// ============================================================
// SHANTI ENTERPRISES
// Admin Shipments Page
// Frontend - Admin Shipment Management
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

const STATUS_STYLE = {
  pending:           { bg: "#f9fafb", color: "#6b7280",  border: "#e5e7eb" },
  processing:        { bg: "#eff6ff", color: "#1d4ed8",  border: "#bfdbfe" },
  packed:            { bg: "#fefce8", color: "#a16207",  border: "#fef08a" },
  shipped:           { bg: "#f0f9ff", color: "#0369a1",  border: "#bae6fd" },
  in_transit:        { bg: "#f0f9ff", color: "#0369a1",  border: "#bae6fd" },
  out_for_delivery:  { bg: "#fef3c7", color: "#b45309",  border: "#fde68a" },
  delivered:         { bg: "#f0fdf4", color: "#15803d",  border: "#bbf7d0" },
  failed:            { bg: "#fef2f2", color: "#dc2626",  border: "#fecaca" },
  cancelled:         { bg: "#f9fafb", color: "#6b7280",  border: "#e5e7eb" },
  returned:          { bg: "#fdf4ff", color: "#7e22ce",  border: "#e9d5ff" },
};

const getStatusStyle = (s) =>
  STATUS_STYLE[s] || { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" };

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
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading shipment..." />
        </div>
      </section>
    );
  }

  if (error || !shipment) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Link
            to="/admin/shipments"
            className="btn-secondary"
            style={{ marginBottom: "16px", display: "inline-block" }}
          >
            ← Back to Shipments
          </Link>
          <ErrorMessage message={error || "Shipment not found."} />
        </div>
      </section>
    );
  }

  const statusStyle = getStatusStyle(shipment?.status);

  return (
    <section className="app-page">
      <div className="page-container">

        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN · SHIPMENTS</span>
            <h1>{shipment?.shipmentNumber || `SHP-${shipmentId}`}</h1>
            <p>
              Order: #{shipment?.order?.orderNumber || "—"} ·{" "}
              Customer: {shipment?.user?.name || "—"}
            </p>
          </div>
          <Link to="/admin/shipments" className="btn-secondary">
            ← All Shipments
          </Link>
        </div>

        {successMsg && (
          <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
            {successMsg}
          </div>
        )}
        {saveError && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
            {saveError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flexWrap: "wrap" }}>

          {/* STATUS CARD */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>Update Status</h2>

            <div
              style={{
                display: "inline-block",
                background: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}`,
                borderRadius: "999px",
                padding: "4px 14px",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Current: {fmtLabel(shipment?.status)}
            </div>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{fmtLabel(s)}</option>
              ))}
            </select>

            <button
              type="button"
              className="btn-primary"
              onClick={handleUpdateStatus}
              disabled={saving || newStatus === shipment?.status}
            >
              {saving ? "Saving..." : "Update Status"}
            </button>
          </div>

          {/* TRACKING CARD */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>Tracking Information</h2>

            {["trackingNumber", "carrier", "trackingUrl"].map((field) => (
              <div key={field} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                  {field === "trackingNumber" ? "Tracking Number" : field === "carrier" ? "Carrier" : "Tracking URL"}
                </label>
                <input
                  type={field === "trackingUrl" ? "url" : "text"}
                  value={trackingData[field]}
                  onChange={(e) => setTrackingData((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={field === "trackingUrl" ? "https://..." : ""}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className="btn-primary"
              onClick={handleUpdateTracking}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Tracking"}
            </button>
          </div>
        </div>

        {/* DETAILS */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "24px",
          }}
        >
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>Shipment Details</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
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
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{value || "—"}</p>
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
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading shipments..." />
        </div>
      </section>
    );
  }

  if (error && shipments.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage message={error} onRetry={() => loadShipments(1)} />
        </div>
      </section>
    );
  }

  return (
    <section className="app-page">
      <div className="page-container">

        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>
            <h1>Shipments</h1>
            <p>{total} total shipments</p>
          </div>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>{error}</div>
        )}

        {/* TOOLBAR */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <input
            type="search"
            placeholder="Search by tracking or shipment number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "220px",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <option value="">All Statuses</option>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{fmtLabel(s)}</option>
            ))}
          </select>
        </div>

        {/* EMPTY */}
        {shipments.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚚</div>
            <h2>No shipments found</h2>
            <p>Try a different search or filter.</p>
          </div>
        )}

        {/* TABLE */}
        {shipments.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Shipment No.", "Order", "Customer", "Tracking No.", "Status", "Shipped On", ""].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#6b7280",
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid #e5e7eb",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => {
                  const sId = s?._id || s?.id;
                  const style = getStatusStyle(s?.status);
                  return (
                    <tr key={sId} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                        {s?.shipmentNumber || `SHP-${sId}`}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        #{s?.order?.orderNumber || "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {s?.user?.name || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "13px" }}>
                        {s?.trackingNumber || "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            borderRadius: "999px",
                            padding: "3px 10px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {fmtLabel(s?.status)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                        {formatDate(s?.shippedAt)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ fontSize: "12px", padding: "4px 12px" }}
                          onClick={() => navigate(`/admin/shipments/${sId}`)}
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
            <button type="button" className="btn-secondary" disabled={page <= 1 || loading} onClick={() => loadShipments(page - 1)}>
              ← Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>
            <button type="button" className="btn-secondary" disabled={page >= totalPages || loading} onClick={() => loadShipments(page + 1)}>
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
