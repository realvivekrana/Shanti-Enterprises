// ============================================================
// SHANTI ENTERPRISES
// Admin RFQ Details + Quotation Page
// Admin - Wholesale RFQ Management
// ============================================================

import "./AdminRFQDetailsPage.css";

import { useCallback, useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  cancelAdminRFQ,
  getAdminRFQById,
  updateAdminRFQStatus,
} from "../../api/rfqApi";

import { createAdminQuotation } from "../../api/quotationApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "reviewing",
    label: "Under Review",
  },
  {
    value: "quoted",
    label: "Quoted",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

// ============================================================
// HELPERS
// ============================================================


const getRFQNumber = (rfq) => rfq?.rfqNumber || "RFQ";

const getCustomer = (rfq) =>
  rfq?.customer || rfq?.user || rfq?.createdBy || null;

const getCustomerName = (rfq) => {
  const customer = getCustomer(rfq);

  if (typeof customer === "string") {
    return customer;
  }

  return (
    customer?.name || customer?.fullName || customer?.username || "Customer"
  );
};

const getCustomerEmail = (rfq) => {
  const customer = getCustomer(rfq);

  if (typeof customer === "object" && customer) {
    return customer.email || "";
  }

  return rfq?.customerEmail || rfq?.email || "";
};

const getCustomerPhone = (rfq) => {
  const customer = getCustomer(rfq);

  if (typeof customer === "object" && customer) {
    return customer.phone || customer.mobile || customer.phoneNumber || "";
  }

  return rfq?.customerPhone || rfq?.phone || "";
};

const getProductName = (item) =>
  item?.product?.name || item?.product?.title || item?.productName || "Product";

const getProductImage = (item) => {
  const product = item?.product;

  if (!product) {
    return "";
  }

  if (Array.isArray(product.images) && product.images.length) {
    const image = product.images[0];

    if (typeof image === "string") {
      return image;
    }

    return image?.url || image?.secure_url || "";
  }

  if (typeof product.image === "string") {
    return product.image;
  }

  return product.image?.url || product.image?.secure_url || "";
};

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

const getStatusLabel = (status) =>
  STATUS_OPTIONS.find((option) => option.value === status)?.label ||
  status ||
  "Unknown";

const getTotalQuantity = (items = []) =>
  items.reduce((total, item) => total + Number(item?.quantity || 0), 0);

// ============================================================
// COMPONENT
// ============================================================

function AdminRFQDetailsPage() {
  const { rfqId } = useParams();

  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfq, setRFQ] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isCancelling, setIsCancelling] = useState(false);

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================================
  // QUOTATION STATE
  // ==========================================================

  const [quotationPrices, setQuotationPrices] = useState({});

  const [quotationNote, setQuotationNote] = useState("");

  const [quotationValidUntil, setQuotationValidUntil] = useState("");

  const [isCreatingQuotation, setIsCreatingQuotation] = useState(false);

  const [createdQuotation, setCreatedQuotation] = useState(null);

  // ==========================================================
  // LOAD RFQ
  // ==========================================================

  const loadRFQ = useCallback(async () => {
    if (!rfqId) {
      setError("RFQ ID is missing.");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAdminRFQById(rfqId);

      const receivedRFQ =
        response?.rfq || response?.data?.rfq || response?.data || null;

      if (!receivedRFQ) {
        setRFQ(null);

        setError("RFQ could not be found.");

        return;
      }

      setRFQ(receivedRFQ);

      setSelectedStatus(receivedRFQ.status || "pending");
    } catch (err) {
      console.error("Admin RFQ details error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load RFQ details.",
      );
    } finally {
      setLoading(false);
    }
  }, [rfqId]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRFQ();
  }, [loadRFQ]);

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusUpdate = async () => {
    if (!rfqId || !selectedStatus || isUpdatingStatus) {
      return;
    }

    if (selectedStatus === rfq?.status) {
      setSuccessMessage("RFQ status is already set to this value.");

      return;
    }

    try {
      setIsUpdatingStatus(true);

      setError("");
      setSuccessMessage("");

      const response = await updateAdminRFQStatus(rfqId, selectedStatus);

      const updatedRFQ =
        response?.rfq || response?.data?.rfq || response?.data || null;

      if (updatedRFQ) {
        setRFQ(updatedRFQ);

        setSelectedStatus(updatedRFQ.status || selectedStatus);
      } else {
        setRFQ((currentRFQ) =>
          currentRFQ
            ? {
                ...currentRFQ,
                status: selectedStatus,
              }
            : currentRFQ,
        );
      }

      setSuccessMessage("RFQ status updated successfully.");
    } catch (err) {
      console.error("Update RFQ status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to update RFQ status.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ==========================================================
  // CANCEL RFQ
  // ==========================================================

  const handleCancelRFQ = async () => {
    if (!rfqId || isCancelling) {
      return;
    }

    try {
      setIsCancelling(true);

      setError("");
      setSuccessMessage("");

      const response = await cancelAdminRFQ(rfqId);

      const updatedRFQ =
        response?.rfq || response?.data?.rfq || response?.data || null;

      if (updatedRFQ) {
        setRFQ(updatedRFQ);

        setSelectedStatus(updatedRFQ.status || "cancelled");
      } else {
        setRFQ((currentRFQ) =>
          currentRFQ
            ? {
                ...currentRFQ,
                status: "cancelled",
              }
            : currentRFQ,
        );

        setSelectedStatus("cancelled");
      }

      setShowCancelConfirmation(false);

      setSuccessMessage("RFQ cancelled successfully.");
    } catch (err) {
      console.error("Cancel admin RFQ error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to cancel RFQ.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // ==========================================================
  // QUOTATION PRICE CHANGE
  // ==========================================================

  const handleQuotationPriceChange = (productId, value) => {
    setQuotationPrices((currentPrices) => ({
      ...currentPrices,
      [productId]: value,
    }));
  };

  // ==========================================================
  // QUOTATION TOTAL
  // ==========================================================

  const getQuotationItemTotal = (item) => {
    const productId =
      item?.product?._id || item?.product || item?.productId || "";

    const quantity = Number(item?.quantity || 0);

    const unitPrice = Number(quotationPrices[productId] || 0);

    return quantity * unitPrice;
  };

  const quotationSubtotal = items.reduce(
    (total, item) => total + getQuotationItemTotal(item),
    0,
  );

  // ==========================================================
  // CREATE QUOTATION
  // ==========================================================

  const handleCreateQuotation = async () => {
    if (!rfqId || !items.length || isCreatingQuotation) {
      return;
    }

    setError("");
    setSuccessMessage("");

    const quotationItems = items.map((item) => {
      const productId =
        item?.product?._id || item?.product || item?.productId || "";

      return {
        productId,
        quantity: Number(item?.quantity || 0),
        unitPrice: Number(quotationPrices[productId] || 0),
      };
    });

    const invalidItem = quotationItems.find(
      (item) =>
        !item.productId ||
        item.quantity < 1 ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0,
    );

    if (invalidItem) {
      setError("Please enter a valid unit price for every requested product.");

      return;
    }

    if (!quotationValidUntil) {
      setError("Please select a quotation validity date.");

      return;
    }

    const validUntilDate = new Date(`${quotationValidUntil}T23:59:59`);

    if (Number.isNaN(validUntilDate.getTime())) {
      setError("Please select a valid quotation expiry date.");

      return;
    }

    if (validUntilDate < new Date()) {
      setError("Quotation validity date must be in the future.");

      return;
    }

    try {
      setIsCreatingQuotation(true);

      const response = await createAdminQuotation({
        rfqId,
        items: quotationItems,
        note: quotationNote.trim(),
        validUntil: validUntilDate.toISOString(),
      });

      const quotation =
        response?.quotation ||
        response?.data?.quotation ||
        response?.data ||
        null;

      setCreatedQuotation(quotation);

      setSuccessMessage(response?.message || "Quotation created successfully.");

      // The backend changes the related RFQ
      // to quoted when quotation creation succeeds.
      setRFQ((currentRFQ) =>
        currentRFQ
          ? {
              ...currentRFQ,
              status: "quoted",
            }
          : currentRFQ,
      );

      setSelectedStatus("quoted");
    } catch (err) {
      console.error("Create quotation error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to create quotation.",
      );
    } finally {
      setIsCreatingQuotation(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="app-page admin-rfq-details-page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>

            <h1>RFQ Details</h1>

            <p>Loading RFQ...</p>
          </div>
        </div>

        <Loading message="Loading RFQ details..." />
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !rfq) {
    return (
      <div className="app-page admin-rfq-details-page">
        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>

            <h1>RFQ Details</h1>
          </div>
        </div>

        <ErrorMessage message={error} onRetry={loadRFQ} />

        <div className="rfq-details-back" style={{ marginTop: "16px" }}>
          <Link to="/admin/rfqs">← Back to RFQs</Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const rfqNumber = getRFQNumber(rfq);

  const currentStatus = rfq?.status || "pending";

  const items = Array.isArray(rfq?.items) ? rfq.items : [];

  const totalQuantity = getTotalQuantity(items);

  const customerName = getCustomerName(rfq);

  const customerEmail = getCustomerEmail(rfq);

  const customerPhone = getCustomerPhone(rfq);

  const canCancel = !["cancelled", "accepted", "rejected"].includes(
    currentStatus,
  );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-rfq-details-page">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="page-header">
        <div>
          <span className="page-eyebrow">ADMIN · WHOLESALE</span>

          <h1>{rfqNumber}</h1>

          <p>Review customer requirements and manage this RFQ.</p>
        </div>

        <Link className="back-link" to="/admin/rfqs">
          ← All RFQs
        </Link>
      </div>

      {/* ======================================================
          SUCCESS
          ====================================================== */}

      {successMessage && (
        <div
          role="status"
          className="alert-success"
          style={{ marginBottom: "20px" }}
        >
          {successMessage}
        </div>
      )}

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && <ErrorMessage message={error} />}

      {/* ======================================================
          TOP SUMMARY
          ====================================================== */}

      <section className="details-grid" style={{ marginBottom: "20px" }}>
        <div className="detail-card card">
          <span className="detail-label">Status</span>

          <strong>{getStatusLabel(currentStatus)}</strong>
        </div>

        <div className="detail-card card">
          <span className="detail-label">Products</span>

          <strong>{items.length}</strong>
        </div>

        <div className="detail-card card">
          <span className="detail-label">Total Quantity</span>

          <strong>{totalQuantity}</strong>
        </div>

        <div className="detail-card card">
          <span className="detail-label">Submitted</span>

          <strong>{formatDateTime(rfq?.createdAt)}</strong>
        </div>
      </section>

      {/* ======================================================
          MAIN GRID
          ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ====================================================
            LEFT
            ==================================================== */}

        <div>
          {/* CUSTOMER */}

          <section className="card" style={{ marginBottom: "20px" }}>
            <h2>Customer Details</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <span className="detail-label">Name</span>

                <strong>{customerName}</strong>
              </div>

              <div>
                <span className="detail-label">Email</span>

                <strong>{customerEmail || "—"}</strong>
              </div>

              <div>
                <span className="detail-label">Phone</span>

                <strong>{customerPhone || "—"}</strong>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}

          <section className="card" style={{ marginBottom: "20px" }}>
            <h2>Requested Products</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {items.length === 0 ? (
                <div className="empty-state">No products found.</div>
              ) : (
                items.map((item, index) => {
                  const image = getProductImage(item);

                  return (
                    <article
                      key={item?._id || item?.productId || index}
                      className="rfq-product-card"
                    >
                      <div className="rfq-product-thumb">
                        {image ? (
                          <img src={image} alt={getProductName(item)} />
                        ) : (
                          <div className="rfq-product-thumb-placeholder">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="rfq-product-info">
                        <h3>{getProductName(item)}</h3>

                        <p>
                          Quantity: <strong>{item?.quantity}</strong>
                        </p>

                        {item?.unit && (
                          <p>
                            Unit: <strong>{item.unit}</strong>
                          </p>
                        )}

                        {item?.note && (
                          <div className="rfq-product-note">
                            <span className="detail-label">
                              Product Requirement
                            </span>

                            <p style={{ margin: 0, lineHeight: 1.5 }}>
                              {item.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* ======================================================
              CREATE QUOTATION
              ====================================================== */}

          {currentStatus !== "cancelled" &&
            currentStatus !== "accepted" &&
            currentStatus !== "rejected" &&
            !createdQuotation && (
              <section className="card" style={{ marginBottom: "20px" }}>
                <div className="section-intro">
                  <span className="detail-label">ADMIN QUOTATION</span>

                  <h2>Create Quotation</h2>

                  <p>
                    Enter the wholesale unit price for every requested product.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {items.map((item, index) => {
                    const productId =
                      item?.product?._id ||
                      item?.product ||
                      item?.productId ||
                      `item-${index}`;

                    const quantity = Number(item?.quantity || 0);

                    const unitPrice = Number(quotationPrices[productId] || 0);

                    const itemTotal = quantity * unitPrice;

                    return (
                      <div key={productId} className="quotation-item-row">
                        <div>
                          <strong className="item-name">
                            {getProductName(item)}
                          </strong>

                          <span className="item-meta">
                            Requested: {quantity}
                            {item?.unit ? ` ${item.unit}` : ""}
                          </span>
                        </div>

                        <div>
                          <label
                            htmlFor={`quotation-price-${productId}`}
                            className="detail-label"
                          >
                            Unit Price
                          </label>

                          <input
                            id={`quotation-price-${productId}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={quotationPrices[productId] ?? ""}
                            onChange={(event) =>
                              handleQuotationPriceChange(
                                productId,
                                event.target.value,
                              )
                            }
                            placeholder="0.00"
                            disabled={isCreatingQuotation}
                          />
                        </div>

                        <div>
                          <span className="detail-label">Total</span>

                          <strong className="item-total">
                            ₹
                            {itemTotal.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* QUOTATION NOTE */}

                <div style={{ marginTop: "18px" }}>
                  <label htmlFor="quotation-note" className="field-label">
                    Quotation Note
                  </label>

                  <textarea
                    id="quotation-note"
                    value={quotationNote}
                    onChange={(event) => setQuotationNote(event.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Add pricing terms, delivery information, payment terms or any other note..."
                    disabled={isCreatingQuotation}
                  />

                  <div className="char-count">{quotationNote.length}/1000</div>
                </div>

                {/* VALID UNTIL */}

                <div style={{ marginTop: "14px", maxWidth: "280px" }}>
                  <label
                    htmlFor="quotation-valid-until"
                    className="field-label"
                  >
                    Valid Until
                  </label>

                  <input
                    id="quotation-valid-until"
                    type="date"
                    value={quotationValidUntil}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(event) =>
                      setQuotationValidUntil(event.target.value)
                    }
                    disabled={isCreatingQuotation}
                  />
                </div>

                {/* TOTAL */}

                <div className="quotation-total-row">
                  <div className="row-inner">
                    <span>Quotation Total</span>

                    <strong>
                      ₹
                      {quotationSubtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                </div>

                {/* CREATE BUTTON */}

                <button
                  type="button"
                  className="create-quotation-btn"
                  onClick={handleCreateQuotation}
                  disabled={isCreatingQuotation || !items.length}
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  {isCreatingQuotation
                    ? "Creating Quotation..."
                    : "Create Quotation"}
                </button>
              </section>
            )}

          {/* ======================================================
              CREATED QUOTATION
              ====================================================== */}

          {createdQuotation && (
            <section className="quotation-created-panel">
              <span className="detail-label">QUOTATION CREATED</span>

              <h2>{createdQuotation.quotationNumber || "Quotation created"}</h2>

              <div className="quotation-created-grid">
                <div>
                  <span className="detail-label">Status</span>

                  <strong>{createdQuotation.status || "sent"}</strong>
                </div>

                <div>
                  <span className="detail-label">Total Amount</span>

                  <strong>
                    ₹
                    {Number(
                      createdQuotation.totalAmount || quotationSubtotal,
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">Valid Until</span>

                  <strong>{formatDateTime(createdQuotation.validUntil)}</strong>
                </div>
              </div>
            </section>
          )}

          {/* OVERALL REQUIREMENT */}

          {rfq?.message && (
            <section className="card" style={{ marginBottom: "20px" }}>
              <h2>Overall Requirement</h2>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {rfq.message}
              </p>
            </section>
          )}
        </div>

        {/* ====================================================
            RIGHT SIDEBAR
            ==================================================== */}

        <aside
          style={{
            position: "sticky",
            top: "20px",
          }}
        >
          {/* STATUS */}

          <section className="card" style={{ marginBottom: "16px" }}>
            <h2>Manage Status</h2>

            <label
              htmlFor="admin-rfq-status"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              RFQ Status
            </label>

            <select
              id="admin-rfq-status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              disabled={isUpdatingStatus || isCancelling || isCreatingQuotation}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={
                isUpdatingStatus ||
                isCancelling ||
                selectedStatus === currentStatus
              }
              style={{ width: "100%", marginTop: "12px" }}
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </button>
          </section>

          {/* QUOTATION STATUS */}

          {createdQuotation && (
            <section className="card" style={{ marginBottom: "16px" }}>
              <h2>Quotation</h2>

              <p style={{ margin: "0 0 12px", color: "var(--rfq-muted)" }}>
                A quotation has been created for this RFQ.
              </p>

              <strong>{createdQuotation.quotationNumber || "Quotation"}</strong>
            </section>
          )}

          {/* RFQ INFORMATION */}

          <section className="card" style={{ marginBottom: "16px" }}>
            <h2>RFQ Information</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div>
                <span className="detail-label">RFQ Number</span>

                <strong>{rfqNumber}</strong>
              </div>

              <div>
                <span className="detail-label">Created</span>

                <strong>{formatDateTime(rfq?.createdAt)}</strong>
              </div>

              <div>
                <span className="detail-label">Updated</span>

                <strong>{formatDateTime(rfq?.updatedAt)}</strong>
              </div>
            </div>
          </section>

          {/* CANCEL */}

          {canCancel && (
            <section className="danger-zone">
              <h3>Danger Zone</h3>

              <p>Cancel this RFQ if it should no longer be processed.</p>

              <button
                type="button"
                onClick={() => setShowCancelConfirmation(true)}
                disabled={isCancelling || isUpdatingStatus}
              >
                Cancel RFQ
              </button>
            </section>
          )}
        </aside>
      </div>

      {/* ======================================================
          CANCEL MODAL
          ====================================================== */}

      <ConfirmModal
        open={showCancelConfirmation}
        title="Cancel RFQ?"
        message={
          <>
            Are you sure you want to cancel <strong>{rfqNumber}</strong>?
          </>
        }
        confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel"}
        cancelText="Keep RFQ"
        variant="danger"
        loading={isCancelling}
        onConfirm={handleCancelRFQ}
        onCancel={() => setShowCancelConfirmation(false)}
      />
    </div>
  );
}

export default AdminRFQDetailsPage;