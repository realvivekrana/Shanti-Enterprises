// ============================================================
// SHANTI ENTERPRISES
// Product Card
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({
  product,
}) {
  const {
    addToCart,
  } = useCart();

  // ==========================================================
  // PRODUCT DATA
  // ==========================================================

  const productId =
    product?._id ||
    product?.id;

  const productName =
    product?.name ||
    product?.title ||
    "Product";

  const price = Number(
    product?.price ??
      product?.sellingPrice ??
      product?.salePrice ??
      0
  );

  const stock = Number(
    product?.stock ??
      product?.countInStock ??
      product?.inventory ??
      product?.quantity ??
      0
  );

  const moq =
    Number(
      product?.moq ??
        product?.minimumOrderQuantity ??
        product?.minOrderQuantity ??
        1
    ) || 1;

  const category =
    typeof product?.category ===
    "object"
      ? product?.category?.name
      : product?.category;

  const brand =
    typeof product?.brand ===
    "object"
      ? product?.brand?.name
      : product?.brand;

  const images =
    Array.isArray(
      product?.images
    )
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const image =
    images[0] || "";

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = (
    event
  ) => {
    event.preventDefault();

    event.stopPropagation();

    if (
      !productId ||
      stock <= 0
    ) {
      return;
    }

    addToCart(
      product,
      moq
    );
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <article className="product-card">

      {/* ==================================================
          IMAGE
          ================================================== */}

      <Link
        to={`/products/${productId}`}
        className="product-card-image-link"
      >

        <div className="product-card-image">

          {image ? (
            <img
              src={image}
              alt={productName}
              loading="lazy"
            />
          ) : (
            <div className="product-card-no-image">
              <span>
                SE
              </span>

              <small>
                No Image
              </small>
            </div>
          )}

          {/* STOCK BADGE */}

          <span
            className={`product-stock-badge ${
              stock > 0
                ? "product-stock-badge-in"
                : "product-stock-badge-out"
            }`}
          >
            {stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </span>

        </div>

      </Link>

      {/* ==================================================
          CONTENT
          ================================================== */}

      <div className="product-card-content">

        {/* CATEGORY */}

        {category && (
          <span className="product-card-category">
            {category}
          </span>
        )}

        {/* NAME */}

        <Link
          to={`/products/${productId}`}
          className="product-card-title"
        >
          {productName}
        </Link>

        {/* BRAND */}

        {brand && (
          <p className="product-card-brand">
            {brand}
          </p>
        )}

        {/* PRICE */}

        <div className="product-card-price-row">

          <div>

            <span className="product-card-price">
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </span>

            <span className="product-card-unit">
              / unit
            </span>

          </div>

        </div>

        {/* MOQ */}

        <div className="product-card-meta">

          <span>
            MOQ
          </span>

          <strong>
            {moq}
          </strong>

        </div>

        {/* ACTION */}

        <div className="product-card-actions">

          <Link
            to={`/products/${productId}`}
            className="product-view-button"
          >
            View Details
          </Link>

          <button
            type="button"
            className="product-add-button"
            disabled={
              stock <= 0
            }
            onClick={
              handleAddToCart
            }
          >
            {stock > 0
              ? "Add to Cart"
              : "Unavailable"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;