// ============================================================
// SHANTI ENTERPRISES
// Home Page
// Frontend Phase 2 - Shopping
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
} from "../../api/productApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// HOME PAGE
// ============================================================

function HomePage() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProducts({
          page: 1,
          limit: 8,
        });

      if (data?.success) {
        setProducts(
          data.products || []
        );
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(
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
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading products..."
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
        onRetry={loadProducts}
      />
    );
  }

  // ==========================================================
  // HOME
  // ==========================================================

  return (
    <section>
      <h1>
        Shanti Enterprises
      </h1>

      <p>
        Welcome to Shanti Enterprises.
      </p>

      <h2>
        Products
      </h2>

      {products.length === 0 ? (
        <EmptyState
          title="No products available"
          message="Products will appear here once they are added."
        />
      ) : (
        <div>
          {products.map((product) => (
            <article
              key={product._id || product.id}
            >
              <h3>
                {product.name}
              </h3>

              {product.price !==
                undefined && (
                <p>
                  ₹{product.price}
                </p>
              )}

              {product.description && (
                <p>
                  {product.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;