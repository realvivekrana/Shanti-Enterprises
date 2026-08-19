import {
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// PRODUCT DETAIL PAGE
// ======================================================

const ProductDetail = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  // ====================================================
  // CART
  // ====================================================

  const {
    addToCart,
    cartError,
    setCartError,
  } = useCart();


  // ====================================================
  // STATE
  // ====================================================

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [quantity, setQuantity] =
    useState(1);

  const [activeImage, setActiveImage] =
    useState(0);

  const [activeTab, setActiveTab] =
    useState('details');


  // ====================================================
  // FETCH PRODUCT
  // ====================================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError('');

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

        const productMOQ =
          Number(
            productData?.moq ||
            productData?.minimumOrderQuantity ||
            1
          );

        setQuantity(
          Math.max(
            productMOQ,
            1
          )
        );

      } catch (err) {

        console.error(
          'Product detail error:',
          err
        );

        setError(
          err.response?.data?.message ||
          'Product not found'
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  // ====================================================
  // PRODUCT VALUES
  // ====================================================

  const moq = useMemo(() => {

    return Number(
      product?.moq ||
      product?.minimumOrderQuantity ||
      1
    );

  }, [product]);


  const stock = useMemo(() => {

    return Number(
      product?.stock ??
      product?.countInStock ??
      0
    );

  }, [product]);


  // ====================================================
  // PRODUCT IMAGES
  // ====================================================

  const images = useMemo(() => {

    if (
      Array.isArray(product?.images) &&
      product.images.length > 0
    ) {

      return product.images;

    }

    if (product?.image) {

      return [
        product.image,
      ];

    }

    return [
      'https://via.placeholder.com/700x700?text=No+Image',
    ];

  }, [product]);


  // ====================================================
  // WHOLESALE PRICING
  // ====================================================

  const wholesalePricing =
    useMemo(() => {

      if (
        Array.isArray(
          product?.wholesalePricing
        ) &&
        product.wholesalePricing.length > 0
      ) {

        return [
          ...product.wholesalePricing,
        ].sort(
          (a, b) =>
            Number(
              a.minQuantity || 0
            ) -
            Number(
              b.minQuantity || 0
            )
        );

      }

      const basePrice =
        Number(
          product?.price || 0
        );

      return [
        {
          minQuantity: 1,
          maxQuantity: 49,
          price: basePrice,
        },

        {
          minQuantity: 50,
          maxQuantity: 199,
          price: basePrice,
        },

        {
          minQuantity: 200,
          maxQuantity: 499,
          price: basePrice,
        },

        {
          minQuantity: 500,
          maxQuantity: null,
          price: basePrice,
        },
      ];

    }, [product]);


  // ====================================================
  // PRICING ENGINE
  // ====================================================

  const currentUnitPrice =
    useMemo(() => {

      if (
        !wholesalePricing.length
      ) {

        return Number(
          product?.price || 0
        );

      }

      let selectedPrice =
        Number(
          product?.price || 0
        );

      for (
        const tier of wholesalePricing
      ) {

        const minQuantity =
          Number(
            tier.minQuantity || 0
          );

        const maxQuantity =
          tier.maxQuantity === null ||
          tier.maxQuantity === undefined ||
          tier.maxQuantity === ''
            ? Infinity
            : Number(
                tier.maxQuantity
              );

        if (
          quantity >= minQuantity &&
          quantity <= maxQuantity
        ) {

          selectedPrice =
            Number(
              tier.price || 0
            );

        }

      }

      return selectedPrice;

    }, [
      quantity,
      wholesalePricing,
      product,
    ]);


  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal =
    useMemo(() => {

      return (
        currentUnitPrice *
        quantity
      );

    }, [
      currentUnitPrice,
      quantity,
    ]);


  // ====================================================
  // QUANTITY INCREASE
  // ====================================================

  const increaseQuantity =
    () => {

      if (!product) {
        return;
      }

      if (
        stock > 0 &&
        quantity >= stock
      ) {

        setCartError(
          `Only ${stock} pieces are available.`
        );

        return;

      }

      setQuantity(
        (current) =>
          current + 1
      );

      setCartError('');

    };


  // ====================================================
  // QUANTITY DECREASE
  // ====================================================

  const decreaseQuantity =
    () => {

      if (!product) {
        return;
      }

      if (
        quantity <= moq
      ) {

        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );

        return;

      }

      setQuantity(
        (current) =>
          Math.max(
            moq,
            current - 1
          )
      );

      setCartError('');

    };


  // ====================================================
  // MANUAL QUANTITY
  // ====================================================

  const handleQuantityChange =
    (event) => {

      if (!product) {
        return;
      }

      const value =
        Number(
          event.target.value
        );

      if (
        !Number.isInteger(value)
      ) {

        return;

      }

      if (
        value < moq
      ) {

        setQuantity(moq);

        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );

        return;

      }

      if (
        stock > 0 &&
        value > stock
      ) {

        setQuantity(stock);

        setCartError(
          `Only ${stock} pieces are available.`
        );

        return;

      }

      setQuantity(value);

      setCartError('');

    };


  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart =
    () => {

      if (!product) {
        return;
      }

      if (
        quantity < moq
      ) {

        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );

        return;

      }

      if (
        stock > 0 &&
        quantity > stock
      ) {

        setCartError(
          `Only ${stock} pieces are available.`
        );

        return;

      }

      const added =
        addToCart(
          product,
          quantity
        );

      if (added) {

        setCartError('');

        navigate('/cart');

      }

    };


  // ====================================================
  // REQUEST QUOTE
  // ====================================================

  const handleRequestQuotation =
    () => {

      if (!product) {
        return;
      }

      navigate(
        `/products/${product._id}/rfq`
      );

    };


  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice =
    (price) => {

      return Number(
        price || 0
      ).toLocaleString(
        'en-IN',
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }
      );

    };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              mx-auto
              border-4
              border-teal-100
              border-t-teal-600
              rounded-full
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Loading product...
          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (

      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            text-center
            max-w-md
          "
        >

          <div className="text-5xl">
            ⚠️
          </div>

          <h1
            className="
              mt-4
              text-2xl
              font-bold
              text-slate-800
            "
          >
            Product Not Found
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/products')
            }
            className="
              mt-6
              px-5
              py-3
              rounded-xl
              bg-teal-600
              text-white
              text-sm
              font-semibold
              hover:bg-teal-700
            "
          >
            Back to Products
          </button>

        </div>

      </div>

    );

  }


  if (!product) {
    return null;
  }


  // ====================================================
  // MAIN UI
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            sm:text-sm
            text-slate-500
          "
        >

          <Link
            to="/"
            className="
              hover:text-teal-600
            "
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="
              hover:text-teal-600
            "
          >
            Products
          </Link>

          <span>/</span>

          <span
            className="
              text-slate-700
              truncate
            "
          >
            {product.name}
          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-10
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            lg:gap-12
          "
        >

          {/* ==================================================
              PRODUCT IMAGES
          ================================================== */}

          <div>

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                overflow-hidden
              "
            >

              <div
                className="
                  aspect-square
                  bg-slate-100
                  overflow-hidden
                "
              >

                <img
                  src={
                    images[activeImage]
                  }
                  alt={
                    product.name
                  }
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>

            </div>


            {images.length > 1 && (

              <div
                className="
                  mt-4
                  flex
                  gap-3
                  overflow-x-auto
                "
              >

                {images.map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`
                        w-20
                        h-20
                        shrink-0
                        rounded-xl
                        overflow-hidden
                        border-2
                        ${
                          activeImage === index
                            ? 'border-teal-600'
                            : 'border-slate-200'
                        }
                      `}
                    >

                      <img
                        src={image}
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <div>

            {/* CATEGORY */}

            {product.category && (

              <p
                className="
                  text-xs
                  sm:text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-teal-600
                "
              >

                {typeof product.category ===
                'object'
                  ? product.category?.name
                  : product.category}

              </p>

            )}


            {/* PRODUCT NAME */}

            <h1
              className="
                mt-2
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-extrabold
                text-slate-900
              "
            >

              {product.name}

            </h1>


            {/* RATING */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-0.5
                  text-amber-500
                "
              >
                ★★★★★
              </div>

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                {product.rating
                  ? `${product.rating} rating`
                  : 'No ratings yet'}
              </span>

            </div>


            {/* SKU */}

            <div
              className="
                mt-4
                text-sm
                text-slate-500
              "
            >

              SKU:{' '}

              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >

                {product.sku || 'N/A'}

              </span>

            </div>


            {/* MOQ */}

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                bg-teal-50
                border
                border-teal-100
              "
            >

              <span
                className="
                  text-sm
                  text-teal-700
                "
              >
                MOQ:
              </span>

              <strong
                className="
                  text-sm
                  text-teal-900
                "
              >
                {moq} pieces
              </strong>

            </div>


            {/* ==================================================
                WHOLESALE PRICING
            ================================================== */}

            <div
              className="
                mt-6
                bg-white
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
                shadow-sm
              "
            >

              <div
                className="
                  px-5
                  py-4
                  bg-slate-50
                  border-b
                  border-slate-200
                "
              >

                <h2
                  className="
                    text-base
                    sm:text-lg
                    font-bold
                    text-slate-800
                  "
                >
                  Wholesale Pricing
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Better prices for larger quantities
                </p>

              </div>


              {/* HEADER */}

              <div
                className="
                  grid
                  grid-cols-2
                  px-5
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                  border-b
                  border-slate-100
                "
              >

                <span>
                  Quantity
                </span>

                <span
                  className="
                    text-right
                  "
                >
                  Price / Piece
                </span>

              </div>


              {/* PRICE TIERS */}

              <div>

                {wholesalePricing.map(
                  (
                    tier,
                    index
                  ) => {

                    const minQuantity =
                      Number(
                        tier.minQuantity || 0
                      );

                    const maxQuantity =
                      tier.maxQuantity === null ||
                      tier.maxQuantity === undefined ||
                      tier.maxQuantity === ''
                        ? null
                        : Number(
                            tier.maxQuantity
                          );

                    const active =
                      quantity >=
                        minQuantity &&
                      (
                        maxQuantity === null ||
                        quantity <=
                          maxQuantity
                      );

                    return (

                      <div
                        key={index}
                        className={`
                          grid
                          grid-cols-2
                          items-center
                          px-5
                          py-3.5
                          border-b
                          border-slate-100
                          last:border-b-0
                          transition
                          ${
                            active
                              ? 'bg-teal-50'
                              : 'bg-white'
                          }
                        `}
                      >

                        <span
                          className={`
                            text-sm
                            ${
                              active
                                ? 'font-bold text-teal-700'
                                : 'text-slate-600'
                            }
                          `}
                        >

                          {minQuantity}
                          {' - '}
                          {maxQuantity ?? '+'}
                          {' pieces'}

                        </span>


                        <span
                          className={`
                            text-right
                            text-sm
                            ${
                              active
                                ? 'font-extrabold text-teal-700'
                                : 'font-semibold text-slate-800'
                            }
                          `}
                        >

                          ₹
                          {formatPrice(
                            tier.price
                          )}

                        </span>

                      </div>

                    );

                  }
                )}

              </div>

            </div>


            {/* ==================================================
                CURRENT PRICE
            ================================================== */}

            <div
              className="
                mt-5
                p-5
                rounded-2xl
                bg-slate-900
                text-white
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Current wholesale price
                  </p>

                  <p
                    className="
                      mt-1
                      text-2xl
                      sm:text-3xl
                      font-extrabold
                    "
                  >

                    ₹
                    {formatPrice(
                      currentUnitPrice
                    )}

                    <span
                      className="
                        ml-1
                        text-sm
                        font-normal
                        text-slate-400
                      "
                    >
                      / piece
                    </span>

                  </p>

                </div>


                <div
                  className="
                    text-right
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Quantity
                  </p>

                  <p
                    className="
                      mt-1
                      font-bold
                    "
                  >
                    {quantity}
                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div
              className="
                mt-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <label
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  Quantity
                </label>

                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Minimum: {moq}
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  w-full
                  max-w-xs
                  border
                  border-slate-300
                  rounded-xl
                  overflow-hidden
                  bg-white
                "
              >

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= moq
                  }
                  className="
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    text-xl
                    text-slate-600
                    hover:bg-slate-100
                    disabled:text-slate-300
                    disabled:cursor-not-allowed
                  "
                >
                  −
                </button>


                <input
                  type="number"
                  min={moq}
                  max={
                    stock > 0
                      ? stock
                      : undefined
                  }
                  value={quantity}
                  onChange={
                    handleQuantityChange
                  }
                  className="
                    flex-1
                    h-12
                    text-center
                    font-bold
                    text-slate-800
                    outline-none
                    border-x
                    border-slate-200
                  "
                />


                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    stock > 0 &&
                    quantity >= stock
                  }
                  className="
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    text-xl
                    text-slate-600
                    hover:bg-slate-100
                    disabled:text-slate-300
                    disabled:cursor-not-allowed
                  "
                >
                  +
                </button>

              </div>

            </div>


            {/* ==================================================
                SUBTOTAL
            ================================================== */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                p-4
                rounded-xl
                bg-white
                border
                border-slate-200
              "
            >

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-600
                "
              >
                Subtotal
              </span>

              <span
                className="
                  text-xl
                  font-extrabold
                  text-slate-900
                "
              >

                ₹
                {formatPrice(
                  subtotal
                )}

              </span>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {cartError && (

              <div
                className="
                  mt-4
                  p-3
                  rounded-lg
                  bg-red-50
                  border
                  border-red-200
                  text-sm
                  text-red-600
                "
              >

                {cartError}

              </div>

            )}


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div
              className="
                mt-5
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  stock === 0 ||
                  quantity < moq
                }
                className="
                  h-12
                  rounded-xl
                  bg-teal-600
                  text-white
                  font-bold
                  hover:bg-teal-700
                  disabled:bg-slate-300
                  disabled:cursor-not-allowed
                  transition
                "
              >

                {stock === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}

              </button>


              <button
                type="button"
                onClick={
                  handleRequestQuotation
                }
                className="
                  h-12
                  rounded-xl
                  border-2
                  border-teal-600
                  text-teal-700
                  font-bold
                  hover:bg-teal-50
                  transition
                "
              >

                Request Quote

              </button>

            </div>


            {/* ==================================================
                INFORMATION TABS
            ================================================== */}

            <div
              className="
                mt-8
                bg-white
                rounded-2xl
                border
                border-slate-200
                overflow-hidden
              "
            >

              {/* TAB NAVIGATION */}

              <div
                className="
                  flex
                  overflow-x-auto
                  border-b
                  border-slate-200
                "
              >

                {[
                  {
                    id: 'details',
                    label: 'Product Details',
                  },

                  {
                    id: 'specifications',
                    label: 'Specifications',
                  },

                  {
                    id: 'shipping',
                    label: 'Shipping',
                  },

                  {
                    id: 'returns',
                    label: 'Return Policy',
                  },

                  {
                    id: 'important',
                    label: 'Important',
                  },

                ].map(
                  (tab) => (

                    <button
                      key={
                        tab.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          tab.id
                        )
                      }
                      className={`
                        shrink-0
                        px-4
                        sm:px-5
                        py-3
                        text-xs
                        sm:text-sm
                        font-semibold
                        border-b-2
                        ${
                          activeTab ===
                          tab.id
                            ? 'border-teal-600 text-teal-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }
                      `}
                    >

                      {tab.label}

                    </button>

                  )
                )}

              </div>


              {/* TAB CONTENT */}

              <div
                className="
                  p-5
                  sm:p-6
                "
              >

                {/* PRODUCT DETAILS */}

                {activeTab ===
                  'details' && (

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Product Details
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-600
                      "
                    >

                      {product.description ||
                        'Product details will be available here.'}

                    </p>

                  </div>

                )}


                {/* SPECIFICATIONS */}

                {activeTab ===
                  'specifications' && (

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Specifications
                    </h3>


                    {product.specifications &&
                    typeof product.specifications ===
                      'object' ? (

                      <div
                        className="
                          mt-4
                          divide-y
                          divide-slate-100
                        "
                      >

                        {Object.entries(
                          product.specifications
                        ).map(
                          (
                            [
                              key,
                              value,
                            ]
                          ) => (

                            <div
                              key={key}
                              className="
                                grid
                                grid-cols-2
                                gap-4
                                py-3
                                text-sm
                              "
                            >

                              <span
                                className="
                                  font-semibold
                                  text-slate-600
                                "
                              >
                                {key}
                              </span>

                              <span
                                className="
                                  text-slate-800
                                "
                              >
                                {String(value)}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p
                        className="
                          mt-3
                          text-sm
                          text-slate-500
                        "
                      >

                        Product specifications
                        are available on request.

                      </p>

                    )}

                  </div>

                )}


                {/* SHIPPING */}

                {activeTab ===
                  'shipping' && (

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Shipping
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-600
                      "
                    >

                      Shipping charges and delivery
                      timelines may vary based on
                      quantity, destination and
                      shipment method.

                    </p>

                  </div>

                )}


                {/* RETURN POLICY */}

                {activeTab ===
                  'returns' && (

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      Return Policy
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-600
                      "
                    >

                      Return eligibility depends on
                      the product condition and the
                      applicable business return
                      policy.

                    </p>

                  </div>

                )}


                {/* IMPORTANT */}

                {activeTab ===
                  'important' && (

                  <div
                    className="
                      rounded-xl
                      bg-amber-50
                      border
                      border-amber-200
                      p-4
                    "
                  >

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-amber-800
                      "
                    >
                      Important
                    </h3>

                    <ul
                      className="
                        mt-3
                        space-y-2
                        text-sm
                        text-amber-900
                      "
                    >

                      <li>
                        • MOQ must be maintained.
                      </li>

                      <li>
                        • Wholesale price changes
                        automatically according to
                        quantity.
                      </li>

                      <li>
                        • Large quantity orders can
                        request a special quotation.
                      </li>

                    </ul>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

};


export default ProductDetail;