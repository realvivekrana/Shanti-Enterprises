// ============================================================
// SHANTI ENTERPRISES
// Product Card
// Frontend Phase - UI/UX
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
    image.path ||
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
  // SAFETY
  // ==========================================================

  if (!product) {
    return null;
  }

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

  const description =
    product?.description ||
    "";

  // ==========================================================
  // IMAGES
  // ==========================================================

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

  // ==========================================================
  // PRODUCT STATUS
  // ==========================================================

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
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = () => {
    setImageError(true);
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <article className="product-card">

      {/* ====================================================
          PRODUCT IMAGE
          ==================================================== */}

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
              onError={
                handleImageError
              }
            />
          ) : (
            <div className="product-card-no-image">

              <div className="product-card-no-image-logo">
                SE
              </div>

              <small>
                Image unavailable
              </small>

            </div>
          )}

          <div className="product-card-image-overlay" />

          {/* STOCK */}

          <span
            className={`product-stock-badge ${
              isInStock
                ? "product-stock-badge-in"
                : "product-stock-badge-out"
            }`}
          >

            <span className="product-stock-dot" />

            {isInStock
              ? "In Stock"
              : "Out of Stock"}

          </span>

          {/* QUICK VIEW LABEL */}

          <span className="product-card-image-action">
            View Product
            <span>
              →
            </span>
          </span>

        </div>

      </Link>

      {/* ====================================================
          CONTENT
          ==================================================== */}

      <div className="product-card-content">

        {/* CATEGORY + BRAND */}

        <div className="product-card-category-row">

          {category ? (
            <span className="product-card-category">
              {category}
            </span>
          ) : (
            <span className="product-card-category">
              PRODUCT
            </span>
          )}

          {brand && (
            <span className="product-card-brand-mini">
              {brand}
            </span>
          )}

        </div>

        {/* PRODUCT NAME */}

        <Link
          to={productPath}
          className="product-card-title"
        >
          {productName}
        </Link>

        {/* DESCRIPTION */}

        {description && (
          <p className="product-card-description">
            {description}
          </p>
        )}

        {/* PRICE */}

        <div className="product-card-price-row">

          <div className="product-card-price-block">

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

          <div className="product-card-meta-item">

            <span>
              MOQ
            </span>

            <strong>
              {moq}
            </strong>

          </div>

          <div className="product-card-meta-divider" />

          <div className="product-card-meta-item">

            <span>
              Stock
            </span>

            <strong
              className={
                !isInStock
                  ? "product-card-stock-zero"
                  : ""
              }
            >
              {stock}
            </strong>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="product-card-actions">

          <Link
            to={productPath}
            className="product-view-button"
          >

            <span>
              View Details
            </span>

            <span className="product-view-arrow">
              →
            </span>

          </Link>

          <button
            type="button"
            className={`product-add-button ${
              addedToCart
                ? "product-add-button-added"
                : ""
            }`}
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