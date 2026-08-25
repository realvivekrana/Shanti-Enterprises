// ============================================================
// SHANTI ENTERPRISES
// Product Details Page
// Frontend Phase 6 - UI/UX
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

  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  const loadProduct = async () => {
    try {
      setLoading(true);

      setError("");

      const data =
        await getProductById(
          productId
        );

      let productData = null;

      if (data?.product) {
        productData =
          data.product;
      } else if (
        data?.data?.product
      ) {
        productData =
          data.data.product;
      } else if (
        data?.data
      ) {
        productData =
          data.data;
      } else if (
        data?._id ||
        data?.id
      ) {
        productData =
          data;
      }

      setProduct(
        productData
      );
    } catch (err) {
      console.error(
        "Product details error:",
        err
      );

      setError(
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
          <ErrorMessage
            message={error}
            onRetry={
              loadProduct
            }
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
          <EmptyState
            title="Product not found"
            message="The requested product could not be found."
          />
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

  const brand =
    typeof product.brand ===
    "object"
      ? product.brand?.name
      : product.brand;

  const images =
    Array.isArray(
      product.images
    )
      ? product.images
      : product.image
        ? [product.image]
        : [];

  // ==========================================================
  // QUANTITY
  // ==========================================================

  const increaseQuantity =
    () => {
      setQuantity(
        (currentQuantity) =>
          currentQuantity + 1
      );
    };

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

  const handleQuantityChange =
    (event) => {
      const value =
        Number(
          event.target.value
        ) || moq;

      setQuantity(
        Math.max(
          moq,
          value
        )
      );
    };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = () => {
    const finalQuantity =
      Math.max(
        moq,
        Number(quantity) || moq
      );

    addToCart(
      product,
      finalQuantity
    );

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

        <Link
          to="/products"
          className="product-details-back"
        >
          ← Back to Products
        </Link>

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
                  src={images[0]}
                  alt={productName}
                  className="product-details-image"
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
                  stock > 0
                    ? "product-details-stock-in"
                    : "product-details-stock-out"
                }`}
              >
                {stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </span>

            </div>

            {/* IMAGE COUNT */}

            {images.length > 1 && (
              <p className="product-details-image-count">
                {images.length} product images
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
                  "en-IN"
                )}
              </span>

              <span className="product-details-price-unit">
                / unit
              </span>

            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <div className="product-details-description">

                <h2>
                  Description
                </h2>

                <p>
                  {product.description}
                </p>

              </div>
            )}

            {/* PRODUCT INFORMATION */}

            <div className="product-details-meta-grid">

              <div className="product-details-meta-item">

                <span>
                  Minimum Order
                </span>

                <strong>
                  {moq} units
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

                <div className="product-quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= moq
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={moq}
                    value={quantity}
                    onChange={
                      handleQuantityChange
                    }
                    aria-label="Product quantity"
                  />

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      stock > 0 &&
                      quantity >=
                        stock
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
                  stock <= 0
                }
                onClick={
                  handleAddToCart
                }
              >
                {stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {/* BUY INFO */}

              {stock > 0 && (
                <p className="product-details-cart-note">
                  Minimum order quantity is{" "}
                  <strong>
                    {moq}
                  </strong>{" "}
                  unit
                  {moq > 1
                    ? "s"
                    : ""}.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetailsPage;