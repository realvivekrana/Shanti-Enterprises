// ============================================================
// SHANTI ENTERPRISES
// Product Details Page
// Frontend Phase 6 - Complete UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProductById,
} from "../../api/productApi";

import {
  useCart,
} from "../../context/CartContext";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

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
// PRODUCT RESPONSE HELPER
// ============================================================

const extractProduct = (
  data
) => {
  if (data?.product) {
    return data.product;
  }

  if (data?.data?.product) {
    return data.data.product;
  }

  if (data?.data) {
    return data.data;
  }

  if (
    data?._id ||
    data?.id
  ) {
    return data;
  }

  return null;
};

// ============================================================
// PRODUCT DETAILS PAGE
// ============================================================

function ProductDetailsPage() {
  const {
    productId,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    addToCart,
  } = useCart();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    addingToCart,
    setAddingToCart,
  ] = useState(false);

  const [
    addedToCart,
    setAddedToCart,
  ] = useState(false);

  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  const loadProduct =
    async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setSelectedImage(0);

        const data =
          await getProductById(
            productId
          );

        const productData =
          extractProduct(data);

        if (!productData) {
          setProduct(null);
          return;
        }

        setProduct(
          productData
        );

        // Quantity starts from MOQ.
        const productMoq =
          Number(
            productData.moq ??
              productData.minimumOrderQuantity ??
              productData.minOrderQuantity ??
              1
          ) || 1;

        setQuantity(
          productMoq
        );
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setError(
        "Product ID is missing."
      );
    }
  }, [productId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="product-details-page">

        <div className="product-details-container">

          <Loading
            message="Loading product details..."
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="product-details-page">

        <div className="product-details-container">

          <div className="product-details-back-row">

            <Link
              to="/products"
              className="product-details-back"
            >
              ← Back to Products
            </Link>

          </div>

          <ErrorMessage
            message={error}
            onRetry={loadProduct}
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!product) {
    return (
      <section className="product-details-page">

        <div className="product-details-container">

          <div className="product-details-back-row">

            <Link
              to="/products"
              className="product-details-back"
            >
              ← Back to Products
            </Link>

          </div>

          <EmptyState
            title="Product not found"
            message="The requested product could not be found."
          />

          <div className="product-details-empty-action">

            <Link
              to="/products"
              className="product-details-add-button"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // PRODUCT DATA
  // ==========================================================

  const productName =
    product.name ||
    product.title ||
    "Product";

  const price = Number(
    product.price ??
      product.sellingPrice ??
      product.salePrice ??
      0
  );

  const stock = Number(
    product.stock ??
      product.countInStock ??
      product.inventory ??
      product.quantity ??
      0
  );

  const moq =
    Number(
      product.moq ??
        product.minimumOrderQuantity ??
        product.minOrderQuantity ??
        1
    ) || 1;

  const category =
    typeof product.category ===
    "object"
      ? product.category?.name
      : product.category;

  const categoryId =
    typeof product.category ===
    "object"
      ? product.category?._id ||
        product.category?.id ||
        product.category?.slug
      : "";

  const brand =
    typeof product.brand ===
    "object"
      ? product.brand?.name
      : product.brand;

  const rawImages =
    Array.isArray(
      product.images
    )
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const images =
    rawImages
      .map(
        (image) =>
          getImageUrl(image)
      )
      .filter(Boolean);

  const isInStock =
    stock > 0;

  // ==========================================================
  // QUANTITY LIMITS
  // ==========================================================

  const canIncreaseQuantity =
    isInStock &&
    quantity < stock;

  const canDecreaseQuantity =
    quantity > moq;

  // ==========================================================
  // INCREASE QUANTITY
  // ==========================================================

  const increaseQuantity =
    () => {
      setQuantity(
        (currentQuantity) =>
          Math.min(
            stock,
            currentQuantity + 1
          )
      );
    };

  // ==========================================================
  // DECREASE QUANTITY
  // ==========================================================

  const decreaseQuantity =
    () => {
      setQuantity(
        (currentQuantity) =>
          Math.max(
            moq,
            currentQuantity - 1
          )
      );
    };

  // ==========================================================
  // MANUAL QUANTITY
  // ==========================================================

  const handleQuantityChange =
    (event) => {
      const rawValue =
        event.target.value;

      if (
        rawValue === ""
      ) {
        setQuantity(moq);
        return;
      }

      const value =
        Number(rawValue);

      if (
        Number.isNaN(value)
      ) {
        return;
      }

      setQuantity(
        Math.min(
          stock,
          Math.max(
            moq,
            value
          )
        )
      );
    };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart =
    async () => {
      if (
        !isInStock ||
        addingToCart
      ) {
        return;
      }

      const finalQuantity =
        Math.min(
          stock,
          Math.max(
            moq,
            Number(quantity) ||
              moq
          )
        );

      try {
        setAddingToCart(true);
        setAddedToCart(false);

        await addToCart(
          product,
          finalQuantity
        );

        setQuantity(
          finalQuantity
        );

        setAddedToCart(true);

        window.setTimeout(
          () => {
            setAddedToCart(false);
          },
          2000
        );
      } catch (err) {
        console.error(
          "Add to cart error:",
          err
        );
      } finally {
        setAddingToCart(false);
      }
    };

  // ==========================================================
  // BUY / GO TO CART
  // ==========================================================

  const handleGoToCart =
    () => {
      navigate("/cart");
    };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="product-details-page">

      <div className="product-details-container">

        {/* ==================================================
            BREADCRUMB
            ================================================== */}

        <div className="product-details-breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span>
            /
          </span>

          <Link to="/products">
            Products
          </Link>

          {category && (
            <>
              <span>
                /
              </span>

              <span>
                {category}
              </span>
            </>
          )}

          <span>
            /
          </span>

          <span>
            {productName}
          </span>

        </div>

        {/* ==================================================
            BACK BUTTON
            ================================================== */}

        <div className="product-details-back-row">

          <Link
            to="/products"
            className="product-details-back"
          >
            ← Back to Products
          </Link>

        </div>

        {/* ==================================================
            PRODUCT MAIN
            ================================================== */}

        <div className="product-details-card">

          {/* ==================================================
              IMAGE SECTION
              ================================================== */}

          <div className="product-details-image-section">

            <div className="product-details-image-box">

              {images.length > 0 ? (
                <img
                  src={
                    images[
                      selectedImage
                    ] ||
                    images[0]
                  }
                  alt={
                    productName
                  }
                  className="product-details-image"
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="product-details-no-image">

                  <span>
                    SE
                  </span>

                  <p>
                    No Image Available
                  </p>

                </div>
              )}

              {/* STOCK BADGE */}

              <span
                className={`product-details-stock ${
                  isInStock
                    ? "product-details-stock-in"
                    : "product-details-stock-out"
                }`}
              >
                {isInStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>

            </div>

            {/* ==================================================
                IMAGE GALLERY
                ================================================== */}

            {images.length > 1 && (
              <div className="product-details-gallery">

                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={`product-details-thumbnail ${
                        selectedImage ===
                        index
                          ? "product-details-thumbnail-active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${productName} ${index + 1}`}
                        loading="lazy"
                      />
                    </button>
                  )
                )}

              </div>
            )}

            {/* IMAGE COUNT */}

            {images.length > 0 && (
              <p className="product-details-image-count">
                {images.length}{" "}
                {images.length ===
                1
                  ? "product image"
                  : "product images"}
              </p>
            )}

          </div>

          {/* ==================================================
              PRODUCT INFORMATION
              ================================================== */}

          <div className="product-details-info">

            {/* CATEGORY */}

            {category && (
              <span className="product-details-category">

                {category}

              </span>
            )}

            {/* NAME */}

            <h1 className="product-details-title">
              {productName}
            </h1>

            {/* BRAND */}

            {brand && (
              <p className="product-details-brand">

                Brand:{" "}

                <strong>
                  {brand}
                </strong>

              </p>
            )}

            {/* PRICE */}

            <div className="product-details-price-box">

              <span className="product-details-price">
                ₹
                {price.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

              <span className="product-details-price-unit">
                / unit
              </span>

            </div>

            {/* DESCRIPTION */}

            <div className="product-details-description">

              <h2>
                Description
              </h2>

              <p>
                {product.description ||
                  "No product description is available for this product."}
              </p>

            </div>

            {/* ==================================================
                PRODUCT INFORMATION
                ================================================== */}

            <div className="product-details-meta-grid">

              <div className="product-details-meta-item">

                <span>
                  Minimum Order
                </span>

                <strong>
                  {moq}{" "}
                  {moq === 1
                    ? "unit"
                    : "units"}
                </strong>

              </div>

              <div className="product-details-meta-item">

                <span>
                  Available Stock
                </span>

                <strong>
                  {stock > 0
                    ? stock
                    : 0}
                </strong>

              </div>

              {product.sku && (
                <div className="product-details-meta-item">

                  <span>
                    SKU
                  </span>

                  <strong>
                    {product.sku}
                  </strong>

                </div>
              )}

              {product.unit && (
                <div className="product-details-meta-item">

                  <span>
                    Unit
                  </span>

                  <strong>
                    {product.unit}
                  </strong>

                </div>
              )}

            </div>

            {/* ==================================================
                PURCHASE BOX
                ================================================== */}

            <div className="product-details-purchase">

              <div className="product-details-quantity-row">

                <div>

                  <span className="product-details-label">
                    Quantity
                  </span>

                  <span className="product-details-moq">
                    MOQ: {moq}
                  </span>

                </div>

                {/* QUANTITY CONTROL */}

                <div className="product-quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      !isInStock ||
                      !canDecreaseQuantity
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={moq}
                    max={
                      stock > 0
                        ? stock
                        : undefined
                    }
                    value={
                      quantity
                    }
                    onChange={
                      handleQuantityChange
                    }
                    disabled={
                      !isInStock
                    }
                    aria-label="Product quantity"
                  />

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      !canIncreaseQuantity
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* ADD TO CART */}

              <button
                type="button"
                className="product-details-add-button"
                disabled={
                  !isInStock ||
                  addingToCart
                }
                onClick={
                  handleAddToCart
                }
              >
                {addingToCart
                  ? "Adding..."
                  : addedToCart
                    ? "Added to Cart ✓"
                    : isInStock
                      ? "Add to Cart"
                      : "Out of Stock"}
              </button>

              {/* GO TO CART */}

              {addedToCart && (
                <button
                  type="button"
                  className="product-details-cart-button"
                  onClick={
                    handleGoToCart
                  }
                >
                  Go to Cart
                </button>
              )}

              {/* PURCHASE NOTE */}

              {isInStock ? (
                <p className="product-details-cart-note">

                  Minimum order quantity is{" "}

                  <strong>
                    {moq}
                  </strong>{" "}

                  {moq === 1
                    ? "unit"
                    : "units"}
                  .

                  {stock > 0 && (
                    <>
                      {" "}
                      Maximum available quantity is{" "}
                      <strong>
                        {stock}
                      </strong>
                        .
                    </>
                  )}

                </p>
              ) : (
                <p className="product-details-cart-note">

                  This product is currently
                  unavailable.

                </p>
              )}

            </div>

            {/* ==================================================
                CATEGORY LINK
                ================================================== */}

            {category && (
              <div className="product-details-category-action">

                <Link
                  to={
                    categoryId
                      ? `/products?category=${encodeURIComponent(
                          categoryId
                        )}`
                      : "/products"
                  }
                >
                  ← More products
                  {category
                    ? ` in ${category}`
                    : ""}
                </Link>

              </div>
            )}

          </div>

        </div>

        {/* ==================================================
            BOTTOM NAVIGATION
            ================================================== */}

        <div className="product-details-bottom-navigation">

          <Link
            to="/products"
            className="product-details-back"
          >
            ← Continue Shopping
          </Link>

          <Link
            to="/cart"
            className="product-details-cart-link"
          >
            View Cart →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default ProductDetailsPage;