// ============================================================
// SHANTI ENTERPRISES
// Admin Order Details Page
// Admin - Order Management
// ============================================================

import "./AdminOrderDetailsPage.css";

import { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  cancelAdminOrder,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../api/adminOrderApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";

// ============================================================
// CONFIG (backend ke enum ke saath match karta hai)
// ============================================================

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const capitalize = (value = "") =>
  String(value).charAt(0).toUpperCase() + String(value).slice(1);

const getItemImage = (item) => {
  if (item?.image) return item.image;

  const image = item?.product?.image;

  if (typeof image === "string") return image;

  return image?.url || image?.secure_url || "";
};

// ============================================================
// COMPONENT
// ============================================================

function AdminOrderDetailsPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrderById(orderId);

      setOrder(data?.order || data?.data || null);
    } catch (err) {
      console.error("Load admin order error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // ==========================================================
  // MERGE UPDATED FIELDS
  // Update APIs sirf chhota order object return karte hain
  // (id, orderNumber, orderStatus, paymentStatus), isliye
  // populated user/items ko bachaane ke liye merge karte hain.
  // ==========================================================

  const mergeOrder = (updated) => {
    if (!updated) return;

    setOrder((current) => ({
      ...current,
      orderStatus: updated.orderStatus ?? current?.orderStatus,
      paymentStatus: updated.paymentStatus ?? current?.paymentStatus,
    }));
  };

  // ==========================================================
  // UPDATE ORDER STATUS
  // ==========================================================

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (!newStatus || newStatus === order?.orderStatus) return;

    try {
      setIsUpdatingStatus(true);
      setError("");
      setSuccessMessage("");

      const data = await updateOrderStatus(orderId, newStatus);

      mergeOrder(data?.order);

      setSuccessMessage(
        data?.message || "Order status updated successfully."
      );
    } catch (err) {
      console.error("Update order status error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update order status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ==========================================================
  // UPDATE PAYMENT STATUS
  // ==========================================================

  const handlePaymentStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (!newStatus || newStatus === order?.paymentStatus) return;

    try {
      setIsUpdatingPayment(true);
      setError("");
      setSuccessMessage("");

      const data = await updatePaymentStatus(orderId, newStatus);

      mergeOrder(data?.order);

      setSuccessMessage(
        data?.message || "Payment status updated successfully."
      );
    } catch (err) {
      console.error("Update payment status error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update payment status."
      );
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // ==========================================================
  // CANCEL ORDER
  // ==========================================================

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      setError("");
      setSuccessMessage("");

      const data = await cancelAdminOrder(orderId);

      mergeOrder(data?.order);

      setShowCancelConfirmation(false);

      setSuccessMessage(data?.message || "Order cancelled successfully.");
    } catch (err) {
      console.error("Cancel order error:", err);

      setShowCancelConfirmation(false);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to cancel order."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // ==========================================================
  // LOADING / ERROR / NOT FOUND
  // ==========================================================

  if (loading) {
    return <Loading message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="admin-order-details-page">
        <div className="admin-order-details-container">
          <div className="admin-order-not-found">
            <div className="admin-empty-icon">📦</div>

            <h1>Order not found</h1>

            <p>{error || "This order does not exist or was removed."}</p>

            <Link to="/admin/orders" className="admin-order-details-back">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const items = Array.isArray(order.items) ? order.items : [];

  const orderStatus = order.orderStatus || "pending";
  const paymentStatus = order.paymentStatus || "pending";

  const customer =
    order.user && typeof order.user === "object" ? order.user : null;

  const address = order.shippingAddress || null;

  const subtotal = Number(order.subtotal ?? 0);
  const total = Number(order.totalAmount ?? subtotal);
  const shippingAndOther = Math.max(total - subtotal, 0);

  const canCancel = !["cancelled", "delivered"].includes(orderStatus);
  const isCancelled = orderStatus === "cancelled";

  const isBusy = isUpdatingStatus || isUpdatingPayment || isCancelling;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-order-details-page">
      <div className="admin-order-details-container">
        {/* ---------------- HEADER ---------------- */}
        <div className="admin-order-details-header">
          <div className="admin-order-header-copy">
            <Link to="/admin/orders" className="admin-order-details-back">
              ← Back to Orders
            </Link>

            <span className="admin-order-details-eyebrow">Order Details</span>

            <h1>{order.orderNumber || "Order"}</h1>

            <p>Placed on {formatDateTime(order.createdAt)}</p>
          </div>

          <div className={`admin-order-details-status ${orderStatus}`}>
            <span className="admin-status-dot" />
            {capitalize(orderStatus)}
          </div>
        </div>

        {/* ---------------- MESSAGES ---------------- */}
        {successMessage && (
          <div className="admin-order-details-success">
            <strong>Success:</strong> {successMessage}
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={loadOrder} />
        )}

        {/* ---------------- SUMMARY ---------------- */}
        <div className="admin-order-details-summary">
          <div className="admin-summary-item">
            <span>Order Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="admin-summary-divider" />

          <div className="admin-summary-item">
            <span>Items</span>
            <strong>{items.length}</strong>
          </div>

          <div className="admin-summary-divider" />

          <div className="admin-summary-item">
            <span>Payment</span>
            <strong>{capitalize(paymentStatus)}</strong>
          </div>
        </div>

        {/* ---------------- MAIN GRID ---------------- */}
        <div className="admin-order-details-grid">
          <div className="admin-order-details-main">
            {/* STATUS UPDATE */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">⚙️</span>
                <h2>Order Status</h2>
              </div>

              <div className="admin-status-update-box">
                <div className="admin-current-status">
                  <span>Current status</span>

                  <strong className={`admin-order-status-text ${orderStatus}`}>
                    {capitalize(orderStatus)}
                  </strong>
                </div>

                <div className="admin-status-control">
                  <label htmlFor="order-status-select">Update status</label>

                  <select
                    id="order-status-select"
                    value={orderStatus}
                    onChange={handleStatusChange}
                    disabled={isBusy || isCancelled}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {capitalize(status)}
                      </option>
                    ))}
                  </select>

                  {isUpdatingStatus && (
                    <span className="admin-order-updating-message">
                      <span className="admin-spinner" /> Updating...
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* ITEMS */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">🛒</span>
                <h2>Order Items</h2>
                <span className="admin-items-count">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="admin-no-items">
                  <span>📭</span>
                  <p>No items found in this order.</p>
                </div>
              ) : (
                <div className="admin-order-items">
                  {items.map((item, index) => {
                    const image = getItemImage(item);
                    const name =
                      item.name || item.product?.name || "Product";
                    const lineTotal =
                      Number(item.price || 0) * Number(item.quantity || 0);

                    return (
                      <div
                        className="admin-order-item"
                        key={`${item.product?._id || item.product || index}-${index}`}
                      >
                        <div className="admin-order-item-image">
                          {image ? (
                            <img src={image} alt={name} loading="lazy" />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>

                        <div className="admin-order-item-info">
                          <h3>{name}</h3>

                          <div className="admin-item-meta">
                            <span>
                              Qty: <strong>{item.quantity}</strong>
                              {item.unit ? ` ${item.unit}` : ""}
                            </span>
                            <span>
                              Price: <strong>{formatCurrency(item.price)}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="admin-order-item-total">
                          {formatCurrency(lineTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* PRICE BREAKDOWN */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">💰</span>
                <h2>Price Summary</h2>
              </div>

              <div className="admin-price-breakdown">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                {shippingAndOther > 0 && (
                  <div>
                    <span>Shipping / Other charges</span>
                    <strong>{formatCurrency(shippingAndOther)}</strong>
                  </div>
                )}

                <div className="admin-grand-total">
                  <span>Grand Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>
            </section>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <aside className="admin-order-details-sidebar">
            {/* CUSTOMER */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">👤</span>
                <h2>Customer</h2>
              </div>

              {customer ? (
                <div className="admin-customer-info">
                  <div className="admin-customer-avatar">
                    {(customer.name || "C").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{customer.name || "Customer"}</h3>

                    {customer.email && (
                      <a href={`mailto:${customer.email}`}>{customer.email}</a>
                    )}

                    {customer.phone && (
                      <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                    )}

                    {customer._id && (
                      <Link to={`/admin/users/${customer._id}`}>
                        View customer profile
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <p className="admin-not-available">
                  Customer details not available.
                </p>
              )}
            </section>

            {/* SHIPPING ADDRESS */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">📍</span>
                <h2>Shipping Address</h2>
              </div>

              {address ? (
                <div className="admin-shipping-address">
                  <strong>{address.name}</strong>

                  <p>
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                  </p>

                  <p>
                    {[address.city, address.state, address.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {address.country && <p>{address.country}</p>}

                  {address.phone && <p>📞 {address.phone}</p>}
                </div>
              ) : (
                <p className="admin-not-available">
                  No shipping address on this order.
                </p>
              )}
            </section>

            {/* PAYMENT */}
            <section className="admin-details-card">
              <div className="admin-details-card-header">
                <span className="admin-card-icon">💳</span>
                <h2>Payment</h2>
              </div>

              <div className="admin-payment-info">
                <div className="admin-payment-row">
                  <span>Method</span>
                  <strong>
                    {order.paymentMethod
                      ? order.paymentMethod.toUpperCase()
                      : "—"}
                  </strong>
                </div>

                <div className="admin-payment-row">
                  <span>Status</span>
                  <strong className={`admin-payment-status ${paymentStatus}`}>
                    {capitalize(paymentStatus)}
                  </strong>
                </div>

                <div className="admin-payment-row">
                  <span>Amount</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              <div className="admin-status-update-box" style={{ gridTemplateColumns: "1fr" }}>
                <div className="admin-status-control">
                  <label htmlFor="payment-status-select">
                    Update payment status
                  </label>

                  <select
                    id="payment-status-select"
                    value={paymentStatus}
                    onChange={handlePaymentStatusChange}
                    disabled={isBusy}
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {capitalize(status)}
                      </option>
                    ))}
                  </select>

                  {isUpdatingPayment && (
                    <span className="admin-order-updating-message">
                      <span className="admin-spinner" /> Updating...
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* CANCEL */}
            {canCancel && (
              <section className="admin-details-card">
                <div className="admin-details-card-header">
                  <span className="admin-card-icon">⚠️</span>
                  <h2>Danger Zone</h2>
                </div>

                <div className="admin-status-update-box" style={{ gridTemplateColumns: "1fr" }}>
                  <p className="admin-not-available">
                    Cancelling restores product stock and cannot be undone.
                  </p>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowCancelConfirmation(true)}
                    disabled={isBusy}
                  >
                    Cancel Order
                  </button>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      <ConfirmModal
        open={showCancelConfirmation}
        title="Cancel this order?"
        message={`Order ${order.orderNumber || ""} will be cancelled and its stock will be restored to inventory.`}
        confirmText="Yes, cancel order"
        cancelText="Keep order"
        variant="danger"
        loading={isCancelling}
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelConfirmation(false)}
      />
    </div>
  );
}

export default AdminOrderDetailsPage;