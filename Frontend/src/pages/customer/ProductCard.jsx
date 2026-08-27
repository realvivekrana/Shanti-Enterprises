// ============================================================
// SHANTI ENTERPRISES
// Product Card
// Frontend Phase 6 - Complete UI/UX
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

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
    ""
  );
};

// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({
  product,
}) {
  const {
    addToCart,
  } = useCart();

  const [
    imageError,
    setImageError,
  ] = useState(false);

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  const [
    addedToCart,
    setAddedToCart,
  ] = useState(false);

  // ==========================================================
  // PRODUCT DATA
  // ==========================================================

  if (!product) {
    return null;
  }

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
    getImageUrl(
      images[0]
    );

  const isInStock =
    stock > 0;

  const productPath =
    productId
      ? `/products/${productId}`
      : "/products";

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = async (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !productId ||
      !isInStock ||
      addingToCart
    ) {
      return;
    }

    try {
      setAddingToCart(true);
      setAddedToCart(false);

      await addToCart(
        product,
        moq
      );

      setAddedToCart(true);

      window.setTimeout(() => {
        setAddedToCart(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    } finally {
      setAddingToCart(false);
    }
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
        to={productPath}
        className="product-card-image-link"
        aria-label={`View ${productName}`}
      >

        <div className="product-card-image">

          {image &&
          !imageError ? (
            <img
              src={image}
              alt={productName}
              loading="lazy"
              onError={() =>
                setImageError(true)
              }
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
              isInStock
                ? "product-stock-badge-in"
                : "product-stock-badge-out"
            }`}
          >
            {isInStock
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
          to={productPath}
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

        {/* DESCRIPTION */}

        {product?.description && (
          <p className="product-card-description">
            {product.description}
          </p>
        )}

        {/* PRICE */}

        <div className="product-card-price-row">

          <div>

            <span className="product-card-price">
              ₹
              {price.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>

            <span className="product-card-unit">
              / unit
            </span>

          </div>

        </div>

        {/* META */}

        <div className="product-card-meta">

          <div>

            <span>
              MOQ
            </span>

            <strong>
              {moq}
            </strong>

          </div>

          {isInStock && (
            <div>

              <span>
                Stock
              </span>

              <strong>
                {stock}
              </strong>

            </div>
          )}

        </div>

        {/* ACTIONS */}

        <div className="product-card-actions">

          <Link
            to={productPath}
            className="product-view-button"
          >
            View Details
          </Link>

          <button
            type="button"
            className="product-add-button"
            disabled={
              !isInStock ||
              !productId ||
              addingToCart
            }
            onClick={
              handleAddToCart
            }
            aria-label={
              isInStock
                ? `Add ${productName} to cart`
                : `${productName} is unavailable`
            }
          >
            {addingToCart
              ? "Adding..."
              : addedToCart
                ? "Added ✓"
                : isInStock
                  ? "Add to Cart"
                  : "Unavailable"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;