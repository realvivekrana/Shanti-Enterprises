// ============================================================
// SHANTI ENTERPRISES
// Saved Addresses Page
// Frontend Phase 4 - Customer
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAddress,
} from "../../context/AddressContext";

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

// ============================================================
// ADDRESSES PAGE
// ============================================================

function AddressesPage() {
  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useAddress();

  const [
    form,
    setForm,
  ] = useState(emptyForm);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

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

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Full name is required.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.address.trim()) {
      return "Address is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.state.trim()) {
      return "State is required.";
    }

    if (!form.pincode.trim()) {
      return "Pincode is required.";
    }

    if (
      !/^\d{6}$/.test(
        form.pincode.trim()
      )
    ) {
      return "Pincode must contain 6 digits.";
    }

    return "";
  };

  // ==========================================================
  // SAVE ADDRESS
  // ==========================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    const addressData = {
      name:
        form.name.trim(),

      phone:
        form.phone.trim(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      pincode:
        form.pincode.trim(),
    };

    if (editingId) {
      updateAddress(
        editingId,
        addressData
      );

      setSuccess(
        "Address updated successfully."
      );
    } else {
      addAddress(
        addressData
      );

      setSuccess(
        "Address added successfully."
      );
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

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

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) {
      return;
    }

    deleteAddress(
      addressId
    );

    if (
      editingId ===
      addressId
    ) {
      resetForm();
    }

    setSuccess(
      "Address deleted successfully."
    );
  };

  // ==========================================================
  // SELECT
  // ==========================================================

  const handleSelect = (
    addressId
  ) => {
    selectAddress(
      addressId
    );

    setSuccess(
      "Delivery address selected."
    );
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>

        <h1>
          Saved Addresses
        </h1>

        <p>
          Manage your delivery
          addresses.
        </p>

      </div>

      {/* ====================================================
          MESSAGES
          ==================================================== */}

      {error && (
        <div>
          <p>
            {error}
          </p>
        </div>
      )}

      {success && (
        <div>
          <p>
            {success}
          </p>
        </div>
      )}

      {/* ====================================================
          SAVED ADDRESSES
          ==================================================== */}

      <div>

        <h2>
          Your Addresses
        </h2>

        {addresses.length === 0 ? (
          <p>
            You don't have any saved
            addresses yet.
          </p>
        ) : (
          addresses.map(
            (address) => (
              <article
                key={address.id}
              >

                {/* SELECT */}

                <label>

                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={
                      selectedAddressId ===
                      address.id
                    }
                    onChange={() =>
                      handleSelect(
                        address.id
                      )
                    }
                  />

                  <strong>
                    {address.name}
                  </strong>

                  {selectedAddressId ===
                    address.id && (
                    <span>
                      {" "}
                      — Selected
                    </span>
                  )}

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

                {/* ACTIONS */}

                <div>

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
                      handleDelete(
                        address.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>
            )
          )
        )}

      </div>

      <hr />

      {/* ====================================================
          ADD / EDIT FORM
          ==================================================== */}

      <div>

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

          <div>

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="Enter full name"
            />

          </div>

          <div>

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={
                handleChange
              }
              placeholder="Enter phone number"
            />

          </div>

          <div>

            <label htmlFor="address">
              Complete Address
            </label>

            <textarea
              id="address"
              name="address"
              value={
                form.address
              }
              onChange={
                handleChange
              }
              placeholder="House number, street, area"
              rows="4"
            />

          </div>

          <div>

            <label htmlFor="city">
              City
            </label>

            <input
              id="city"
              type="text"
              name="city"
              value={form.city}
              onChange={
                handleChange
              }
              placeholder="Enter city"
            />

          </div>

          <div>

            <label htmlFor="state">
              State
            </label>

            <input
              id="state"
              type="text"
              name="state"
              value={form.state}
              onChange={
                handleChange
              }
              placeholder="Enter state"
            />

          </div>

          <div>

            <label htmlFor="pincode">
              Pincode
            </label>

            <input
              id="pincode"
              type="text"
              name="pincode"
              value={
                form.pincode
              }
              onChange={
                handleChange
              }
              placeholder="6 digit pincode"
              maxLength="6"
            />

          </div>

          <div>

            <button
              type="submit"
            >
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

          </div>

        </form>

      </div>

      {/* ====================================================
          CHECKOUT LINK
          ==================================================== */}

      {selectedAddressId && (
        <div>

          <Link to="/checkout/summary">
            Continue with Selected Address
          </Link>

        </div>
      )}

    </section>
  );
}

export default AddressesPage;