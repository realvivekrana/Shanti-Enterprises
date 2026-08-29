// ============================================================
// SHANTI ENTERPRISES
// Create Quotation Page
// Admin - Wholesale Quotation
// ============================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  getAdminRFQById,
} from "../../api/rfqApi";

import {
  createAdminQuotation,
} from "../../api/quotationApi";

// ============================================================
// HELPERS
// ============================================================

const getRFQId = (rfq) =>
  rfq?._id ||
  rfq?.id ||
  "";

const getRFQNumber = (rfq) =>
  rfq?.rfqNumber ||
  "RFQ";

const getCustomer = (rfq) =>
  rfq?.user ||
  rfq?.customer ||
  rfq?.createdBy ||
  null;

const getCustomerName = (rfq) => {
  const customer =
    getCustomer(rfq);

  if (
    typeof customer ===
    "string"
  ) {
    return customer;
  }

  return (
    customer?.name ||
    customer?.fullName ||
    customer?.username ||
    customer?.email ||
    "Customer"
  );
};

const getCustomerEmail = (rfq) => {
  const customer =
    getCustomer(rfq);

  if (
    customer &&
    typeof customer ===
      "object"
  ) {
    return (
      customer.email ||
      ""
    );
  }

  return (
    rfq?.customerEmail ||
    rfq?.email ||
    ""
  );
};

const getItemProductId = (
  item
) => {
  if (
    typeof item?.product ===
    "string"
  ) {
    return item.product;
  }

  return (
    item?.product?._id ||
    item?.product?.id ||
    item?.productId ||
    ""
  );
};

const getProductName = (
  item
) => {
  if (
    typeof item?.product ===
    "object"
  ) {
    return (
      item.product.name ||
      item.product.title ||
      item.product.productName ||
      "Product"
    );
  }

  return (
    item?.productName ||
    item?.name ||
    "Product"
  );
};

const getProductUnit = (
  item
) => {
  if (
    typeof item?.product ===
    "object"
  ) {
    return (
      item.product.unit ||
      item.unit ||
      "piece"
    );
  }

  return (
    item?.unit ||
    "piece"
  );
};

const getQuantity = (
  item
) =>
  Number(
    item?.quantity || 0
  );

const formatCurrency = (
  value
) =>
  `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits:
        2,
      maximumFractionDigits:
        2,
    }
  )}`;

const formatDate = (
  value
) => {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ============================================================
// COMPONENT
// ============================================================

function CreateQuotationPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  // ----------------------------------------------------------
  // RFQ ID
  // Supports:
//  /admin/quotations/create?rfqId=...
//  /admin/quotations/create/:rfqId
  // ----------------------------------------------------------

  const rfqId =
    searchParams.get(
      "rfqId"
    );

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    rfq,
    setRFQ,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    itemPrices,
    setItemPrices,
  ] = useState({});

  const [
    validUntil,
    setValidUntil,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  // ==========================================================
  // LOAD RFQ
  // ==========================================================

  const loadRFQ =
    useCallback(
      async () => {
        if (!rfqId) {
          setError(
            "RFQ ID is missing. Please open Create Quotation from an RFQ."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getAdminRFQById(
              rfqId
            );

          const receivedRFQ =
            response?.rfq ||
            response?.data?.rfq ||
            response?.data ||
            null;

          if (
            !receivedRFQ
          ) {
            throw new Error(
              "RFQ details were not found."
            );
          }

          setRFQ(
            receivedRFQ
          );

          const initialPrices =
            {};

          const items =
            Array.isArray(
              receivedRFQ?.items
            )
              ? receivedRFQ.items
              : [];

          items.forEach(
            (
              item,
              index
            ) => {
              const itemId =
                item?._id ||
                getItemProductId(
                  item
                ) ||
                index;

              initialPrices[
                itemId
              ] = "";
            }
          );

          setItemPrices(
            initialPrices
          );
        } catch (err) {
          console.error(
            "Load RFQ for quotation error:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.response?.data
                ?.error ||
              err?.message ||
              "Unable to load RFQ."
          );
        } finally {
          setLoading(false);
        }
      },
      [rfqId]
    );

  // ==========================================================
  // EFFECT
  // ==========================================================

  useEffect(() => {
    loadRFQ();
  }, [loadRFQ]);

  // ==========================================================
  // RFQ ITEMS
  // ==========================================================

  const items =
    useMemo(
      () =>
        Array.isArray(
          rfq?.items
        )
          ? rfq.items
          : [],
      [rfq]
    );

  // ==========================================================
  // PRICE CHANGE
  // ==========================================================

  const handlePriceChange =
    (
      item,
      index,
      value
    ) => {
      const itemId =
        item?._id ||
        getItemProductId(
          item
        ) ||
        index;

      // Allow empty input
      if (
        value === ""
      ) {
        setItemPrices(
          (current) => ({
            ...current,
            [itemId]: "",
          })
        );

        return;
      }

      // Allow positive decimal numbers
      if (
        !/^\d*\.?\d*$/.test(
          value
        )
      ) {
        return;
      }

      setItemPrices(
        (current) => ({
          ...current,
          [itemId]: value,
        })
      );
    };

  // ==========================================================
  // GET ITEM PRICE
  // ==========================================================

  const getItemPrice =
    (
      item,
      index
    ) => {
      const itemId =
        item?._id ||
        getItemProductId(
          item
        ) ||
        index;

      return (
        itemPrices[
          itemId
        ] ?? ""
      );
    };

  // ==========================================================
  // CALCULATE ITEM TOTAL
  // ==========================================================

  const getCalculatedItemTotal =
    (
      item,
      index
    ) => {
      const price =
        Number(
          getItemPrice(
            item,
            index
          ) || 0
        );

      const quantity =
        getQuantity(item);

      return (
        price *
        quantity
      );
    };

  // ==========================================================
  // SUBTOTAL
  // ==========================================================

  const subtotal =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item,
          index
        ) =>
          total +
          getCalculatedItemTotal(
            item,
            index
          ),
        0
      );
    }, [
      items,
      itemPrices,
    ]);

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm =
    () => {
      if (!rfqId) {
        return "RFQ ID is missing.";
      }

      if (
        items.length ===
        0
      ) {
        return "This RFQ does not contain any products.";
      }

      for (
        let index = 0;
        index <
        items.length;
        index += 1
      ) {
        const item =
          items[index];

        const productId =
          getItemProductId(
            item
          );

        if (!productId) {
          return `Product ID is missing for item ${
            index + 1
          }.`;
        }

        const priceValue =
          getItemPrice(
            item,
            index
          );

        const price =
          Number(
            priceValue
          );

        if (
          priceValue ===
            "" ||
          !Number.isFinite(
            price
          ) ||
          price < 0
        ) {
          return `Please enter a valid unit price for ${getProductName(
            item
          )}.`;
        }
      }

      if (
        validUntil
      ) {
        const expiry =
          new Date(
            `${validUntil}T23:59:59`
          );

        if (
          Number.isNaN(
            expiry.getTime()
          )
        ) {
          return "Please select a valid quotation expiry date.";
        }

        if (
          expiry <
          new Date()
        ) {
          return "Quotation expiry date cannot be in the past.";
        }
      }

      if (
        note.length >
        1000
      ) {
        return "Quotation note cannot exceed 1000 characters.";
      }

      return "";
    };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      setError("");
      setSuccessMessage("");

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
        setSubmitting(
          true
        );

        // ----------------------------------------------------
        // BUILD PAYLOAD
        // ----------------------------------------------------

        const quotationItems =
          items.map(
            (
              item,
              index
            ) => ({
              productId:
                getItemProductId(
                  item
                ),

              quantity:
                getQuantity(
                  item
                ),

              unit:
                getProductUnit(
                  item
                ),

              unitPrice:
                Number(
                  getItemPrice(
                    item,
                    index
                  )
                ),
            })
          );

        const payload = {
          rfqId,
          items:
            quotationItems,

          ...(note.trim()
            ? {
                note:
                  note.trim(),
              }
            : {}),

          ...(validUntil
            ? {
                validUntil:
                  new Date(
                    `${validUntil}T23:59:59`
                  ).toISOString(),
              }
            : {}),
        };

        const response =
          await createAdminQuotation(
            payload
          );

        const createdQuotation =
          response?.quotation ||
          response?.data?.quotation ||
          null;

        setSuccessMessage(
          response?.message ||
            "Quotation created successfully."
        );

        // ----------------------------------------------------
        // REDIRECT
        // ----------------------------------------------------

        const createdId =
          createdQuotation?._id ||
          createdQuotation?.id;

        if (
          createdId
        ) {
          setTimeout(
            () => {
              navigate(
                `/admin/quotations/${createdId}`
              );
            },
            700
          );
        }
      } catch (err) {
        console.error(
          "Create quotation error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.response?.data
              ?.error ||
            err?.message ||
            "Unable to create quotation."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              ADMIN
            </span>

            <h1>
              Create Quotation
            </h1>

            <p>
              Loading RFQ details...
            </p>

          </div>

        </div>

        <div
          style={{
            padding:
              "60px 20px",
            textAlign:
              "center",
          }}
        >
          Loading RFQ...
        </div>

      </div>
    );
  }

  // ==========================================================
  // RFQ ERROR
  // ==========================================================

  if (
    !rfq &&
    error
  ) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              ADMIN
            </span>

            <h1>
              Create Quotation
            </h1>

          </div>

          <Link
            to="/admin/rfqs"
          >
            ← Back to RFQs
          </Link>

        </div>

        <section
          style={{
            padding:
              "24px",
            background:
              "#fef2f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecaca",
            borderRadius:
              "12px",
          }}
        >

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadRFQ
            }
          >
            Try Again
          </button>

        </section>

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
            ADMIN · WHOLESALE
          </span>

          <h1>
            Create Quotation
          </h1>

          <p>
            Create a quotation for{" "}
            <strong>
              {getRFQNumber(
                rfq
              )}
            </strong>
          </p>

        </div>

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >

          <Link
            to="/admin/rfqs"
          >
            ← All RFQs
          </Link>

          {rfqId && (
            <Link
              to={`/admin/rfqs/${rfqId}`}
            >
              View RFQ
            </Link>
          )}

        </div>

      </div>

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          role="alert"
          style={{
            marginBottom:
              "20px",
            padding:
              "14px 16px",
            background:
              "#fef2f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecaca",
            borderRadius:
              "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SUCCESS
          ====================================================== */}

      {successMessage && (
        <div
          role="status"
          style={{
            marginBottom:
              "20px",
            padding:
              "14px 16px",
            background:
              "#ecfdf5",
            color:
              "#047857",
            border:
              "1px solid #a7f3d0",
            borderRadius:
              "10px",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* ======================================================
          CUSTOMER / RFQ INFORMATION
          ====================================================== */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap:
            "16px",
          marginBottom:
            "20px",
        }}
      >

        <section
          style={{
            padding:
              "18px",
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "13px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            RFQ Number
          </span>

          <strong>
            {
              getRFQNumber(
                rfq
              )
            }
          </strong>

        </section>

        <section
          style={{
            padding:
              "18px",
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "13px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            Customer
          </span>

          <strong
            style={{
              display:
                "block",
            }}
          >
            {
              getCustomerName(
                rfq
              )
            }
          </strong>

          {getCustomerEmail(
            rfq
          ) && (
            <span
              style={{
                display:
                  "block",
                marginTop:
                  "4px",
                fontSize:
                  "13px",
                color:
                  "#6b7280",
              }}
            >
              {
                getCustomerEmail(
                  rfq
                )
              }
            </span>
          )}

        </section>

        <section
          style={{
            padding:
              "18px",
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "13px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            RFQ Date
          </span>

          <strong>
            {
              formatDate(
                rfq?.createdAt
              )
            }
          </strong>

        </section>

      </div>

      {/* ======================================================
          CREATE FORM
          ====================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* ====================================================
            PRODUCTS
            ==================================================== */}

        <section
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            overflow:
              "hidden",
            marginBottom:
              "20px",
          }}
        >

          <div
            style={{
              padding:
                "18px 20px",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >

            <h2
              style={{
                margin:
                  0,
              }}
            >
              Quotation Items
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color:
                  "#6b7280",
                fontSize:
                  "14px",
              }}
            >
              Enter your selling price for
              each requested product.
            </p>

          </div>

          {items.length ===
          0 ? (
            <div
              style={{
                padding:
                  "40px 20px",
                textAlign:
                  "center",
                color:
                  "#6b7280",
              }}
            >
              This RFQ has no products.
            </div>
          ) : (
            <div
              style={{
                overflowX:
                  "auto",
              }}
            >

              <table
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                  minWidth:
                    "850px",
                }}
              >

                <thead>

                  <tr
                    style={{
                      background:
                        "#f9fafb",
                    }}
                  >

                    <th
                      style={{
                        textAlign:
                          "left",
                        padding:
                          "14px 16px",
                      }}
                    >
                      Product
                    </th>

                    <th
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "14px 16px",
                      }}
                    >
                      Quantity
                    </th>

                    <th
                      style={{
                        textAlign:
                          "left",
                        padding:
                          "14px 16px",
                      }}
                    >
                      Unit
                    </th>

                    <th
                      style={{
                        textAlign:
                          "right",
                        padding:
                          "14px 16px",
                      }}
                    >
                      Unit Price
                    </th>

                    <th
                      style={{
                        textAlign:
                          "right",
                        padding:
                          "14px 16px",
                      }}
                    >
                      Item Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {items.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={
                          item?._id ||
                          getItemProductId(
                            item
                          ) ||
                          index
                        }
                        style={{
                          borderTop:
                            "1px solid #f3f4f6",
                        }}
                      >

                        {/* PRODUCT */}

                        <td
                          style={{
                            padding:
                              "16px",
                          }}
                        >

                          <strong>
                            {
                              getProductName(
                                item
                              )
                            }
                          </strong>

                        </td>

                        {/* QUANTITY */}

                        <td
                          style={{
                            padding:
                              "16px",
                            textAlign:
                              "center",
                          }}
                        >

                          <strong>
                            {
                              getQuantity(
                                item
                              )
                            }
                          </strong>

                        </td>

                        {/* UNIT */}

                        <td
                          style={{
                            padding:
                              "16px",
                          }}
                        >
                          {
                            getProductUnit(
                              item
                            )
                          }
                        </td>

                        {/* UNIT PRICE */}

                        <td
                          style={{
                            padding:
                              "16px",
                            textAlign:
                              "right",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "flex-end",
                              gap:
                                "6px",
                            }}
                          >

                            <span>
                              ₹
                            </span>

                            <input
                              type="text"
                              inputMode="decimal"
                              value={
                                getItemPrice(
                                  item,
                                  index
                                )
                              }
                              onChange={(
                                event
                              ) =>
                                handlePriceChange(
                                  item,
                                  index,
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="0.00"
                              disabled={
                                submitting
                              }
                              style={{
                                width:
                                  "130px",
                                padding:
                                  "10px 12px",
                                border:
                                  "1px solid #d1d5db",
                                borderRadius:
                                  "8px",
                                textAlign:
                                  "right",
                              }}
                            />

                          </div>

                        </td>

                        {/* TOTAL */}

                        <td
                          style={{
                            padding:
                              "16px",
                            textAlign:
                              "right",
                            fontWeight:
                              700,
                          }}
                        >
                          {formatCurrency(
                            getCalculatedItemTotal(
                              item,
                              index
                            )
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ====================================================
            QUOTATION SETTINGS
            ==================================================== */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) minmax(300px, 380px)",
            gap:
              "20px",
            alignItems:
              "start",
          }}
        >

          {/* ==================================================
              NOTE + VALID UNTIL
              ================================================== */}

          <section
            style={{
              padding:
                "20px",
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "12px",
            }}
          >

            <h2>
              Quotation Information
            </h2>

            {/* VALID UNTIL */}

            <div
              style={{
                marginBottom:
                  "18px",
              }}
            >

              <label
                htmlFor="validUntil"
                style={{
                  display:
                    "block",
                  fontWeight:
                    600,
                  marginBottom:
                    "7px",
                }}
              >
                Valid Until
              </label>

              <input
                id="validUntil"
                type="date"
                value={
                  validUntil
                }
                onChange={(
                  event
                ) =>
                  setValidUntil(
                    event.target
                      .value
                  )
                }
                disabled={
                  submitting
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                style={{
                  width:
                    "100%",
                  maxWidth:
                    "300px",
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

              <p
                style={{
                  margin:
                    "6px 0 0",
                  fontSize:
                    "12px",
                  color:
                    "#6b7280",
                }}
              >
                Optional expiry date for
                this quotation.
              </p>

            </div>

            {/* NOTE */}

            <div>

              <label
                htmlFor="quotationNote"
                style={{
                  display:
                    "block",
                  fontWeight:
                    600,
                  marginBottom:
                    "7px",
                }}
              >
                Note
              </label>

              <textarea
                id="quotationNote"
                value={note}
                onChange={(
                  event
                ) =>
                  setNote(
                    event.target
                      .value
                  )
                }
                disabled={
                  submitting
                }
                maxLength={
                  1000
                }
                rows={6}
                placeholder="Add any terms, delivery information or special notes..."
                style={{
                  width:
                    "100%",
                  padding:
                    "12px",
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

              <div
                style={{
                  textAlign:
                    "right",
                  fontSize:
                    "12px",
                  color:
                    "#6b7280",
                  marginTop:
                    "5px",
                }}
              >
                {
                  note.length
                }
                /1000
              </div>

            </div>

          </section>

          {/* ==================================================
              TOTAL
              ================================================== */}

          <section
            style={{
              padding:
                "20px",
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "12px",
            }}
          >

            <h2>
              Quotation Total
            </h2>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                paddingBottom:
                  "12px",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              <span>
                Items
              </span>

              <strong>
                {
                  items.length
                }
              </strong>

            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                paddingTop:
                  "16px",
                fontSize:
                  "20px",
              }}
            >

              <strong>
                Subtotal
              </strong>

              <strong>
                {formatCurrency(
                  subtotal
                )}
              </strong>

            </div>

            <button
              type="submit"
              disabled={
                submitting ||
                items.length ===
                  0
              }
              style={{
                width:
                  "100%",
                marginTop:
                  "20px",
              }}
            >
              {submitting
                ? "Creating Quotation..."
                : "Create Quotation"}
            </button>

          </section>

        </div>

      </form>

    </div>
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default CreateQuotationPage;