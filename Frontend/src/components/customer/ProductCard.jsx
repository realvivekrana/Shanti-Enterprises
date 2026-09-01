// ============================================================
// SHANTI ENTERPRISES — ProductCard (Premium)
// ============================================================

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const id     = product?._id || product?.id || "";
  const name   = product?.name || "Product";
  const price  = Number(product?.price ?? 0);
  const stock  = Number(product?.stock ?? product?.inventory ?? 0);
  const moq    = Number(product?.moq ?? 1);
  const image  = product?.images?.[0] || product?.image || "";
  const category =
    typeof product?.category === "object"
      ? product?.category?.name
      : product?.category || "";
  const isWholesale = product?.isWholesale;

  const stockStatus =
    stock === 0 ? "out-stock" :
    stock <= 10 ? "low-stock" : "in-stock";

  const stockLabel =
    stock === 0 ? "Out of Stock" :
    stock <= 10 ? `Only ${stock} left` : "In Stock";

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stock > 0) {
      addToCart(product, moq);
    }
  };

  return (
    <article className="product-card">

      {/* IMAGE */}
      <div className="product-card-image">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "var(--se-text-4)" }}>
            <span style={{ fontSize: "36px" }}>📦</span>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>No Image</span>
          </div>
        )}
        {isWholesale && (
          <span className="product-card-badge">Wholesale</span>
        )}
      </div>

      {/* BODY */}
      <div className="product-card-body">
        {category && (
          <p className="product-card-category">{category}</p>
        )}

        <h3 className="product-card-title">{name}</h3>

        <p className="product-card-price">
          {formatCurrency(price)}
          <span>/ {product?.unit || "pc"}</span>
        </p>

        {moq > 1 && (
          <p className="product-card-stock" style={{ fontSize: "12px", color: "var(--se-text-3)" }}>
            MOQ: {moq} units
          </p>
        )}

        <p className={`product-card-stock ${stockStatus}`}>
          {stockStatus === "in-stock" ? "● " : stockStatus === "low-stock" ? "⚡ " : "✕ "}
          {stockLabel}
        </p>

        {/* ACTIONS */}
        <div className="product-card-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleAddToCart}
            disabled={stock === 0}
            title={stock === 0 ? "Out of stock" : `Add ${moq} to cart`}
          >
            {stock === 0 ? "Out of Stock" : "+ Add to Cart"}
          </button>

          {id && (
            <Link
              to={`/products/${id}`}
              className="btn-secondary"
              title="View details"
              style={{ height: "38px", padding: "0 12px", fontSize: "13px", display: "inline-flex", alignItems: "center" }}
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
