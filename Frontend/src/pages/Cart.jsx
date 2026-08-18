import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';

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

  // ==============================
  // EMPTY CART
  // ==============================

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-xl p-10">
          <h1 className="text-2xl font-bold text-slate-800">
            Your Cart is Empty
          </h1>

          <p className="text-slate-500 mt-2">
            Add wholesale products to
            continue.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // DECREASE QUANTITY
  // ==============================

  const handleDecrease = (
    item
  ) => {
    const moq =
      Number(item.moq || 1);

    if (
      item.quantity <= moq
    ) {
      setCartError(
        `Minimum order quantity for ${item.name} is ${moq} pieces.`
      );

      return;
    }

    updateQuantity(
      item._id,
      Number(item.quantity) - 1
    );
  };

  // ==============================
  // INCREASE QUANTITY
  // ==============================

  const handleIncrease = (
    item
  ) => {
    const stock =
      Number(item.stock || 0);

    if (
      Number(item.quantity) >=
      stock
    ) {
      setCartError(
        `Only ${stock} pieces of ${item.name} are available.`
      );

      return;
    }

    updateQuantity(
      item._id,
      Number(item.quantity) + 1
    );
  };

  // ==============================
  // MANUAL QUANTITY
  // ==============================

  const handleQuantityChange =
    (item, value) => {
      const quantity =
        Number(value);

      const moq =
        Number(item.moq || 1);

      const stock =
        Number(item.stock || 0);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ==============================
          HEADER
      ============================== */}

      <div className="mb-7">
        <h1 className="text-3xl font-bold text-slate-800">
          Wholesale Cart
        </h1>

        <p className="text-slate-500 mt-1">
          Review your bulk order,
          pricing and taxes before
          checkout.
        </p>
      </div>

      {/* ==============================
          ERROR
      ============================== */}

      {cartError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {cartError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ==============================
            CART ITEMS
        ============================== */}

        <div className="space-y-5">
          {cartItems.map(
            (item) => {
              const pricing =
                getItemPricing(item);

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
                  className="bg-white border border-slate-200 rounded-xl p-5"
                >
                  {/* PRODUCT HEADER */}

                  <div className="flex gap-4">
                    <img
                      src={
                        item.image ||
                        'https://via.placeholder.com/120x120?text=No+Image'
                      }
                      alt={
                        item.name
                      }
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg bg-slate-50 border border-slate-200"
                    />

                    <div className="flex-grow">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-800">
                            {
                              item.name
                            }
                          </h2>

                          <p className="text-xs text-slate-500 mt-1">
                            MOQ:{' '}
                            <strong>
                              {
                                moq
                              }{' '}
                              pieces
                            </strong>
                          </p>

                          <p className="text-xs text-slate-500">
                            Stock:{' '}
                            {
                              stock
                            }
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item._id
                            )
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCT PRICING */}

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* QUANTITY */}

                      <div>
                        <p className="text-xs text-slate-500">
                          Quantity
                        </p>

                        <div className="flex items-center border border-slate-300 rounded-lg mt-1 w-fit">
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
                              ) <=
                              moq
                            }
                            className="px-3 py-2 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            min={
                              moq
                            }
                            max={
                              stock
                            }
                            value={
                              item.quantity
                            }
                            onChange={(
                              e
                            ) =>
                              handleQuantityChange(
                                item,
                                e
                                  .target
                                  .value
                              )
                            }
                            className="w-16 text-center py-2 outline-none text-sm"
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
                              ) >=
                              stock
                            }
                            className="px-3 py-2 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* UNIT PRICE */}

                      <div>
                        <p className="text-xs text-slate-500">
                          Unit Price
                        </p>

                        <p className="font-semibold text-slate-800 mt-1">
                          ₹
                          {pricing.wholesaleUnitPrice.toFixed(
                            2
                          )}
                        </p>

                        {pricing.wholesaleUnitPrice <
                          pricing.baseUnitPrice && (
                          <p className="text-xs text-slate-400 line-through">
                            ₹
                            {pricing.baseUnitPrice.toFixed(
                              2
                            )}
                          </p>
                        )}
                      </div>

                      {/* BULK DISCOUNT */}

                      <div>
                        <p className="text-xs text-slate-500">
                          Bulk Discount
                        </p>

                        <p className="font-semibold text-emerald-600 mt-1">
                          - ₹
                          {pricing.bulkDiscount.toFixed(
                            2
                          )}
                        </p>
                      </div>

                      {/* SUBTOTAL */}

                      <div>
                        <p className="text-xs text-slate-500">
                          Subtotal
                        </p>

                        <p className="font-bold text-slate-800 mt-1">
                          ₹
                          {pricing.subtotal.toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GST */}

                  <div className="mt-4 bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        GST (
                        {
                          pricing.gstRate
                        }
                        %)
                      </span>

                      <span className="font-medium text-slate-700">
                        ₹
                        {pricing.gstAmount.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* ==============================
            ORDER SUMMARY
        ============================== */}

        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Order Summary
            </h2>

            {/* BASE SUBTOTAL */}

            <div className="flex justify-between text-sm text-slate-600">
              <span>
                Original Subtotal
              </span>

              <span>
                ₹
                {cartSummary.baseSubtotal.toFixed(
                  2
                )}
              </span>
            </div>

            {/* BULK DISCOUNT */}

            <div className="flex justify-between text-sm text-emerald-600 mt-3">
              <span>
                Bulk Discount
              </span>

              <span>
                - ₹
                {cartSummary.bulkDiscount.toFixed(
                  2
                )}
              </span>
            </div>

            {/* WHOLESALE SUBTOTAL */}

            <div className="flex justify-between text-sm text-slate-700 mt-3">
              <span>
                Wholesale Subtotal
              </span>

              <span className="font-semibold">
                ₹
                {cartSummary.subtotal.toFixed(
                  2
                )}
              </span>
            </div>

            {/* GST */}

            <div className="flex justify-between text-sm text-slate-600 mt-3">
              <span>
                GST
              </span>

              <span>
                ₹
                {cartSummary.gst.toFixed(
                  2
                )}
              </span>
            </div>

            {/* SHIPPING */}

            <div className="flex justify-between text-sm text-slate-600 mt-3">
              <span>
                Shipping
              </span>

              <span>
                ₹
                {shippingPrice.toFixed(
                  2
                )}
              </span>
            </div>

            {/* DIVIDER */}

            <div className="border-t border-slate-200 my-5" />

            {/* TOTAL */}

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">
                Total
              </span>

              <span className="text-2xl font-bold text-slate-900">
                ₹
                {cartTotal.toFixed(
                  2
                )}
              </span>
            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/checkout'
                )
              }
              className="w-full mt-6 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-sm text-teal-700 hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;