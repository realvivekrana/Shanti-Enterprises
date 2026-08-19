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

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// PRODUCT DETAILS PAGE
// ======================================================

const ProductDetail = () => {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const {
    addToCart,
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
    activeTab,
    setActiveTab,
  ] = useState(
    'details'
  );


  // ====================================================
  // FETCH PRODUCT
  // ====================================================

  useEffect(() => {

    const fetchProduct =
      async () => {

        try {

          setLoading(true);

          setError('');


          const response =
            await fetch(
              `${API_URL}/api/products/${id}`
            );


          if (!response.ok) {

            throw new Error(
              'Product not found'
            );

          }


          const data =
            await response.json();


          /*
           * Existing backend ke possible
           * response structures handle kar rahe hain.
           */

          const productData =
            data?.data?.product ||
            data?.data ||
            data?.product ||
            data;


          setProduct(
            productData
          );


        } catch (err) {

          console.error(
            'Product details error:',
            err
          );


          setError(
            err.message ||
            'Unable to load product'
          );


        } finally {

          setLoading(false);

        }

      };


    fetchProduct();

  }, [
    id,
  ]);


  // ====================================================
  // NORMALIZED PRODUCT VALUES
  // ====================================================

  const productData =
    useMemo(() => {

      if (!product) {

        return null;

      }


      const images =
        product.images?.length
          ? product.images
          : product.image
            ? [product.image]
            : product.thumbnail
              ? [product.thumbnail]
              : [];


      const basePrice =
        Number(
          product.price ??
          product.sellingPrice ??
          product.salePrice ??
          0
        );


      const productMOQ =
        Number(
          product.moq ??
          product.minimumOrderQuantity ??
          product.minOrderQuantity ??
          1
        );


      const productStock =
        Number(
          product.stock ??
          product.countInStock ??
          product.inventory ??
          product.quantity ??
          0
        );


      const productSKU =
        product.sku ||
        product.SKU ||
        product.productCode ||
        'N/A';


      const rating =
        Number(
          product.rating ??
          product.ratings ??
          0
        );


      const reviewCount =
        Number(
          product.numReviews ??
          product.reviewCount ??
          product.reviews?.length ??
          0
        );


      /*
       * Wholesale pricing tiers.
       *
       * Agar backend se wholesalePricing
       * milta hai to usko use karenge.
       *
       * Nahi milta to product ke normal
       * price se fallback tiers banenge.
       */

      let pricingTiers = [];


      if (
        Array.isArray(
          product.wholesalePricing
        ) &&
        product.wholesalePricing.length > 0
      ) {

        pricingTiers =
          product.wholesalePricing
            .map(
              (tier) => ({

                minQuantity:
                  Number(
                    tier.minQuantity ??
                    tier.minQty ??
                    tier.minimumQuantity ??
                    1
                  ),

                maxQuantity:
                  tier.maxQuantity === null ||
                  tier.maxQuantity === undefined ||
                  tier.maxQuantity === ''
                    ? null
                    : Number(
                        tier.maxQuantity
                      ),

                price:
                  Number(
                    tier.price ??
                    tier.unitPrice ??
                    basePrice
                  ),

              })
            )
            .sort(
              (
                a,
                b
              ) =>
                a.minQuantity -
                b.minQuantity
            );

      } else {

        /*
         * Default B2B pricing engine.
         *
         * Example:
         * 1–49     base price
         * 50–199   12% discount
         * 200–499  20% discount
         * 500+     28% discount
         *
         * Ye fallback hai.
         * Real product ke wholesalePricing
         * aane par wahi prices use honge.
         */

        pricingTiers = [

          {
            minQuantity: 1,
            maxQuantity: 49,
            price: basePrice,
          },

          {
            minQuantity: 50,
            maxQuantity: 199,
            price:
              Number(
                (
                  basePrice *
                  0.88
                ).toFixed(2)
              ),
          },

          {
            minQuantity: 200,
            maxQuantity: 499,
            price:
              Number(
                (
                  basePrice *
                  0.80
                ).toFixed(2)
              ),
          },

          {
            minQuantity: 500,
            maxQuantity: null,
            price:
              Number(
                (
                  basePrice *
                  0.72
                ).toFixed(2)
              ),
          },

        ];

      }


      return {

        ...product,

        images,

        basePrice,

        productMOQ,

        productStock,

        productSKU,

        rating,

        reviewCount,

        pricingTiers,

      };

    }, [
      product,
    ]);


  // ====================================================
  // CURRENT PRICING TIER
  // ====================================================

  const currentPricingTier =
    useMemo(() => {

      if (
        !productData ||
        !productData.pricingTiers?.length
      ) {

        return null;

      }


      /*
       * Highest matching tier select karenge.
       */

      let matchedTier =
        productData.pricingTiers[0];


      productData.pricingTiers.forEach(
        (tier) => {

          const meetsMinimum =
            quantity >=
            tier.minQuantity;


          const withinMaximum =
            tier.maxQuantity === null ||
            quantity <=
            tier.maxQuantity;


          if (
            meetsMinimum &&
            withinMaximum
          ) {

            matchedTier =
              tier;

          }

        }
      );


      return matchedTier;

    }, [
      productData,
      quantity,
    ]);


  // ====================================================
  // CURRENT UNIT PRICE
  // ====================================================

  const unitPrice =
    currentPricingTier?.price ||
    productData?.basePrice ||
    0;


  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal =
    unitPrice *
    quantity;


  // ====================================================
  // MOQ VALIDATION
  // ====================================================

  const minimumQuantity =
    productData?.productMOQ ||
    1;


  // ====================================================
  // STOCK VALIDATION
  // ====================================================

  const isOutOfStock =
    productData
      ? productData.productStock <= 0
      : false;


  // ====================================================
  // QUANTITY CHANGE
  // ====================================================

  const increaseQuantity =
    () => {

      const nextQuantity =
        quantity + 1;


      setQuantity(
        nextQuantity
      );

    };


  const decreaseQuantity =
    () => {

      const nextQuantity =
        quantity - 1;


      if (
        nextQuantity >=
        minimumQuantity
      ) {

        setQuantity(
          nextQuantity
        );

      }

    };


  const handleQuantityInput =
    (event) => {

      const value =
        Number(
          event.target.value
        );


      if (
        !Number.isFinite(
          value
        )
      ) {

        return;

      }


      if (
        value <
        minimumQuantity
      ) {

        setQuantity(
          minimumQuantity
        );

        return;

      }


      if (
        productData?.productStock > 0 &&
        value >
        productData.productStock
      ) {

        setQuantity(
          productData.productStock
        );

        return;

      }


      setQuantity(
        Math.floor(
          value
        )
      );

    };


  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart =
    () => {

      if (!productData) {

        return;

      }


      if (
        quantity <
        minimumQuantity
      ) {

        alert(
          `Minimum order quantity is ${minimumQuantity}`
        );

        return;

      }


      if (
        isOutOfStock
      ) {

        alert(
          'This product is out of stock'
        );

        return;

      }


      try {

        addToCart(
          productData,
          quantity
        );


        /*
         * Cart add hone ke baad
         * customer ko cart page par
         * le ja sakte hain.
         */

        navigate(
          '/cart'
        );

      } catch (err) {

        console.error(
          'Add to cart error:',
          err
        );

        alert(
          'Unable to add product to cart'
        );

      }

    };


  // ====================================================
  // REQUEST QUOTE
  // ====================================================

  const handleRequestQuote =
    () => {

      if (!productData) {

        return;

      }


      navigate(
        `/products/${productData._id || productData.id}/rfq`,
        {
          state: {

            quantity,

            unitPrice,

            subtotal,

          },

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
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

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

  if (
    error ||
    !productData
  ) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            max-w-md
            w-full
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-8
            text-center
          "
        >

          <div
            className="
              text-4xl
            "
          >

            📦

          </div>


          <h1
            className="
              mt-4
              text-xl
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

            {error ||
              'This product is not available.'}

          </p>


          <Link
            to="/products"
            className="
              inline-flex
              mt-6
              px-5
              py-3
              rounded-xl
              bg-teal-600
              text-white
              text-sm
              font-bold
              hover:bg-teal-700
            "
          >

            Back to Products

          </Link>

        </div>

      </div>

    );

  }


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
          pt-5
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
            overflow-x-auto
            whitespace-nowrap
          "
        >

          <Link
            to="/"
            className="
              hover:text-teal-700
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
              hover:text-teal-700
            "
          >

            Products

          </Link>


          <span>
            /
          </span>


          <span
            className="
              text-slate-700
              font-medium
              truncate
            "
          >

            {productData.name}

          </span>

        </div>

      </div>


      {/* ==================================================
          PRODUCT MAIN
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
          sm:py-8
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

          <section>

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
              "
            >

              <div
                className="
                  aspect-square
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                {productData.images.length >
                0 ? (

                  <img
                    src={
                      productData.images[
                        selectedImage
                      ]
                    }
                    alt={
                      productData.name
                    }
                    className="
                      w-full
                      h-full
                      object-contain
                      p-4
                      sm:p-8
                    "
                  />

                ) : (

                  <div
                    className="
                      text-7xl
                      text-slate-300
                    "
                  >

                    📦

                  </div>

                )}

              </div>

            </div>


            {/* ==================================================
                THUMBNAILS
            ================================================== */}

            {productData.images.length >
              1 && (

              <div
                className="
                  flex
                  gap-3
                  mt-4
                  overflow-x-auto
                  pb-1
                "
              >

                {productData.images.map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      key={
                        `${image}-${index}`
                      }
                      type="button"
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
                        ${
                          selectedImage ===
                          index
                            ? 'border-teal-600'
                            : 'border-slate-200'
                        }
                      `}
                    >

                      <img
                        src={
                          image
                        }
                        alt={
                          `${productData.name} ${index + 1}`
                        }
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

          </section>


          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <section>

            {/* ==================================================
                BRAND
            ================================================== */}

            {productData.brand && (

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-teal-600
                "
              >

                {typeof productData.brand ===
                'object'
                  ? productData.brand.name
                  : productData.brand}

              </p>

            )}


            {/* ==================================================
                PRODUCT NAME
            ================================================== */}

            <h1
              className="
                mt-2
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-extrabold
                leading-tight
                text-slate-900
              "
            >

              {productData.name}

            </h1>


            {/* ==================================================
                RATING + SKU
            ================================================== */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-4
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-1
                "
              >

                <span
                  className="
                    text-yellow-500
                  "
                >

                  ★

                </span>


                <span
                  className="
                    font-bold
                    text-slate-700
                  "
                >

                  {productData.rating
                    ? productData.rating.toFixed(
                        1
                      )
                    : 'No rating'}

                </span>


                {productData.reviewCount >
                  0 && (

                  <span
                    className="
                      text-slate-400
                    "
                  >

                    (
                    {
                      productData.reviewCount
                    } reviews)

                  </span>

                )}

              </div>


              <span
                className="
                  text-slate-300
                "
              >

                |

              </span>


              <div
                className="
                  text-slate-500
                "
              >

                SKU:{' '}

                <strong
                  className="
                    text-slate-700
                  "
                >

                  {
                    productData.productSKU
                  }

                </strong>

              </div>

            </div>


            {/* ==================================================
                MOQ / STOCK
            ================================================== */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-3
              "
            >

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-teal-50
                  border
                  border-teal-100
                "
              >

                <p
                  className="
                    text-[11px]
                    text-teal-600
                    font-semibold
                  "
                >

                  Minimum Order

                </p>


                <p
                  className="
                    mt-0.5
                    text-sm
                    font-bold
                    text-teal-800
                  "
                >

                  {productData.productMOQ}
                  {' '}
                  pieces

                </p>

              </div>


              <div
                className={`
                  px-4
                  py-2
                  rounded-xl
                  border
                  ${
                    isOutOfStock
                      ? 'bg-red-50 border-red-100'
                      : 'bg-emerald-50 border-emerald-100'
                  }
                `}
              >

                <p
                  className="
                    text-[11px]
                    font-semibold
                    text-slate-500
                  "
                >

                  Availability

                </p>


                <p
                  className={`
                    mt-0.5
                    text-sm
                    font-bold
                    ${
                      isOutOfStock
                        ? 'text-red-600'
                        : 'text-emerald-700'
                    }
                  `}
                >

                  {isOutOfStock
                    ? 'Out of Stock'
                    : `${productData.productStock} pieces available`}

                </p>

              </div>

            </div>


            {/* ==================================================
                WHOLESALE PRICING
            ================================================== */}

            <div
              className="
                mt-7
                rounded-2xl
                border
                border-slate-200
                bg-white
                overflow-hidden
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

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
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

                      Buy more, save more

                    </p>

                  </div>


                  <span
                    className="
                      text-xl
                    "
                  >

                    💰

                  </span>

                </div>

              </div>


              {/* TABLE */}

              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full
                    text-sm
                  "
                >

                  <thead>

                    <tr
                      className="
                        border-b
                        border-slate-100
                        text-left
                      "
                    >

                      <th
                        className="
                          px-5
                          py-3
                          font-semibold
                          text-slate-500
                        "
                      >

                        Quantity

                      </th>


                      <th
                        className="
                          px-5
                          py-3
                          text-right
                          font-semibold
                          text-slate-500
                        "
                      >

                        Price / Unit

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {productData.pricingTiers.map(
                      (
                        tier,
                        index
                      ) => {

                        const isActive =
                          currentPricingTier ===
                          tier;


                        const quantityLabel =
                          tier.maxQuantity ===
                          null
                            ? `${tier.minQuantity}+`
                            : `${tier.minQuantity}–${tier.maxQuantity}`;


                        return (

                          <tr
                            key={
                              `${tier.minQuantity}-${index}`
                            }
                            className={`
                              border-b
                              border-slate-100
                              last:border-b-0
                              transition-colors
                              ${
                                isActive
                                  ? 'bg-teal-50'
                                  : ''
                              }
                            `}
                          >

                            <td
                              className={`
                                px-5
                                py-3.5
                                font-medium
                                ${
                                  isActive
                                    ? 'text-teal-800 font-bold'
                                    : 'text-slate-600'
                                }
                              `}
                            >

                              {quantityLabel}

                              {isActive && (

                                <span
                                  className="
                                    ml-2
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    text-teal-600
                                  "
                                >

                                  Current

                                </span>

                              )}

                            </td>


                            <td
                              className={`
                                px-5
                                py-3.5
                                text-right
                                font-bold
                                ${
                                  isActive
                                    ? 'text-teal-700'
                                    : 'text-slate-800'
                                }
                              `}
                            >

                              ₹
                              {
                                tier.price.toLocaleString(
                                  'en-IN'
                                )
                              }

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* ==================================================
                CURRENT PRICE INFO
            ================================================== */}

            <div
              className="
                mt-5
                p-4
                rounded-xl
                bg-teal-50
                border
                border-teal-100
              "
            >

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      text-teal-600
                      font-semibold
                    "
                  >

                    Current Wholesale Price

                  </p>


                  <p
                    className="
                      mt-1
                      text-2xl
                      font-extrabold
                      text-teal-800
                    "
                  >

                    ₹
                    {
                      unitPrice.toLocaleString(
                        'en-IN'
                      )
                    }

                    <span
                      className="
                        text-sm
                        font-medium
                        text-teal-600
                      "
                    >

                      {' '}
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
                      text-slate-500
                    "
                  >

                    Quantity

                  </p>


                  <p
                    className="
                      font-bold
                      text-slate-800
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

                  MOQ: {minimumQuantity}

                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  w-full
                  max-w-xs
                  h-12
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
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
                    minimumQuantity
                  }
                  className="
                    w-12
                    h-full
                    text-xl
                    font-bold
                    text-slate-600
                    hover:bg-slate-50
                    disabled:text-slate-300
                    disabled:cursor-not-allowed
                  "
                >

                  −

                </button>


                <input
                  type="number"
                  min={
                    minimumQuantity
                  }
                  max={
                    productData.productStock ||
                    undefined
                  }
                  value={
                    quantity
                  }
                  onChange={
                    handleQuantityInput
                  }
                  className="
                    flex-1
                    min-w-0
                    h-full
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
                    productData.productStock >
                      0 &&
                    quantity >=
                      productData.productStock
                  }
                  className="
                    w-12
                    h-full
                    text-xl
                    font-bold
                    text-slate-600
                    hover:bg-slate-50
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
                mt-6
                flex
                items-center
                justify-between
                gap-4
                p-4
                rounded-xl
                bg-white
                border
                border-slate-200
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Subtotal

                </p>


                <p
                  className="
                    text-xs
                    text-slate-400
                    mt-1
                  "
                >

                  {quantity} × ₹
                  {
                    unitPrice.toLocaleString(
                      'en-IN'
                    )
                  }

                </p>

              </div>


              <p
                className="
                  text-2xl
                  font-extrabold
                  text-slate-900
                "
              >

                ₹
                {
                  subtotal.toLocaleString(
                    'en-IN'
                  )
                }

              </p>

            </div>


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
                mt-5
              "
            >

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  isOutOfStock
                }
                className="
                  h-12
                  rounded-xl
                  bg-teal-600
                  text-white
                  font-bold
                  text-sm
                  hover:bg-teal-700
                  disabled:bg-slate-200
                  disabled:text-slate-400
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >

                {isOutOfStock
                  ? 'Out of Stock'
                  : '🛒 Add to Cart'}

              </button>


              <button
                type="button"
                onClick={
                  handleRequestQuote
                }
                className="
                  h-12
                  rounded-xl
                  border-2
                  border-teal-600
                  text-teal-700
                  font-bold
                  text-sm
                  hover:bg-teal-50
                  transition-colors
                "
              >

                📋 Request Quote

              </button>

            </div>

          </section>

        </div>


        {/* ==================================================
            PRODUCT INFORMATION TABS
        ================================================== */}

        <section
          className="
            mt-12
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
          "
        >

          {/* ==================================================
              TAB NAVIGATION
          ================================================== */}

          <div
            className="
              flex
              overflow-x-auto
              border-b
              border-slate-200
            "
          >

            <TabButton
              active={
                activeTab ===
                'details'
              }
              onClick={() =>
                setActiveTab(
                  'details'
                )
              }
            >

              Product Details

            </TabButton>


            <TabButton
              active={
                activeTab ===
                'specifications'
              }
              onClick={() =>
                setActiveTab(
                  'specifications'
                )
              }
            >

              Specifications

            </TabButton>


            <TabButton
              active={
                activeTab ===
                'shipping'
              }
              onClick={() =>
                setActiveTab(
                  'shipping'
                )
              }
            >

              Shipping

            </TabButton>


            <TabButton
              active={
                activeTab ===
                'returns'
              }
              onClick={() =>
                setActiveTab(
                  'returns'
                )
              }
            >

              Return Policy

            </TabButton>

          </div>


          {/* ==================================================
              TAB CONTENT
          ================================================== */}

          <div
            className="
              p-5
              sm:p-7
            "
          >

            {activeTab ===
              'details' && (

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-800
                  "
                >

                  Product Details

                </h2>


                <p
                  className="
                    mt-4
                    text-sm
                    text-slate-600
                    leading-7
                    whitespace-pre-line
                  "
                >

                  {productData.description ||
                    'Product description is not available.'}

                </p>

              </div>

            )}


            {activeTab ===
              'specifications' && (

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-800
                  "
                >

                  Specifications

                </h2>


                {productData.specifications &&
                typeof productData.specifications ===
                  'object' ? (

                  <div
                    className="
                      mt-5
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                    "
                  >

                    {Object.entries(
                      productData.specifications
                    ).map(
                      (
                        [
                          key,
                          value,
                        ],
                        index
                      ) => (

                        <div
                          key={
                            key
                          }
                          className={`
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            ${
                              index %
                                2 ===
                              0
                                ? 'bg-slate-50'
                                : 'bg-white'
                            }
                          `}
                        >

                          <div
                            className="
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              text-slate-600
                            "
                          >

                            {formatLabel(
                              key
                            )}

                          </div>


                          <div
                            className="
                              px-4
                              py-3
                              text-sm
                              text-slate-800
                            "
                          >

                            {String(
                              value
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p
                    className="
                      mt-4
                      text-sm
                      text-slate-500
                    "
                  >

                    Product specifications
                    are not available.

                  </p>

                )}

              </div>

            )}


            {activeTab ===
              'shipping' && (

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-800
                  "
                >

                  Shipping

                </h2>


                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-4
                  "
                >

                  <InfoBox
                    icon="🚚"
                    title="Business Delivery"
                    text="Shipping is arranged according to your delivery location and order requirements."
                  />


                  <InfoBox
                    icon="📦"
                    title="Bulk Orders"
                    text="Large orders may be shipped in multiple packages depending on quantity and availability."
                  />


                  <InfoBox
                    icon="📍"
                    title="Order Tracking"
                    text="Tracking information will be available after your order is shipped."
                  />

                </div>

              </div>

            )}


            {activeTab ===
              'returns' && (

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-800
                  "
                >

                  Return Policy

                </h2>


                <p
                  className="
                    mt-4
                    text-sm
                    text-slate-600
                    leading-7
                  "
                >

                  Returns and refunds are subject
                  to the applicable order and
                  product return policy. Please
                  check the return conditions before
                  placing a bulk order.

                </p>


                <Link
                  to="/policies/returns"
                  className="
                    inline-flex
                    mt-5
                    text-sm
                    font-bold
                    text-teal-700
                    hover:text-teal-800
                  "
                >

                  View Full Return Policy →

                </Link>

              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            IMPORTANT NOTICE
        ================================================== */}

        <section
          className="
            mt-6
            p-5
            rounded-2xl
            bg-amber-50
            border
            border-amber-200
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <span
              className="
                text-xl
              "
            >

              ⚠️

            </span>


            <div>

              <h3
                className="
                  font-bold
                  text-amber-900
                "
              >

                Important

              </h3>


              <p
                className="
                  mt-1
                  text-sm
                  text-amber-800
                  leading-6
                "
              >

                Wholesale prices are based on
                quantity. Increase the quantity
                above to automatically see the
                applicable price tier.

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

};


// ======================================================
// TAB BUTTON
// ======================================================

const TabButton = ({
  active,
  onClick,
  children,
}) => {

  return (

    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        shrink-0
        px-5
        py-4
        text-sm
        font-semibold
        border-b-2
        transition-colors
        ${
          active
            ? 'border-teal-600 text-teal-700'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }
      `}
    >

      {children}

    </button>

  );

};


// ======================================================
// INFO BOX
// ======================================================

const InfoBox = ({
  icon,
  title,
  text,
}) => {

  return (

    <div
      className="
        p-5
        rounded-xl
        bg-slate-50
        border
        border-slate-200
      "
    >

      <div
        className="
          text-2xl
        "
      >

        {icon}

      </div>


      <h3
        className="
          mt-3
          font-bold
          text-slate-800
        "
      >

        {title}

      </h3>


      <p
        className="
          mt-2
          text-xs
          text-slate-500
          leading-5
        "
      >

        {text}

      </p>

    </div>

  );

};


// ======================================================
// FORMAT SPECIFICATION LABEL
// ======================================================

const formatLabel =
  (value) => {

    return String(
      value
    )
      .replace(
        /([A-Z])/g,
        ' $1'
      )
      .replace(
        /^./,
        (character) =>
          character.toUpperCase()
      );

  };


export default ProductDetail;