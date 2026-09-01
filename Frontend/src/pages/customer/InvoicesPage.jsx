// ============================================================
// SHANTI ENTERPRISES
// Customer Invoices Page
// Frontend - Invoices
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyInvoices,
  createInvoice,
} from "../../api/invoiceApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

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
  issued:   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  paid:     { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  overdue:  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  cancelled:{ bg: "#f9fafb", color: "#6b7280", border: "#e5e7eb" },
};

const getStatusStyle = (status) =>
  STATUS_STYLE[status] || { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" };

// ============================================================
// INVOICES PAGE
// ============================================================

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================================
  // LOAD INVOICES
  // ==========================================================

  const loadInvoices = async (requestedPage = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyInvoices({ page: requestedPage, limit: 10 });
      setInvoices(response?.invoices || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load your invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(1);
  }, []);

  // ==========================================================
  // PRINT INVOICE
  // ==========================================================

  const handlePrint = () => {
    window.print();
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && invoices.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading your invoices..." />
        </div>
      </section>
    );
  }

  if (error && invoices.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage message={error} onRetry={() => loadInvoices(1)} />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="app-page">
      <div className="page-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>My Invoices</h1>
            <p>View and download invoices for your orders.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/orders" className="btn-secondary">
              ← My Orders
            </Link>
          </div>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
            {successMsg}
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* EMPTY */}
        {invoices.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧾</div>
            <h2>No invoices yet</h2>
            <p>Invoices will appear here after your orders are processed.</p>
            <Link to="/orders" className="btn-primary">
              View My Orders →
            </Link>
          </div>
        )}

        {/* INVOICE LIST */}
        {invoices.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {invoices.map((invoice) => {
              const invId = invoice?._id || invoice?.id;
              const status = invoice?.status || "issued";
              const style = getStatusStyle(status);
              const orderNumber =
                invoice?.order?.orderNumber || "—";
              const totalAmount = invoice?.totalAmount || 0;
              const issuedAt = invoice?.issuedAt || invoice?.createdAt;
              const paidAt = invoice?.paidAt;

              return (
                <article
                  key={invId}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  {/* TOP ROW */}
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
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#6b7280",
                        }}
                      >
                        INVOICE
                      </span>
                      <h3 style={{ margin: "2px 0 0", fontSize: "17px", fontWeight: 700 }}>
                        {invoice?.invoiceNumber || `INV-${invId}`}
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
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  {/* META GRID */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Order
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        #{orderNumber}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Amount
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1d4ed8",
                        }}
                      >
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Issued On
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                        {formatDate(issuedAt)}
                      </p>
                    </div>

                    {paidAt && (
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                          Paid On
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                          {formatDate(paidAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LINE ITEMS SUMMARY */}
                  {Array.isArray(invoice?.items) &&
                    invoice.items.length > 0 && (
                      <div
                        style={{
                          background: "#f9fafb",
                          border: "1px solid #f3f4f6",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          marginBottom: "16px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: "0.06em",
                          }}
                        >
                          ITEMS ({invoice.items.length})
                        </p>

                        {invoice.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "4px 0",
                              borderBottom:
                                idx < invoice.items.length - 1
                                  ? "1px solid #e5e7eb"
                                  : "none",
                              fontSize: "13px",
                            }}
                          >
                            <span>
                              {item?.productName || "Product"} × {item?.quantity || 1}
                            </span>
                            <span style={{ fontWeight: 600 }}>
                              {formatCurrency(item?.totalPrice || 0)}
                            </span>
                          </div>
                        ))}

                        {/* TOTALS */}
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
                          <span>Total</span>
                          <span style={{ color: "#1d4ed8" }}>
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* ACTIONS */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {invoice?.order?._id && (
                      <Link
                        to={`/orders/${invoice.order._id}`}
                        className="btn-secondary"
                        style={{ fontSize: "13px" }}
                      >
                        View Order
                      </Link>
                    )}

                    <button
                      type="button"
                      className="btn-primary"
                      style={{ fontSize: "13px" }}
                      onClick={handlePrint}
                    >
                      🖨 Print Invoice
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              disabled={page <= 1 || loading}
              onClick={() => loadInvoices(page - 1)}
            >
              ← Previous
            </button>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              className="btn-secondary"
              disabled={page >= totalPages || loading}
              onClick={() => loadInvoices(page + 1)}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default InvoicesPage;
