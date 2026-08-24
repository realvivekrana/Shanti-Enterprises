import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CheckoutPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    subtotal,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError(
        "Please fill all delivery address fields."
      );
      return;
    }

    /*
      Payment/order API will be connected
      in the upcoming checkout steps.
    */

    navigate("/checkout/summary", {
      state: {
        address: form,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <section className="app-page">
        <h1>Checkout</h1>

        <p>
          Your cart is empty.
        </p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="app-page">
      <h1>Checkout</h1>

      <p>
        Total Items: {totalItems}
      </p>

      {error && (
        <p>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label>
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label>
            Address
          </label>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House / Street / Area"
            rows="4"
          />
        </div>

        <div>
          <label>
            City
          </label>

          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div>
          <label>
            State
          </label>

          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        <div>
          <label>
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>

        <hr />

        <h2>
          Order Total
        </h2>

        <p>
          Subtotal: ₹
          {subtotal.toLocaleString("en-IN")}
        </p>

        <button type="submit">
          Continue to Order Summary
        </button>
      </form>
    </section>
  );
}

export default CheckoutPage;