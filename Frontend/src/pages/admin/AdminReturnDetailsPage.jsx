// ============================================================
// SHANTI ENTERPRISES
// Admin Return Details Page
// Admin - Return Review, Pickup, Receive & Refund workflow
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAdminReturnById,
  updateAdminReturnStatus,
} from "../../api/adminReturnApi";

import Loading from "../../components/common/Loading";
import ConfirmModal from "../../components/common/ConfirmModal";

import "./AdminOpsPages.css";

// ============================================================
// CONFIG
// ============================================================

const STATUS_LABELS = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  picked_up: "Picked Up",
  received: "Received",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

// Normal (happy path) order of a return
const FLOW = [
  { key: "requested", label: "Requested", dateKey: "requestedAt" },
  { key: "approved", label: "Approved", dateKey: "approvedAt" },
  { key: "picked_up", label: "Picked Up", dateKey: null },
  { key: "received", label: "Received", dateKey: "receivedAt" },
  { key: "refunded", label: "Refunded", dateKey: "refundedAt" },
];

// Backend ke allowedNextStatuses ke saath match karta hai
const NEXT_ACTIONS = {
  requested: [
    { status: "approved", label: "Approve Return", tone: "primary" },
    { status: "rejected", label: "Reject Return", tone: "danger" },
    { status: "cancelled", label: "Cancel Return", tone: "danger" },
  ],
  approved: [
    { status: "picked_up", label: "Mark as Picked Up", tone: "primary" },
    { status: "cancelled", label: "Cancel Return", tone: "danger" },
  ],
  picked_up: [
    { status: "received", label: "Mark as Received", tone: "primary" },
  ],
  received: [
    { status: "refunded", label: "Issue Refund", tone: "success" },
  ],
};

const CONFIRM_TEXT = {
  approved: "Approve this return request? The customer will be able to hand over the items for pickup.",
  rejected: "Reject this return request? This cannot be undone.",
  cancelled: "Cancel this return request? This cannot be undone.",
  picked_up: "Mark the return items as picked up from the customer?",
  received: "Confirm that the returned items have reached the warehouse?",
  refunded: "Issue the refund? The returned quantities will be added back to product stock. This cannot be undone.",
};

// ============================================================
// HELPERS
// ============================================================

const formatDateTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// ============================================================
// ADMIN RETURN DETAILS PAGE
// ============================================================

function AdminReturnDetailsPage() {
  const { returnId } = useParams();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pendingStatus, setPendingStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");

  // ==========================================================
  // LOAD
  // ==========================================================

  const loadReturn = useCallback(async () => {
    if (!returnId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAdminReturnById(returnId);

      setReturnRequest(response?.returnRequest || null);
    } catch (err) {
      console.error("Admin return details error:", err);
      setError(getErrorMessage(err, "Unable to load return request."));
    } finally {
      setLoading(false);
    }
  }, [returnId]);

  useEffect(() => {
    loadReturn();
  }, [loadReturn]);

  // ==========================================================
  // STATUS UPDATE
  // ==========================================================

  const requestStatusChange = (status) => {
    setError("");
    setSuccess("");

    if (status === "refunded") {
      const amount = Number(refundAmount);

      if (
        refundAmount === "" ||
        !Number.isFinite(amount) ||
        amount < 0
      ) {
        setError("Enter a valid refund amount (0 or more) before issuing the refund.");
        return;
      }
    }

    setPendingStatus(status);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const payload = { status: pendingStatus };

      if (pendingStatus === "refunded") {
        payload.refundAmount = Number(refundAmount);
      }

      await updateAdminReturnStatus(returnId, payload);

      setSuccess(
        `Return marked as ${STATUS_LABELS[pendingStatus] || pendingStatus}.`
      );

      setPendingStatus("");

      // Fresh data (dates, refund amount) wapas le aao
      const response = await getAdminReturnById(returnId);
      setReturnRequest(response?.returnRequest || null);
    } catch (err) {
      console.error("Update return status error:", err);
      setError(getErrorMessage(err, "Unable to update return status."));
      setPendingStatus("");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================================
  // LOADING / NOT FOUND
  // ==========================================================

  if (loading && !returnRequest) {
    return (
      <div className="app-page admin-ops-page">
        <Loading message="Loading return request..." />
      </div>
    );
  }

  if (!returnRequest) {
    return (
      <div className="app-page admin-ops-page">
        <div className="ops-state">
          <h2>Return request not found</h2>

          {error && (
            <div className="ops-alert ops-alert--error">{error}</div>
          )}

          <Link className="ops-back" to="/admin/returns">
            ← Back to Returns
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DERIVED
  // ==========================================================

  const status = returnRequest.status;
  const actions = NEXT_ACTIONS[status] || [];
  const isStopped = status === "rejected" || status === "cancelled";
  const currentIndex = FLOW.findIndex((step) => step.key === status);

  const totalQuantity = (returnRequest.items || []).reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );

  // Timeline: happy-path steps + terminal rejected/cancelled step agar ho
  const timeline = FLOW.map((step, index) => {
    const date = step.dateKey ? returnRequest[step.dateKey] : null;

    // picked_up ke liye alag date field nahi hai, isliye uski state sirf
    // current status se pata chalti hai.
    // Rejected/cancelled par sirf wahi steps done dikhte hain jinki date hai.
    const reached = isStopped
      ? index === 0 || Boolean(date)
      : currentIndex >= index;

    return {
      ...step,
      date,
      done: reached && (isStopped || index < currentIndex),
      current: !isStopped && index === currentIndex,
    };
  });

  const orderId = returnRequest.order?._id;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-ops-page">
      {/* HEADER */}

      <div className="ops-header">
        <div>
          <span className="ops-eyebrow">ADMIN • RETURN</span>

          <div className="ops-title-row">
            <h1>{returnRequest.returnNumber}</h1>

            <span className={`ops-status ops-status--${status}`}>
              {STATUS_LABELS[status] || status}
            </span>
          </div>

          <p className="ops-subtitle">
            Requested on {formatDateTime(returnRequest.requestedAt || returnRequest.createdAt) || "—"}
          </p>
        </div>

        <Link className="ops-back" to="/admin/returns">
          ← All Returns
        </Link>
      </div>

      {error && <div className="ops-alert ops-alert--error">{error}</div>}
      {success && <div className="ops-alert ops-alert--success">{success}</div>}

      <div className="ops-grid">
        {/* ==================================================
            LEFT COLUMN
            ================================================== */}

        <div className="ops-col">
          {/* REASON */}

          <section className="ops-card">
            <h2>Return Reason</h2>

            <p className="ops-text-block">{returnRequest.reason || "—"}</p>

            {returnRequest.description && (
              <>
                <h3 style={{ marginTop: 16 }}>Customer Description</h3>
                <p className="ops-text-block">{returnRequest.description}</p>
              </>
            )}
          </section>

          {/* ITEMS */}

          <section className="ops-card">
            <h2>Items to Return ({totalQuantity})</h2>

            <div className="ops-table-scroll">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="ops-num">Qty</th>
                    <th>Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {(returnRequest.items || []).map((item, index) => {
                    const product =
                      item.product && typeof item.product === "object"
                        ? item.product
                        : null;

                    return (
                      <tr key={`${item.productName}-${index}`}>
                        <td>
                          <div className="ops-product">
                            {product?.image && (
                              <img
                                src={product.image}
                                alt={item.productName}
                                loading="lazy"
                              />
                            )}

                            <div>
                              <strong>{item.productName}</strong>

                              {product?.unit && (
                                <small>Unit: {product.unit}</small>
                              )}

                              {!product && (
                                <span className="ops-warn">
                                  Product no longer exists — stock will not be restored for this item
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="ops-num">
                          <strong>{item.quantity}</strong>
                        </td>

                        <td>{item.reason || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ==================================================
            RIGHT COLUMN
            ================================================== */}

        <div className="ops-col">
          {/* ACTIONS */}

          <section className="ops-card">
            <h2>Actions</h2>

            {actions.length === 0 ? (
              <div className="ops-alert ops-alert--info" style={{ marginBottom: 0 }}>
                This return is {STATUS_LABELS[status] || status}. No further
                actions are available.
                {status === "refunded" &&
                  ` Refunded amount: ${formatMoney(returnRequest.refundAmount)}.`}
              </div>
            ) : (
              <div className="ops-actions">
                {status === "received" && (
                  <div className="ops-field">
                    <label htmlFor="refundAmount">Refund amount (₹)</label>

                    <input
                      id="refundAmount"
                      className="ops-input"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={refundAmount}
                      onChange={(event) => setRefundAmount(event.target.value)}
                      placeholder="e.g. 1500"
                      disabled={updating}
                    />

                    <span className="ops-hint">
                      Refunding adds the returned quantities back to product stock.
                    </span>
                  </div>
                )}

                {actions.map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className={`ops-btn ops-btn--${action.tone}`}
                    onClick={() => requestStatusChange(action.status)}
                    disabled={updating}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* PROGRESS */}

          <section className="ops-card">
            <h2>Progress</h2>

            <ul className="ops-timeline">
              {timeline.map((step) => (
                <li
                  key={step.key}
                  className={`${step.done ? "is-done" : ""} ${
                    step.current ? "is-current is-done" : ""
                  }`}
                >
                  <span>{step.label}</span>
                  {step.date && <small>{formatDateTime(step.date)}</small>}
                </li>
              ))}

              {isStopped && (
                <li className="is-stopped is-done">
                  <span>{STATUS_LABELS[status]}</span>
                  <small>
                    {formatDateTime(
                      status === "rejected"
                        ? returnRequest.rejectedAt
                        : returnRequest.cancelledAt
                    )}
                  </small>
                </li>
              )}
            </ul>
          </section>

          {/* CUSTOMER + ORDER */}

          <section className="ops-card">
            <h2>Customer & Order</h2>

            <dl className="ops-kv">
              <div>
                <dt>Customer</dt>
                <dd>{returnRequest.user?.name || "—"}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{returnRequest.user?.email || "—"}</dd>
              </div>

              <div>
                <dt>Phone</dt>
                <dd>{returnRequest.user?.phone || "—"}</dd>
              </div>

              <div>
                <dt>Order</dt>
                <dd>
                  {orderId ? (
                    <Link to={`/admin/orders/${orderId}`}>
                      {returnRequest.order?.orderNumber || "View order"}
                    </Link>
                  ) : (
                    returnRequest.order?.orderNumber || "—"
                  )}
                </dd>
              </div>

              <div>
                <dt>Order total</dt>
                <dd>{formatMoney(returnRequest.order?.totalAmount)}</dd>
              </div>

              <div>
                <dt>Refund amount</dt>
                <dd>
                  {status === "refunded"
                    ? formatMoney(returnRequest.refundAmount)
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* CONFIRM */}

      <ConfirmModal
        open={Boolean(pendingStatus)}
        title={`${STATUS_LABELS[pendingStatus] || "Update"} — confirm`}
        message={CONFIRM_TEXT[pendingStatus] || "Are you sure?"}
        confirmText="Yes, continue"
        variant={
          pendingStatus === "rejected" || pendingStatus === "cancelled"
            ? "danger"
            : "primary"
        }
        loading={updating}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatus("")}
      />
    </div>
  );
}

export default AdminReturnDetailsPage;