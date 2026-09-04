// ============================================================
// SHANTI ENTERPRISES
// Admin Products Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getProducts,
  deleteProduct,
} from "../../api/productApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";
import "./AdminProductsPage.css";

// ============================================================
// ADMIN PRODUCTS PAGE
// ============================================================

function AdminProductsPage() {
  const navigate =
    useNavigate();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    stockFilter,
    setStockFilter,
  ] = useState("all");

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProducts({
          limit: 100,
        });

      let productData = [];

      if (Array.isArray(response)) {
        productData = response;
      } else if (
        Array.isArray(
          response?.products
        )
      ) {
        productData =
          response.products;
      } else if (
        Array.isArray(
          response?.data
        )
      ) {
        productData =
          response.data;
      } else if (
        Array.isArray(
          response?.data?.products
        )
      ) {
        productData =
          response.data.products;
      }

      setProducts(
        productData
      );
    } catch (err) {
      console.error(
        "Admin products error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
        err.message ||
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

  const getName = (
    product
  ) => {
    return (
      product.name ||
      product.title ||
      "Product"
    );
  };

  // ==========================================================
  // PRICE
  // ==========================================================

  const getPrice = (
    product
  ) => {
    return Number(
      product.price ??
      product.sellingPrice ??
      product.salePrice ??
      0
    );
  };

  // ==========================================================
  // STOCK
  // ==========================================================

  const getStock = (
    product
  ) => {
    return Number(
      product.stock ??
      product.countInStock ??
      product.inventory ??
      product.quantity ??
      0
    );
  };

  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const name =
          getName(
            product
          ).toLowerCase();

        const searchMatch =
          name.includes(
            search
              .trim()
              .toLowerCase()
          );

        const stock =
          getStock(
            product
          );

        let stockMatch =
          true;

        if (
          stockFilter ===
          "in-stock"
        ) {
          stockMatch =
            stock > 0;
        }

        if (
          stockFilter ===
          "out-of-stock"
        ) {
          stockMatch =
            stock <= 0;
        }

        if (
          stockFilter ===
          "low-stock"
        ) {
          stockMatch =
            stock > 0 &&
            stock <= 10;
        }

        return (
          searchMatch &&
          stockMatch
        );
      }
    );

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDelete =
    async (
      productId
    ) => {
      if (!productId) {
        setError(
          "Product ID is missing."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          productId
        );

        setError("");

        await deleteProduct(
          productId
        );

        setProducts(
          (currentProducts) =>
            currentProducts.filter(
              (product) =>
                (
                  product._id ||
                  product.id
                ) !== productId
            )
        );
      } catch (err) {
        console.error(
          "Delete product error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to delete product."
        );
      } finally {
        setDeletingId(null);
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading admin products..."
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-products-page">

      <div className="admin-products-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-products-header">

          <div>

            <Link
              to="/admin"
              className="admin-products-back"
            >
              ← Admin Dashboard
            </Link>

            <span className="admin-products-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>
              Products
            </h1>

            <p>
              Manage your store catalogue,
              pricing and inventory.
            </p>

          </div>

          <div className="admin-products-header-actions">

            <button
              type="button"
              className="admin-products-refresh"
              onClick={
                loadProducts
              }
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              className="admin-products-add"
              onClick={() =>
                navigate(
                  "/admin/products/new"
                )
              }
            >
              + Add Product
            </button>

          </div>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-products-error">

            <ErrorMessage
              message={error}
              onRetry={
                loadProducts
              }
            />

          </div>
        )}

        {/* ==================================================
            TOOLBAR
            ================================================== */}

        <div className="admin-products-toolbar">

          <div className="admin-products-search">

            <label htmlFor="productSearch">
              Search Products
            </label>

            <div className="admin-products-search-box">

              <span>
                ⌕
              </span>

              <input
                id="productSearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search product by name..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

          </div>

          <div className="admin-products-filter">

            <label htmlFor="stockFilter">
              Stock Status
            </label>

            <select
              id="stockFilter"
              value={
                stockFilter
              }
              onChange={(event) =>
                setStockFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Products
              </option>

              <option value="in-stock">
                In Stock
              </option>

              <option value="low-stock">
                Low Stock
              </option>

              <option value="out-of-stock">
                Out of Stock
              </option>
            </select>

          </div>

        </div>

        {/* ==================================================
            SUMMARY
            ================================================== */}

        <div className="admin-products-summary">

          <div>

            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              Showing products
            </span>

          </div>

          <span>
            Total catalogue:{" "}
            <strong>
              {products.length}
            </strong>
          </span>

        </div>

        {/* ==================================================
            PRODUCTS
            ================================================== */}

        {filteredProducts.length === 0 ? (
          <div className="admin-products-empty">

            <EmptyState
              title="No products found"
              message="Try changing your search or stock filter."
            />

          </div>
        ) : (
          <div className="admin-products-list">

            {filteredProducts.map(
              (product) => {

                const productId =
                  product._id ||
                  product.id;

                const name =
                  getName(
                    product
                  );

                const price =
                  getPrice(
                    product
                  );

                const stock =
                  getStock(
                    product
                  );

                const category =
                  typeof product.category ===
                  "object"
                    ? product
                        .category
                        ?.name
                    : product.category;

                const image =
                  product.image ||
                  (
                    Array.isArray(
                      product.images
                    )
                      ? product
                          .images[0]
                      : ""
                  );

                const isDeleting =
                  deletingId ===
                  productId;

                let stockStatus =
                  "In Stock";

                let stockClass =
                  "in-stock";

                if (
                  stock <= 0
                ) {
                  stockStatus =
                    "Out of Stock";

                  stockClass =
                    "out-of-stock";
                } else if (
                  stock <= 10
                ) {
                  stockStatus =
                    "Low Stock";

                  stockClass =
                    "low-stock";
                }

                return (
                  <article
                    key={
                      productId
                    }
                    className="admin-product-card"
                  >

                    {/* IMAGE */}

                    <div className="admin-product-image">

                      {image ? (
                        <img
                          src={image}
                          alt={name}
                        />
                      ) : (
                        <div className="admin-product-no-image">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* INFO */}

                    <div className="admin-product-info">

                      <div className="admin-product-heading">

                        <div>

                          <span className="admin-product-label">
                            PRODUCT
                          </span>

                          <h2>
                            {name}
                          </h2>

                        </div>

                        <span
                          className={`admin-stock-badge ${stockClass}`}
                        >
                          {stockStatus}
                        </span>

                      </div>

                      {category && (
                        <p className="admin-product-category">
                          Category:{" "}
                          {category}
                        </p>
                      )}

                      <div className="admin-product-meta">

                        <div>
                          <span>
                            PRICE
                          </span>

                          <strong>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            STOCK
                          </span>

                          <strong>
                            {stock}
                          </strong>
                        </div>

                        {product.sku && (
                          <div>
                            <span>
                              SKU
                            </span>

                            <strong>
                              {product.sku}
                            </strong>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-product-actions">

                      <Link
                        to={`/products/${productId}`}
                        className="admin-product-view"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        className="admin-product-edit"
                        onClick={() =>
                          navigate(
                            `/admin/products/${productId}/edit`
                          )
                        }
                        disabled={
                          isDeleting
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-product-delete"
                        onClick={() =>
                          handleDelete(
                            productId
                          )
                        }
                        disabled={
                          isDeleting
                        }
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminProductsPage;