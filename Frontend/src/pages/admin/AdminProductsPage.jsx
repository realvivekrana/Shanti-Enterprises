// ============================================================
// SHANTI ENTERPRISES
// Admin Products Page
// Frontend Phase 5 - Product Management
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

      if (
        Array.isArray(response)
      ) {
        productData =
          response;
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
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          Product Management
        </h1>

        <p>
          Manage all products in
          your store.
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadProducts}
        />
      )}

      {/* ====================================================
          ACTIONS
          ==================================================== */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/products/new"
            )
          }
        >
          + Add Product
        </button>

        <button
          type="button"
          onClick={
            loadProducts
          }
          disabled={loading}
        >
          Refresh
        </button>

      </div>

      {/* ====================================================
          SEARCH
          ==================================================== */}

      <div>

        <label htmlFor="productSearch">
          Search Products
        </label>

        <input
          id="productSearch"
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search product..."
        />

      </div>

      {/* ====================================================
          STOCK FILTER
          ==================================================== */}

      <div>

        <label htmlFor="stockFilter">
          Stock
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

      {/* ====================================================
          COUNT
          ==================================================== */}

      <p>
        Showing{" "}
        {
          filteredProducts.length
        }{" "}
        of{" "}
        {products.length} products
      </p>

      {/* ====================================================
          PRODUCTS
          ==================================================== */}

      {filteredProducts.length ===
      0 ? (
        <EmptyState
          title="No products found"
          message="Try changing your search or stock filter."
        />
      ) : (
        <div>

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

              return (
                <article
                  key={
                    productId
                  }
                >

                  {/* IMAGE */}

                  {image && (
                    <img
                      src={image}
                      alt={name}
                      style={{
                        width:
                          "120px",
                        height:
                          "100px",
                        objectFit:
                          "contain",
                      }}
                    />
                  )}

                  {/* INFO */}

                  <div>

                    <h2>
                      {name}
                    </h2>

                    {category && (
                      <p>
                        Category:{" "}
                        {category}
                      </p>
                    )}

                    <p>
                      Price: ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>
                      Stock:{" "}
                      {stock}
                    </p>

                    {stock <=
                      0 && (
                      <strong>
                        Out of Stock
                      </strong>
                    )}

                    {stock > 0 &&
                      stock <=
                        10 && (
                      <strong>
                        Low Stock
                      </strong>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div>

                    <Link
                      to={`/products/${productId}`}
                    >
                      View
                    </Link>

                    <button
                      type="button"
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

    </section>
  );
}

export default AdminProductsPage;