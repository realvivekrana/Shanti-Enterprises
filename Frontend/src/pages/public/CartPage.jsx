// ============================================================
// SHANTI ENTERPRISES
// Cart Page
// Frontend Phase 6 - Complete UI/UX
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

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// IMAGE URL HELPER
// ============================================================

const getImageUrl = (
  image
) => {
  if (!image) {
    return "";
  }

  if (
    typeof image === "string"
  ) {
    return image;
  }

  return (
    image.url ||
    image.secure_url ||
    image.src ||
    ""
  );
};

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

  const navigate =
    useNavigate();

  const [
    imageErrors,
    setImageErrors,
  ] = useState({});

  const [
    removingProductId,
    setRemovingProductId,
  ] = useState(null);

  const [
    clearingCart,
    setClearingCart,
  ] = useState(false);

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemove = async (
    productId
  ) => {
    if (
      removingProductId
    ) {
      return;
    }

    try {
      setRemovingProductId(
        productId
      );

      await removeFromCart(
        productId
      );
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );
    } finally {
      setRemovingProductId(
        null
      );
    }
  };

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const handleClearCart =
    async () => {
      if (
        clearingCart ||
        cartItems.length === 0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to remove all items from your cart?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setClearingCart(
          true
        );

        await clearCart();
      } catch (error) {
        console.error(
          "Clear cart error:",
          error
        );
      } finally {
        setClearingCart(
          false
        );
      }
    };

  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError =
    (productId) => {
      setImageErrors(
        (current) => ({
          ...current,
          [productId]: true,
        })
      );
    };

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const handleQuantityChange =
    (
      item,
      requestedQuantity
    ) => {
      const moq =
        Number(
          item.moq
        ) || 1;

      const stock =
        Number(
          item.stock ??
            item.countInStock ??
            item.inventory
        );

      let nextQuantity =
        Number(
          requestedQuantity
        );

      if (
        Number.isNaN(
          nextQuantity
        ) ||
        nextQuantity < moq
      ) {
        nextQuantity = moq;
      }

      if (
        Number.isFinite(stock) &&
        stock > 0
      ) {
        nextQuantity =
          Math.min(
            nextQuantity,
            stock
          );
      }

      updateQuantity(
        item.productId,
        nextQuantity
      );
    };

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    cartItems.length === 0
  ) {
    return (
      <section className="cart-page">

        <div className="cart-container">

          <header className="cart-page-header">

            <div className="cart-header-content">

              <span className="cart-eyebrow">
                YOUR SHOPPING CART
              </span>

              <h1>
                Shopping Cart
              </h1>

              <p>
                Your cart is waiting for
                some great products.
              </p>

            </div>

            <div className="cart-items-count cart-items-count-empty">

              <strong>
                0
              </strong>

              <span>
                Items
              </span>

            </div>

          </header>

          <div className="cart-empty-card">

            <div className="cart-empty-icon">
              🛒
            </div>

            <EmptyState
              title="Your cart is empty"
              message="Add products to your cart to continue shopping."
            />

            <Link
              to="/products"
              className="cart-primary-button"
            >
              Browse Products
              <span>
                →
              </span>
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <section className="cart-page">

      <div className="cart-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="cart-page-header">

          <div className="cart-header-content">

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

        </header>

        {/* ==================================================
            CART CONTENT
            ================================================== */}

        <div className="cart-layout">

          {/* ==================================================
              ITEMS
              ================================================== */}

          <div className="cart-items-section">

            <div className="cart-items-header">

              <div>

                <span className="cart-section-eyebrow">
                  SELECTED PRODUCTS
                </span>

                <h2>
                  Cart Items
                </h2>

              </div>

              <button
                type="button"
                className="cart-clear-button"
                onClick={
                  handleClearCart
                }
                disabled={
                  clearingCart
                }
              >
                {clearingCart
                  ? "Clearing..."
                  : "Clear Cart"}
              </button>

            </div>

            <div className="cart-items-list">

              {cartItems.map(
                (item) => {

                  const itemId =
                    item.productId;

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

                  const itemStock =
                    Number(
                      item.stock ??
                        item.countInStock ??
                        item.inventory
                    );

                  const hasStockLimit =
                    Number.isFinite(
                      itemStock
                    ) &&
                    itemStock > 0;

                  const itemTotal =
                    itemPrice *
                    itemQuantity;

                  const image =
                    getImageUrl(
                      item.image
                    );

                  const imageFailed =
                    imageErrors[
                      itemId
                    ];

                  const canDecrease =
                    itemQuantity >
                    itemMoq;

                  const canIncrease =
                    !hasStockLimit ||
                    itemQuantity <
                      itemStock;

                  return (
                    <article
                      className="cart-item"
                      key={itemId}
                    >

                      {/* PRODUCT IMAGE */}

                      <Link
                        to={`/products/${itemId}`}
                        className="cart-item-image-link"
                        aria-label={`View ${item.name}`}
                      >

                        <div className="cart-item-image">

                          {image &&
                          !imageFailed ? (
                            <img
                              src={image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              loading="lazy"
                              onError={() =>
                                handleImageError(
                                  itemId
                                )
                              }
                            />
                          ) : (
                            <div className="cart-item-no-image">

                              <span>
                                SE
                              </span>

                              <small>
                                No Image
                              </small>

                            </div>
                          )}

                        </div>

                      </Link>

                      {/* PRODUCT INFORMATION */}

                      <div className="cart-item-info">

                        <div className="cart-item-top-line">

                          {item.category && (
                            <span className="cart-item-category">
                              {typeof item.category ===
                              "object"
                                ? item.category?.name
                                : item.category}
                            </span>
                          )}

                          {hasStockLimit && (
                            <span className="cart-item-stock-badge">
                              {itemStock}{" "}
                              available
                            </span>
                          )}

                        </div>

                        <Link
                          to={`/products/${itemId}`}
                          className="cart-item-name"
                        >
                          {item.name ||
                            "Product"}
                        </Link>

                        <p className="cart-item-price">

                          ₹
                          {itemPrice.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                          <span>
                            / unit
                          </span>

                        </p>

                        <p className="cart-item-moq">

                          Minimum Order:{" "}

                          <strong>
                            {itemMoq}
                          </strong>{" "}

                          {itemMoq === 1
                            ? "unit"
                            : "units"}

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
                                !canDecrease
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  itemQuantity -
                                    1
                                )
                              }
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min={
                                itemMoq
                              }
                              max={
                                hasStockLimit
                                  ? itemStock
                                  : undefined
                              }
                              value={
                                itemQuantity
                              }
                              onChange={(
                                event
                              ) =>
                                handleQuantityChange(
                                  item,
                                  event
                                    .target
                                    .value
                                )
                              }
                              aria-label={`${item.name} quantity`}
                            />

                            <button
                              type="button"
                              disabled={
                                !canIncrease
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  itemQuantity +
                                    1
                                )
                              }
                              aria-label={`Increase ${item.name} quantity`}
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
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>

                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            handleRemove(
                              itemId
                            )
                          }
                          disabled={
                            removingProductId ===
                            itemId
                          }
                        >
                          {removingProductId ===
                          itemId
                            ? "Removing..."
                            : "Remove"}
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
              <span>
                ←
              </span>

              Continue Shopping
            </Link>

          </div>

          {/* ==================================================
              ORDER SUMMARY
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

            <div className="cart-summary-highlight">

              <span>
                Items in cart
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
                {Number(
                  subtotal || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

            <div className="cart-summary-row">

              <span>
                Shipping
              </span>

              <strong>
                Calculated at checkout
              </strong>

            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">

              <span>
                Estimated Total
              </span>

              <strong>
                ₹
                {Number(
                  subtotal || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

            {/* CHECKOUT */}

            <Link
              to="/checkout"
              className="cart-checkout-button"
            >
              <span>
                Proceed to Checkout
              </span>

              <span>
                →
              </span>
            </Link>

            {/* CONTINUE */}

            <button
              type="button"
              className="cart-summary-products-button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              Continue Shopping
            </button>

            <div className="cart-summary-trust">

              <span>
                ✓
              </span>

              <p>
                Review your address,
                quantities and order details
                before placing the order.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default CartPage;