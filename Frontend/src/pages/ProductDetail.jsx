import {
  useState,
  useEffect,
} from 'react';

import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';

const marketplaces = [
  'Flipkart',
  'Amazon',
  'Myntra',
  'Meesho',
];

const ProductDetail = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    addToCart,
    cartError,
    setCartError,
  } = useCart();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [quantity, setQuantity] =
    useState(1);

  // ==============================
  // FETCH PRODUCT
  // ==============================

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const response =
            await API.get(
              `/products/${id}`
            );

          const productData =
            response.data?.data ||
            response.data;

          setProduct(
            productData
          );

          // Start quantity from MOQ
          setQuantity(
            Math.max(
              Number(
                productData.moq ||
                  1
              ),
              1
            )
          );
        } catch (err) {
          setError(
            err.response?.data
              ?.message ||
              'Product not found'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [id]);

  // ==============================
  // QUANTITY INCREASE
  // ==============================

  const increaseQuantity =
    () => {
      if (!product) {
        return;
      }

      const stock =
        Number(
          product.stock || 0
        );

      setQuantity(
        (current) =>
          Math.min(
            stock,
            current + 1
          )
      );

      setCartError('');
    };

  // ==============================
  // QUANTITY DECREASE
  // ==============================

  const decreaseQuantity =
    () => {
      if (!product) {
        return;
      }

      const moq =
        Number(
          product.moq || 1
        );

      setQuantity(
        (current) =>
          Math.max(
            moq,
            current - 1
          )
      );

      setCartError('');
    };

  // ==============================
  // MANUAL QUANTITY
  // ==============================

  const handleQuantityChange =
    (e) => {
      if (!product) {
        return;
      }

      const value =
        Number(
          e.target.value
        );

      const moq =
        Number(
          product.moq || 1
        );

      const stock =
        Number(
          product.stock || 0
        );

      if (
        !Number.isInteger(
          value
        )
      ) {
        return;
      }

      if (value < moq) {
        setQuantity(moq);

        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );

        return;
      }

      if (value > stock) {
        setQuantity(stock);

        setCartError(
          `Only ${stock} pieces are available.`
        );

        return;
      }

      setQuantity(value);

      setCartError('');
    };

  // ==============================
  // ADD TO CART
  // ==============================

  const handleAddToCart =
    () => {
      if (!product) {
        return;
      }

      const moq =
        Number(
          product.moq || 1
        );

      if (
        quantity < moq
      ) {
        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );

        return;
      }

      const added =
        addToCart(
          product,
          quantity
        );

      if (added) {
        navigate('/cart');
      }
    };

  // ==============================
  // REQUEST BEST PRICE
  // ==============================

  const handleRequestQuotation =
    () => {
      if (!product) {
        return;
      }

      navigate(
        `/products/${product._id}/rfq`
      );
    };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <p className="p-8 text-slate-500">
        Loading...
      </p>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <p className="p-8 text-red-600">
        {error}
      </p>
    );
  }

  if (!product) {
    return null;
  }

  const moq =
    Number(
      product.moq || 1
    );

  const stock =
    Number(
      product.stock || 0
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ==============================
            PRODUCT IMAGE
        ============================== */}

        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">

          <img
            src={
              product.images?.[0] ||
              'https://via.placeholder.com/500x500?text=No+Image'
            }
            alt={product.name}
            className="w-full aspect-square object-cover"
          />

        </div>

        {/* ==============================
            PRODUCT DETAILS
        ============================== */}

        <div>

          {/* CATEGORY */}

          <p className="text-xs text-teal-700 font-medium uppercase tracking-wide">
            {product.category}
          </p>

          {/* PRODUCT NAME */}

          <h1 className="text-2xl font-bold text-slate-800 mt-1">
            {product.name}
          </h1>

          {/* BASE PRICE */}

          <p className="text-2xl font-bold text-slate-900 mt-4">
            ₹
            {Number(
              product.price || 0
            ).toFixed(2)}
          </p>

          {/* DESCRIPTION */}

          <p className="text-slate-600 mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* ==============================
              STOCK
          ============================== */}

          <p
            className={`mt-4 text-sm font-medium ${
              stock > 0
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {stock > 0
              ? `In Stock (${stock} available)`
              : 'Out of Stock'}
          </p>

          {/* ==============================
              MOQ
          ============================== */}

          <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-4">

            <p className="text-sm text-teal-800">
              Minimum order quantity
            </p>

            <p className="text-lg font-bold text-teal-900 mt-1">
              {moq} pieces
            </p>

            <p className="text-xs text-teal-700 mt-1">
              You must order at least{' '}
              {moq} pieces of this
              product.
            </p>

          </div>

          {/* ==============================
              WHOLESALE PRICING
          ============================== */}

          {product.wholesalePricing &&
            product
              .wholesalePricing
              .length > 0 && (
              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-lg p-4">

                <p className="text-sm font-semibold text-slate-800 mb-3">
                  Wholesale Pricing
                </p>

                <div className="space-y-2">

                  {[
                    ...product.wholesalePricing,
                  ]
                    .sort(
                      (a, b) =>
                        Number(
                          a.minQuantity
                        ) -
                        Number(
                          b.minQuantity
                        )
                    )
                    .map(
                      (
                        tier,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-slate-600">
                            {
                              tier.minQuantity
                            }
                            {' - '}
                            {tier.maxQuantity ??
                              '+'}
                            {' pieces'}
                          </span>

                          <span className="font-semibold text-slate-800">
                            ₹
                            {Number(
                              tier.price
                            ).toFixed(
                              2
                            )}
                            {' / piece'}
                          </span>
                        </div>
                      )
                    )}

                </div>

              </div>
            )}

          {/* ==============================
              MARKETPLACES
          ============================== */}

          <div className="mt-5">

            <p className="text-xs text-slate-500 mb-2">
              Suitable for sellers on
            </p>

            <div className="flex flex-wrap gap-2">

              {marketplaces.map(
                (name) => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                  >
                    {name}
                  </span>
                )
              )}

            </div>

          </div>

          {/* ==============================
              QUANTITY
          ============================== */}

          <div className="mt-6">

            <p className="text-sm font-medium text-slate-700 mb-2">
              Order Quantity
            </p>

            <div className="flex items-center gap-4">

              <div className="flex items-center border border-slate-300 rounded-lg">

                {/* DECREASE */}

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <=
                    moq
                  }
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  −
                </button>

                {/* QUANTITY */}

                <input
                  type="number"
                  min={moq}
                  max={stock}
                  value={quantity}
                  onChange={
                    handleQuantityChange
                  }
                  className="w-24 text-center py-2 outline-none"
                />

                {/* INCREASE */}

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >=
                    stock
                  }
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  +
                </button>

              </div>

              <span className="text-sm text-slate-500">
                MOQ: {moq}
              </span>

            </div>

          </div>

          {/* ==============================
              ERROR
          ============================== */}

          {(cartError ||
            error) && (
            <p className="text-red-600 text-sm mt-4">
              {cartError ||
                error}
            </p>
          )}

          {/* ==============================
              ADD TO CART
          ============================== */}

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              stock === 0 ||
              quantity < moq
            }
            className="mt-6 w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium"
          >
            {stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>

          {/* ==============================
              REQUEST BEST PRICE
          ============================== */}

          <button
            type="button"
            onClick={
              handleRequestQuotation
            }
            disabled={
              stock === 0
            }
            className="mt-3 w-full border border-teal-600 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed font-medium"
          >
            Request Best Wholesale Price
          </button>

          {/* ==============================
              RFQ INFORMATION
          ============================== */}

          <p className="text-xs text-slate-500 mt-2 text-center">
            Need a large quantity?
            Request a special price
            from our sales team.
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;