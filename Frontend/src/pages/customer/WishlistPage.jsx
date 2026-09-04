// ============================================================
// SHANTI ENTERPRISES
// Customer Wishlist Page
// Frontend - Wishlist
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../api/wishlistApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";
import "./WishlistPage.css";

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============================================================
// WISHLIST PAGE
// ============================================================

function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState("");
  const [clearing, setClearing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================================
  // LOAD WISHLIST
  // ==========================================================

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getWishlist();
      const items = response?.products || [];
      setProducts(items);
    } catch (err) {
      setError(
        err.message || "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemove = async (productId) => {
    try {
      setRemoving(productId);
      setSuccessMsg("");

      await removeFromWishlist(productId);
      setProducts((prev) =>
        prev.filter(
          (p) => (p._id || p.id) !== productId
        )
      );
      setSuccessMsg("Item removed from wishlist.");
    } catch (err) {
      setError(err.message || "Failed to remove item.");
    } finally {
      setRemoving("");
    }
  };

  // ==========================================================
  // CLEAR WISHLIST
  // ==========================================================

  const handleClear = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire wishlist?"
      )
    ) {
      return;
    }

    try {
      setClearing(true);
      setSuccessMsg("");

      await clearWishlist();
      setProducts([]);
      setSuccessMsg("Wishlist cleared.");
    } catch (err) {
      setError(err.message || "Failed to clear wishlist.");
    } finally {
      setClearing(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading your wishlist..." />
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && products.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage
            message={error}
            onRetry={loadWishlist}
          />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="app-page">
      <div className="page-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">CUSTOMER ACCOUNT</span>
            <h1>My Wishlist</h1>
            <p>
              {products.length > 0
                ? `${products.length} saved item${products.length !== 1 ? "s" : ""}`
                : "Your saved items appear here."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="btn-secondary">
              ← Dashboard
            </Link>

            {products.length > 0 && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleClear}
                disabled={clearing}
              >
                {clearing ? "Clearing..." : "Clear Wishlist"}
              </button>
            )}
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="alert-success" role="status">
            {successMsg}
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {products.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Save products you like to come back to them later.</p>
            <Link to="/products" className="btn-primary">
              Browse Products →
            </Link>
          </div>
        )}

        {/* PRODUCT GRID */}
        {products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {products.map((product) => {
              const productId = product?._id || product?.id;
              const name = product?.name || "Product";
              const image = product?.image || "";
              const price = product?.price || 0;
              const stock = product?.stock ?? 0;
              const unit = product?.unit || "piece";

              return (
                <article
                  key={productId}
                  style={{
                    background: "var(--card-bg, #fff)",
                    border: "1px solid var(--border, #e5e7eb)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      height: "200px",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "48px" }}>📦</span>
                    )}
                  </div>

                  {/* INFO */}
                  <div style={{ padding: "16px" }}>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {name}
                    </h3>

                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--primary, #2563eb)",
                      }}
                    >
                      {formatCurrency(price)}
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#6b7280",
                          marginLeft: "4px",
                        }}
                      >
                        / {unit}
                      </span>
                    </p>

                    <p
                      style={{
                        margin: "0 0 16px",
                        fontSize: "13px",
                        color: stock > 0 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {stock > 0 ? `${stock} in stock` : "Out of stock"}
                    </p>

                    {/* ACTIONS */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/products/${productId}`}
                        className="btn-primary"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleRemove(productId)}
                        disabled={removing === productId}
                        style={{ flex: 1 }}
                      >
                        {removing === productId ? "..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default WishlistPage;
