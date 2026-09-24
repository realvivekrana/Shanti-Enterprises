// ============================================================
// SHANTI ENTERPRISES
// Admin Bulk Quote Details Page
// Admin - Price a bulk quote & send it to the customer (RFQ-style)
// ============================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAdminBulkQuoteById,
  respondToAdminBulkQuote,
  updateAdminBulkQuoteStatus,
} from "../../api/adminBulkQuoteApi";

import Loading from "../../components/common/Loading";
import ConfirmModal from "../../components/common/ConfirmModal";

import "./AdminOpsPages.css";

// ============================================================
// CONFIG
// ============================================================

const STATUS_LABELS = {
  pending: "Pending",
  reviewing: "Under Review",
  quoted: "Quoted",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

// Backend: respond sirf in statuses par allowed hai
const PRICEABLE_STATUSES = ["pending", "reviewing", "quoted"];

const CONFIRM_CONFIG = {
  rejected: {
    title: "Reject this bulk quote?",
    message:
      "The customer will see this quote as rejected. This cannot be undone.",
    confirmText: "Yes, reject",
  },
  cancelled: {
    title: "Cancel this bulk quote?",
    message:
      "The quote will be cancelled. This cannot be undone.",
    confirmText: "Yes, cancel",
  },
};

// ============================================================
// HELPERS
// ============================================================

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
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

  if (value === null || value === undefined || !Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

// yyyy-mm-dd (local time) for <input type="date">
const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

const getProductId = (item) => {
  if (!item?.product) {
    return "";
  }

  return typeof item.product === "object"
    ? item.product._id || ""
    : String(item.product);
};

const getProductObject = (item) =>
  item?.product && typeof item.product === "object" ? item.product : null;

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// ============================================================
// ADMIN BULK QUOTE DETAILS PAGE
// ============================================================

function AdminBulkQuoteDetailsPage() {
  const { quoteId } = useParams();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [prices, setPrices] = useState({});
  const [adminNote, setAdminNote] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const [sending, setSending] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  // ==========================================================
  // APPLY QUOTE TO FORM STATE
  // ==========================================================

  const applyQuote = useCallback((data) => {
    setQuote(data);

    const nextPrices = {};

    (data?.items || []).forEach((item) => {
      const productId = getProductId(item);

      if (productId) {
        nextPrices[productId] =
          item.quotedPrice === null || item.quotedPrice === undefined
            ? ""
            : String(item.quotedPrice);
      }
    });

    setPrices(nextPrices);
    setAdminNote(data?.adminNote || "");
    setValidUntil(toDateInputValue(data?.validUntil));
  }, []);

  // ==========================================================
  // LOAD
  // ==========================================================

  const loadQuote = useCallback(async () => {
    if (!quoteId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAdminBulkQuoteById(quoteId);

      applyQuote(response?.bulkQuote || null);
    } catch (err) {
      console.error("Admin bulk quote details error:", err);
      setError(getErrorMessage(err, "Unable to load bulk quote."));
    } finally {
      setLoading(false);
    }
  }, [quoteId, applyQuote]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  // ==========================================================
  // TOTAL (live)
  // ==========================================================

  const total = useMemo(() => {
    if (!quote) {
      return 0;
    }

    return (quote.items || []).reduce((sum, item) => {
      const price = Number(prices[getProductId(item)]);

      if (!Number.isFinite(price)) {
        return sum;
      }

      return sum + price * Number(item.quantity || 0);
    }, 0);
  }, [quote, prices]);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handlePriceChange = (productId, value) => {
    setPrices((current) => ({
      ...current,
      [productId]: value,
    }));
  };

  // Khaali price boxes me product ka listed price bhar deta hai
  const handleFillListPrices = () => {
    setPrices((current) => {
      const next = { ...current };

      (quote?.items || []).forEach((item) => {
        const productId = getProductId(item);
        const listPrice = getProductObject(item)?.price;

        if (
          productId &&
          (next[productId] === "" || next[productId] === undefined) &&
          Number.isFinite(Number(listPrice))
        ) {
          next[productId] = String(listPrice);
        }
      });

      return next;
    });
  };

  const handleSendQuote = async () => {
    setError("");
    setSuccess("");

    // ---- validate prices ----
    const pricedItems = [];

    for (const item of quote.items || []) {
      const productId = getProductId(item);
      const raw = prices[productId];

      if (!productId) {
        setError(
          `"${item.productName}" no longer exists, so this quote cannot be priced.`
        );
        return;
      }

      const price = Number(raw);

      if (raw === "" || raw === undefined || !Number.isFinite(price) || price < 0) {
        setError(`Enter a valid price for "${item.productName}".`);
        return;
      }

      pricedItems.push({ productId, quotedPrice: price });
    }

    // ---- validate date (end of the chosen day, must be in the future) ----
    let validUntilISO = null;

    if (validUntil) {
      const endOfDay = new Date(`${validUntil}T23:59:59`);

      if (Number.isNaN(endOfDay.getTime()) || endOfDay <= new Date()) {
        setError("Valid-until date must be today or a future date.");
        return;
      }

      validUntilISO = endOfDay.toISOString();
    }

    try {
      setSending(true);

      await respondToAdminBulkQuote(quoteId, {
        items: pricedItems,
        adminNote: adminNote.trim(),
        validUntil: validUntilISO,
      });

      setSuccess("Quote sent to the customer successfully.");

      const response = await getAdminBulkQuoteById(quoteId);
      applyQuote(response?.bulkQuote || null);
    } catch (err) {
      console.error("Send bulk quote error:", err);
      setError(getErrorMessage(err, "Unable to send the quote."));
    } finally {
      setSending(false);
    }
  };

  const handleMarkReviewing = async () => {
    setError("");
    setSuccess("");

    try {
      setStatusUpdating(true);

      await updateAdminBulkQuoteStatus(quoteId, "reviewing");

      setSuccess("Quote marked as under review.");

      const response = await getAdminBulkQuoteById(quoteId);
      applyQuote(response?.bulkQuote || null);
    } catch (err) {
      console.error("Mark reviewing error:", err);
      setError(getErrorMessage(err, "Unable to update status."));
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleConfirmStatus = async () => {
    if (!confirmStatus) {
      return;
    }

    try {
      setStatusUpdating(true);
      setError("");
      setSuccess("");

      await updateAdminBulkQuoteStatus(quoteId, confirmStatus);

      setSuccess(`Quote marked as ${STATUS_LABELS[confirmStatus]}.`);

      const response = await getAdminBulkQuoteById(quoteId);
      applyQuote(response?.bulkQuote || null);
    } catch (err) {
      console.error("Update bulk quote status error:", err);
      setError(getErrorMessage(err, "Unable to update status."));
    } finally {
      setStatusUpdating(false);
      setConfirmStatus("");
    }
  };

  // ==========================================================
  // LOADING / NOT FOUND
  // ==========================================================

  if (loading && !quote) {
    return (
      <div className="app-page admin-ops-page">
        <Loading message="Loading bulk quote..." />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="app-page admin-ops-page">
        <div className="ops-state">
          <h2>Bulk quote not found</h2>

          {error && (
            <div className="ops-alert ops-alert--error">{error}</div>
          )}

          <Link className="ops-back" to="/admin/bulk-quotes">
            ← Back to Bulk Quotes
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DERIVED
  // ==========================================================

  const status = quote.status;
  const canPrice = PRICEABLE_STATUSES.includes(status);
  const busy = sending || statusUpdating;

  const todayInput = toDateInputValue(new Date());

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-ops-page">
      {/* HEADER */}

      <div className="ops-header">
        <div>
          <span className="ops-eyebrow">ADMIN • BULK QUOTE</span>

          <div className="ops-title-row">
            <h1>{quote.quoteNumber}</h1>

            <span className={`ops-status ops-status--${status}`}>
              {STATUS_LABELS[status] || status}
            </span>
          </div>

          <p className="ops-subtitle">
            Requested on {formatDateTime(quote.createdAt)}
          </p>
        </div>

        <Link className="ops-back" to="/admin/bulk-quotes">
          ← All Bulk Quotes
        </Link>
      </div>

      {error && <div className="ops-alert ops-alert--error">{error}</div>}
      {success && <div className="ops-alert ops-alert--success">{success}</div>}

      <div className="ops-grid">
        {/* ==================================================
            LEFT COLUMN
            ================================================== */}

        <div className="ops-col">
          {/* CUSTOMER MESSAGE */}

          {quote.message && (
            <section className="ops-card">
              <h2>Customer Message</h2>
              <p className="ops-text-block">{quote.message}</p>
            </section>
          )}

          {/* ITEMS + PRICING */}

          <section className="ops-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <h2 style={{ margin: 0 }}>
                {canPrice ? "Price the Items" : "Quoted Items"}
              </h2>

              {canPrice && (
                <button
                  type="button"
                  className="ops-btn"
                  style={{ minHeight: 36 }}
                  onClick={handleFillListPrices}
                  disabled={busy}
                >
                  Fill empty with list price
                </button>
              )}
            </div>

            <div className="ops-table-scroll">
              <table className="ops-table" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="ops-num">Qty</th>
                    <th className="ops-num">List Price</th>
                    <th className="ops-num">Customer Asked</th>
                    <th className="ops-num">Your Price (₹)</th>
                    <th className="ops-num">Line Total</th>
                  </tr>
                </thead>

                <tbody>
                  {(quote.items || []).map((item, index) => {
                    const productId = getProductId(item);
                    const product = getProductObject(item);

                    const priceValue = canPrice
                      ? prices[productId] ?? ""
                      : item.quotedPrice;

                    const lineTotal =
                      Number(priceValue) * Number(item.quantity || 0);

                    const belowMoq =
                      Number(product?.moq) > 0 &&
                      item.quantity < Number(product.moq);

                    const overStock =
                      product &&
                      Number.isFinite(Number(product.stock)) &&
                      item.quantity > Number(product.stock);

                    return (
                      <tr key={`${productId}-${index}`}>
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

                              {item.unit && <small>Unit: {item.unit}</small>}

                              {belowMoq && (
                                <span className="ops-warn">
                                  Below MOQ ({product.moq}) — customer cannot order this quantity
                                </span>
                              )}

                              {overStock && (
                                <span className="ops-warn" style={{ display: "block" }}>
                                  Only {product.stock} in stock
                                </span>
                              )}

                              {!productId && (
                                <span className="ops-warn">
                                  Product no longer exists
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="ops-num">
                          <strong>{item.quantity}</strong>
                        </td>

                        <td className="ops-num">
                          {formatMoney(product?.price)}
                        </td>

                        <td className="ops-num">
                          {formatMoney(item.requestedPrice)}
                        </td>

                        <td className="ops-num">
                          {canPrice ? (
                            <input
                              className="ops-input ops-input--price"
                              type="number"
                              min="0"
                              step="0.01"
                              inputMode="decimal"
                              value={priceValue}
                              onChange={(event) =>
                                handlePriceChange(productId, event.target.value)
                              }
                              placeholder="0.00"
                              aria-label={`Price for ${item.productName}`}
                              disabled={busy || !productId}
                            />
                          ) : (
                            <strong>{formatMoney(item.quotedPrice)}</strong>
                          )}
                        </td>

                        <td className="ops-num">
                          <strong>
                            {Number.isFinite(lineTotal) &&
                            priceValue !== "" &&
                            priceValue !== null &&
                            priceValue !== undefined
                              ? formatMoney(lineTotal)
                              : "—"}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="ops-total">
              <span>{canPrice ? "Quote total" : "Total"}</span>

              <strong>
                {canPrice ? formatMoney(total) : formatMoney(quote.totalAmount)}
              </strong>
            </div>
          </section>

          {/* NOTE + VALIDITY */}

          {canPrice ? (
            <section className="ops-card">
              <h2>Message to Customer</h2>

              <div className="ops-field">
                <label htmlFor="adminNote">Note (optional)</label>

                <textarea
                  id="adminNote"
                  className="ops-textarea"
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  maxLength={1000}
                  placeholder="Delivery timeline, payment terms, GST, anything the customer should know..."
                  disabled={busy}
                />

                <span className="ops-hint">{adminNote.length}/1000</span>
              </div>

              <div className="ops-field" style={{ marginBottom: 0 }}>
                <label htmlFor="validUntil">Quote valid until (optional)</label>

                <input
                  id="validUntil"
                  className="ops-input"
                  type="date"
                  min={todayInput}
                  value={validUntil}
                  onChange={(event) => setValidUntil(event.target.value)}
                  disabled={busy}
                />

                <span className="ops-hint">
                  The customer can accept the quote until the end of this day.
                </span>
              </div>
            </section>
          ) : (
            quote.adminNote && (
              <section className="ops-card">
                <h2>Your Note to Customer</h2>
                <p className="ops-text-block">{quote.adminNote}</p>
              </section>
            )
          )}
        </div>

        {/* ==================================================
            RIGHT COLUMN
            ================================================== */}

        <div className="ops-col">
          {/* ACTIONS */}

          <section className="ops-card">
            <h2>Actions</h2>

            {canPrice ? (
              <div className="ops-actions">
                <button
                  type="button"
                  className="ops-btn ops-btn--primary"
                  onClick={handleSendQuote}
                  disabled={busy}
                >
                  {sending
                    ? "Sending..."
                    : status === "quoted"
                    ? "Update & Resend Quote"
                    : "Send Quote to Customer"}
                </button>

                {status === "pending" && (
                  <button
                    type="button"
                    className="ops-btn"
                    onClick={handleMarkReviewing}
                    disabled={busy}
                  >
                    Mark as Under Review
                  </button>
                )}

                <button
                  type="button"
                  className="ops-btn ops-btn--danger"
                  onClick={() => setConfirmStatus("rejected")}
                  disabled={busy}
                >
                  Reject Quote
                </button>

                <button
                  type="button"
                  className="ops-btn ops-btn--danger"
                  onClick={() => setConfirmStatus("cancelled")}
                  disabled={busy}
                >
                  Cancel Quote
                </button>
              </div>
            ) : (
              <div className="ops-alert ops-alert--info" style={{ marginBottom: 0 }}>
                {status === "accepted" &&
                  "The customer accepted this quote. They can now place the order from their Bulk Quotes page."}
                {status === "rejected" && "This quote was rejected."}
                {status === "cancelled" && "This quote was cancelled."}
              </div>
            )}
          </section>

          {/* CUSTOMER */}

          <section className="ops-card">
            <h2>Customer</h2>

            <dl className="ops-kv">
              <div>
                <dt>Name</dt>
                <dd>{quote.user?.name || "—"}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{quote.user?.email || "—"}</dd>
              </div>

              <div>
                <dt>Phone</dt>
                <dd>{quote.user?.phone || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* DATES */}

          <section className="ops-card">
            <h2>Timeline</h2>

            <dl className="ops-kv">
              <div>
                <dt>Requested</dt>
                <dd>{formatDateTime(quote.createdAt)}</dd>
              </div>

              <div>
                <dt>Quoted</dt>
                <dd>{formatDateTime(quote.quotedAt)}</dd>
              </div>

              <div>
                <dt>Valid until</dt>
                <dd>{formatDateTime(quote.validUntil)}</dd>
              </div>

              {quote.acceptedAt && (
                <div>
                  <dt>Accepted</dt>
                  <dd>{formatDateTime(quote.acceptedAt)}</dd>
                </div>
              )}

              {quote.rejectedAt && (
                <div>
                  <dt>Rejected</dt>
                  <dd>{formatDateTime(quote.rejectedAt)}</dd>
                </div>
              )}

              {quote.cancelledAt && (
                <div>
                  <dt>Cancelled</dt>
                  <dd>{formatDateTime(quote.cancelledAt)}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>

      {/* CONFIRM */}

      <ConfirmModal
        open={Boolean(confirmStatus)}
        title={CONFIRM_CONFIG[confirmStatus]?.title || "Are you sure?"}
        message={CONFIRM_CONFIG[confirmStatus]?.message}
        confirmText={CONFIRM_CONFIG[confirmStatus]?.confirmText || "Confirm"}
        variant="danger"
        loading={statusUpdating}
        onConfirm={handleConfirmStatus}
        onCancel={() => setConfirmStatus("")}
      />
    </div>
  );
}

export default AdminBulkQuoteDetailsPage;