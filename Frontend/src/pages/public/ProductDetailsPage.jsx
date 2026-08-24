// ============================================================
// SHANTI ENTERPRISES
// Product Details Page
// Frontend Phase 2 - Shopping
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
      } else if (data?.data) {
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
      <Loading
        message="Loading product details..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadProduct}
      />
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        message="The requested product could not be found."
      />
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
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = () => {
    addToCart(
      product,
      Math.max(
        moq,
        Number(quantity) || moq
      )
    );

    navigate("/cart");
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      <p>
        <Link to="/products">
          ← Back to Products
        </Link>
      </p>

      <div>

        {/* PRODUCT IMAGE */}

        <div>
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={productName}
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div>
              No Image Available
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}

        <div>

          {category && (
            <p>
              Category: {category}
            </p>
          )}

          <h1>
            {productName}
          </h1>

          {brand && (
            <p>
              Brand: {brand}
            </p>
          )}

          <h2>
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </h2>

          {product.description && (
            <div>
              <h3>
                Description
              </h3>

              <p>
                {product.description}
              </p>
            </div>
          )}

          <p>
            Minimum Order Quantity:{" "}
            {moq}
          </p>

          <p>
            {stock > 0
              ? `In Stock: ${stock}`
              : "Out of Stock"}
          </p>

          {product.sku && (
            <p>
              SKU: {product.sku}
            </p>
          )}

          {/* QUANTITY */}

          <label>
            Quantity:

            <input
              type="number"
              min={moq}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.max(
                    moq,
                    Number(
                      event.target
                        .value
                    ) || moq
                  )
                )
              }
            />
          </label>

          {/* ADD TO CART */}

          <div>
            <button
              type="button"
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
          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetailsPage;