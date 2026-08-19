import {
  useMemo,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// CONSTANTS
// ======================================================

const GST_RATE = 0.18;

const SHIPPING_CHARGE = 2000;

const BULK_DISCOUNT_THRESHOLD = 50000;

const BULK_DISCOUNT_RATE = 0.05;


// ======================================================
// CART PAGE
// ======================================================

const Cart = () => {

  const navigate =
    useNavigate();


  const {
    cartItems = [],
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useCart();


  // ====================================================
  // NORMALIZE CART ITEMS
  // ====================================================

  const normalizedItems =
    useMemo(() => {

      return cartItems.map(
        (item) => {

          const product =
            item.product ||
            item;


          const quantity =
            Number(
              item.quantity ||
              1
            );


          /*
           * Product Details page se wholesale
           * price aa sakta hai.
           */

          const unitPrice =
            Number(
              item.unitPrice ??
              item.price ??
              product.unitPrice ??
              product.price ??
              product.sellingPrice ??
              0
            );


          const image =
            item.image ||
            product.image ||
            product.images?.[0] ||
            product.thumbnail ||
            '';


          const name =
            item.name ||
            product.name ||
            'Product';


          const productId =
            item._id ||
            item.productId ||
            product._id ||
            product.id;


          return {

            ...item,

            product,

            productId,

            name,

            image,

            quantity,

            unitPrice,

            lineTotal:
              unitPrice *
              quantity,

          };

        }
      );

    }, [
      cartItems,
    ]);


  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal =
    useMemo(() => {

      return normalizedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.lineTotal,
        0
      );

    }, [
      normalizedItems,
    ]);


  // ====================================================
  // TOTAL QUANTITY
  // ====================================================

  const totalQuantity =
    useMemo(() => {

      return normalizedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );

    }, [
      normalizedItems,
    ]);


  // ====================================================
  // BULK DISCOUNT
  // ====================================================

  const bulkDiscount =
    useMemo(() => {

      /*
       * B2B cart discount:
       *
       * ₹50,000+ subtotal
       * => 5% bulk discount
       *
       * Isko later backend pricing engine
       * ke according replace kiya ja sakta hai.
       */

      if (
        subtotal >=
        BULK_DISCOUNT_THRESHOLD
      ) {

        return Number(
          (
            subtotal *
            BULK_DISCOUNT_RATE
          ).toFixed(2)
        );

      }


      return 0;

    }, [
      subtotal,
    ]);


  // ====================================================
  // TAXABLE AMOUNT
  // ====================================================

  const taxableAmount =
    Math.max(
      0,
      subtotal -
      bulkDiscount
    );


  // ====================================================
  // GST
  // ====================================================

  const gst =
    Number(
      (
        taxableAmount *
        GST_RATE
      ).toFixed(2)
    );


  // ====================================================
  // SHIPPING
  // ====================================================

  const shipping =
    normalizedItems.length > 0
      ? SHIPPING_CHARGE
      : 0;


  // ====================================================
  // GRAND TOTAL
  // ====================================================

  const grandTotal =
    taxableAmount +
    gst +
    shipping;


  // ====================================================
  // UPDATE QUANTITY
  // ====================================================

  const handleIncrease =
    (item) => {

      const nextQuantity =
        item.quantity + 1;


      if (
        typeof addToCart ===
        'function'
      ) {

        /*
         * Existing CartContext agar
         * addToCart(product, quantity)
         * support karta hai.
         */

        addToCart(
          item.product ||
          item,
          1
        );

        return;

      }


      if (
        typeof updateCartQuantity ===
        'function'
      ) {

        updateCartQuantity(
          item.productId,
          nextQuantity
        );

      }

    };


  const handleDecrease =
    (item) => {

      const nextQuantity =
        item.quantity - 1;


      if (
        nextQuantity <= 0
      ) {

        handleRemove(
          item
        );

        return;

      }


      if (
        typeof updateCartQuantity ===
        'function'
      ) {

        updateCartQuantity(
          item.productId,
          nextQuantity
        );

        return;

      }

    };


  // ====================================================
  // DIRECT QUANTITY
  // ====================================================

  const handleQuantityChange =
    (
      item,
      value
    ) => {

      const quantity =
        Number(
          value
        );


      if (
        !Number.isFinite(
          quantity
        )
      ) {

        return;

      }


      if (
        quantity <= 0
      ) {

        handleRemove(
          item
        );

        return;

      }


      if (
        typeof updateCartQuantity ===
        'function'
      ) {

        updateCartQuantity(
          item.productId,
          Math.floor(
            quantity
          )
        );

      }

    };


  // ====================================================
  // REMOVE
  // ====================================================

  const handleRemove =
    (item) => {

      if (
        typeof removeFromCart ===
        'function'
      ) {

        removeFromCart(
          item.productId
        );

      }

    };


  // ====================================================
  // CHECKOUT
  // ====================================================

  const handleCheckout =
    () => {

      if (
        normalizedItems.length ===
        0
      ) {

        return;

      }


      navigate(
        '/checkout'
      );

    };


  // ====================================================
  // EMPTY CART
  // ====================================================

  if (
    normalizedItems.length ===
    0
  ) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-50
          px-4
          py-10
        "
      >

        <div
          className="
            max-w-3xl
            mx-auto
          "
        >

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-8
              sm:p-12
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-slate-100
                flex
                items-center
                justify-center
                text-4xl
              "
            >

              🛒

            </div>


            <h1
              className="
                mt-6
                text-2xl
                sm:text-3xl
                font-extrabold
                text-slate-900
              "
            >

              Your Cart is Empty

            </h1>


            <p
              className="
                mt-3
                text-sm
                text-slate-500
              "
            >

              Add wholesale products to your
              cart and place your bulk order.

            </p>


            <Link
              to="/products"
              className="
                inline-flex
                mt-6
                px-6
                py-3
                rounded-xl
                bg-teal-600
                text-white
                text-sm
                font-bold
                hover:bg-teal-700
              "
            >

              Continue Shopping

            </Link>

          </div>

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
          PAGE HEADER
      ================================================== */}

      <section
        className="
          bg-white
          border-b
          border-slate-200
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-7
            sm:py-9
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-end
              justify-between
              gap-3
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-teal-600
                "
              >

                Wholesale Cart

              </p>


              <h1
                className="
                  mt-1
                  text-3xl
                  sm:text-4xl
                  font-extrabold
                  text-slate-900
                "
              >

                Your Cart

              </h1>

            </div>


            <div
              className="
                text-sm
                text-slate-500
              "
            >

              {totalQuantity}{' '}

              {totalQuantity === 1
                ? 'piece'
                : 'pieces'}

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          MAIN
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
            xl:grid-cols-[1fr_360px]
            gap-6
            items-start
          "
        >

          {/* ==================================================
              CART PRODUCTS
          ================================================== */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              overflow-hidden
            "
          >

            {/* DESKTOP HEADER */}

            <div
              className="
                hidden
                md:grid
                md:grid-cols-[minmax(0,1fr)_110px_130px_140px_40px]
                gap-4
                px-5
                py-4
                bg-slate-50
                border-b
                border-slate-200
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >

              <div>
                Product
              </div>

              <div>
                Qty
              </div>

              <div>
                Price
              </div>

              <div>
                Total
              </div>

              <div />

            </div>


            {/* ==================================================
                ITEMS
            ================================================== */}

            <div>

              {normalizedItems.map(
                (item) => (

                  <CartItem
                    key={
                      item.productId
                    }
                    item={
                      item
                    }
                    onIncrease={
                      handleIncrease
                    }
                    onDecrease={
                      handleDecrease
                    }
                    onQuantityChange={
                      handleQuantityChange
                    }
                    onRemove={
                      handleRemove
                    }
                  />

                )
              )}

            </div>


            {/* ==================================================
                CART FOOTER
            ================================================== */}

            <div
              className="
                p-4
                sm:p-5
                border-t
                border-slate-200
                flex
                flex-col
                sm:flex-row
                gap-3
                justify-between
              "
            >

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  h-11
                  px-5
                  rounded-xl
                  border
                  border-slate-200
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-slate-50
                "
              >

                ← Continue Shopping

              </Link>


              {typeof clearCart ===
                'function' && (

                <button
                  type="button"
                  onClick={
                    clearCart
                  }
                  className="
                    h-11
                    px-5
                    rounded-xl
                    text-sm
                    font-semibold
                    text-red-600
                    hover:bg-red-50
                  "
                >

                  Clear Cart

                </button>

              )}

            </div>

          </section>


          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <aside
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-5
              sm:p-6
              xl:sticky
              xl:top-24
            "
          >

            <h2
              className="
                text-xl
                font-extrabold
                text-slate-900
              "
            >

              Order Summary

            </h2>


            {/* ==================================================
                SUBTOTAL
            ================================================== */}

            <SummaryRow
              label="Subtotal"
              value={
                subtotal
              }
            />


            {/* ==================================================
                BULK DISCOUNT
            ================================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                py-3
              "
            >

              <span
                className="
                  text-sm
                  text-slate-600
                "
              >

                Bulk Discount

              </span>


              <span
                className={`
                  text-sm
                  font-bold
                  ${
                    bulkDiscount > 0
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }
                `}
              >

                {bulkDiscount > 0
                  ? `- ₹${bulkDiscount.toLocaleString(
                      'en-IN'
                    )}`
                  : '₹0'}

              </span>

            </div>


            {/* ==================================================
                GST
            ================================================== */}

            <SummaryRow
              label="GST (18%)"
              value={
                gst
              }
            />


            {/* ==================================================
                SHIPPING
            ================================================== */}

            <SummaryRow
              label="Shipping"
              value={
                shipping
              }
            />


            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div
              className="
                border-t
                border-slate-200
                my-2
              "
            />


            {/* ==================================================
                GRAND TOTAL
            ================================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                pt-3
              "
            >

              <span
                className="
                  text-base
                  font-bold
                  text-slate-800
                "
              >

                Grand Total

              </span>


              <span
                className="
                  text-2xl
                  font-extrabold
                  text-teal-700
                "
              >

                ₹
                {
                  grandTotal.toLocaleString(
                    'en-IN'
                  )
                }

              </span>

            </div>


            {/* ==================================================
                BULK DISCOUNT INFO
            ================================================== */}

            {bulkDiscount === 0 && (
              <div
                className="
                  mt-5
                  p-3
                  rounded-xl
                  bg-teal-50
                  border
                  border-teal-100
                "
              >

                <p
                  className="
                    text-xs
                    text-teal-800
                    leading-5
                  "
                >

                  💡 Add{' '}

                  <strong>
                    ₹
                    {Math.max(
                      0,
                      BULK_DISCOUNT_THRESHOLD -
                      subtotal
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </strong>

                  {' '}more to unlock
                  the bulk discount.

                </p>

              </div>
            )}


            {/* ==================================================
                PROCEED CHECKOUT
            ================================================== */}

            <button
              type="button"
              onClick={
                handleCheckout
              }
              className="
                w-full
                mt-6
                h-12
                rounded-xl
                bg-teal-600
                text-white
                text-sm
                font-bold
                hover:bg-teal-700
                transition-colors
              "
            >

              Proceed to Checkout →

            </button>


            {/* ==================================================
                SECURE ORDER
            ================================================== */}

            <div
              className="
                mt-4
                text-center
              "
            >

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >

                🔒 Secure wholesale checkout

              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>

  );

};


// ======================================================
// CART ITEM
// ======================================================

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onQuantityChange,
  onRemove,
}) => {

  return (

    <article
      className="
        p-4
        sm:p-5
        border-b
        border-slate-200
        last:border-b-0
      "
    >

      {/* ==================================================
          DESKTOP
      ================================================== */}

      <div
        className="
          hidden
          md:grid
          md:grid-cols-[minmax(0,1fr)_110px_130px_140px_40px]
          gap-4
          items-center
        "
      >

        {/* PRODUCT */}

        <ProductInfo
          item={
            item
          }
        />


        {/* QUANTITY */}

        <QuantityControl
          item={
            item
          }
          onIncrease={
            onIncrease
          }
          onDecrease={
            onDecrease
          }
          onQuantityChange={
            onQuantityChange
          }
        />


        {/* PRICE */}

        <div
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >

          ₹
          {
            item.unitPrice.toLocaleString(
              'en-IN'
            )
          }

        </div>


        {/* TOTAL */}

        <div
          className="
            text-base
            font-extrabold
            text-slate-900
          "
        >

          ₹
          {
            item.lineTotal.toLocaleString(
              'en-IN'
            )
          }

        </div>


        {/* REMOVE */}

        <button
          type="button"
          onClick={() =>
            onRemove(
              item
            )
          }
          className="
            w-9
            h-9
            rounded-lg
            text-slate-400
            hover:text-red-600
            hover:bg-red-50
          "
          title="Remove product"
        >

          ×

        </button>

      </div>


      {/* ==================================================
          MOBILE
      ================================================== */}

      <div
        className="
          md:hidden
        "
      >

        <div
          className="
            flex
            gap-3
          "
        >

          {/* IMAGE */}

          <Link
            to={`/product/${item.productId}`}
            className="
              w-24
              h-24
              shrink-0
              rounded-xl
              bg-slate-100
              overflow-hidden
            "
          >

            {item.image ? (

              <img
                src={
                  item.image
                }
                alt={
                  item.name
                }
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-2xl
                  text-slate-300
                "
              >

                📦

              </div>

            )}

          </Link>


          {/* INFO */}

          <div
            className="
              flex-1
              min-w-0
            "
          >

            <Link
              to={`/product/${item.productId}`}
              className="
                block
                font-bold
                text-sm
                text-slate-800
                line-clamp-2
                hover:text-teal-700
              "
            >

              {item.name}

            </Link>


            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-slate-500
              "
            >

              ₹
              {
                item.unitPrice.toLocaleString(
                  'en-IN'
                )
              }

              {' '}

              / piece

            </p>


            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >

              MOQ:{' '}

              {item.product?.moq ||
                item.product?.minimumOrderQuantity ||
                1}

            </p>

          </div>


          {/* REMOVE */}

          <button
            type="button"
            onClick={() =>
              onRemove(
                item
              )
            }
            className="
              w-8
              h-8
              shrink-0
              rounded-lg
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
            "
          >

            ×

          </button>

        </div>


        {/* MOBILE BOTTOM */}

        <div
          className="
            mt-4
            pt-4
            border-t
            border-slate-100
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <QuantityControl
            item={
              item
            }
            onIncrease={
              onIncrease
            }
            onDecrease={
              onDecrease
            }
            onQuantityChange={
              onQuantityChange
            }
          />


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

              Total

            </p>


            <p
              className="
                text-lg
                font-extrabold
                text-slate-900
              "
            >

              ₹
              {
                item.lineTotal.toLocaleString(
                  'en-IN'
                )
              }

            </p>

          </div>

        </div>

      </div>

    </article>

  );

};


// ======================================================
// PRODUCT INFO
// ======================================================

const ProductInfo = ({
  item,
}) => {

  return (

    <div
      className="
        flex
        items-center
        gap-4
        min-w-0
      "
    >

      <Link
        to={`/product/${item.productId}`}
        className="
          w-20
          h-20
          shrink-0
          rounded-xl
          bg-slate-100
          overflow-hidden
        "
      >

        {item.image ? (

          <img
            src={
              item.image
            }
            alt={
              item.name
            }
            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-2xl
              text-slate-300
            "
          >

            📦

          </div>

        )}

      </Link>


      <div
        className="
          min-w-0
        "
      >

        <Link
          to={`/product/${item.productId}`}
          className="
            block
            font-bold
            text-sm
            text-slate-800
            truncate
            hover:text-teal-700
          "
        >

          {item.name}

        </Link>


        <p
          className="
            mt-1
            text-xs
            text-slate-400
          "
        >

          MOQ:{' '}

          {item.product?.moq ||
            item.product?.minimumOrderQuantity ||
            1}

        </p>

      </div>

    </div>

  );

};


// ======================================================
// QUANTITY CONTROL
// ======================================================

const QuantityControl = ({
  item,
  onIncrease,
  onDecrease,
  onQuantityChange,
}) => {

  return (

    <div
      className="
        inline-flex
        items-center
        h-9
        rounded-lg
        border
        border-slate-200
        overflow-hidden
        bg-white
      "
    >

      <button
        type="button"
        onClick={() =>
          onDecrease(
            item
          )
        }
        className="
          w-8
          h-full
          text-base
          font-bold
          text-slate-600
          hover:bg-slate-50
        "
      >

        −

      </button>


      <input
        type="number"
        min="1"
        value={
          item.quantity
        }
        onChange={(event) =>
          onQuantityChange(
            item,
            event.target.value
          )
        }
        className="
          w-12
          h-full
          text-center
          text-sm
          font-bold
          text-slate-800
          outline-none
          border-x
          border-slate-200
        "
      />


      <button
        type="button"
        onClick={() =>
          onIncrease(
            item
          )
        }
        className="
          w-8
          h-full
          text-base
          font-bold
          text-slate-600
          hover:bg-slate-50
        "
      >

        +

      </button>

    </div>

  );

};


// ======================================================
// SUMMARY ROW
// ======================================================

const SummaryRow = ({
  label,
  value,
}) => {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        py-3
      "
    >

      <span
        className="
          text-sm
          text-slate-600
        "
      >

        {label}

      </span>


      <span
        className="
          text-sm
          font-semibold
          text-slate-800
        "
      >

        ₹
        {
          Number(
            value
          ).toLocaleString(
            'en-IN'
          )
        }

      </span>

    </div>

  );

};


export default Cart;