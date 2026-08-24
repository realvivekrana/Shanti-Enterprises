import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAddress,
} from "../../context/AddressContext";

function AddressPage() {
  const navigate =
    useNavigate();

  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useAddress();

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setEditingId(null);
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert(
        "Please fill all address fields."
      );

      return;
    }

    if (editingId) {
      updateAddress(
        editingId,
        form
      );
    } else {
      addAddress(form);
    }

    resetForm();
  };

  const handleEdit = (
    address
  ) => {
    setEditingId(
      address.id
    );

    setForm({
      name:
        address.name || "",
      phone:
        address.phone || "",
      address:
        address.address || "",
      city:
        address.city || "",
      state:
        address.state || "",
      pincode:
        address.pincode || "",
    });
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert(
        "Please select a delivery address."
      );

      return;
    }

    navigate(
      "/checkout/summary"
    );
  };

  return (
    <section className="app-page">

      <h1>
        Delivery Address
      </h1>

      <h2>
        Saved Addresses
      </h2>

      {addresses.length === 0 && (
        <p>
          No saved addresses yet.
        </p>
      )}

      {addresses.map(
        (address) => (
          <article
            key={address.id}
          >

            <label>
              <input
                type="radio"
                name="selectedAddress"
                checked={
                  selectedAddressId ===
                  address.id
                }
                onChange={() =>
                  selectAddress(
                    address.id
                  )
                }
              />

              <strong>
                {address.name}
              </strong>
            </label>

            <p>
              {address.phone}
            </p>

            <p>
              {address.address}
            </p>

            <p>
              {address.city},{" "}
              {address.state} -{" "}
              {address.pincode}
            </p>

            <button
              type="button"
              onClick={() =>
                handleEdit(
                  address
                )
              }
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                deleteAddress(
                  address.id
                )
              }
            >
              Delete
            </button>

          </article>
        )
      )}

      <hr />

      <h2>
        {editingId
          ? "Edit Address"
          : "Add New Address"}
      </h2>

      <form
        onSubmit={
          handleSubmit
        }
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={
            handleChange
          }
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={
            handleChange
          }
        />

        <textarea
          name="address"
          placeholder="Complete Address"
          value={form.address}
          onChange={
            handleChange
          }
          rows="4"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={
            handleChange
          }
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={
            handleChange
          }
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={
            handleChange
          }
        />

        <button type="submit">
          {editingId
            ? "Update Address"
            : "Save Address"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={
              resetForm
            }
          >
            Cancel
          </button>
        )}

      </form>

      <hr />

      <button
        type="button"
        disabled={
          !selectedAddressId
        }
        onClick={
          handleContinue
        }
      >
        Continue to Order Summary
      </button>

    </section>
  );
}

export default AddressPage;