// ============================================================
// SHANTI ENTERPRISES
// RFQ Create Page
// Customer - Wholesale
// ============================================================

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createRFQ } from "../../api/rfqApi";

// ============================================================
// HELPERS
// ============================================================

const getProductId = (product) =>
  product?._id || product?.id || "";

const getProductName = (product) =>
  product?.name ||
  product?.title ||
  "Product";

const getProductImage = (product) =>
  product?.images?.[0]?.url ||
  product?.images?.[0]?.secure_url ||
  product?.images?.[0] ||
  product?.image?.url ||
  product?.image?.secure_url ||
  product?.image ||
  "";

const getProductMOQ = (product) => {
  const moq = Number(
    product?.moq ??
      product?.minimumOrderQuantity ??
      product?.minOrderQuantity ??
      1
  );

  return Number.isFinite(moq) && moq > 0
    ? Math.floor(moq)
    : 1;
};

const getProductStock = (product) => {
  const stock = Number(
    product?.stock ??
      product?.countInStock ??
      product?.inventory ??
      product?.quantity ??
      0
  );

  return Number.isFinite(stock) && stock >= 0
    ? Math.floor(stock)
    : 0;
};

const getProductUnit = (product) =>
  product?.unit ||
  "piece";

// ============================================================
// COMPONENT
// ============================================================

function RFQCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================================
  // PRODUCT RECEIVED FROM PRODUCT DETAILS
  // ==========================================================

  const sourceProduct =
    location.state?.product || null;

  const sourceQuantity =
    Number(
      location.state?.quantity
    );

  // ==========================================================
  // INITIAL PRODUCT
  // ==========================================================

  const initialProduct =
    sourceProduct
      ? {
          product: sourceProduct,

          productId:
            getProductId(
              sourceProduct
            ),

          quantity:
            Number.isInteger(
              sourceQuantity
            ) &&
            sourceQuantity > 0
              ? sourceQuantity
              : getProductMOQ(
                  sourceProduct
                ),

          note: "",
        }
      : null;

  // ==========================================================
  // STATE
  // ==========================================================

  const [items, setItems] =
    useState(
      initialProduct
        ? [initialProduct]
        : []
    );

  const [message, setMessage] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ==========================================================
  // TOTAL QUANTITY
  // ==========================================================

  const totalQuantity =
    useMemo(() => {
      return items.reduce(
        (total, item) =>
          total +
          Number(
            item.quantity || 0
          ),
        0
      );
    }, [items]);

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const handleQuantityChange = (
    index,
    value
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) => {
            if (
              itemIndex !== index
            ) {
              return item;
            }

            return {
              ...item,
              quantity: value,
            };
          }
        )
    );

    setErrors(
      (currentErrors) => {
        const nextErrors = {
          ...currentErrors,
        };

        delete nextErrors[index];

        return nextErrors;
      }
    );

    setSubmitError("");
  };

  // ==========================================================
  // UPDATE NOTE
  // ==========================================================

  const handleNoteChange = (
    index,
    value
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item, itemIndex) => {
            if (
              itemIndex !== index
            ) {
              return item;
            }

            return {
              ...item,
              note: value,
            };
          }
        )
    );

    setSubmitError("");
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemoveItem = (
    index
  ) => {
    setItems(
      (currentItems) =>
        currentItems.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );

    setErrors({});
    setSubmitError("");
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    const validationErrors = {};

    if (!items.length) {
      setSubmitError(
        "Please add at least one product to your RFQ."
      );

      return false;
    }

    items.forEach(
      (item, index) => {
        const product =
          item.product;

        const quantity =
          Number(
            item.quantity
          );

        const moq =
          getProductMOQ(
            product
          );

        const stock =
          getProductStock(
            product
          );

        const productName =
          getProductName(
            product
          );

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {
          validationErrors[index] =
            `${productName}: Quantity must be a valid whole number.`;

          return;
        }

        if (
          quantity < moq
        ) {
          validationErrors[index] =
            `${productName}: Minimum order quantity is ${moq}.`;

          return;
        }

        if (
          stock > 0 &&
          quantity > stock
        ) {
          validationErrors[index] =
            `${productName}: Requested quantity cannot exceed available stock of ${stock}.`;

          return;
        }

        if (
          item.note &&
          item.note.length > 500
        ) {
          validationErrors[index] =
            `${productName}: Product note cannot exceed 500 characters.`;
        }
      }
    );

    if (
      message.length > 1000
    ) {
      setSubmitError(
        "Overall requirement cannot exceed 1000 characters."
      );

      return false;
    }

    setErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return false;
    }

    return true;
  };

  // ==========================================================
  // SUBMIT RFQ
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitError("");

    if (
      !validateForm()
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        items: items.map(
          (item) => ({
            productId:
              item.productId,

            quantity:
              Number(
                item.quantity
              ),

            note:
              item.note.trim(),
          })
        ),

        message:
          message.trim(),
      };

      const response =
        await createRFQ(
          payload
        );

      const createdRFQ =
        response?.rfq ||
        response?.data?.rfq ||
        response?.data ||
        null;

      const rfqId =
        createdRFQ?.id ||
        createdRFQ?._id;

      if (rfqId) {
        navigate(
          `/rfq/${rfqId}`,
          {
            replace: true,
            state: {
              successMessage:
                "Your RFQ has been submitted successfully.",
            },
          }
        );

        return;
      }

      navigate(
        "/rfqs",
        {
          replace: true,
          state: {
            successMessage:
              "Your RFQ has been submitted successfully.",
          },
        }
      );
    } catch (error) {
      console.error(
        "RFQ submission error:",
        error
      );

      const apiMessage =
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        "Unable to submit RFQ. Please try again.";

      setSubmitError(
        apiMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    navigate(-1);
  };

  // ==========================================================
  // BROWSE PRODUCTS
  // ==========================================================

  const handleBrowseProducts =
    () => {
      navigate(
        "/products"
      );
    };

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (!items.length) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              WHOLESALE
            </span>

            <h1>
              Request for Quote
            </h1>

            <p>
              Select a product first
              to create your wholesale
              quote request.
            </p>

          </div>

        </div>

        <div
          style={{
            padding:
              "48px 24px",
            textAlign:
              "center",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >

          <h2>
            No products selected
          </h2>

          <p>
            Please select at least
            one product before
            requesting a quote.
          </p>

          <button
            type="button"
            onClick={
              handleBrowseProducts
            }
            style={{
              marginTop:
                "16px",
            }}
          >
            Browse Products
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="page-header">

        <div>

          <span className="page-eyebrow">
            WHOLESALE
          </span>

          <h1>
            Request for Quote
          </h1>

          <p>
            Submit your wholesale
            requirements and our team
            will get back to you with
            pricing and availability.
          </p>

        </div>

      </div>

      {/* ======================================================
          BACK
          ====================================================== */}

      <div
        style={{
          marginBottom:
            "24px",
        }}
      >

        <button
          type="button"
          onClick={
            handleBack
          }
        >
          ← Back
        </button>

      </div>

      {/* ======================================================
          FORM
          ====================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 340px",
            gap:
              "24px",
            alignItems:
              "start",
          }}
        >

          {/* ==================================================
              PRODUCTS
              ================================================== */}

          <section>

            <div
              style={{
                marginBottom:
                  "16px",
              }}
            >

              <h2
                style={{
                  margin:
                    0,
                }}
              >
                Requested Product
                {items.length !== 1
                  ? "s"
                  : ""}
              </h2>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  color:
                    "#6b7280",
                }}
              >
                {items.length}{" "}
                product
                {items.length !== 1
                  ? "s"
                  : ""}{" "}
                ·{" "}
                {totalQuantity}{" "}
                total units
              </p>

            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap:
                  "16px",
              }}
            >

              {items.map(
                (
                  item,
                  index
                ) => {
                  const product =
                    item.product;

                  const image =
                    getProductImage(
                      product
                    );

                  const productName =
                    getProductName(
                      product
                    );

                  const moq =
                    getProductMOQ(
                      product
                    );

                  const stock =
                    getProductStock(
                      product
                    );

                  const unit =
                    getProductUnit(
                      product
                    );

                  const itemError =
                    errors[index];

                  return (
                    <article
                      key={
                        item.productId ||
                        index
                      }
                      style={{
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "12px",
                        background:
                          "#ffffff",
                        padding:
                          "20px",
                      }}
                    >

                      {/* PRODUCT */}

                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "16px",
                          alignItems:
                            "flex-start",
                        }}
                      >

                        {/* IMAGE */}

                        <div
                          style={{
                            width:
                              "96px",
                            height:
                              "96px",
                            borderRadius:
                              "10px",
                            overflow:
                              "hidden",
                            background:
                              "#f3f4f6",
                            flexShrink:
                              0,
                          }}
                        >

                          {image ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                productName
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontSize:
                                  "12px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              No Image
                            </div>
                          )}

                        </div>

                        {/* INFO */}

                        <div
                          style={{
                            flex:
                              1,
                            minWidth:
                              0,
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 8px",
                            }}
                          >
                            {productName}
                          </h3>

                          <p
                            style={{
                              margin:
                                "0 0 6px",
                              color:
                                "#6b7280",
                            }}
                          >
                            Unit:{" "}
                            <strong>
                              {unit}
                            </strong>
                          </p>

                          <p
                            style={{
                              margin:
                                "0 0 6px",
                              color:
                                "#6b7280",
                            }}
                          >
                            MOQ:{" "}
                            <strong>
                              {moq}
                            </strong>
                          </p>

                          {stock > 0 && (
                            <p
                              style={{
                                margin:
                                  0,
                                color:
                                  "#6b7280",
                              }}
                            >
                              Available:
                              {" "}
                              <strong>
                                {stock}
                              </strong>
                            </p>
                          )}

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              index
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          style={{
                            border:
                              "none",
                            background:
                              "transparent",
                            color:
                              "#dc2626",
                            cursor:
                              isSubmitting
                                ? "not-allowed"
                                : "pointer",
                            fontWeight:
                              600,
                          }}
                        >
                          Remove
                        </button>

                      </div>

                      {/* FIELDS */}

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "minmax(180px, 220px) minmax(0, 1fr)",
                          gap:
                            "16px",
                          marginTop:
                            "20px",
                        }}
                      >

                        {/* QUANTITY */}

                        <div>

                          <label
                            htmlFor={`rfq-quantity-${index}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                600,
                              marginBottom:
                                "8px",
                            }}
                          >
                            Quantity
                          </label>

                          <input
                            id={`rfq-quantity-${index}`}
                            type="number"
                            min={moq}
                            max={
                              stock > 0
                                ? stock
                                : undefined
                            }
                            step="1"
                            value={
                              item.quantity
                            }
                            onChange={(
                              event
                            ) =>
                              handleQuantityChange(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px 12px",
                              border:
                                "1px solid #d1d5db",
                              borderRadius:
                                "8px",
                              boxSizing:
                                "border-box",
                            }}
                          />

                          <small
                            style={{
                              display:
                                "block",
                              marginTop:
                                "6px",
                              color:
                                "#6b7280",
                            }}
                          >
                            Minimum:
                            {" "}
                            {moq}{" "}
                            {unit}
                          </small>

                        </div>

                        {/* NOTE */}

                        <div>

                          <label
                            htmlFor={`rfq-note-${index}`}
                            style={{
                              display:
                                "block",
                              fontWeight:
                                600,
                              marginBottom:
                                "8px",
                            }}
                          >
                            Product
                            Requirement
                          </label>

                          <textarea
                            id={`rfq-note-${index}`}
                            rows="3"
                            maxLength="500"
                            placeholder="Mention color, size, specification, packaging or any other requirement..."
                            value={
                              item.note
                            }
                            onChange={(
                              event
                            ) =>
                              handleNoteChange(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            style={{
                              width:
                                "100%",
                              padding:
                                "10px 12px",
                              border:
                                "1px solid #d1d5db",
                              borderRadius:
                                "8px",
                              resize:
                                "vertical",
                              boxSizing:
                                "border-box",
                            }}
                          />

                          <small
                            style={{
                              display:
                                "block",
                              marginTop:
                                "6px",
                              color:
                                "#6b7280",
                            }}
                          >
                            {
                              item.note
                                .length
                            }
                            /500
                          </small>

                        </div>

                      </div>

                      {/* ERROR */}

                      {itemError && (
                        <p
                          role="alert"
                          style={{
                            margin:
                              "12px 0 0",
                            color:
                              "#dc2626",
                            fontWeight:
                              500,
                          }}
                        >
                          {itemError}
                        </p>
                      )}

                    </article>
                  );
                }
              )}

            </div>

          </section>

          {/* ==================================================
              SUMMARY
              ================================================== */}

          <aside
            style={{
              position:
                "sticky",
              top:
                "20px",
            }}
          >

            <div
              style={{
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "12px",
                background:
                  "#ffffff",
                padding:
                  "20px",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                RFQ Summary
              </h2>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  padding:
                    "12px 0",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >

                <span>
                  Products
                </span>

                <strong>
                  {items.length}
                </strong>

              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  padding:
                    "12px 0",
                }}
              >

                <span>
                  Total Quantity
                </span>

                <strong>
                  {totalQuantity}
                </strong>

              </div>

              {/* OVERALL MESSAGE */}

              <div
                style={{
                  marginTop:
                    "20px",
                }}
              >

                <label
                  htmlFor="rfq-message"
                  style={{
                    display:
                      "block",
                    fontWeight:
                      600,
                    marginBottom:
                      "8px",
                  }}
                >
                  Overall Requirement
                </label>

                <textarea
                  id="rfq-message"
                  rows="6"
                  maxLength="1000"
                  placeholder="Tell us about your business requirement, delivery expectations, preferred pricing, packaging or any other information..."
                  value={
                    message
                  }
                  onChange={(
                    event
                  ) =>
                    setMessage(
                      event
                        .target
                        .value
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px 12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "8px",
                    resize:
                      "vertical",
                    boxSizing:
                      "border-box",
                  }}
                />

                <small
                  style={{
                    display:
                      "block",
                    marginTop:
                      "6px",
                    color:
                      "#6b7280",
                  }}
                >
                  {message.length}
                  /1000
                </small>

              </div>

              {/* ERROR */}

              {submitError && (
                <div
                  role="alert"
                  style={{
                    marginTop:
                      "16px",
                    padding:
                      "12px",
                    borderRadius:
                      "8px",
                    background:
                      "#fef2f2",
                    color:
                      "#b91c1c",
                    border:
                      "1px solid #fecaca",
                  }}
                >
                  {submitError}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !items.length
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "20px",
                  padding:
                    "12px 16px",
                  borderRadius:
                    "8px",
                  border:
                    "none",
                  cursor:
                    isSubmitting
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    isSubmitting
                      ? 0.7
                      : 1,
                }}
              >
                {isSubmitting
                  ? "Submitting RFQ..."
                  : "Submit RFQ"}
              </button>

              <p
                style={{
                  margin:
                    "12px 0 0",
                  fontSize:
                    "13px",
                  color:
                    "#6b7280",
                  lineHeight:
                    1.5,
                }}
              >
                Our team will review
                your requirements and
                contact you with
                wholesale pricing and
                availability.
              </p>

            </div>

          </aside>

        </div>

      </form>

    </div>
  );
}

export default RFQCreatePage;