// ============================================================
// SHANTI ENTERPRISES
// Order Summary Page
// Frontend Phase 3 - Checkout
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import {
  useAddress,
} from "../../context/AddressContext";

import {
  createOrder,
} from "../../api/orderApi";

// ============================================================
// ORDER SUMMARY
// ============================================================

function OrderSummaryPage() {
  const navigate =
    useNavigate();

  const {
    cartItems,
    totalItems,
    subtotal,
    clearCart,
  } = useCart();

  const {
    selectedAddress,
  } = useAddress();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  if (
    cartItems.length === 0
  ) {
    return (
      <section className="app-page">
        <h1>
          Order Summary
        </h1>

        <p>
          Your cart is empty.
        </p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </section>
    );
  }

  if (!selectedAddress) {
    return (
      <section className="app-page">
        <h1>
          Order Summary
        </h1>

        <p>
          Please select a delivery
          address first.
        </p>

        <Link to="/checkout/address">
          Select Address
        </Link>
      </section>
    );
  }

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handlePlaceOrder =
    async () => {
      try {
        setLoading(true);
        setError("");

        const orderItems =
          cartItems.map(
            (item) => ({
              product:
                item.productId,

              productId:
                item.productId,

              name:
                item.name,

              quantity:
                Number(
                  item.quantity
                ),

              price:
                Number(
                  item.price
                ),

              subtotal:
                Number(
                  item.price
                ) *
                Number(
                  item.quantity
                ),
            })
          );

        const orderData = {
          items: orderItems,

          shippingAddress: {
            name:
              selectedAddress.name,

            phone:
              selectedAddress.phone,

            address:
              selectedAddress.address,

            city:
              selectedAddress.city,

            state:
              selectedAddress.state,

            pincode:
              selectedAddress.pincode,
          },

          subtotal:
            Number(subtotal),

          totalAmount:
            Number(subtotal),

          totalItems:
            Number(totalItems),

          paymentMethod:
            "RAZORPAY",

          paymentStatus:
            "PENDING",
        };

        const response =
          await createOrder(
            orderData
          );

        const createdOrder =
          response?.order ||
          response?.data?.order ||
          response?.data ||
          response;

        const orderId =
          createdOrder?._id ||
          createdOrder?.id ||
          response?.orderId ||
          response?.data?.orderId;

        if (!orderId) {
          throw new Error(
            "Order ID was not returned by the server."
          );
        }

        /*
          Cart is cleared only after
          successful payment verification.

          Therefore do NOT call clearCart()
          here.
        */

        navigate(
          `/payment/${orderId}`
        );
      } catch (err) {
        console.error(
          "Create order error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to create order."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="app-page">

      <h1>
        Order Summary
      </h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      {/* ADDRESS */}

      <div>

        <h2>
          Delivery Address
        </h2>

        <p>
          <strong>
            {selectedAddress.name}
          </strong>
        </p>

        <p>
          {selectedAddress.phone}
        </p>

        <p>
          {selectedAddress.address}
        </p>

        <p>
          {selectedAddress.city},{" "}
          {selectedAddress.state} -{" "}
          {selectedAddress.pincode}
        </p>

        <Link to="/checkout/address">
          Change Address
        </Link>

      </div>

      <hr />

      {/* PRODUCTS */}

      <div>

        <h2>
          Products
        </h2>

        {cartItems.map(
          (item) => (
            <article
              key={
                item.productId
              }
            >

              <h3>
                {item.name}
              </h3>

              <p>
                Price: ₹
                {Number(
                  item.price
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <p>
                Quantity:{" "}
                {item.quantity}
              </p>

              <p>
                Item Total: ₹
                {(
                  Number(
                    item.price
                  ) *
                  Number(
                    item.quantity
                  )
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

            </article>
          )
        )}

      </div>

      <hr />

      {/* TOTAL */}

      <h2>
        Order Total
      </h2>

      <p>
        Total Items:{" "}
        {totalItems}
      </p>

      <p>
        Subtotal: ₹
        {subtotal.toLocaleString(
          "en-IN"
        )}
      </p>

      <h2>
        Total: ₹
        {subtotal.toLocaleString(
          "en-IN"
        )}
      </h2>

      {/* PAYMENT */}

      <button
        type="button"
        disabled={loading}
        onClick={
          handlePlaceOrder
        }
      >
        {loading
          ? "Creating Order..."
          : "Continue to Payment"}
      </button>

    </section>
  );
}

export default OrderSummaryPage;