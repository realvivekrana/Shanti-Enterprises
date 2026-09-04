// ============================================================
// SHANTI ENTERPRISES
// Saved Addresses Page
// Customer Account
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

import "./AddressesPage.css";

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
// ADDRESS ID
// ============================================================

const getAddressId = (
  address
) => {
  return (
    address?._id ||
    address?.id ||
    ""
  );
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
    loading,
    error: contextError,
  } = useAddress();

  const [
    form,
    setForm,
  ] = useState({
    ...emptyForm,
  });

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

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

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
        [name]:
          name === "pincode"
            ? value.replace(/\D/g, "").slice(0, 6)
            : value,
      })
    );

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

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
  // SAVE
  // ==========================================================

  const handleSubmit = async (
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

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateAddress(
          editingId,
          addressData
        );

        setSuccess(
          "Address updated successfully."
        );
      } else {
        await addAddress(
          addressData
        );

        setSuccess(
          "Address added successfully."
        );
      }

      setForm({
        ...emptyForm,
      });

      setEditingId(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save address."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (
    address
  ) => {
    const addressId =
      getAddressId(address);

    setEditingId(
      addressId
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
      setActionLoading(true);
      setError("");
      setSuccess("");

      await deleteAddress(
        addressId
      );

      if (
        String(editingId) ===
        String(addressId)
      ) {
        setForm({
          ...emptyForm,
        });

        setEditingId(null);
      }

      setSuccess(
        "Address deleted successfully."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete address."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // SELECT
  // ==========================================================

  const handleSelect = async (
    addressId
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await selectAddress(
        addressId
      );

      setSuccess(
        "Delivery address selected."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to select address."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // DISPLAY ERROR
  // ==========================================================

  const displayError =
    error ||
    contextError ||
    "";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="addresses-page">

      <div className="addresses-bg-orb addresses-bg-orb-one" />
      <div className="addresses-bg-orb addresses-bg-orb-two" />

      <div className="addresses-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="addresses-header">

          <div className="addresses-header-copy">

            <Link
              to="/dashboard"
              className="addresses-back-link"
            >
              <span className="addresses-back-icon">
                ←
              </span>
              Dashboard
            </Link>

            <div className="addresses-eyebrow-row">
              <span className="addresses-eyebrow-dot" />
              <span className="addresses-eyebrow">
                DELIVERY SETTINGS
              </span>
            </div>

            <h1>
              Saved Addresses
              <span className="addresses-title-accent">
                .
              </span>
            </h1>

            <p>
              Manage your delivery addresses for
              faster and easier business checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="addresses-shop-link"
          >
            <span>Continue Shopping</span>
            <span>→</span>
          </Link>

        </header>

        {/* ==================================================
            MESSAGES
            ================================================== */}

        {displayError && (
          <div
            className="addresses-alert addresses-alert-error"
            role="alert"
          >
            <span className="addresses-alert-icon">
              !
            </span>

            <div>
              <strong>
                Something needs attention
              </strong>
              <p>
                {displayError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            className="addresses-alert addresses-alert-success"
            role="status"
            aria-live="polite"
          >
            <span className="addresses-alert-icon">
              ✓
            </span>

            <div>
              <strong>
                Done
              </strong>
              <p>
                {success}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="addresses-layout">

          {/* ==================================================
              SAVED ADDRESSES
              ================================================== */}

          <div className="saved-addresses-section">

            <div className="addresses-section-heading">

              <div>
                <span className="addresses-section-kicker">
                  YOUR ADDRESSES
                </span>

                <h2>
                  Saved Addresses
                </h2>

                <p>
                  Select an address to use during checkout.
                </p>
              </div>

              <div className="addresses-count">
                <strong>
                  {addresses.length}
                </strong>
                <span>
                  {addresses.length === 1
                    ? "Address"
                    : "Addresses"}
                </span>
              </div>

            </div>

            {loading ? (
              <div className="address-list">
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="address-card address-card-skeleton"
                    >
                      <div className="address-skeleton-line address-skeleton-small" />
                      <div className="address-skeleton-line address-skeleton-title" />
                      <div className="address-skeleton-line" />
                      <div className="address-skeleton-line address-skeleton-medium" />
                      <div className="address-skeleton-actions">
                        <span />
                        <span />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : addresses.length === 0 ? (
              <div className="addresses-empty">

                <div className="addresses-empty-illustration">
                  <span className="addresses-empty-pin">
                    ●
                  </span>
                  <span className="addresses-empty-ring" />
                </div>

                <span className="addresses-empty-kicker">
                  NOTHING SAVED YET
                </span>

                <h3>
                  No saved addresses
                </h3>

                <p>
                  Add your first delivery address using
                  the form to make future checkout faster.
                </p>

                <button
                  type="button"
                  className="addresses-empty-button"
                  onClick={() =>
                    document
                      .getElementById("address-form")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                  }
                >
                  Add Your First Address
                  <span>→</span>
                </button>

              </div>
            ) : (
              <div className="address-list">

                {addresses.map(
                  (address) => {
                    const addressId =
                      getAddressId(
                        address
                      );

                    const isSelected =
                      String(
                        selectedAddressId
                      ) ===
                      String(
                        addressId
                      );

                    const isEditing =
                      String(
                        editingId
                      ) ===
                      String(
                        addressId
                      );

                    return (
                      <article
                        key={
                          addressId
                        }
                        className={`address-card ${
                          isSelected
                            ? "selected"
                            : ""
                        } ${
                          isEditing
                            ? "editing"
                            : ""
                        }`}
                      >

                        {/* TOP */}

                        <div className="address-card-top">

                          <button
                            type="button"
                            className={`address-select-button ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleSelect(
                                addressId
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            <span className="address-radio">
                              {isSelected && (
                                <span />
                              )}
                            </span>

                            <span>
                              {isSelected
                                ? "Selected address"
                                : "Use this address"}
                            </span>
                          </button>

                          {isSelected && (
                            <span className="selected-address-badge">
                              <span>✓</span>
                              Default
                            </span>
                          )}

                        </div>

                        {/* CONTENT */}

                        <div className="address-card-content">

                          <div className="address-name-row">
                            <h3>
                              {address.name}
                            </h3>

                            {address.isDefault && (
                              <span className="address-default-label">
                                PRIMARY
                              </span>
                            )}
                          </div>

                          <div className="address-phone">
                            <span>☎</span>
                            {address.phone}
                          </div>

                          <div className="address-copy">
                            <p>
                              {address.address}
                            </p>

                            <p>
                              {address.city},{" "}
                              {address.state}
                              {" "}
                              <strong>
                                {address.pincode}
                              </strong>
                            </p>
                          </div>

                        </div>

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
                              actionLoading
                            }
                          >
                            <span>✎</span>
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
                              actionLoading
                            }
                          >
                            <span>×</span>
                            Delete
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* ==================================================
              ADD / EDIT FORM
              ================================================== */}

          <div
            id="address-form"
            className="address-form-card"
          >

            <div className="address-form-decoration" />

            <div className="address-form-header">

              <div className="address-form-icon">
                {editingId ? "✎" : "+"}
              </div>

              <div>
                <span className="address-form-kicker">
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
                  Enter your complete delivery
                  information below.
                </p>
              </div>

            </div>

            <form
              className="address-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <div className="address-form-group">

                <label htmlFor="name">
                  <span>Full Name</span>
                  <small>Required</small>
                </label>

                <div className="address-input-wrap">
                  <span className="address-input-icon">
                    A
                  </span>

                  <input
                    id="name"
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
                    disabled={
                      actionLoading
                    }
                  />
                </div>

              </div>

              {/* PHONE */}

              <div className="address-form-group">

                <label htmlFor="phone">
                  <span>Phone Number</span>
                  <small>Required</small>
                </label>

                <div className="address-input-wrap">
                  <span className="address-input-icon">
                    #
                  </span>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    disabled={
                      actionLoading
                    }
                  />
                </div>

              </div>

              {/* ADDRESS */}

              <div className="address-form-group">

                <label htmlFor="address">
                  <span>Complete Address</span>
                  <small>Required</small>
                </label>

                <div className="address-input-wrap address-textarea-wrap">
                  <span className="address-input-icon address-textarea-icon">
                    ▤
                  </span>

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
                    disabled={
                      actionLoading
                    }
                  />
                </div>

              </div>

              {/* CITY + STATE */}

              <div className="address-form-row">

                <div className="address-form-group">

                  <label htmlFor="city">
                    <span>City</span>
                    <small>Required</small>
                  </label>

                  <div className="address-input-wrap">
                    <span className="address-input-icon">
                      C
                    </span>

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter city"
                      disabled={
                        actionLoading
                      }
                    />
                  </div>

                </div>

                <div className="address-form-group">

                  <label htmlFor="state">
                    <span>State</span>
                    <small>Required</small>
                  </label>

                  <div className="address-input-wrap">
                    <span className="address-input-icon">
                      S
                    </span>

                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter state"
                      disabled={
                        actionLoading
                      }
                    />
                  </div>

                </div>

              </div>

              {/* PINCODE */}

              <div className="address-form-group">

                <label htmlFor="pincode">
                  <span>Pincode</span>
                  <small>6 digits</small>
                </label>

                <div className="address-input-wrap">
                  <span className="address-input-icon">
                    #
                  </span>

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
                    inputMode="numeric"
                    autoComplete="postal-code"
                    disabled={
                      actionLoading
                    }
                  />
                </div>

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
                      actionLoading
                    }
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="address-save-button"
                  disabled={
                    actionLoading
                  }
                >
                  {actionLoading ? (
                    <>
                      <span className="address-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingId
                        ? "Update Address"
                        : "Save Address"}
                      <span>→</span>
                    </>
                  )}
                </button>

              </div>

            </form>

            <div className="address-form-note">
              <span>✓</span>
              <p>
                Your saved address is used only for
                your Shanti Enterprises deliveries.
              </p>
            </div>

          </div>

        </div>

        {/* ==================================================
            CHECKOUT CTA
            ================================================== */}

        {selectedAddressId && (
          <div className="addresses-checkout">

            <div className="addresses-checkout-copy">
              <div className="addresses-checkout-icon">
                ✓
              </div>

              <div>
                <span>
                  READY FOR CHECKOUT?
                </span>

                <p>
                  Your selected delivery address
                  will be used for your order.
                </p>
              </div>
            </div>

            <Link
              to="/checkout/summary"
              className="addresses-checkout-button"
            >
              <span>
                Continue to Checkout
              </span>
              <span className="addresses-checkout-arrow">
                →
              </span>
            </Link>

          </div>
        )}

        {/* ==================================================
            FOOTER NAV
            ================================================== */}

        <nav
          className="addresses-footer-nav"
          aria-label="Account navigation"
        >
          <Link to="/orders">
            <span>Orders</span>
            <span>→</span>
          </Link>

          <Link to="/quotations">
            <span>Quotations</span>
            <span>→</span>
          </Link>

          <Link to="/rfqs">
            <span>RFQs</span>
            <span>→</span>
          </Link>

          <Link to="/profile">
            <span>Profile</span>
            <span>→</span>
          </Link>
        </nav>

      </div>
    </section>
  );
}

export default AddressesPage;
