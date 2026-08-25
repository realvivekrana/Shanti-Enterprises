// ============================================================
// SHANTI ENTERPRISES
// Checkout Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

// ============================================================
// CHECKOUT PAGE
// ============================================================

function CheckoutPage() {
  const navigate =
    useNavigate();

  const {
    cartItems,
    totalItems,
    subtotal,
  } = useCart();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      cartItems.length === 0
    ) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError(
        "Please fill all delivery address fields."
      );

      return;
    }

    /*
      Payment/order API will be connected
      in the upcoming checkout steps.
    */

    navigate(
      "/checkout/summary",
      {
        state: {
          address: form,
        },
      }
    );
  };

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    cartItems.length === 0
  ) {
    return (
      <section className="checkout-page">

        <div className="checkout-container">

          <div className="checkout-empty-card">

            <div className="checkout-empty-icon">
              🛒
            </div>

            <span className="checkout-eyebrow">
              CHECKOUT
            </span>

            <h1>
              Your cart is empty
            </h1>

            <p>
              Add products to your cart
              before continuing to checkout.
            </p>

            <Link
              to="/products"
              className="checkout-primary-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="checkout-page">

      <div className="checkout-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="checkout-page-header">

          <div>

            <span className="checkout-eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>
              Checkout
            </h1>

            <p>
              Enter your delivery details
              to continue with your order.
            </p>

          </div>

          <div className="checkout-items-count">

            <strong>
              {totalItems}
            </strong>

            <span>
              {totalItems === 1
                ? "Item"
                : "Items"}
            </span>

          </div>

        </div>

        {/* ==================================================
            CHECKOUT STEPS
            ================================================== */}

        <div className="checkout-steps">

          <div className="checkout-step checkout-step-active">

            <span>
              1
            </span>

            <div>
              <strong>
                Delivery
              </strong>

              <small>
                Address
              </small>
            </div>

          </div>

          <div className="checkout-step-line" />

          <div className="checkout-step">

            <span>
              2
            </span>

            <div>
              <strong>
                Summary
              </strong>

              <small>
                Review order
              </small>
            </div>

          </div>

          <div className="checkout-step-line" />

          <div className="checkout-step">

            <span>
              3
            </span>

            <div>
              <strong>
                Payment
              </strong>

              <small>
                Complete order
              </small>
            </div>

          </div>

        </div>

        {/* ==================================================
            MAIN LAYOUT
            ================================================== */}

        <div className="checkout-layout">

          {/* ==================================================
              ADDRESS FORM
              ================================================== */}

          <div className="checkout-form-card">

            <div className="checkout-card-header">

              <div>

                <span>
                  DELIVERY DETAILS
                </span>

                <h2>
                  Delivery Address
                </h2>

              </div>

            </div>

            {error && (
              <div
                className="checkout-error"
                role="alert"
              >
                <span>
                  !
                </span>

                <p>
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* FULL NAME */}

              <div className="checkout-form-group">

                <label htmlFor="checkout-name">
                  Full Name
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

              {/* PHONE */}

              <div className="checkout-form-group">

                <label htmlFor="checkout-phone">
                  Phone Number
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter phone number"
                  autoComplete="tel"
                />

              </div>

              {/* ADDRESS */}

              <div className="checkout-form-group">

                <label htmlFor="checkout-address">
                  Address
                  <span>
                    *
                  </span>
                </label>

                <textarea
                  id="checkout-address"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House number, street, area"
                  rows="4"
                  autoComplete="street-address"
                />

              </div>

              {/* CITY + STATE */}

              <div className="checkout-form-row">

                <div className="checkout-form-group">

                  <label htmlFor="checkout-city">
                    City
                    <span>
                      *
                    </span>
                  </label>

                  <input
                    id="checkout-city"
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter city"
                    autoComplete="address-level2"
                  />

                </div>

                <div className="checkout-form-group">

                  <label htmlFor="checkout-state">
                    State
                    <span>
                      *
                    </span>
                  </label>

                  <input
                    id="checkout-state"
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter state"
                    autoComplete="address-level1"
                  />

                </div>

              </div>

              {/* PINCODE */}

              <div className="checkout-form-group">

                <label htmlFor="checkout-pincode">
                  Pincode
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="checkout-pincode"
                  type="text"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter 6-digit pincode"
                  inputMode="numeric"
                  maxLength="6"
                  autoComplete="postal-code"
                />

              </div>

              {/* ACTIONS */}

              <div className="checkout-form-actions">

                <Link
                  to="/cart"
                  className="checkout-back-button"
                >
                  ← Back to Cart
                </Link>

                <button
                  type="submit"
                  className="checkout-submit-button"
                >
                  Continue to Order Summary
                  <span>
                    →
                  </span>
                </button>

              </div>

            </form>

          </div>

          {/* ==================================================
              ORDER SUMMARY
              ================================================== */}

          <aside className="checkout-summary-card">

            <div className="checkout-summary-header">

              <span>
                YOUR ORDER
              </span>

              <h2>
                Order Summary
              </h2>

            </div>

            {/* ITEMS */}

            <div className="checkout-summary-items">

              {cartItems.map(
                (item) => {

                  const price =
                    Number(
                      item.price
                    ) || 0;

                  const quantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const itemTotal =
                    price *
                    quantity;

                  return (
                    <div
                      className="checkout-summary-item"
                      key={
                        item.productId
                      }
                    >

                      <div className="checkout-summary-item-image">

                        {item.image ? (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                          />
                        ) : (
                          <span>
                            SE
                          </span>
                        )}

                      </div>

                      <div className="checkout-summary-item-info">

                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          Qty:{" "}
                          {quantity}
                        </span>

                      </div>

                      <strong className="checkout-summary-item-price">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

            {/* TOTALS */}

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row">

              <span>
                Total Items
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-total">

              <span>
                Order Total
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="checkout-secure-note">

              <span>
                ✓
              </span>

              <p>
                Your order details will be
                reviewed before payment.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default CheckoutPage;