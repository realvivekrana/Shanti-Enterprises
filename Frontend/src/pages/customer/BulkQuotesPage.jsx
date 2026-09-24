// ============================================================
// SHANTI ENTERPRISES
// Customer Bulk Quotes Page
// Frontend - Wholesale Bulk Quotes
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getMyBulkQuotes,
  createBulkQuote,
  acceptBulkQuote,
  rejectBulkQuote,
} from "../../api/bulkQuoteApi";

import {
  getProducts,
} from "../../api/productApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";
import BulkQuoteOrderModal from "../../components/customer/BulkQuoteOrderModal";
import "./BulkQuotesPage.css";

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

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const STATUS_STYLE = {
  pending:  { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  reviewed: { bg: "#fefce8", color: "#a16207", border: "#fef08a" },
  reviewing:{ bg: "#fefce8", color: "#a16207", border: "#fef08a" },
  quoted:   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  accepted: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
  rejected: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  cancelled:{ bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  expired:  { bg: "#f9fafb", color: "#6b7280", border: "#e5e7eb" },
};

const STATUS_LABEL = {
  reviewing: "Under Review",
};

// validUntil nikal chuki hai?
const isExpired = (quote) =>
  Boolean(quote?.validUntil) && new Date(quote.validUntil) < new Date();

const getStatusStyle = (s) =>
  STATUS_STYLE[s] || { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" };

const fmtLabel = (s) =>
  STATUS_LABEL[s] ||
  String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ============================================================
// BULK QUOTES PAGE
// ============================================================

function BulkQuotesPage() {
  const navigate = useNavigate();

  // ---- list state ----
  const [quotes, setQuotes]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---- new quote form state ----
  const [showForm, setShowForm] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formItems, setFormItems] = useState([
    { productId: "", quantity: 1, requestedPrice: "" },
  ]);
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg]   = useState("");

  // ---- quote actions (accept / reject / place order) ----
  const [actionId, setActionId]         = useState("");
  const [actionError, setActionError]   = useState("");
  const [rejectQuote, setRejectQuote]   = useState(null);
  const [orderQuote, setOrderQuote]     = useState(null);

  // ==========================================================
  // LOAD QUOTES
  // ==========================================================

  const loadQuotes = async (requestedPage = 1) => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyBulkQuotes({ page: requestedPage, limit: 10 });
      setQuotes(response?.bulkQuotes || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load bulk quotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuotes(1); }, []);

  // ==========================================================
  // LOAD PRODUCTS FOR FORM
  // ==========================================================

  const loadProducts = async () => {
    if (allProducts.length > 0) return;
    try {
      setLoadingProducts(true);
      const response = await getProducts({ limit: 100, isWholesale: true });
      const items =
        response?.products ||
        response?.data?.products ||
        [];
      setAllProducts(items);
    } catch {
      // fallback: still show form, dropdown will be empty
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    loadProducts();
    setSubmitError("");
    setSuccessMsg("");
    setFormItems([{ productId: "", quantity: 1, requestedPrice: "" }]);
    setFormMessage("");
  };

  // ==========================================================
  // FORM ITEMS
  // ==========================================================

  const addItem = () =>
    setFormItems((prev) => [
      ...prev,
      { productId: "", quantity: 1, requestedPrice: "" },
    ]);

  const removeItem = (idx) =>
    setFormItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx, field, value) =>
    setFormItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  // ==========================================================
  // SUBMIT QUOTE
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = formItems.filter(
      (item) => item.productId && Number(item.quantity) >= 1
    );

    if (validItems.length === 0) {
      setSubmitError("Please add at least one product with a valid quantity.");
      return;
    }

    const payload = {
      items: validItems.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        requestedPrice:
          item.requestedPrice !== "" ? Number(item.requestedPrice) : undefined,
      })),
      message: formMessage.trim(),
    };

    try {
      setSubmitting(true);
      setSubmitError("");
      await createBulkQuote(payload);
      setSuccessMsg("Bulk quote submitted successfully! We will get back to you shortly.");
      setShowForm(false);
      loadQuotes(1);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit bulk quote.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // ACCEPT / REJECT QUOTED PRICE
  // ==========================================================

  const handleAccept = async (quote) => {
    const qId = quote?._id || quote?.id;

    try {
      setActionId(qId);
      setActionError("");
      setSuccessMsg("");

      await acceptBulkQuote(qId);

      setSuccessMsg(
        "Quote accepted! You can now place your order at the agreed prices."
      );

      await loadQuotes(page);
    } catch (err) {
      setActionError(err.message || "Unable to accept the quote.");
    } finally {
      setActionId("");
    }
  };

  const handleConfirmReject = async () => {
    const qId = rejectQuote?._id || rejectQuote?.id;

    if (!qId) {
      return;
    }

    try {
      setActionId(qId);
      setActionError("");
      setSuccessMsg("");

      await rejectBulkQuote(qId);

      setSuccessMsg("Quote rejected.");

      await loadQuotes(page);
    } catch (err) {
      setActionError(err.message || "Unable to reject the quote.");
    } finally {
      setActionId("");
      setRejectQuote(null);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && quotes.length === 0) {
    return (
      <section className="app-page bulk-quotes-page">
        <div className="page-container">
          <Loading message="Loading your bulk quotes..." />
        </div>
      </section>
    );
  }

  if (error && quotes.length === 0) {
    return (
      <section className="app-page bulk-quotes-page">
        <div className="page-container">
          <ErrorMessage message={error} onRetry={() => loadQuotes(1)} />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="app-page bulk-quotes-page">
      <div className="page-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>Bulk Quotes</h1>
            <p>Request wholesale pricing for large orders.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="btn-secondary">
              ← Dashboard
            </Link>
            {!showForm && (
              <button type="button" className="btn-primary" onClick={handleShowForm}>
                + New Bulk Quote
              </button>
            )}
          </div>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
            {successMsg}
          </div>
        )}

        {/* ==================================================
            NEW QUOTE FORM
            ================================================== */}
        {showForm && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                New Bulk Quote Request
              </h2>
              <button
                type="button"
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            {loadingProducts && (
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                Loading products...
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {/* ITEMS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {formItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr auto",
                      gap: "10px",
                      alignItems: "end",
                    }}
                  >
                    <div>
                      {idx === 0 && (
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                          Product *
                        </label>
                      )}
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(idx, "productId", e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                        }}
                      >
                        <option value="">Select product</option>
                        {allProducts.map((p) => (
                          <option key={p._id || p.id} value={p._id || p.id}>
                            {p.name}
                            {p.sku ? ` [${p.sku}]` : ""}
                            {` · ₹${p.price} / ${p.unit || "pc"}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      {idx === 0 && (
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                          Qty *
                        </label>
                      )}
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      {idx === 0 && (
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                          Target Price (₹)
                        </label>
                      )}
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Optional"
                        value={item.requestedPrice}
                        onChange={(e) => updateItem(idx, "requestedPrice", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={formItems.length === 1}
                      style={{
                        background: formItems.length === 1 ? "#f3f4f6" : "#fef2f2",
                        color: formItems.length === 1 ? "#9ca3af" : "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        cursor: formItems.length === 1 ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ marginBottom: "20px", fontSize: "13px" }}
                onClick={addItem}
              >
                + Add Another Product
              </button>

              {/* MESSAGE */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Additional Message
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Any special requirements, delivery timeline, etc."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {submitError && (
                <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
                  {submitError}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Quote Request"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================
            QUOTES LIST
            ================================================== */}
        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>{error}</div>
        )}

        {actionError && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>{actionError}</div>
        )}

        {quotes.length === 0 && !showForm && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h2>No bulk quote requests yet</h2>
            <p>Submit a bulk quote request for wholesale pricing on large orders.</p>
            <button type="button" className="btn-primary" onClick={handleShowForm}>
              Request Bulk Quote →
            </button>
          </div>
        )}

        {quotes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {quotes.map((quote) => {
              const qId = quote?._id || quote?.id;
              const status = quote?.status || "pending";
              const style = getStatusStyle(status);
              const itemCount = Array.isArray(quote?.items) ? quote.items.length : 0;
              const expired = isExpired(quote);
              const busy = actionId === qId;
              const hasQuotedPrices =
                quote?.totalAmount !== null && quote?.totalAmount !== undefined;

              return (
                <article
                  key={qId}
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
                        BULK QUOTE
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: "17px", fontWeight: 700 }}>
                        {quote?.quoteNumber || `BQ-${qId}`}
                      </h3>
                    </div>

                    <span
                      style={{
                        background: style.bg,
                        color: style.color,
                        border: `1px solid ${style.border}`,
                        borderRadius: "999px",
                        padding: "4px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {fmtLabel(status)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Products</p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{itemCount}</p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Submitted</p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        {formatDate(quote?.createdAt)}
                      </p>
                    </div>

                    {quote?.validUntil && (status === "quoted" || status === "accepted") && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Valid until</p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: expired ? "#dc2626" : undefined,
                          }}
                        >
                          {formatDate(quote.validUntil)}
                          {expired ? " (expired)" : ""}
                        </p>
                      </div>
                    )}

                    {quote?.message && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Message</p>
                        <p style={{ margin: 0, fontSize: "14px" }}>{quote.message}</p>
                      </div>
                    )}

                    {quote?.adminNote && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Note from Shanti Enterprises</p>
                        <p style={{ margin: 0, fontSize: "14px" }}>{quote.adminNote}</p>
                      </div>
                    )}
                  </div>

                  {/* ITEMS */}
                  {Array.isArray(quote?.items) && quote.items.length > 0 && (
                    <div
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #f3f4f6",
                        borderRadius: "8px",
                        padding: "12px 16px",
                      }}
                    >
                      <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>
                        ITEMS
                      </p>
                      {quote.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "4px 0",
                            borderBottom: idx < quote.items.length - 1 ? "1px solid #e5e7eb" : "none",
                            fontSize: "13px",
                          }}
                        >
                          <span>
                            {item?.product?.name || item?.productName || "Product"} × {item?.quantity}
                            {item?.unit ? ` ${item.unit}` : ""}
                          </span>
                          {item?.quotedPrice != null ? (
                            <span style={{ fontWeight: 600 }}>
                              {formatCurrency(item.quotedPrice)} / {item?.unit || "unit"}
                              {" = "}
                              <span style={{ color: "#059669" }}>
                                {formatCurrency(
                                  Number(item.quotedPrice) * Number(item?.quantity || 0)
                                )}
                              </span>
                            </span>
                          ) : (
                            item?.requestedPrice != null && (
                              <span style={{ color: "#6b7280" }}>
                                Target: {formatCurrency(item.requestedPrice)}
                              </span>
                            )
                          )}
                        </div>
                      ))}

                      {/* Quoted price if available */}
                      {hasQuotedPrices && (
                        <div
                          style={{
                            marginTop: "8px",
                            paddingTop: "8px",
                            borderTop: "2px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          <span>Quoted Total</span>
                          <span style={{ color: "#059669" }}>
                            {formatCurrency(quote.totalAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==============================================
                      ACTIONS
                      ============================================== */}

                  {status === "quoted" && (
                    <div style={{ marginTop: "16px" }}>
                      {expired ? (
                        <p style={{ margin: 0, fontSize: "13px", color: "#dc2626" }}>
                          This quote has expired. Please submit a new bulk quote request.
                        </p>
                      ) : (
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleAccept(quote)}
                            disabled={busy}
                          >
                            {busy ? "Please wait..." : "Accept Quote"}
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setRejectQuote(quote)}
                            disabled={busy}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {status === "accepted" && (
                    <div style={{ marginTop: "16px" }}>
                      {quote?.order ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "12px",
                          }}
                        >
                          <span style={{ fontSize: "13px", color: "#059669", fontWeight: 600 }}>
                            Order placed: {quote.order.orderNumber}
                          </span>

                          <Link to={`/orders/${quote.order._id}`} className="btn-secondary">
                            View Order →
                          </Link>
                        </div>
                      ) : expired ? (
                        <p style={{ margin: 0, fontSize: "13px", color: "#dc2626" }}>
                          This quote expired before an order was placed. Please submit a new bulk quote request.
                        </p>
                      ) : (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => setOrderQuote(quote)}
                        >
                          Place Order →
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "32px" }}>
            <button type="button" className="btn-secondary" disabled={page <= 1 || loading} onClick={() => loadQuotes(page - 1)}>
              ← Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>
            <button type="button" className="btn-secondary" disabled={page >= totalPages || loading} onClick={() => loadQuotes(page + 1)}>
              Next →
            </button>
          </div>
        )}

      </div>

      {/* REJECT CONFIRM */}
      <ConfirmModal
        open={Boolean(rejectQuote)}
        title="Reject this quote?"
        message="You will not be able to place an order from this quote. You can always submit a new bulk quote request."
        confirmText="Yes, reject"
        variant="danger"
        loading={Boolean(actionId)}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectQuote(null)}
      />

      {/* PLACE ORDER */}
      {orderQuote && (
        <BulkQuoteOrderModal
          quote={orderQuote}
          onClose={() => setOrderQuote(null)}
        />
      )}
    </section>
  );
}

export default BulkQuotesPage;