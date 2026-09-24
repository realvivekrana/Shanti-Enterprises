// ============================================================
// SHANTI ENTERPRISES
// Bulk Quote Order Modal
// Customer - place an order from an ACCEPTED bulk quote
// (address + payment method, quoted prices are fixed)
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
  useAddress,
} from "../../context/AddressContext";

import {
  createOrderFromBulkQuote,
} from "../../api/orderApi";

import "./BulkQuoteOrderModal.css";

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============================================================
// COMPONENT
// ============================================================

function BulkQuoteOrderModal({
  quote,
  onClose,
}) {
  const navigate = useNavigate();

  const {
    addresses,
    selectedAddressId,
    loading: addressesLoading,
  } = useAddress();

  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addressList = Array.isArray(addresses) ? addresses : [];

  const getAddressId = (address) =>
    String(address?._id || address?.id || "");

  // ==========================================================
  // DEFAULT ADDRESS
  // ==========================================================

  useEffect(() => {
    if (addressId && addressList.some((a) => getAddressId(a) === String(addressId))) {
      return;
    }

    const preferred =
      addressList.find((a) => getAddressId(a) === String(selectedAddressId)) ||
      addressList[0];

    setAddressId(getAddressId(preferred));
  }, [addressList, selectedAddressId, addressId]);

  // ==========================================================
  // ESC TO CLOSE + LOCK BODY SCROLL
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [submitting, onClose]);

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handlePlaceOrder = async () => {
    const address = addressList.find((a) => getAddressId(a) === String(addressId));

    if (!address) {
      setError("Please select a delivery address.");
      return;
    }

    const shippingAddress = {
      name: address.name?.trim(),
      phone: address.phone?.trim(),
      addressLine1: address.address?.trim(),
      addressLine2: address.addressLine2 || "",
      city: address.city?.trim(),
      state: address.state?.trim(),
      postalCode: address.pincode?.trim(),
      country: "India",
    };

    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      setError(
        "This address is incomplete. Please update it or choose another one."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await createOrderFromBulkQuote({
        bulkQuoteId: quote._id || quote.id,
        shippingAddress,
        paymentMethod,
      });

      const order = response?.order || response?.data?.order;
      const orderId = order?._id || order?.id;

      if (!orderId) {
        throw new Error("Order ID was not returned. Please check My Orders.");
      }

      if (paymentMethod === "cod") {
        navigate(`/order-success/${orderId}`, {
          replace: true,
          state: { paymentMethod: "cod" },
        });
      } else {
        navigate(`/payment/${orderId}`);
      }
    } catch (err) {
      console.error("Order from bulk quote error:", err);

      // 409 => order already exists for this quote
      const existingOrderId = err?.response?.data?.order?._id;

      if (err?.response?.status === 409 && existingOrderId) {
        navigate(`/orders/${existingOrderId}`);
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to place the order."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  const items = Array.isArray(quote?.items) ? quote.items : [];

  return (
    <div
      className="bqo-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose?.();
        }
      }}
    >
      <div
        className="bqo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bqo-title"
      >
        {/* HEADER */}

        <div className="bqo-header">
          <div>
            <span className="bqo-eyebrow">WHOLESALE ORDER</span>
            <h2 id="bqo-title">Place order — {quote?.quoteNumber}</h2>
          </div>

          <button
            type="button"
            className="bqo-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="bqo-body">
          {error && (
            <div className="bqo-error" role="alert">
              {error}
            </div>
          )}

          {/* ITEMS */}

          <section className="bqo-section">
            <h3>Items (agreed prices)</h3>

            <div className="bqo-items">
              {items.map((item, index) => (
                <div className="bqo-item" key={index}>
                  <span>
                    {item?.product?.name || item?.productName || "Product"} ×{" "}
                    {item?.quantity}
                    {item?.unit ? ` ${item.unit}` : ""}
                  </span>

                  <strong>
                    {formatCurrency(
                      Number(item?.quotedPrice || 0) *
                        Number(item?.quantity || 0)
                    )}
                  </strong>
                </div>
              ))}

              <div className="bqo-item bqo-total">
                <span>Total</span>
                <strong>{formatCurrency(quote?.totalAmount)}</strong>
              </div>
            </div>
          </section>

          {/* ADDRESS */}

          <section className="bqo-section">
            <h3>Delivery address</h3>

            {addressesLoading && addressList.length === 0 ? (
              <p className="bqo-muted">Loading addresses...</p>
            ) : addressList.length === 0 ? (
              <div className="bqo-empty">
                <p>You have no saved delivery address yet.</p>

                <Link to="/checkout/address" className="bqo-link">
                  Add an address →
                </Link>
              </div>
            ) : (
              <div className="bqo-options">
                {addressList.map((address) => (
                  <label
                    key={getAddressId(address)}
                    className={`bqo-option ${
                      addressId === getAddressId(address) ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="bqo-address"
                      checked={addressId === getAddressId(address)}
                      onChange={() => setAddressId(getAddressId(address))}
                      disabled={submitting}
                    />

                    <span>
                      <strong>{address.name}</strong>
                      <small>{address.phone}</small>
                      <small>
                        {[
                          address.address,
                          address.city,
                          address.state,
                          address.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* PAYMENT */}

          <section className="bqo-section">
            <h3>Payment method</h3>

            <div className="bqo-options">
              <label
                className={`bqo-option ${
                  paymentMethod === "razorpay" ? "is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="bqo-payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  disabled={submitting}
                />

                <span>
                  <strong>Online payment</strong>
                  <small>UPI, cards, net banking</small>
                </span>
              </label>

              <label
                className={`bqo-option ${
                  paymentMethod === "cod" ? "is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="bqo-payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  disabled={submitting}
                />

                <span>
                  <strong>Cash on delivery</strong>
                  <small>Pay when the order arrives</small>
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* FOOTER */}

        <div className="bqo-footer">
          <button
            type="button"
            className="bqo-btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="bqo-btn bqo-btn--primary"
            onClick={handlePlaceOrder}
            disabled={submitting || !addressId}
          >
            {submitting
              ? "Placing order..."
              : `Place order · ${formatCurrency(quote?.totalAmount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkQuoteOrderModal;