// ============================================================
// SHANTI ENTERPRISES
// Product Card
// Frontend Phase 2 - Shopping
// ============================================================

import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const productId =
    product?._id || product?.id;

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

  const moq = Number(
    product?.moq ??
      product?.minimumOrderQuantity ??
      product?.minOrderQuantity ??
      1
  );

  const category =
    typeof product?.category === "object"
      ? product?.category?.name
      : product?.category;

  const brand =
    typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand;

  const image =
    product?.images?.[0] ||
    product?.image ||
    "";

  return (
    <article className="product-card">

      {/* Product Image */}

      <div className="product-card-image">
        {image ? (
          <img
            src={image}
            alt={productName}
          />
        ) : (
          <div>
            No Image
          </div>
        )}
      </div>

      {/* Product Information */}

      <div className="product-card-content">

        {category && (
          <p>
            {category}
          </p>
        )}

        <h2>
          {productName}
        </h2>

        {brand && (
          <p>
            Brand: {brand}
          </p>
        )}

        <p>
          ₹{price.toLocaleString("en-IN")}
        </p>

        <p>
          MOQ: {moq}
        </p>

        <p>
          {stock > 0
            ? `In Stock: ${stock}`
            : "Out of Stock"}
        </p>

        {productId && (
          <Link
            to={`/products/${productId}`}
          >
            View Product
          </Link>
        )}

      </div>

    </article>
  );
}

export default ProductCard;