import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// CART PAGE
// ======================================================

const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartError,
    setCartError,
    getItemPricing,
    cartSummary,
    shippingPrice,
    cartTotal,
  } = useCart();


  const navigate =
    useNavigate();


  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice = (
    value
  ) => {

    return Number(
      value || 0
    ).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    );

  };


  // ====================================================
  // EMPTY CART
  // ====================================================

  if (
    cartItems.length === 0
  ) {

    return (

      <div
        className="
          min-h-[70vh]
          bg-slate-50
          px-4
          py-12
          sm:py-20
        "
      >

        <div
          className="
            max-w-xl
            mx-auto
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
              bg-teal-50
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
              text-slate-800
            "
          >

            Your Cart is Empty

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >

            Add wholesale products to
            your cart to continue.

          </p>


          <Link
            to="/products"
            className="
              inline-flex
              items-center
              justify-center
              mt-6
              px-6
              h-11
              rounded-xl
              bg-teal-600
              text-white
              text-sm
              font-bold
              hover:bg-teal-700
              transition
            "
          >

            Continue Shopping

          </Link>

        </div>

      </div>

    );

  }


  // ====================================================
  // DECREASE QUANTITY
  // ====================================================

  const handleDecrease =
    (item) => {

      const moq =
        Number(
          item.moq || 1
        );


      if (
        Number(
          item.quantity
        ) <= moq
      ) {

        setCartError(
          `Minimum order quantity for ${item.name} is ${moq} pieces.`
        );

        return;

      }


      updateQuantity(
        item._id,
        Number(
          item.quantity
        ) - 1
      );

    };


  // ====================================================
  // INCREASE QUANTITY
  // ====================================================

  const handleIncrease =
    (item) => {

      const stock =
        Number(
          item.stock || 0
        );


      if (
        Number(
          item.quantity
        ) >= stock
      ) {

        setCartError(
          `Only ${stock} pieces of ${item.name} are available.`
        );

        return;

      }


      updateQuantity(
        item._id,
        Number(
          item.quantity
        ) + 1
      );

    };


  // ====================================================
  // MANUAL QUANTITY
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


      const moq =
        Number(
          item.moq || 1
        );


      const stock =
        Number(
          item.stock || 0
        );


      if (
        !Number.isInteger(
          quantity
        )
      ) {

        return;

      }


      if (
        quantity < moq
      ) {

        setCartError(
          `Minimum order quantity for ${item.name} is ${moq} pieces.`
        );

        return;

      }


      if (
        quantity > stock
      ) {

        setCartError(
          `Only ${stock} pieces of ${item.name} are available.`
        );

        return;

      }


      updateQuantity(
        item._id,
        quantity
      );

    };


  // ====================================================
  // PROCEED CHECKOUT
  // ====================================================

  const handleCheckout =
    () => {

      navigate(
        '/checkout'
      );

    };


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
            sm:px-6
            lg:px-8
            py-7
            sm:py-9
          "
        >

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

            Wholesale Order

          </p>


          <h1
            className="
              mt-1
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-extrabold
              text-slate-900
            "
          >

            Your Cart

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >

            Review your bulk order,
            wholesale pricing and taxes
            before checkout.

          </p>

        </div>

      </section>


      {/* ==================================================
          MAIN CONTENT
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

        {/* ==================================================
            ERROR
        ================================================== */}

        {cartError && (

          <div
            className="
              mb-6
              bg-red-50
              border
              border-red-200
              text-red-700
              rounded-xl
              px-4
              py-3
              text-sm
            "
          >

            {cartError}

          </div>

        )}


        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1fr_380px]
            gap-6
            lg:gap-8
            items-start
          "
        >

          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <section>

            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div
              className="
                hidden
                md:block
                bg-white
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
              "
            >

              {/* TABLE HEADER */}

              <div
                className="
                  grid
                  grid-cols-[minmax(260px,1.8fr)_110px_130px_140px]
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

                <span>
                  Product
                </span>

                <span>
                  Qty
                </span>

                <span>
                  Price
                </span>

                <span
                  className="
                    text-right
                  "
                >
                  Total
                </span>

              </div>


              {/* TABLE ROWS */}

              {cartItems.map(
                (item) => {

                  const pricing =
                    getItemPricing(
                      item
                    );


                  const moq =
                    Number(
                      item.moq || 1
                    );


                  const stock =
                    Number(
                      item.stock || 0
                    );


                  return (

                    <div
                      key={
                        item._id
                      }
                      className="
                        grid
                        grid-cols-[minmax(260px,1.8fr)_110px_130px_140px]
                        gap-4
                        items-center
                        px-5
                        py-5
                        border-b
                        border-slate-100
                        last:border-b-0
                      "
                    >

                      {/* PRODUCT */}

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          min-w-0
                        "
                      >

                        <Link
                          to={`/product/${item._id}`}
                          className="
                            w-20
                            h-20
                            shrink-0
                            rounded-xl
                            overflow-hidden
                            bg-slate-100
                            border
                            border-slate-200
                          "
                        >

                          <img
                            src={
                              item.image ||
                              item.images?.[0] ||
                              'https://via.placeholder.com/120x120?text=No+Image'
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

                        </Link>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <Link
                            to={`/product/${item._id}`}
                            className="
                              font-bold
                              text-slate-800
                              hover:text-teal-700
                              line-clamp-2
                            "
                          >

                            {item.name}

                          </Link>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >

                            MOQ:{' '}

                            <strong
                              className="
                                text-slate-700
                              "
                            >

                              {moq}

                            </strong>

                            {' pieces'}

                          </p>


                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item._id
                              )
                            }
                            className="
                              mt-2
                              text-xs
                              font-semibold
                              text-red-500
                              hover:text-red-700
                            "
                          >

                            Remove

                          </button>

                        </div>

                      </div>


                      {/* QUANTITY */}

                      <div>

                        <div
                          className="
                            inline-flex
                            items-center
                            border
                            border-slate-300
                            rounded-lg
                            overflow-hidden
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(
                                item
                              )
                            }
                            disabled={
                              Number(
                                item.quantity
                              ) <= moq
                            }
                            className="
                              w-8
                              h-9
                              flex
                              items-center
                              justify-center
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
                              item.quantity
                            }
                            onChange={(event) =>
                              handleQuantityChange(
                                item,
                                event.target.value
                              )
                            }
                            className="
                              w-12
                              h-9
                              text-center
                              text-sm
                              font-semibold
                              outline-none
                              border-x
                              border-slate-200
                            "
                          />


                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(
                                item
                              )
                            }
                            disabled={
                              Number(
                                item.quantity
                              ) >= stock
                            }
                            className="
                              w-8
                              h-9
                              flex
                              items-center
                              justify-center
                              hover:bg-slate-100
                              disabled:text-slate-300
                              disabled:cursor-not-allowed
                            "
                          >

                            +

                          </button>

                        </div>

                      </div>


                      {/* PRICE */}

                      <div>

                        <p
                          className="
                            font-bold
                            text-slate-800
                          "
                        >

                          ₹
                          {formatPrice(
                            pricing.wholesaleUnitPrice
                          )}

                        </p>


                        {pricing.wholesaleUnitPrice <
                          pricing.baseUnitPrice && (

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                              line-through
                            "
                          >

                            ₹
                            {formatPrice(
                              pricing.baseUnitPrice
                            )}

                          </p>

                        )}

                      </div>


                      {/* TOTAL */}

                      <div
                        className="
                          text-right
                        "
                      >

                        <p
                          className="
                            font-extrabold
                            text-slate-900
                          "
                        >

                          ₹
                          {formatPrice(
                            pricing.subtotal
                          )}

                        </p>


                        {pricing.bulkDiscount >
                          0 && (

                          <p
                            className="
                              mt-1
                              text-xs
                              font-semibold
                              text-emerald-600
                            "
                          >

                            Save ₹
                            {formatPrice(
                              pricing.bulkDiscount
                            )}

                          </p>

                        )}

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            {/* ==================================================
                MOBILE CART
            ================================================== */}

            <div
              className="
                md:hidden
                space-y-4
              "
            >

              {cartItems.map(
                (item) => {

                  const pricing =
                    getItemPricing(
                      item
                    );


                  const moq =
                    Number(
                      item.moq || 1
                    );


                  const stock =
                    Number(
                      item.stock || 0
                    );


                  return (

                    <div
                      key={
                        item._id
                      }
                      className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        p-4
                      "
                    >

                      {/* PRODUCT */}

                      <div
                        className="
                          flex
                          gap-3
                        "
                      >

                        <Link
                          to={`/product/${item._id}`}
                          className="
                            w-20
                            h-20
                            shrink-0
                            rounded-xl
                            overflow-hidden
                            bg-slate-100
                            border
                            border-slate-200
                          "
                        >

                          <img
                            src={
                              item.image ||
                              item.images?.[0] ||
                              'https://via.placeholder.com/120x120?text=No+Image'
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

                        </Link>


                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >

                          <div
                            className="
                              flex
                              justify-between
                              gap-3
                            "
                          >

                            <Link
                              to={`/product/${item._id}`}
                              className="
                                font-bold
                                text-sm
                                text-slate-800
                                line-clamp-2
                              "
                            >

                              {item.name}

                            </Link>


                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item._id
                                )
                              }
                              className="
                                shrink-0
                                text-xs
                                text-red-500
                                font-semibold
                              "
                            >

                              Remove

                            </button>

                          </div>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >

                            MOQ: {moq} pieces

                          </p>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div
                        className="
                          mt-4
                          pt-4
                          border-t
                          border-slate-100
                          space-y-4
                        "
                      >

                        {/* QTY */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-sm
                              text-slate-500
                            "
                          >
                            Quantity
                          </span>


                          <div
                            className="
                              inline-flex
                              items-center
                              border
                              border-slate-300
                              rounded-lg
                              overflow-hidden
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                handleDecrease(
                                  item
                                )
                              }
                              disabled={
                                Number(
                                  item.quantity
                                ) <= moq
                              }
                              className="
                                w-9
                                h-9
                                hover:bg-slate-100
                                disabled:text-slate-300
                              "
                            >
                              −
                            </button>


                            <input
                              type="number"
                              min={moq}
                              max={stock}
                              value={
                                item.quantity
                              }
                              onChange={(event) =>
                                handleQuantityChange(
                                  item,
                                  event.target.value
                                )
                              }
                              className="
                                w-14
                                h-9
                                text-center
                                text-sm
                                font-bold
                                outline-none
                                border-x
                                border-slate-200
                              "
                            />


                            <button
                              type="button"
                              onClick={() =>
                                handleIncrease(
                                  item
                                )
                              }
                              disabled={
                                Number(
                                  item.quantity
                                ) >= stock
                              }
                              className="
                                w-9
                                h-9
                                hover:bg-slate-100
                                disabled:text-slate-300
                              "
                            >
                              +
                            </button>

                          </div>

                        </div>


                        {/* PRICE */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-sm
                              text-slate-500
                            "
                          >
                            Price / piece
                          </span>


                          <span
                            className="
                              font-bold
                              text-slate-800
                            "
                          >

                            ₹
                            {formatPrice(
                              pricing.wholesaleUnitPrice
                            )}

                          </span>

                        </div>


                        {/* TOTAL */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-sm
                              text-slate-500
                            "
                          >
                            Total
                          </span>


                          <span
                            className="
                              text-lg
                              font-extrabold
                              text-slate-900
                            "
                          >

                            ₹
                            {formatPrice(
                              pricing.subtotal
                            )}

                          </span>

                        </div>


                        {/* SAVING */}

                        {pricing.bulkDiscount >
                          0 && (

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              text-sm
                              text-emerald-600
                              font-semibold
                            "
                          >

                            <span>
                              Bulk Discount
                            </span>

                            <span>
                              - ₹
                              {formatPrice(
                                pricing.bulkDiscount
                              )}
                            </span>

                          </div>

                        )}

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            {/* ==================================================
                CONTINUE SHOPPING
            ================================================== */}

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                gap-2
                mt-5
                text-sm
                font-semibold
                text-teal-700
                hover:text-teal-800
              "
            >

              ← Continue Shopping

            </Link>

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
              lg:sticky
              lg:top-24
            "
          >

            <h2
              className="
                text-xl
                font-extrabold
                text-slate-800
              "
            >

              Order Summary

            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >

              Wholesale order breakdown

            </p>


            {/* ORIGINAL SUBTOTAL */}

            <div
              className="
                mt-6
                flex
                justify-between
                gap-4
                text-sm
              "
            >

              <span
                className="
                  text-slate-500
                "
              >

                Subtotal

              </span>


              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >

                ₹
                {formatPrice(
                  cartSummary.baseSubtotal
                )}

              </span>

            </div>


            {/* BULK DISCOUNT */}

            <div
              className="
                mt-3
                flex
                justify-between
                gap-4
                text-sm
              "
            >

              <span
                className="
                  text-emerald-600
                "
              >

                Bulk Discount

              </span>


              <span
                className="
                  font-semibold
                  text-emerald-600
                "
              >

                - ₹
                {formatPrice(
                  cartSummary.bulkDiscount
                )}

              </span>

            </div>


            {/* WHOLESALE SUBTOTAL */}

            <div
              className="
                mt-3
                flex
                justify-between
                gap-4
                text-sm
              "
            >

              <span
                className="
                  text-slate-600
                "
              >

                Wholesale Subtotal

              </span>


              <span
                className="
                  font-bold
                  text-slate-800
                "
              >

                ₹
                {formatPrice(
                  cartSummary.subtotal
                )}

              </span>

            </div>


            {/* GST */}

            <div
              className="
                mt-3
                flex
                justify-between
                gap-4
                text-sm
              "
            >

              <span
                className="
                  text-slate-500
                "
              >

                GST

              </span>


              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >

                ₹
                {formatPrice(
                  cartSummary.gst
                )}

              </span>

            </div>


            {/* SHIPPING */}

            <div
              className="
                mt-3
                flex
                justify-between
                gap-4
                text-sm
              "
            >

              <span
                className="
                  text-slate-500
                "
              >

                Shipping

              </span>


              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >

                ₹
                {formatPrice(
                  shippingPrice
                )}

              </span>

            </div>


            {/* DIVIDER */}

            <div
              className="
                border-t
                border-slate-200
                my-5
              "
            />


            {/* GRAND TOTAL */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <span
                className="
                  text-lg
                  font-extrabold
                  text-slate-800
                "
              >

                Grand Total

              </span>


              <span
                className="
                  text-2xl
                  font-extrabold
                  text-slate-900
                "
              >

                ₹
                {formatPrice(
                  cartTotal
                )}

              </span>

            </div>


            {/* CHECKOUT */}

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
                font-bold
                hover:bg-teal-700
                transition
              "
            >

              Proceed to Checkout

            </button>


            {/* CONTINUE */}

            <Link
              to="/products"
              className="
                block
                text-center
                mt-4
                text-sm
                font-semibold
                text-teal-700
                hover:underline
              "
            >

              Continue Shopping

            </Link>


            {/* B2B NOTE */}

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
                  leading-5
                  text-teal-800
                "
              >

                Wholesale pricing is applied
                automatically according to
                your order quantity.

              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>

  );

};


export default Cart;