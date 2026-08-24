import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import EmptyState from "../../components/common/EmptyState";

function CartPage() {
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="app-page">
        <h1>
          Shopping Cart
        </h1>

        <EmptyState
          title="Your cart is empty"
          message="Add products to your cart to continue."
        />

        <Link to="/products">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="app-page">

      <h1>
        Shopping Cart
      </h1>

      <p>
        Total Items: {totalItems}
      </p>

      {cartItems.map(
        (item) => (
          <article
            key={item.productId}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            )}

            <h2>
              {item.name}
            </h2>

            <p>
              ₹
              {Number(
                item.price
              ).toLocaleString("en-IN")}
            </p>

            <p>
              MOQ: {item.moq}
            </p>

            <label>
              Quantity:

              <input
                type="number"
                min={item.moq}
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(
                    item.productId,
                    Math.max(
                      item.moq,
                      Number(
                        event.target.value
                      ) || item.moq
                    )
                  )
                }
              />
            </label>

            <p>
              Item Total: ₹
              {(
                Number(item.price) *
                Number(item.quantity)
              ).toLocaleString("en-IN")}
            </p>

            <button
              type="button"
              onClick={() =>
                removeFromCart(
                  item.productId
                )
              }
            >
              Remove
            </button>
          </article>
        )
      )}

      <hr />

      <h2>
        Cart Summary
      </h2>

      <p>
        Subtotal: ₹
        {subtotal.toLocaleString(
          "en-IN"
        )}
      </p>

      <button
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </button>

      <Link to="/products">
        Continue Shopping
      </Link>

      <br />

      <Link to="/checkout">
        Proceed to Checkout
      </Link>

    </section>
  );
}

export default CartPage;