// ============================================================
// SHANTI ENTERPRISES
// Customer Shipment Tracking Page
// Frontend - Shipment Tracking
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getMyShipments,
  trackShipment,
} from "../../api/customerShipmentApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";
import "./ShipmentTrackingPage.css";

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

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
};

// Shipment status ordered list for progress bar
const STATUS_STEPS = [
  "processing",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS = {
  processing:        "Processing",
  packed:            "Packed",
  shipped:           "Shipped",
  in_transit:        "In Transit",
  out_for_delivery:  "Out for Delivery",
  delivered:         "Delivered",
  pending:           "Pending",
  failed:            "Failed",
  cancelled:         "Cancelled",
  returned:          "Returned",
};

const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

// ============================================================
// SHIPMENT LIST PAGE (no :id param)
// ============================================================

function ShipmentListView() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadShipments = async (requestedPage = 1) => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyShipments({ page: requestedPage, limit: 10 });
      setShipments(response?.shipments || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments(1);
  }, []);

  if (loading && shipments.length === 0) {
    return (
      <section className="app-page shipment-tracking-page">
        <div className="page-container">
          <Loading message="Loading your shipments..." />
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
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>My Shipments</h1>
            <p>Track all your shipments in one place.</p>
          </div>
          <Link to="/orders" className="btn-secondary">
            ← My Orders
          </Link>
        </div>

        {shipments.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚚</div>
            <h2>No shipments yet</h2>
            <p>Shipment details will appear here once your orders are dispatched.</p>
            <Link to="/orders" className="btn-primary">View My Orders →</Link>
          </div>
        )}

        {shipments.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {shipments.map((shipment) => {
              const sId = shipment?._id || shipment?.id;
              const status = shipment?.status || "processing";
              const stepIdx = getStepIndex(status);
              const orderNumber = shipment?.order?.orderNumber || "—";

              return (
                <article
                  key={sId}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#6b7280" }}>
                        SHIPMENT
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: "17px", fontWeight: 700 }}>
                        {shipment?.shipmentNumber || `SHP-${sId}`}
                      </h3>
                      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                        Order #{orderNumber}
                      </p>
                    </div>

                    <span
                      style={{
                        background: status === "delivered" ? "#f0fdf4" : "#eff6ff",
                        color: status === "delivered" ? "#15803d" : "#1d4ed8",
                        border: `1px solid ${status === "delivered" ? "#bbf7d0" : "#bfdbfe"}`,
                        borderRadius: "999px",
                        padding: "4px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  {stepIdx >= 0 && (
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "6px",
                        }}
                      >
                        {STATUS_STEPS.map((step, idx) => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              height: "6px",
                              borderRadius: "3px",
                              background:
                                idx <= stepIdx ? "#2563eb" : "#e5e7eb",
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "10px",
                          color: "#9ca3af",
                        }}
                      >
                        <span>Processing</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* META */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    {shipment?.carrier && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Carrier</p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{shipment.carrier}</p>
                      </div>
                    )}
                    {shipment?.trackingNumber && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Tracking No.</p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{shipment.trackingNumber}</p>
                      </div>
                    )}
                    {shipment?.estimatedDeliveryDate && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Est. Delivery</p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{formatDate(shipment.estimatedDeliveryDate)}</p>
                      </div>
                    )}
                    {shipment?.shippedAt && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Shipped On</p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{formatDate(shipment.shippedAt)}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      to={`/shipments/${sId}`}
                      className="btn-primary"
                      style={{ fontSize: "13px" }}
                    >
                      Track Shipment →
                    </Link>
                    {shipment?.order?._id && (
                      <Link
                        to={`/orders/${shipment.order._id}`}
                        className="btn-secondary"
                        style={{ fontSize: "13px" }}
                      >
                        View Order
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "32px" }}>
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
// SHIPMENT DETAIL / TRACKING PAGE (with :shipmentId param)
// ============================================================

function ShipmentDetailView({ shipmentId }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await trackShipment(shipmentId);
        setTracking(response?.tracking || response);
      } catch (err) {
        setError(err.message || "Unable to load tracking information.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [shipmentId]);

  if (loading) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading tracking information..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Link to="/shipments" className="btn-secondary" style={{ marginBottom: "16px", display: "inline-block" }}>
            ← Back to Shipments
          </Link>
          <ErrorMessage message={error} />
        </div>
      </section>
    );
  }

  const status = tracking?.status || "processing";
  const stepIdx = getStepIndex(status);
  const events = Array.isArray(tracking?.trackingEvents)
    ? tracking.trackingEvents
    : [];

  return (
    <section className="app-page">
      <div className="page-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">SHIPMENT TRACKING</span>
            <h1>{tracking?.shipmentNumber || `SHP-${shipmentId}`}</h1>
            <p>
              {tracking?.carrier
                ? `Carrier: ${tracking.carrier}`
                : "Live tracking information"}
            </p>
          </div>
          <Link to="/shipments" className="btn-secondary">
            ← All Shipments
          </Link>
        </div>

        {/* STATUS CARD */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div
              style={{
                background: status === "delivered" ? "#f0fdf4" : "#eff6ff",
                color: status === "delivered" ? "#15803d" : "#1d4ed8",
                border: `1px solid ${status === "delivered" ? "#bbf7d0" : "#bfdbfe"}`,
                borderRadius: "999px",
                padding: "6px 16px",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {STATUS_LABELS[status] || status}
            </div>

            {tracking?.trackingNumber && (
              <span style={{ fontSize: "14px", color: "#374151" }}>
                Tracking #: <strong>{tracking.trackingNumber}</strong>
              </span>
            )}
          </div>

          {/* PROGRESS STEPS */}
          {stepIdx >= 0 && (
            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                {STATUS_STEPS.map((step, idx) => {
                  const done = idx <= stepIdx;
                  const current = idx === stepIdx;
                  return (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        {/* LINE LEFT */}
                        {idx > 0 && (
                          <div
                            style={{
                              flex: 1,
                              height: "4px",
                              background: idx <= stepIdx ? "#2563eb" : "#e5e7eb",
                            }}
                          />
                        )}
                        {/* DOT */}
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: done ? "#2563eb" : "#e5e7eb",
                            border: current ? "3px solid #1d4ed8" : "none",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            color: done ? "#fff" : "#9ca3af",
                            fontWeight: 700,
                          }}
                        >
                          {done ? "✓" : ""}
                        </div>
                        {/* LINE RIGHT */}
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            style={{
                              flex: 1,
                              height: "4px",
                              background: idx < stepIdx ? "#2563eb" : "#e5e7eb",
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: "11px",
                          color: done ? "#1d4ed8" : "#9ca3af",
                          fontWeight: current ? 700 : 400,
                        }}
                      >
                        {STATUS_LABELS[step]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DATES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {tracking?.shippedAt && (
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Shipped On</p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{formatDate(tracking.shippedAt)}</p>
              </div>
            )}
            {tracking?.estimatedDeliveryDate && (
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Est. Delivery</p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{formatDate(tracking.estimatedDeliveryDate)}</p>
              </div>
            )}
            {tracking?.deliveredAt && (
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Delivered On</p>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{formatDate(tracking.deliveredAt)}</p>
              </div>
            )}
            {tracking?.trackingUrl && (
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>External Tracking</p>
                <a
                  href={tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "14px", color: "#2563eb", fontWeight: 600 }}
                >
                  Track on carrier site →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* TRACKING EVENTS */}
        {events.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700 }}>
              Tracking History
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[...events].reverse().map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "16px",
                    paddingBottom: idx < events.length - 1 ? "20px" : "0",
                  }}
                >
                  {/* TIMELINE */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: idx === 0 ? "#2563eb" : "#d1d5db",
                        flexShrink: 0,
                        marginTop: "3px",
                      }}
                    />
                    {idx < events.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          flex: 1,
                          background: "#e5e7eb",
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </div>

                  {/* EVENT CONTENT */}
                  <div style={{ flex: 1, paddingBottom: "4px" }}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "14px",
                        fontWeight: idx === 0 ? 700 : 500,
                        color: idx === 0 ? "#111827" : "#374151",
                      }}
                    >
                      {STATUS_LABELS[event?.status] || event?.status || "Update"}
                    </p>
                    {event?.message && (
                      <p style={{ margin: "0 0 2px", fontSize: "13px", color: "#6b7280" }}>
                        {event.message}
                      </p>
                    )}
                    {event?.location && (
                      <p style={{ margin: "0 0 2px", fontSize: "13px", color: "#9ca3af" }}>
                        📍 {event.location}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                      {formatDateTime(event?.timestamp || event?.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// ============================================================
// MAIN EXPORT — renders list or detail based on route param
// ============================================================

function ShipmentTrackingPage() {
  const { shipmentId } = useParams();

  if (shipmentId) {
    return <ShipmentDetailView shipmentId={shipmentId} />;
  }

  return <ShipmentListView />;
}

export default ShipmentTrackingPage;
