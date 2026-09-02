// ============================================================
// SHANTI ENTERPRISES — ProductDetailsPage
// Premium UI • Mobile First • Responsive
// ============================================================

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getProductById } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import "./ProductDetailsPage.css";

// ============================================================
// HELPERS
// ============================================================

const getImg = (img) => {
  if (!img) {
    return "";
  }

  if (typeof img === "string") {
    return img;
  }

  return (
    img?.url ||
    img?.secure_url ||
    img?.src ||
    ""
  );
};

const extractProduct = (data) =>
  data?.product ||
  data?.data?.product ||
  data?.data ||
  (data?._id ? data : null);

const fmt = (number) =>
  `₹${Number(number || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

// ============================================================
// PRICING TIERS
// ============================================================

function PricingTiers({
  tiers,
  basePrice,
  unit,
}) {
  if (
    !Array.isArray(tiers) ||
    tiers.length === 0
  ) {
    return null;
  }

  return (
    <section className="product-pricing-section">
      <div className="product-subsection-heading">
        <div className="product-subsection-icon">
          <Tag size={16} />
        </div>

        <div>
          <p>Wholesale Pricing</p>

          <span>
            Save more when you order in bulk
          </span>
        </div>
      </div>

      <div className="product-pricing-table-wrap">
        <table className="product-pricing-table">
          <thead>
            <tr>
              <th>Min Qty</th>

              <th>
                Price / {unit || "unit"}
              </th>

              <th>Saving</th>
            </tr>
          </thead>

          <tbody>
            {tiers.map((tier, index) => {
              const tierPrice = Number(
                tier?.price || 0
              );

              const saving =
                basePrice > tierPrice
                  ? Math.round(
                      (1 -
                        tierPrice /
                          basePrice) *
                        100
                    )
                  : 0;

              return (
                <tr key={index}>
                  <td>
                    <strong>
                      {tier?.minQuantity || 0}+
                    </strong>{" "}
                    units
                  </td>

                  <td className="product-tier-price">
                    {fmt(tierPrice)}
                  </td>

                  <td>
                    {saving > 0 ? (
                      <span className="product-saving-badge">
                        Save {saving}%
                      </span>
                    ) : (
                      <span className="product-no-saving">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================
// META ITEM
// ============================================================

function MetaItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="product-meta-item">
      <div className="product-meta-icon">
        {icon}
      </div>

      <div className="product-meta-content">
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT DETAILS PAGE
// ============================================================

function ProductDetailsPage() {
  const { productId } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [selImg, setSelImg] =
    useState(0);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [addedToCart, setAddedToCart] =
    useState(false);

  const [cartError, setCartError] =
    useState("");

  const [imgErrors, setImgErrors] =
    useState({});

  const [activeTab, setActiveTab] =
    useState("description");

  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  const loadProduct = async () => {
    if (!productId) {
      setLoading(false);

      setError(
        "Product ID is missing."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setProduct(null);
      setSelImg(0);
      setImgErrors({});
      setCartError("");
      setAddedToCart(false);

      const data =
        await getProductById(productId);

      const loadedProduct =
        extractProduct(data);

      if (!loadedProduct) {
        setProduct(null);

        return;
      }

      setProduct(loadedProduct);

      const minimumOrderQuantity =
        Math.max(
          1,
          Number(
            loadedProduct?.moq ?? 1
          ) || 1
        );

      const availableStock =
        Number(
          loadedProduct?.stock ?? 0
        );

      setQuantity(
        availableStock > 0
          ? Math.min(
              minimumOrderQuantity,
              availableStock
            )
          : minimumOrderQuantity
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-container product-loading-state">
          <Loading message="Loading product…" />
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <main className="product-details-page">
        <div className="product-details-container product-error-page">
          <Link
            to="/products"
            className="product-back-link"
          >
            <ChevronLeft size={17} />

            <span>
              Back to Products
            </span>
          </Link>

          <div className="product-error-card">
            <ErrorMessage
              message={error}
              onRetry={loadProduct}
            />
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // PRODUCT NOT FOUND
  // ==========================================================

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-container product-error-page">
          <Link
            to="/products"
            className="product-back-link"
          >
            <ChevronLeft size={17} />

            <span>
              Back to Products
            </span>
          </Link>

          <div className="product-not-found">
            <div className="product-not-found-icon">
              <Package size={36} />
            </div>

            <span>
              Product Not Found
            </span>

            <h1>
              This product is no longer
              available
            </h1>

            <p>
              The product may have been
              removed or the requested
              product does not exist.
            </p>

            <Link
              to="/products"
              className="product-primary-button"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const name =
    product?.name || "Product";

  const price =
    Number(product?.price ?? 0);

  const stock = Math.max(
    0,
    Number(product?.stock ?? 0)
  );

  const moq = Math.max(
    1,
    Number(product?.moq ?? 1)
  );

  const unit =
    product?.unit || "unit";

  const brand =
    typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand;

  const catObj =
    product?.category;

  const catName =
    typeof catObj === "object"
      ? catObj?.name
      : catObj;

  const catId =
    typeof catObj === "object"
      ? catObj?._id ||
        catObj?.id
      : "";

  const tiers = Array.isArray(
    product?.wholesalePriceTiers
  )
    ? product.wholesalePriceTiers.filter(
        (tier) =>
          tier?.minQuantity &&
          tier?.price
      )
    : [];

  const rawImages = Array.isArray(
    product?.images
  )
    ? product.images
    : product?.image
      ? [product.image]
      : [];

  const images = rawImages
    .map(getImg)
    .filter(Boolean);

  const inStock = stock > 0;

  const minQty = inStock
    ? Math.min(moq, stock)
    : moq;

  // ==========================================================
  // QUANTITY HANDLERS
  // ==========================================================

  const inc = () => {
    if (
      inStock &&
      quantity < stock
    ) {
      setQuantity((current) =>
        Math.min(
          stock,
          current + 1
        )
      );

      setCartError("");
    }
  };

  const dec = () => {
    if (
      inStock &&
      quantity > minQty
    ) {
      setQuantity((current) =>
        Math.max(
          minQty,
          current - 1
        )
      );

      setCartError("");
    }
  };

  const qChange = (event) => {
    const value = Math.floor(
      Number(event.target.value)
    );

    if (!Number.isFinite(value)) {
      return;
    }

    setQuantity(
      Math.min(
        stock,
        Math.max(
          minQty,
          value
        )
      )
    );

    setCartError("");
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const handleAddToCart = async () => {
    if (
      !inStock ||
      addingToCart
    ) {
      return;
    }

    setCartError("");
    setAddedToCart(false);

    const finalQuantity = Math.min(
      stock,
      Math.max(
        minQty,
        Math.floor(
          Number(quantity) ||
            minQty
        )
      )
    );

    if (finalQuantity < moq) {
      setCartError(
        `Minimum order quantity is ${moq} units.`
      );

      return;
    }

    if (finalQuantity > stock) {
      setCartError(
        `Only ${stock} units available.`
      );

      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        product,
        finalQuantity
      );

      setQuantity(finalQuantity);

      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2500);
    } catch (err) {
      setCartError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to add to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ==========================================================
  // REQUEST FOR QUOTE
  // ==========================================================

  const handleRFQ = () => {
    navigate(
      "/rfq/create",
      {
        state: {
          product: {
            ...product,
          },
          quantity: Math.max(
            moq,
            Math.floor(
              Number(quantity) ||
                moq
            )
          ),
        },
      }
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        {/* ====================================================
            BREADCRUMB
            ==================================================== */}

        <nav
          className="product-breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link to="/">
            Home
          </Link>

          <ChevronRight size={14} />

          <Link to="/products">
            Products
          </Link>

          {catName && (
            <>
              <ChevronRight size={14} />

              <span>
                {catName}
              </span>
            </>
          )}

          <ChevronRight size={14} />

          <strong title={name}>
            {name}
          </strong>
        </nav>

        {/* ====================================================
            MAIN PRODUCT SECTION
            ==================================================== */}

        <section className="product-main-section">
          {/* ==================================================
              IMAGE AREA
              ================================================== */}

          <div className="product-gallery">
            <div className="product-main-image">
              {images.length > 0 &&
              !imgErrors[selImg] ? (
                <img
                  src={
                    images[selImg] ||
                    images[0]
                  }
                  alt={name}
                  onError={() =>
                    setImgErrors(
                      (current) => ({
                        ...current,
                        [selImg]: true,
                      })
                    )
                  }
                />
              ) : (
                <div className="product-image-fallback">
                  <Package size={54} />

                  <span>
                    No Image Available
                  </span>
                </div>
              )}

              <span
                className={`product-stock-badge ${
                  inStock
                    ? "product-stock-badge--in"
                    : "product-stock-badge--out"
                }`}
              >
                <span className="product-stock-dot" />

                {inStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map(
                  (image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`product-thumbnail ${
                        selImg === index
                          ? "product-thumbnail--active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelImg(index)
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    >
                      {!imgErrors[index] ? (
                        <img
                          src={image}
                          alt={`${name} ${
                            index + 1
                          }`}
                          loading="lazy"
                          onError={() =>
                            setImgErrors(
                              (current) => ({
                                ...current,
                                [index]: true,
                              })
                            )
                          }
                        />
                      ) : (
                        <Package
                          size={20}
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ==================================================
              PRODUCT INFORMATION
              ================================================== */}

          <div className="product-information">
            {/* CATEGORY */}

            {catName && (
              <Link
                to={
                  catId
                    ? `/products?category=${catId}`
                    : "/products"
                }
                className="product-category-link"
              >
                <Tag size={14} />

                {catName}
              </Link>
            )}

            {/* TITLE */}

            <h1 className="product-title">
              {name}
            </h1>

            {/* BRAND / SKU */}

            {(brand ||
              product?.sku) && (
              <div className="product-identifiers">
                {brand && (
                  <span>
                    Brand{" "}
                    <strong>
                      {brand}
                    </strong>
                  </span>
                )}

                {brand &&
                  product?.sku && (
                    <span className="product-identifier-divider">
                      •
                    </span>
                  )}

                {product?.sku && (
                  <span>
                    SKU{" "}
                    <strong className="product-sku">
                      {product.sku}
                    </strong>
                  </span>
                )}
              </div>
            )}

            {/* PRICE */}

            <div className="product-price-box">
              <div className="product-price-row">
                <span className="product-price">
                  {fmt(price)}
                </span>

                <span className="product-price-unit">
                  / {unit}
                </span>
              </div>

              {tiers.length > 0 && (
                <div className="product-volume-note">
                  <Sparkles size={14} />

                  <span>
                    Volume discounts
                    available
                  </span>
                </div>
              )}
            </div>

            {/* META */}

            <div className="product-meta-grid">
              <MetaItem
                icon={
                  <Package size={17} />
                }
                label="Minimum Order"
                value={`${moq} ${unit}${
                  moq > 1 ? "s" : ""
                }`}
              />

              <MetaItem
                icon={
                  <ShoppingCart
                    size={17}
                  />
                }
                label="Available Stock"
                value={
                  inStock
                    ? `${stock} ${unit}${
                        stock > 1
                          ? "s"
                          : ""
                      }`
                    : "Unavailable"
                }
              />

              <MetaItem
                icon={
                  <Tag size={17} />
                }
                label="Selling Unit"
                value={unit}
              />
            </div>

            {/* WHOLESALE */}

            <PricingTiers
              tiers={tiers}
              basePrice={price}
              unit={unit}
            />

            {/* =================================================
                PURCHASE BOX
                ================================================= */}

            <div className="product-purchase-box">
              <div className="product-purchase-header">
                <div>
                  <h2>
                    Select Quantity
                  </h2>

                  <p>
                    Choose the quantity
                    you need
                  </p>
                </div>

                <div className="product-moq-badge">
                  MOQ {moq}
                </div>
              </div>

              {/* QUANTITY */}

              <div className="product-quantity-row">
                <div className="product-quantity-control">
                  <button
                    type="button"
                    onClick={dec}
                    disabled={
                      !inStock ||
                      quantity <=
                        minQty
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={qChange}
                    min={minQty}
                    max={
                      stock || undefined
                    }
                    disabled={!inStock}
                    aria-label="Product quantity"
                  />

                  <button
                    type="button"
                    onClick={inc}
                    disabled={
                      !inStock ||
                      quantity >= stock
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                <div className="product-quantity-info">
                  <span>
                    Minimum
                  </span>

                  <strong>
                    {moq} {unit}
                  </strong>

                  {inStock && (
                    <>
                      <span>
                        Max
                      </span>

                      <strong>
                        {stock} {unit}
                      </strong>
                    </>
                  )}
                </div>
              </div>

              {/* TOTAL */}

              {inStock && (
                <div className="product-total-row">
                  <div>
                    <span>
                      Order Total
                    </span>

                    <small>
                      {quantity}{" "}
                      {unit}
                      {quantity > 1
                        ? "s"
                        : ""}
                    </small>
                  </div>

                  <strong>
                    {fmt(
                      price *
                        quantity
                    )}
                  </strong>
                </div>
              )}

              {/* ERROR */}

              {cartError && (
                <div className="product-cart-error">
                  <X size={15} />

                  <span>
                    {cartError}
                  </span>
                </div>
              )}

              {/* ADD TO CART */}

              <button
                type="button"
                className={`product-add-cart-button ${
                  addedToCart
                    ? "product-add-cart-button--success"
                    : ""
                }`}
                onClick={
                  handleAddToCart
                }
                disabled={
                  !inStock ||
                  addingToCart
                }
              >
                {addingToCart ? (
                  <>
                    <span className="product-spinner" />

                    <span>
                      Adding to Cart...
                    </span>
                  </>
                ) : addedToCart ? (
                  <>
                    <ShoppingCart
                      size={18}
                    />

                    <span>
                      Added to Cart
                    </span>
                  </>
                ) : inStock ? (
                  <>
                    <ShoppingCart
                      size={18}
                    />

                    <span>
                      Add{" "}
                      {quantity}{" "}
                      to Cart
                    </span>
                  </>
                ) : (
                  <>
                    <Package size={18} />

                    <span>
                      Out of Stock
                    </span>
                  </>
                )}
              </button>

              {/* GO TO CART */}

              {addedToCart && (
                <button
                  type="button"
                  className="product-go-cart-button"
                  onClick={() =>
                    navigate("/cart")
                  }
                >
                  <ShoppingCart
                    size={16}
                  />

                  Go to Cart

                  <ChevronRight
                    size={15}
                  />
                </button>
              )}

              {/* RFQ */}

              <button
                type="button"
                className="product-rfq-button"
                onClick={
                  handleRFQ
                }
              >
                <FileText size={17} />

                <span>
                  Request a Quote
                </span>

                <ChevronRight
                  size={15}
                />
              </button>

              {/* DELIVERY NOTE */}

              <div className="product-delivery-note">
                <Truck size={16} />

                <span>
                  Reliable business
                  ordering and
                  convenient
                  delivery support.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            DESCRIPTION / SPECIFICATIONS
            ==================================================== */}

        <section className="product-details-tabs">
          <div className="product-tabs-header">
            <button
              type="button"
              className={
                activeTab ===
                "description"
                  ? "product-tab product-tab--active"
                  : "product-tab"
              }
              onClick={() =>
                setActiveTab(
                  "description"
                )
              }
            >
              Description
            </button>

            <button
              type="button"
              className={
                activeTab === "specs"
                  ? "product-tab product-tab--active"
                  : "product-tab"
              }
              onClick={() =>
                setActiveTab("specs")
              }
            >
              Specifications
            </button>
          </div>

          <div className="product-tab-content">
            {activeTab ===
              "description" && (
              <div className="product-description">
                <div className="product-tab-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <h2>
                    Product Description
                  </h2>

                  <p>
                    {product?.description ||
                      "No description available for this product."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="product-specifications">
                {[
                  catName && [
                    "Category",
                    catName,
                  ],

                  brand && [
                    "Brand",
                    brand,
                  ],

                  product?.sku && [
                    "SKU",
                    product.sku,
                  ],

                  ["Unit", unit],

                  [
                    "MOQ",
                    `${moq} ${unit}${
                      moq > 1
                        ? "s"
                        : ""
                    }`,
                  ],

                  [
                    "Stock",
                    inStock
                      ? `${stock} available`
                      : "Out of stock",
                  ],

                  product?.isWholesale && [
                    "Type",
                    "Wholesale",
                  ],
                ]
                  .filter(Boolean)
                  .map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="product-spec-item"
                      >
                        <span>
                          {label}
                        </span>

                        <strong>
                          {value}
                        </strong>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>
        </section>

        {/* ====================================================
            BOTTOM NAVIGATION
            ==================================================== */}

        <div className="product-bottom-navigation">
          <Link
            to="/products"
            className="product-bottom-link"
          >
            <ChevronLeft size={17} />

            <span>
              Continue Shopping
            </span>
          </Link>

          <Link
            to="/cart"
            className="product-bottom-link product-bottom-link--cart"
          >
            <span>
              View Cart
            </span>

            <ShoppingCart
              size={17}
            />

            <ChevronRight
              size={15}
            />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;