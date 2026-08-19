import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// MARKETPLACES
// ======================================================

const marketplaces = [
  'Flipkart',
  'Amazon',
  'Myntra',
  'Meesho',
];


// ======================================================
// PRODUCT DETAIL
// ======================================================

const ProductDetail = () => {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const {
    addToCart,
    cartError,
    setCartError,
  } = useCart();


  // ====================================================
  // STATE
  // ====================================================

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
  ] = useState('');


  const [
    quantity,
    setQuantity,
  ] = useState(1);


  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);


  const [
    wishlist,
    setWishlist,
  ] = useState(false);


  const [
    wishlistLoading,
    setWishlistLoading,
  ] = useState(false);


  const [
    relatedProducts,
    setRelatedProducts,
  ] = useState([]);


  // ====================================================
  // FETCH PRODUCT
  // ====================================================

  useEffect(() => {

    const fetchProduct =
      async () => {

        setLoading(true);
        setError('');


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


          const moq =
            Number(
              productData?.moq ||
              productData?.minimumOrderQuantity ||
              1
            );


          setQuantity(
            Math.max(
              moq,
              1
            )
          );


        } catch (err) {

          console.error(
            'Product detail error:',
            err
          );


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


  // ====================================================
  // FETCH RELATED PRODUCTS
  // ====================================================

  useEffect(() => {

    const fetchRelatedProducts =
      async () => {

        if (!product) {
          return;
        }


        try {

          const response =
            await API.get(
              '/products'
            );


          const data =
            response.data?.data ||
            response.data?.products ||
            response.data ||
            [];


          const products =
            Array.isArray(data)
              ? data
              : [];


          const related =
            products
              .filter(
                (item) =>
                  String(
                    item._id
                  ) !==
                  String(
                    product._id
                  )
              )
              .filter(
                (item) =>
                  !product.category ||
                  !item.category ||
                  item.category ===
                    product.category
              )
              .slice(
                0,
                4
              );


          setRelatedProducts(
            related
          );


        } catch (err) {

          console.error(
            'Related products error:',
            err
          );

        }

      };


    fetchRelatedProducts();

  }, [product]);


  // ====================================================
  // PRODUCT VALUES
  // ====================================================

  const moq =
    Number(
      product?.moq ||
      product?.minimumOrderQuantity ||
      1
    );


  const stock =
    Number(
      product?.stock ||
      product?.countInStock ||
      0
    );


  const basePrice =
    Number(
      product?.price ||
      0
    );


  const wholesalePrice =
    Number(
      product?.wholesalePrice ||
      product?.bulkPrice ||
      basePrice
    );


  // ====================================================
  // IMAGES
  // ====================================================

  const images =
    useMemo(() => {

      if (!product) {
        return [];
      }


      if (
        Array.isArray(
          product.images
        ) &&
        product.images.length > 0
      ) {

        return product.images;

      }


      if (
        product.image
      ) {

        return [
          product.image,
        ];

      }


      return [
        'https://via.placeholder.com/700x700?text=No+Image',
      ];

    }, [
      product,
    ]);


  // ====================================================
  // CURRENT PRICE
  // ====================================================

  const currentWholesalePrice =
    useMemo(() => {

      if (
        !product?.wholesalePricing ||
        !Array.isArray(
          product.wholesalePricing
        )
      ) {

        return wholesalePrice;

      }


      const tiers =
        [
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
          );


      let price =
        wholesalePrice;


      tiers.forEach(
        (tier) => {

          const minimum =
            Number(
              tier.minQuantity ||
              0
            );


          const maximum =
            tier.maxQuantity ===
            null ||
            tier.maxQuantity ===
            undefined ||
            tier.maxQuantity ===
            ''
              ? Infinity
              : Number(
                  tier.maxQuantity
                );


          if (
            quantity >=
              minimum &&
            quantity <=
              maximum
          ) {

            price =
              Number(
                tier.price
              );

          }

        }
      );


      return price;

    }, [
      product,
      quantity,
      wholesalePrice,
    ]);


  // ====================================================
  // TOTAL
  // ====================================================

  const totalPrice =
    currentWholesalePrice *
    quantity;


  // ====================================================
  // QUANTITY INCREASE
  // ====================================================

  const increaseQuantity =
    () => {

      if (!product) {
        return;
      }


      if (
        quantity >=
        stock
      ) {

        setCartError(
          `Only ${stock} pieces are available.`
        );

        return;

      }


      setQuantity(
        (current) =>
          Math.min(
            stock,
            current + 1
          )
      );


      setCartError('');

    };


  // ====================================================
  // QUANTITY DECREASE
  // ====================================================

  const decreaseQuantity =
    () => {

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
        !Number.isInteger(
          value
        )
      ) {

        return;

      }


      if (
        value < moq
      ) {

        setQuantity(
          moq
        );


        setCartError(
          `Minimum order quantity is ${moq} pieces.`
        );


        return;

      }


      if (
        value > stock
      ) {

        setQuantity(
          stock
        );


        setCartError(
          `Only ${stock} pieces are available.`
        );


        return;

      }


      setQuantity(
        value
      );


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

        navigate(
          '/cart'
        );

      }

    };


  // ====================================================
  // BUY NOW
  // ====================================================

  const handleBuyNow =
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

        navigate(
          '/checkout'
        );

      }

    };


  // ====================================================
  // REQUEST QUOTATION
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
  // WISHLIST
  // ====================================================

  const handleWishlist =
    async () => {

      if (
        wishlistLoading
      ) {

        return;

      }


      setWishlistLoading(
        true
      );


      try {

        if (
          wishlist
        ) {

          await API.delete(
            `/wishlist/${product._id}`
          );


          setWishlist(
            false
          );

        } else {

          await API.post(
            '/wishlist',
            {
              product:
                product._id,
            }
          );


          setWishlist(
            true
          );

        }

      } catch (err) {

        console.error(
          'Wishlist error:',
          err
        );


        // ----------------------------------------------
        // FALLBACK
        // ----------------------------------------------

        if (
          err.response?.status ===
          401
        ) {

          navigate(
            '/login'
          );

        }

      } finally {

        setWishlistLoading(
          false
        );

      }

    };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-[60vh]
          flex
          items-center
          justify-center
          bg-slate-50
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              w-12
              h-12
              border-4
              border-slate-200
              border-t-teal-600
              rounded-full
              animate-spin
              mx-auto
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
          min-h-[60vh]
          flex
          items-center
          justify-center
          bg-slate-50
          px-4
        "
      >

        <div
          className="
            max-w-md
            w-full
            bg-white
            border
            border-red-200
            rounded-2xl
            p-8
            text-center
          "
        >

          <div
            className="
              text-5xl
            "
          >

            📦

          </div>


          <h2
            className="
              mt-4
              text-xl
              font-bold
              text-slate-800
            "
          >

            Product Not Found

          </h2>


          <p
            className="
              mt-2
              text-sm
              text-red-600
            "
          >

            {error}

          </p>


          <Link
            to="/products"
            className="
              inline-block
              mt-6
              px-5
              py-2.5
              rounded-xl
              bg-teal-600
              text-white
              font-semibold
              hover:bg-teal-700
            "
          >

            Back to Products

          </Link>

        </div>

      </div>

    );

  }


  if (!product) {
    return null;
  }


  // ====================================================
  // RENDER
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
          pt-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
            overflow-x-auto
            whitespace-nowrap
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


          <span>
            /
          </span>


          <Link
            to="/products"
            className="
              hover:text-teal-600
            "
          >

            Products

          </Link>


          <span>
            /
          </span>


          <span
            className="
              text-slate-800
              font-medium
            "
          >

            {product.name}

          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN PRODUCT
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            overflow-hidden
          "
        >

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-0
            "
          >

            {/* ==================================================
                LEFT - IMAGES
            ================================================== */}

            <div
              className="
                p-5
                sm:p-8
                bg-slate-50
              "
            >

              <div
                className="
                  relative
                  bg-white
                  rounded-2xl
                  border
                  border-slate-200
                  overflow-hidden
                "
              >

                <img
                  src={
                    images[
                      selectedImage
                    ] ||
                    images[0]
                  }
                  alt={
                    product.name
                  }
                  className="
                    w-full
                    aspect-square
                    object-contain
                  "
                />


                {/* Wishlist */}

                <button
                  type="button"
                  onClick={
                    handleWishlist
                  }
                  disabled={
                    wishlistLoading
                  }
                  className="
                    absolute
                    top-4
                    right-4
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    shadow-md
                    flex
                    items-center
                    justify-center
                    text-xl
                    hover:scale-105
                    transition-transform
                  "
                  title="Wishlist"
                >

                  {wishlist
                    ? '❤️'
                    : '♡'}

                </button>

              </div>


              {/* ==================================================
                  IMAGE THUMBNAILS
              ================================================== */}

              {images.length >
                1 && (

                <div
                  className="
                    flex
                    gap-3
                    mt-4
                    overflow-x-auto
                  "
                >

                  {images.map(
                    (
                      image,
                      index
                    ) => (

                      <button
                        type="button"
                        key={
                          `${image}-${index}`
                        }
                        onClick={() =>
                          setSelectedImage(
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
                          bg-white
                          ${
                            selectedImage ===
                            index
                              ? 'border-teal-600'
                              : 'border-slate-200'
                          }
                        `}
                      >

                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
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
                RIGHT - DETAILS
            ================================================== */}

            <div
              className="
                p-5
                sm:p-8
              "
            >

              {/* Category */}

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-teal-600
                "
              >

                {product.category ||
                  'Wholesale Product'}

              </p>


              {/* Name */}

              <h1
                className="
                  mt-2
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  text-slate-900
                "
              >

                {product.name}

              </h1>


              {/* SKU */}

              {product.sku && (

                <p
                  className="
                    mt-2
                    text-xs
                    text-slate-400
                  "
                >

                  SKU:
                  {' '}
                  {product.sku}

                </p>

              )}


              {/* Rating */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-4
                "
              >

                <span
                  className="
                    text-amber-500
                  "
                >

                  ★★★★★

                </span>


                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Customer Reviews

                </span>

              </div>


              {/* ==================================================
                  PRICE
              ================================================== */}

              <div
                className="
                  mt-6
                  p-5
                  rounded-2xl
                  bg-teal-50
                  border
                  border-teal-100
                "
              >

                <p
                  className="
                    text-xs
                    text-teal-700
                    font-semibold
                  "
                >

                  WHOLESALE PRICE

                </p>


                <div
                  className="
                    flex
                    items-end
                    gap-3
                    mt-1
                  "
                >

                  <span
                    className="
                      text-3xl
                      font-extrabold
                      text-teal-900
                    "
                  >

                    ₹
                    {currentWholesalePrice.toLocaleString(
                      'en-IN',
                      {
                        minimumFractionDigits:
                          2,
                      }
                    )}

                  </span>


                  {basePrice >
                    currentWholesalePrice && (

                    <span
                      className="
                        text-sm
                        text-slate-400
                        line-through
                        mb-1
                      "
                    >

                      ₹
                      {basePrice.toLocaleString(
                        'en-IN'
                      )}

                    </span>

                  )}

                </div>


                <p
                  className="
                    text-xs
                    text-teal-700
                    mt-1
                  "
                >

                  Per piece

                </p>

              </div>


              {/* ==================================================
                  STOCK + MOQ
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-5
                "
              >

                <div
                  className="
                    rounded-xl
                    bg-slate-50
                    border
                    border-slate-200
                    p-4
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >

                    Minimum Order

                  </p>


                  <p
                    className="
                      mt-1
                      font-bold
                      text-slate-800
                    "
                  >

                    {moq} pieces

                  </p>

                </div>


                <div
                  className="
                    rounded-xl
                    bg-slate-50
                    border
                    border-slate-200
                    p-4
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >

                    Availability

                  </p>


                  <p
                    className={`
                      mt-1
                      font-bold
                      ${
                        stock > 0
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }
                    `}
                  >

                    {stock > 0
                      ? `${stock} pcs`
                      : 'Out of Stock'}

                  </p>

                </div>

              </div>


              {/* ==================================================
                  WHOLESALE TIERS
              ================================================== */}

              {product.wholesalePricing &&
                Array.isArray(
                  product.wholesalePricing
                ) &&
                product.wholesalePricing
                  .length > 0 && (

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-200
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      px-4
                      py-3
                      bg-slate-50
                      border-b
                      border-slate-200
                    "
                  >

                    <h2
                      className="
                        text-sm
                        font-bold
                        text-slate-800
                      "
                    >

                      Bulk Pricing

                    </h2>

                  </div>


                  <div
                    className="
                      divide-y
                      divide-slate-100
                    "
                  >

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
                        ) => {

                          const min =
                            Number(
                              tier.minQuantity ||
                              0
                            );


                          const max =
                            tier.maxQuantity ??
                            '+';


                          const active =
                            quantity >=
                            min &&
                            (
                              tier.maxQuantity ===
                                null ||
                              tier.maxQuantity ===
                                undefined ||
                              quantity <=
                                Number(
                                  tier.maxQuantity
                                )
                            );


                          return (

                            <div
                              key={
                                index
                              }
                              className={`
                                flex
                                items-center
                                justify-between
                                px-4
                                py-3
                                ${
                                  active
                                    ? 'bg-teal-50'
                                    : 'bg-white'
                                }
                              `}
                            >

                              <div>

                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                  "
                                >

                                  {min}
                                  {' - '}
                                  {max}
                                  {' '}
                                  pieces

                                </p>


                                {active && (

                                  <span
                                    className="
                                      text-[10px]
                                      text-teal-700
                                      font-semibold
                                    "
                                  >

                                    Current price tier

                                  </span>

                                )}

                              </div>


                              <p
                                className="
                                  font-bold
                                  text-slate-900
                                "
                              >

                                ₹
                                {Number(
                                  tier.price
                                ).toLocaleString(
                                  'en-IN',
                                  {
                                    minimumFractionDigits:
                                      2,
                                  }
                                )}

                                <span
                                  className="
                                    text-xs
                                    font-normal
                                    text-slate-400
                                  "
                                >

                                  {' '}
                                  / piece

                                </span>

                              </p>

                            </div>

                          );

                        }
                      )}

                  </div>

                </div>

              )}


              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div
                className="
                  mt-6
                "
              >

                <h2
                  className="
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >

                  Product Description

                </h2>


                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-600
                    leading-6
                  "
                >

                  {product.description ||
                    'Quality wholesale product suitable for business and bulk purchasing.'}

                </p>

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

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >

                    Order Quantity

                  </p>


                  <span
                    className="
                      text-xs
                      text-slate-400
                    "
                  >

                    MOQ: {moq}

                  </span>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      border
                      border-slate-300
                      rounded-xl
                      overflow-hidden
                    "
                  >

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <=
                        moq
                      }
                      className="
                        w-11
                        h-11
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
                      max={stock}
                      value={
                        quantity
                      }
                      onChange={
                        handleQuantityChange
                      }
                      className="
                        w-20
                        h-11
                        text-center
                        border-x
                        border-slate-200
                        outline-none
                        font-semibold
                      "
                    />


                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        stock
                      }
                      className="
                        w-11
                        h-11
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


                  <div
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    {quantity} pcs

                  </div>

                </div>

              </div>


              {/* ==================================================
                  TOTAL
              ================================================== */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <span
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Estimated Total

                </span>


                <span
                  className="
                    text-xl
                    font-extrabold
                    text-slate-900
                  "
                >

                  ₹
                  {totalPrice.toLocaleString(
                    'en-IN',
                    {
                      minimumFractionDigits:
                        2,
                    }
                  )}

                </span>

              </div>


              {/* ==================================================
                  CART ERROR
              ================================================== */}

              {cartError && (

                <div
                  className="
                    mt-4
                    p-3
                    rounded-xl
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
                  ACTIONS
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
                    stock <= 0
                  }
                  className="
                    py-3.5
                    rounded-xl
                    bg-teal-600
                    text-white
                    font-bold
                    hover:bg-teal-700
                    disabled:bg-slate-300
                    disabled:cursor-not-allowed
                    transition-colors
                  "
                >

                  🛒 Add to Cart

                </button>


                <button
                  type="button"
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    stock <= 0
                  }
                  className="
                    py-3.5
                    rounded-xl
                    bg-slate-900
                    text-white
                    font-bold
                    hover:bg-slate-800
                    disabled:bg-slate-300
                    disabled:cursor-not-allowed
                    transition-colors
                  "
                >

                  ⚡ Buy Now

                </button>

              </div>


              {/* RFQ */}

              <button
                type="button"
                onClick={
                  handleRequestQuotation
                }
                disabled={
                  stock <= 0
                }
                className="
                  w-full
                  mt-3
                  py-3.5
                  rounded-xl
                  border-2
                  border-teal-600
                  text-teal-700
                  font-bold
                  hover:bg-teal-50
                  disabled:border-slate-300
                  disabled:text-slate-400
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >

                📋 Request Best Wholesale Price

              </button>


              <p
                className="
                  text-xs
                  text-center
                  text-slate-400
                  mt-2
                "
              >

                Need a large quantity?
                Request a special price
                from our sales team.

              </p>


              {/* ==================================================
                  TRUST FEATURES
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-7
                  pt-6
                  border-t
                  border-slate-200
                "
              >

                <div
                  className="
                    text-center
                  "
                >

                  <div
                    className="
                      text-2xl
                    "
                  >

                    🚚

                  </div>


                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >

                    Business Delivery

                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                    "
                  >

                    Reliable shipping

                  </p>

                </div>


                <div
                  className="
                    text-center
                  "
                >

                  <div
                    className="
                      text-2xl
                    "
                  >

                    🔒

                  </div>


                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >

                    Secure Payment

                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                    "
                  >

                    Safe checkout

                  </p>

                </div>


                <div
                  className="
                    text-center
                  "
                >

                  <div
                    className="
                      text-2xl
                    "
                  >

                    📦

                  </div>


                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >

                    Bulk Orders

                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                    "
                  >

                    Wholesale pricing

                  </p>

                </div>


                <div
                  className="
                    text-center
                  "
                >

                  <div
                    className="
                      text-2xl
                    "
                  >

                    🔄

                  </div>


                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >

                    Easy Returns

                  </p>


                  <p
                    className="
                      text-[10px]
                      text-slate-400
                    "
                  >

                    Business support

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            PRODUCT INFORMATION
        ================================================== */}

        <section
          className="
            mt-6
            bg-white
            rounded-3xl
            border
            border-slate-200
            p-5
            sm:p-8
          "
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            {/* Description */}

            <div>

              <h2
                className="
                  font-bold
                  text-slate-800
                "
              >

                Product Information

              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  leading-6
                "
              >

                {product.description ||
                  'Product information is available for business and wholesale buyers.'}

              </p>

            </div>


            {/* Specifications */}

            <div>

              <h2
                className="
                  font-bold
                  text-slate-800
                "
              >

                Specifications

              </h2>


              <div
                className="
                  mt-3
                  space-y-2
                  text-sm
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    gap-4
                  "
                >

                  <span
                    className="
                      text-slate-400
                    "
                  >

                    Category

                  </span>


                  <span
                    className="
                      font-medium
                      text-slate-700
                      text-right
                    "
                  >

                    {product.category ||
                      'N/A'}

                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-4
                  "
                >

                  <span
                    className="
                      text-slate-400
                    "
                  >

                    MOQ

                  </span>


                  <span
                    className="
                      font-medium
                      text-slate-700
                    "
                  >

                    {moq} pcs

                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    gap-4
                  "
                >

                  <span
                    className="
                      text-slate-400
                    "
                  >

                    Stock

                  </span>


                  <span
                    className="
                      font-medium
                      text-slate-700
                    "
                  >

                    {stock} pcs

                  </span>

                </div>


                {product.brand && (

                  <div
                    className="
                      flex
                      justify-between
                      gap-4
                    "
                  >

                    <span
                      className="
                        text-slate-400
                      "
                    >

                      Brand

                    </span>


                    <span
                      className="
                        font-medium
                        text-slate-700
                      "
                    >

                      {product.brand}

                    </span>

                  </div>

                )}

              </div>

            </div>


            {/* Shipping */}

            <div>

              <h2
                className="
                  font-bold
                  text-slate-800
                "
              >

                Shipping & Returns

              </h2>


              <div
                className="
                  mt-3
                  space-y-3
                  text-sm
                  text-slate-500
                "
              >

                <p>

                  🚚 Business shipping
                  available for bulk orders.

                </p>


                <p>

                  📦 Shipping charges are
                  calculated during checkout.

                </p>


                <p>

                  🔄 Returns are subject to
                  the applicable return policy.

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            MARKETPLACE
        ================================================== */}

        <section
          className="
            mt-6
            bg-white
            rounded-3xl
            border
            border-slate-200
            p-5
            sm:p-8
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-slate-800
            "
          >

            Perfect for Online Sellers

          </h2>


          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >

            Suitable for businesses selling
            through major marketplaces.

          </p>


          <div
            className="
              flex
              flex-wrap
              gap-3
              mt-5
            "
          >

            {marketplaces.map(
              (name) => (

                <span
                  key={name}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-slate-100
                    text-slate-700
                    text-sm
                    font-semibold
                  "
                >

                  {name}

                </span>

              )
            )}

          </div>

        </section>


        {/* ==================================================
            RELATED PRODUCTS
        ================================================== */}

        {relatedProducts.length >
          0 && (

          <section
            className="
              mt-8
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                mb-4
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-teal-600
                    font-bold
                  "
                >

                  You may also like

                </p>


                <h2
                  className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  "
                >

                  Related Products

                </h2>

              </div>


              <Link
                to="/products"
                className="
                  text-sm
                  font-semibold
                  text-teal-700
                  hover:underline
                "
              >

                View All

              </Link>

            </div>


            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-4
              "
            >

              {relatedProducts.map(
                (item) => {

                  const itemImage =
                    item.images?.[0] ||
                    item.image ||
                    'https://via.placeholder.com/400x400?text=No+Image';


                  const itemPrice =
                    Number(
                      item.wholesalePrice ||
                      item.bulkPrice ||
                      item.price ||
                      0
                    );


                  return (

                    <Link
                      key={
                        item._id
                      }
                      to={`/product/${item._id}`}
                      className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        overflow-hidden
                        hover:shadow-lg
                        hover:border-teal-300
                        transition-all
                      "
                    >

                      <div
                        className="
                          aspect-square
                          bg-slate-50
                          overflow-hidden
                        "
                      >

                        <img
                          src={
                            itemImage
                          }
                          alt={
                            item.name
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                            hover:scale-105
                            transition-transform
                          "
                        />

                      </div>


                      <div
                        className="
                          p-3
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-teal-600
                            font-semibold
                          "
                        >

                          {item.category ||
                            'Product'}

                        </p>


                        <h3
                          className="
                            mt-1
                            font-bold
                            text-sm
                            text-slate-800
                            line-clamp-2
                          "
                        >

                          {item.name}

                        </h3>


                        <p
                          className="
                            mt-2
                            font-extrabold
                            text-slate-900
                          "
                        >

                          ₹
                          {itemPrice.toLocaleString(
                            'en-IN'
                          )}

                        </p>

                      </div>

                    </Link>

                  );

                }
              )}

            </div>

          </section>

        )}

      </main>

    </div>

  );

};


export default ProductDetail;