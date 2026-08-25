// ============================================================
// SHANTI ENTERPRISES
// Cart Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// CART PAGE
// ============================================================

function CartPage() {
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    cartItems.length === 0
  ) {
    return (
      <section className="cart-page">

        <div className="cart-container">

          <div className="cart-page-header">

            <span className="cart-eyebrow">
              YOUR SHOPPING CART
            </span>

            <h1>
              Shopping Cart
            </h1>

            <p>
              Review your selected products
              before checkout.
            </p>

          </div>

          <div className="cart-empty-card">

            <div className="cart-empty-icon">
              🛒
            </div>

            <EmptyState
              title="Your cart is empty"
              message="Add products to your cart to continue."
            />

            <Link
              to="/products"
              className="cart-primary-button"
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
    <section className="cart-page">

      <div className="cart-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="cart-page-header">

          <div>

            <span className="cart-eyebrow">
              YOUR SHOPPING CART
            </span>

            <h1>
              Shopping Cart
            </h1>

            <p>
              Review your selected products
              before checkout.
            </p>

          </div>

          <div className="cart-items-count">

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
            CART CONTENT
            ================================================== */}

        <div className="cart-layout">

          {/* ==================================================
              ITEMS
              ================================================== */}

          <div className="cart-items-section">

            <div className="cart-items-header">

              <h2>
                Cart Items
              </h2>

              <button
                type="button"
                className="cart-clear-button"
                onClick={
                  clearCart
                }
              >
                Clear Cart
              </button>

            </div>

            <div className="cart-items-list">

              {cartItems.map(
                (item) => {

                  const itemPrice =
                    Number(
                      item.price
                    ) || 0;

                  const itemQuantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const itemMoq =
                    Number(
                      item.moq
                    ) || 1;

                  const itemTotal =
                    itemPrice *
                    itemQuantity;

                  return (
                    <article
                      className="cart-item"
                      key={
                        item.productId
                      }
                    >

                      {/* PRODUCT IMAGE */}

                      <Link
                        to={`/products/${item.productId}`}
                        className="cart-item-image-link"
                      >

                        <div className="cart-item-image">

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
                            <div className="cart-item-no-image">
                              SE
                            </div>
                          )}

                        </div>

                      </Link>

                      {/* PRODUCT INFO */}

                      <div className="cart-item-info">

                        <Link
                          to={`/products/${item.productId}`}
                          className="cart-item-name"
                        >
                          {item.name}
                        </Link>

                        <p className="cart-item-price">
                          ₹
                          {itemPrice.toLocaleString(
                            "en-IN"
                          )}
                          <span>
                            / unit
                          </span>
                        </p>

                        <p className="cart-item-moq">
                          Minimum Order:
                          {" "}
                          <strong>
                            {itemMoq}
                          </strong>
                          {" "}
                          unit
                          {itemMoq > 1
                            ? "s"
                            : ""}
                        </p>

                        {/* QUANTITY */}

                        <div className="cart-item-quantity-row">

                          <span>
                            Quantity
                          </span>

                          <div className="cart-quantity-control">

                            <button
                              type="button"
                              disabled={
                                itemQuantity <=
                                itemMoq
                              }
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(
                                    itemMoq,
                                    itemQuantity -
                                      1
                                  )
                                )
                              }
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min={
                                itemMoq
                              }
                              value={
                                itemQuantity
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(
                                    itemMoq,
                                    Number(
                                      event
                                        .target
                                        .value
                                    ) ||
                                      itemMoq
                                  )
                                )
                              }
                              aria-label="Cart quantity"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  itemQuantity +
                                    1
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* TOTAL + REMOVE */}

                      <div className="cart-item-actions">

                        <div className="cart-item-total">

                          <span>
                            Item Total
                          </span>

                          <strong>
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.productId
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="cart-continue-link"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* ==================================================
              SUMMARY
              ================================================== */}

          <aside className="cart-summary">

            <div className="cart-summary-header">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Cart Summary
              </h2>

            </div>

            <div className="cart-summary-row">

              <span>
                Total Items
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>

            <div className="cart-summary-row">

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

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <Link
              to="/checkout"
              className="cart-checkout-button"
            >
              Proceed to Checkout
            </Link>

            <p className="cart-summary-note">
              Review your address and order
              details during checkout.
            </p>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default CartPage;