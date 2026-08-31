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
    image?.url ||
    image?.secure_url ||
    image?.src ||
    ""
  );
};

// ============================================================
// CART PAGE
// ============================================================

function CartPage() {
  const {
    cartItems = [],
    totalItems = 0,
    subtotal = 0,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate =
    useNavigate();

  // ==========================================================
  // UI STATE
  // ==========================================================

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

  const [
    quantityErrors,
    setQuantityErrors,
  ] = useState({});

  // ==========================================================
  // GET PRODUCT ID
  // ==========================================================

  const getProductId = (
    item
  ) => {
    return (
      item?.productId ||
      item?._id ||
      item?.product?._id ||
      item?.product?.id ||
      item?.product ||
      item?.id ||
      ""
    );
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemove = async (
    productId
  ) => {
    if (
      !productId ||
      removingProductId
    ) {
      return;
    }

    try {
      setRemovingProductId(
        productId
      );

      setQuantityErrors(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[
            productId
          ];

          return updated;
        }
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

        setQuantityErrors({});
        setImageErrors({});
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
      if (!productId) {
        return;
      }

      setImageErrors(
        (current) => ({
          ...current,
          [productId]: true,
        })
      );
    };

  // ==========================================================
  // QUANTITY CHANGE
  // ==========================================================

  const handleQuantityChange =
    (
      item,
      requestedQuantity
    ) => {
      const productId =
        getProductId(item);

      if (!productId) {
        return;
      }

      const moq =
        Math.max(
          1,
          Number(
            item?.moq ??
              item?.minimumOrderQuantity ??
              item?.minOrderQuantity ??
              1
          ) || 1
        );

      const rawStock =
        Number(
          item?.stock ??
            item?.countInStock ??
            item?.inventory
        );

      const hasStockLimit =
        Number.isFinite(
          rawStock
        ) &&
        rawStock >= 0;

      let nextQuantity =
        Number(
          requestedQuantity
        );

      // --------------------------------------------------------
      // INVALID VALUE
      // --------------------------------------------------------

      if (
        !Number.isFinite(
          nextQuantity
        )
      ) {
        setQuantityErrors(
          (current) => ({
            ...current,
            [productId]:
              `Quantity must be at least ${moq}.`,
          })
        );

        return;
      }

      // --------------------------------------------------------
      // MOQ
      // --------------------------------------------------------

      if (
        nextQuantity < moq
      ) {
        nextQuantity = moq;
      }

      // --------------------------------------------------------
      // STOCK
      // --------------------------------------------------------

      if (
        hasStockLimit
      ) {
        if (rawStock <= 0) {
          setQuantityErrors(
            (current) => ({
              ...current,
              [productId]:
                "This product is currently out of stock.",
            })
          );

          return;
        }

        if (
          nextQuantity >
          rawStock
        ) {
          nextQuantity =
            rawStock;

          setQuantityErrors(
            (current) => ({
              ...current,
              [productId]:
                `Only ${rawStock} unit${
                  rawStock === 1
                    ? ""
                    : "s"
                } available.`,
            })
          );
        } else {
          setQuantityErrors(
            (current) => {
              const updated = {
                ...current,
              };

              delete updated[
                productId
              ];

              return updated;
            }
          );
        }
      } else {
        setQuantityErrors(
          (current) => {
            const updated = {
              ...current,
            };

            delete updated[
              productId
            ];

            return updated;
          }
        );
      }

      updateQuantity(
        productId,
        nextQuantity
      );
    };

  // ==========================================================
  // INCREASE QUANTITY
  // ==========================================================

  const handleIncrease =
    (item) => {
      const currentQuantity =
        Number(
          item?.quantity
        ) || 0;

      handleQuantityChange(
        item,
        currentQuantity + 1
      );
    };

  // ==========================================================
  // DECREASE QUANTITY
  // ==========================================================

  const handleDecrease =
    (item) => {
      const currentQuantity =
        Number(
          item?.quantity
        ) || 0;

      const moq =
        Math.max(
          1,
          Number(
            item?.moq ??
              item?.minimumOrderQuantity ??
              1
          ) || 1
        );

      if (
        currentQuantity <=
        moq
      ) {
        return;
      }

      handleQuantityChange(
        item,
        currentQuantity - 1
      );
    };

  // ==========================================================
  // CHECKOUT
  // ==========================================================

  const handleCheckout =
    (event) => {
      event.preventDefault();

      if (
        cartItems.length === 0
      ) {
        return;
      }

      if (
        Number(subtotal) <= 0
      ) {
        return;
      }

      navigate(
        "/checkout"
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

            {/* ==================================================
                ITEMS LIST
                ================================================== */}

            <div className="cart-items-list">

              {cartItems.map(
                (item, index) => {
                  const itemId =
                    getProductId(
                      item
                    );

                  const itemPrice =
                    Number(
                      item?.price ??
                        item?.product
                          ?.price ??
                        0
                    ) || 0;

                  const itemQuantity =
                    Number(
                      item?.quantity
                    ) || 0;

                  const itemMoq =
                    Math.max(
                      1,
                      Number(
                        item?.moq ??
                          item?.minimumOrderQuantity ??
                          item?.minOrderQuantity ??
                          1
                      ) || 1
                    );

                  const itemStock =
                    Number(
                      item?.stock ??
                        item?.countInStock ??
                        item?.inventory
                    );

                  const hasStockLimit =
                    Number.isFinite(
                      itemStock
                    ) &&
                    itemStock >= 0;

                  const isOutOfStock =
                    hasStockLimit &&
                    itemStock <= 0;

                  const itemTotal =
                    itemPrice *
                    itemQuantity;

                  const image =
                    getImageUrl(
                      item?.image ||
                        item?.images?.[0] ||
                        item?.product
                          ?.image ||
                        item?.product
                          ?.images?.[0]
                    );

                  const imageFailed =
                    imageErrors[
                      itemId
                    ];

                  const quantityError =
                    quantityErrors[
                      itemId
                    ];

                  const productName =
                    item?.name ||
                    item?.product
                      ?.name ||
                    "Product";

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
                      key={
                        itemId ||
                        index
                      }
                    >

                      {/* ==================================================
                          PRODUCT IMAGE
                          ================================================== */}

                      <Link
                        to={
                          itemId
                            ? `/products/${itemId}`
                            : "/products"
                        }
                        className="cart-item-image-link"
                        aria-label={`View ${productName}`}
                      >

                        <div className="cart-item-image">

                          {image &&
                          !imageFailed ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                productName
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

                      {/* ==================================================
                          PRODUCT INFORMATION
                          ================================================== */}

                      <div className="cart-item-info">

                        <div className="cart-item-top-line">

                          {item?.category && (
                            <span className="cart-item-category">
                              {typeof item.category ===
                              "object"
                                ? item.category?.name ||
                                  "Category"
                                : item.category}
                            </span>
                          )}

                          {isOutOfStock ? (
                            <span className="cart-item-stock-badge cart-item-stock-badge-out">
                              Out of stock
                            </span>
                          ) : (
                            hasStockLimit && (
                              <span className="cart-item-stock-badge">
                                {itemStock}{" "}
                                available
                              </span>
                            )
                          )}

                        </div>

                        <Link
                          to={
                            itemId
                              ? `/products/${itemId}`
                              : "/products"
                          }
                          className="cart-item-name"
                        >
                          {productName}
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

                        {/* ==================================================
                            QUANTITY
                            ================================================== */}

                        <div className="cart-item-quantity-row">

                          <span>
                            Quantity
                          </span>

                          <div className="cart-quantity-control">

                            <button
                              type="button"
                              disabled={
                                !canDecrease ||
                                isOutOfStock
                              }
                              onClick={() =>
                                handleDecrease(
                                  item
                                )
                              }
                              aria-label={`Decrease ${productName} quantity`}
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
                              disabled={
                                isOutOfStock
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
                              aria-label={`${productName} quantity`}
                            />

                            <button
                              type="button"
                              disabled={
                                !canIncrease ||
                                isOutOfStock
                              }
                              onClick={() =>
                                handleIncrease(
                                  item
                                )
                              }
                              aria-label={`Increase ${productName} quantity`}
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* ==================================================
                            QUANTITY ERROR
                            ================================================== */}

                        {quantityError && (
                          <p className="text-xs text-red-600 mt-2">
                            {quantityError}
                          </p>
                        )}

                      </div>

                      {/* ==================================================
                          TOTAL + REMOVE
                          ================================================== */}

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
                            !itemId ||
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

            {/* ==================================================
                CONTINUE SHOPPING
                ================================================== */}

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

            {/* ==================================================
                ITEMS COUNT
                ================================================== */}

            <div className="cart-summary-highlight">

              <span>
                Items in cart
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>

            {/* ==================================================
                SUBTOTAL
                ================================================== */}

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

            {/* ==================================================
                SHIPPING
                ================================================== */}

            <div className="cart-summary-row">

              <span>
                Shipping
              </span>

              <strong>
                Calculated at checkout
              </strong>

            </div>

            <div className="cart-summary-divider" />

            {/* ==================================================
                TOTAL
                ================================================== */}

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

            {/* ==================================================
                CHECKOUT
                ================================================== */}

            {Number(
              subtotal || 0
            ) > 0 ? (
              <button
                type="button"
                className="cart-checkout-button"
                onClick={
                  handleCheckout
                }
              >
                <span>
                  Proceed to Checkout
                </span>

                <span>
                  →
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="cart-checkout-button"
                disabled
              >
                Cart Total Unavailable
              </button>
            )}

            {/* ==================================================
                CONTINUE SHOPPING
                ================================================== */}

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

            {/* ==================================================
                TRUST MESSAGE
                ================================================== */}

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