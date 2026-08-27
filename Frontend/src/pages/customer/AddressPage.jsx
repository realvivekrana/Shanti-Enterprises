// ============================================================
// SHANTI ENTERPRISES
// Customer Addresses
// Frontend Phase 6 - Complete Address Management
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAddress,
} from "../../context/AddressContext";

// ============================================================
// INITIAL FORM
// ============================================================

const INITIAL_FORM = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

// ============================================================
// ADDRESS PAGE
// ============================================================

function AddressPage() {
  const navigate =
    useNavigate();

  const {
    addresses = [],
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useAddress();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

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

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm(
      INITIAL_FORM
    );

    setEditingId(null);
    setError("");
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    const name =
      form.name.trim();

    const phone =
      form.phone.trim();

    const address =
      form.address.trim();

    const city =
      form.city.trim();

    const state =
      form.state.trim();

    const pincode =
      form.pincode.trim();

    if (!name) {
      return "Full name is required.";
    }

    if (
      name.length <
      2
    ) {
      return "Name must be at least 2 characters.";
    }

    if (!phone) {
      return "Phone number is required.";
    }

    const cleanPhone =
      phone.replace(
        /\D/g,
        ""
      );

    if (
      cleanPhone.length !==
      10
    ) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!address) {
      return "Complete address is required.";
    }

    if (
      address.length <
      5
    ) {
      return "Please enter a complete address.";
    }

    if (!city) {
      return "City is required.";
    }

    if (!state) {
      return "State is required.";
    }

    if (!pincode) {
      return "Pincode is required.";
    }

    if (
      !/^\d{6}$/.test(
        pincode
      )
    ) {
      return "Pincode must be exactly 6 digits.";
    }

    return "";
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    try {
      setSaving(true);

      const cleanForm = {
        name:
          form.name.trim(),

        phone:
          form.phone
            .replace(
              /\D/g,
              ""
            )
            .slice(
              -10
            ),

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
        await updateAddress(
          editingId,
          cleanForm
        );

        setSuccess(
          "Address updated successfully."
        );
      } else {
        await addAddress(
          cleanForm
        );

        setSuccess(
          "Address saved successfully."
        );
      }

      resetForm();

      setSuccess(
        editingId
          ? "Address updated successfully."
          : "Address saved successfully."
      );
    } catch (err) {
      console.error(
        "Address save error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save address. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
        address.name ||
        "",

      phone:
        address.phone ||
        "",

      address:
        address.address ||
        "",

      city:
        address.city ||
        "",

      state:
        address.state ||
        "",

      pincode:
        address.pincode ||
        "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        addressId
      );

      setError("");
      setSuccess("");

      await deleteAddress(
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
    } catch (err) {
      console.error(
        "Address delete error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete address. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // SELECT ADDRESS
  // ==========================================================

  const handleSelect = (
    addressId
  ) => {
    selectAddress(
      addressId
    );

    setError("");
    setSuccess(
      "Delivery address selected."
    );
  };

  // ==========================================================
  // CONTINUE
  // ==========================================================

  const handleContinue = () => {
    if (
      !selectedAddressId
    ) {
      setError(
        "Please select a delivery address before continuing."
      );

      return;
    }

    navigate(
      "/checkout/summary"
    );
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="address-page">

      <div className="address-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="address-header">

          <div>

            <Link
              to="/profile"
              className="address-back-link"
            >
              ← My Profile
            </Link>

            <span className="address-eyebrow">
              DELIVERY INFORMATION
            </span>

            <h1>
              Delivery Addresses
            </h1>

            <p>
              Save and manage your
              delivery addresses for
              faster checkout.
            </p>

          </div>

          <div className="address-count">

            <span>
              Saved Addresses
            </span>

            <strong>
              {addresses.length}
            </strong>

          </div>

        </div>

        {/* ==================================================
            MESSAGES
            ================================================== */}

        {error && (
          <div
            className="address-message address-message-error"
            role="alert"
          >

            <span>
              !
            </span>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              aria-label="Close error"
            >
              ×
            </button>

          </div>
        )}

        {success && (
          <div
            className="address-message address-message-success"
            role="status"
          >

            <span>
              ✓
            </span>

            <p>
              {success}
            </p>

            <button
              type="button"
              onClick={() =>
                setSuccess("")
              }
              aria-label="Close success message"
            >
              ×
            </button>

          </div>
        )}

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="address-layout">

          {/* ==================================================
              SAVED ADDRESSES
              ================================================== */}

          <div className="address-list-section">

            <div className="address-section-heading">

              <div>

                <span>
                  SAVED ADDRESSES
                </span>

                <h2>
                  Choose delivery address
                </h2>

              </div>

              {addresses.length >
                0 && (
                <span className="address-selected-label">

                  {selectedAddressId
                    ? "Address selected"
                    : "Select an address"}

                </span>
              )}

            </div>

            {addresses.length ===
            0 ? (
              <div className="address-empty-state">

                <div className="address-empty-icon">
                  📍
                </div>

                <h3>
                  No saved addresses
                </h3>

                <p>
                  Add your first delivery
                  address using the form.
                </p>

              </div>
            ) : (
              <div className="address-list">

                {addresses.map(
                  (
                    address,
                    index
                  ) => {

                    const addressId =
                      address.id;

                    const selected =
                      selectedAddressId ===
                      addressId;

                    const deleting =
                      deletingId ===
                      addressId;

                    return (
                      <article
                        key={
                          addressId ||
                          index
                        }
                        className={`address-card ${
                          selected
                            ? "address-card-selected"
                            : ""
                        }`}
                      >

                        {/* RADIO */}

                        <label className="address-card-select">

                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={
                              selected
                            }
                            onChange={() =>
                              handleSelect(
                                addressId
                              )
                            }
                          />

                          <span className="address-radio-mark">
                            {selected
                              ? "✓"
                              : ""}
                          </span>

                        </label>

                        {/* CONTENT */}

                        <div className="address-card-content">

                          <div className="address-card-top">

                            <div>

                              <span className="address-card-label">
                                DELIVERY ADDRESS
                              </span>

                              <h3>
                                {address.name ||
                                  "Customer"}
                              </h3>

                            </div>

                            {selected && (
                              <span className="address-default-badge">
                                Selected
                              </span>
                            )}

                          </div>

                          <p className="address-card-phone">

                            {address.phone ||
                              "Phone unavailable"}

                          </p>

                          <p className="address-card-line">

                            {address.address ||
                              "Address unavailable"}

                          </p>

                          <p className="address-card-location">

                            {address.city ||
                              ""}

                            {address.city &&
                              address.state &&
                              ", "}

                            {address.state ||
                              ""}

                            {(address.city ||
                              address.state) &&
                              address.pincode &&
                              " - "}

                            {address.pincode ||
                              ""}

                          </p>

                          {/* ACTIONS */}

                          <div className="address-card-actions">

                            <button
                              type="button"
                              className="address-edit-button"
                              onClick={() =>
                                handleEdit(
                                  address
                                )
                              }
                              disabled={
                                deleting
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="address-delete-button"
                              onClick={() =>
                                handleDelete(
                                  addressId
                                )
                              }
                              disabled={
                                deleting
                              }
                            >
                              {deleting
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* ==================================================
              FORM
              ================================================== */}

          <div className="address-form-card">

            <div className="address-section-heading">

              <div>

                <span>
                  {editingId
                    ? "UPDATE ADDRESS"
                    : "NEW ADDRESS"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p>
                  Enter your complete
                  delivery details.
                </p>

              </div>

              {editingId && (
                <button
                  type="button"
                  className="address-form-reset-button"
                  onClick={
                    resetForm
                  }
                >
                  Cancel Edit
                </button>
              )}

            </div>

            <form
              className="address-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <div className="address-form-group">

                <label htmlFor="address-name">
                  Full Name
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="address-name"
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter full name"
                  autoComplete="name"
                  maxLength={80}
                  disabled={
                    saving
                  }
                />

              </div>

              {/* PHONE */}

              <div className="address-form-group">

                <label htmlFor="address-phone">
                  Phone Number
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="address-phone"
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  maxLength={15}
                  inputMode="numeric"
                  disabled={
                    saving
                  }
                />

              </div>

              {/* ADDRESS */}

              <div className="address-form-group address-form-full">

                <label htmlFor="address-line">
                  Complete Address
                  <span>
                    *
                  </span>
                </label>

                <textarea
                  id="address-line"
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="House / Flat / Building / Street / Area"
                  rows={4}
                  maxLength={300}
                  autoComplete="street-address"
                  disabled={
                    saving
                  }
                />

              </div>

              {/* CITY */}

              <div className="address-form-group">

                <label htmlFor="address-city">
                  City
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="address-city"
                  type="text"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter city"
                  autoComplete="address-level2"
                  maxLength={60}
                  disabled={
                    saving
                  }
                />

              </div>

              {/* STATE */}

              <div className="address-form-group">

                <label htmlFor="address-state">
                  State
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="address-state"
                  type="text"
                  name="state"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter state"
                  autoComplete="address-level1"
                  maxLength={60}
                  disabled={
                    saving
                  }
                />

              </div>

              {/* PINCODE */}

              <div className="address-form-group">

                <label htmlFor="address-pincode">
                  Pincode
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="address-pincode"
                  type="text"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="6-digit pincode"
                  autoComplete="postal-code"
                  maxLength={6}
                  inputMode="numeric"
                  disabled={
                    saving
                  }
                />

              </div>

              {/* ACTIONS */}

              <div className="address-form-actions">

                {editingId && (
                  <button
                    type="button"
                    className="address-cancel-button"
                    onClick={
                      resetForm
                    }
                    disabled={
                      saving
                    }
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="address-save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Address"
                      : "Save Address"}
                </button>

              </div>

            </form>

          </div>

        </div>

        {/* ==================================================
            CHECKOUT ACTION
            ================================================== */}

        <div className="address-checkout-card">

          <div>

            <span>
              READY FOR CHECKOUT?
            </span>

            <h2>
              {selectedAddressId
                ? "Your delivery address is selected."
                : "Select a delivery address to continue."}
            </h2>

            <p>
              You can review your order
              before placing it.
            </p>

          </div>

          <div className="address-checkout-actions">

            <Link
              to="/cart"
              className="address-cart-button"
            >
              ← Back to Cart
            </Link>

            <button
              type="button"
              className="address-continue-button"
              disabled={
                !selectedAddressId
              }
              onClick={
                handleContinue
              }
            >
              Continue to Order Summary
              <span>
                →
              </span>
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AddressPage;