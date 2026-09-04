
// ============================================================
// SHANTI ENTERPRISES
// Customer Quotation Details Page
// Frontend - Wholesale Quotation
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./QuotationDetailsPage.css";

import {
  acceptQuotation,
  getQuotationById,
  rejectQuotation,
} from "../../api/quotationApi";

// ============================================================
// HELPERS
// ============================================================

const getQuotationNumber = (
  quotation
) =>
  quotation?.quotationNumber ||
  "Quotation";

const getRFQNumber = (
  quotation
) =>
  quotation?.rfq?.rfqNumber ||
  quotation?.rfqNumber ||
  "—";

const getProductName = (
  item
) =>
  item?.product?.name ||
  item?.productName ||
  item?.product?.title ||
  "Product";

const getProductImage = (
  item
) => {
  const product =
    item?.product;

  if (!product) {
    return "";
  }

  if (
    Array.isArray(
      product.images
    ) &&
    product.images.length > 0
  ) {
    const image =
      product.images[0];

    if (
      typeof image ===
      "string"
    ) {
      return image;
    }

    return (
      image?.url ||
      image?.secure_url ||
      ""
    );
  }

  if (
    typeof product.image ===
    "string"
  ) {
    return product.image;
  }

  return (
    product.image?.url ||
    product.image?.secure_url ||
    ""
  );
};

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

const formatDateTime = (
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

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

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

const getStatusLabel = (
  status
) => {
  const labels = {
    pending: "Pending",
    sent: "Sent",
    accepted: "Accepted",
    rejected: "Rejected",
    expired: "Expired",
  };

  return (
    labels[status] ||
    status ||
    "Unknown"
  );
};

// ============================================================
// COMPONENT
// ============================================================

function QuotationDetailsPage() {
  const {
    quotationId,
  } = useParams();

  const navigate =
    useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [quotation, setQuotation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [action, setAction] =
    useState("");

  const [showAcceptConfirmation, setShowAcceptConfirmation] =
    useState(false);

  const [showRejectConfirmation, setShowRejectConfirmation] =
    useState(false);

  // ==========================================================
  // LOAD QUOTATION
  // ==========================================================

  const loadQuotation =
    useCallback(
      async () => {
        if (!quotationId) {
          setError(
            "Quotation ID is missing."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getQuotationById(
              quotationId
            );

          const receivedQuotation =
            response?.quotation ||
            response?.data?.quotation ||
            response?.data ||
            null;

          if (
            !receivedQuotation
          ) {
            setQuotation(null);

            setError(
              "Quotation could not be found."
            );

            return;
          }

          setQuotation(
            receivedQuotation
          );
        } catch (err) {
          console.error(
            "Quotation details error:",
            err
          );

          setError(
            err?.response
              ?.data?.message ||
              err?.response
                ?.data?.error ||
              err?.message ||
              "Unable to load quotation."
          );
        } finally {
          setLoading(false);
        }
      },
      [quotationId]
    );

  useEffect(() => {
    loadQuotation();
  }, [loadQuotation]);

  // ==========================================================
  // ACCEPT QUOTATION
  // ==========================================================

  const handleAccept =
    async () => {
      if (
        !quotationId ||
        action
      ) {
        return;
      }

      try {
        setAction("accept");
        setError("");
        setSuccessMessage("");

        const response =
          await acceptQuotation(
            quotationId
          );

        const updatedQuotation =
          response?.quotation ||
          response?.data?.quotation ||
          null;

        if (
          updatedQuotation
        ) {
          setQuotation(
            (currentQuotation) =>
              currentQuotation
                ? {
                    ...currentQuotation,
                    ...updatedQuotation,
                  }
                : updatedQuotation
          );
        } else {
          setQuotation(
            (currentQuotation) =>
              currentQuotation
                ? {
                    ...currentQuotation,
                    status:
                      "accepted",
                    acceptedAt:
                      new Date().toISOString(),
                  }
                : currentQuotation
          );
        }

        setShowAcceptConfirmation(
          false
        );

        setSuccessMessage(
          response?.message ||
            "Quotation accepted successfully."
        );
      } catch (err) {
        console.error(
          "Accept quotation error:",
          err
        );

        setError(
          err?.response
            ?.data?.message ||
            err?.response
              ?.data?.error ||
            err?.message ||
            "Unable to accept quotation."
        );
      } finally {
        setAction("");
      }
    };

  // ==========================================================
  // REJECT QUOTATION
  // ==========================================================

  const handleReject =
    async () => {
      if (
        !quotationId ||
        action
      ) {
        return;
      }

      try {
        setAction("reject");
        setError("");
        setSuccessMessage("");

        const response =
          await rejectQuotation(
            quotationId
          );

        const updatedQuotation =
          response?.quotation ||
          response?.data?.quotation ||
          null;

        if (
          updatedQuotation
        ) {
          setQuotation(
            (currentQuotation) =>
              currentQuotation
                ? {
                    ...currentQuotation,
                    ...updatedQuotation,
                  }
                : updatedQuotation
          );
        } else {
          setQuotation(
            (currentQuotation) =>
              currentQuotation
                ? {
                    ...currentQuotation,
                    status:
                      "rejected",
                    rejectedAt:
                      new Date().toISOString(),
                  }
                : currentQuotation
          );
        }

        setShowRejectConfirmation(
          false
        );

        setSuccessMessage(
          response?.message ||
            "Quotation rejected successfully."
        );
      } catch (err) {
        console.error(
          "Reject quotation error:",
          err
        );

        setError(
          err?.response
            ?.data?.message ||
            err?.response
              ?.data?.error ||
            err?.message ||
            "Unable to reject quotation."
        );
      } finally {
        setAction("");
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="app-page quotation-details-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              WHOLESALE
            </span>

            <h1>
              Quotation Details
            </h1>

            <p>
              Loading quotation...
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
          Loading quotation details...
        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR WITHOUT DATA
  // ==========================================================

  if (
    error &&
    !quotation
  ) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              WHOLESALE
            </span>

            <h1>
              Quotation Details
            </h1>

          </div>

        </div>

        <div
          role="alert"
          style={{
            padding:
              "20px",
            borderRadius:
              "12px",
            background:
              "#fef2f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecaca",
          }}
        >

          <p
            style={{
              margin:
                "0 0 16px",
            }}
          >
            {error}
          </p>

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

            <button
              type="button"
              onClick={
                loadQuotation
              }
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/quotations"
                )
              }
            >
              Back to Quotations
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const items =
    Array.isArray(
      quotation?.items
    )
      ? quotation.items
      : [];

  const currentStatus =
    quotation?.status ||
    "pending";

  const canRespond =
    currentStatus ===
    "sent";

  const isAccepted =
    currentStatus ===
    "accepted";

  const isRejected =
    currentStatus ===
    "rejected";

  const isExpired =
    currentStatus ===
    "expired";

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
            WHOLESALE QUOTATION
          </span>

          <h1>
            {getQuotationNumber(
              quotation
            )}
          </h1>

          <p>
            Review your quotation and
            respond to the supplier.
          </p>

        </div>

        <Link
          to="/quotations"
        >
          ← My Quotations
        </Link>

      </div>

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
            borderRadius:
              "10px",
            background:
              "#ecfdf5",
            color:
              "#047857",
            border:
              "1px solid #a7f3d0",
          }}
        >
          {successMessage}
        </div>
      )}

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
            borderRadius:
              "10px",
            background:
              "#fef2f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <section
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap:
            "16px",
          marginBottom:
            "20px",
        }}
      >

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "12px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            Status
          </span>

          <strong>
            {getStatusLabel(
              currentStatus
            )}
          </strong>

        </div>

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "12px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            RFQ
          </span>

          <strong>
            {getRFQNumber(
              quotation
            )}
          </strong>

        </div>

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "12px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            Total Amount
          </span>

          <strong
            style={{
              fontSize:
                "20px",
            }}
          >
            {formatCurrency(
              quotation?.totalAmount
            )}
          </strong>

        </div>

        <div
          style={{
            padding:
              "18px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
            background:
              "#ffffff",
          }}
        >

          <span
            style={{
              display:
                "block",
              fontSize:
                "12px",
              color:
                "#6b7280",
              marginBottom:
                "6px",
            }}
          >
            Valid Until
          </span>

          <strong>
            {formatDate(
              quotation?.validUntil
            )}
          </strong>

        </div>

      </section>

      {/* ======================================================
          MAIN GRID
          ====================================================== */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) 320px",
          gap:
            "20px",
          alignItems:
            "start",
        }}
      >

        {/* ====================================================
            LEFT
            ==================================================== */}

        <div>

          {/* PRODUCTS */}

          <section
            style={{
              marginBottom:
                "20px",
            }}
          >

            <h2>
              Quotation Items
            </h2>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap:
                  "14px",
              }}
            >

              {items.length ===
              0 ? (
                <div
                  style={{
                    padding:
                      "24px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "12px",
                    background:
                      "#ffffff",
                  }}
                >
                  No quotation items found.
                </div>
              ) : (
                items.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      Number(
                        item?.quantity ||
                          0
                      );

                    const unitPrice =
                      Number(
                        item?.unitPrice ||
                          0
                      );

                    const totalPrice =
                      Number(
                        item?.totalPrice ??
                          quantity *
                            unitPrice
                      );

                    const image =
                      getProductImage(
                        item
                      );

                    return (
                      <article
                        key={
                          item?._id ||
                          item?.product?._id ||
                          index
                        }
                        style={{
                          display:
                            "flex",
                          gap:
                            "16px",
                          padding:
                            "18px",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius:
                            "12px",
                          background:
                            "#ffffff",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "90px",
                            height:
                              "90px",
                            flexShrink:
                              0,
                            borderRadius:
                              "8px",
                            overflow:
                              "hidden",
                            background:
                              "#f3f4f6",
                          }}
                        >

                          {image ? (
                            <img
                              src={
                                image
                              }
                              alt={getProductName(
                                item
                              )}
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
                                  "11px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              No Image
                            </div>
                          )}

                        </div>

                        <div
                          style={{
                            flex:
                              1,
                            minWidth:
                              "220px",
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 12px",
                            }}
                          >
                            {getProductName(
                              item
                            )}
                          </h3>

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                              gap:
                                "12px",
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "12px",
                                  color:
                                    "#6b7280",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Quantity
                              </span>

                              <strong>
                                {
                                  quantity
                                }{" "}
                                {item?.unit ||
                                  "piece"}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "12px",
                                  color:
                                    "#6b7280",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Unit Price
                              </span>

                              <strong>
                                {formatCurrency(
                                  unitPrice
                                )}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "12px",
                                  color:
                                    "#6b7280",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Total
                              </span>

                              <strong>
                                {formatCurrency(
                                  totalPrice
                                )}
                              </strong>

                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )
              )}

            </div>

          </section>

          {/* NOTE */}

          {quotation?.note && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "12px",
                background:
                  "#ffffff",
                marginBottom:
                  "20px",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                Supplier Note
              </h2>

              <p
                style={{
                  margin:
                    0,
                  lineHeight:
                    1.7,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  quotation.note
                }
              </p>

            </section>
          )}

          {/* DATES */}

          <section
            style={{
              padding:
                "20px",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "12px",
              background:
                "#ffffff",
            }}
          >

            <h2
              style={{
                marginTop:
                  0,
              }}
            >
              Quotation Information
            </h2>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap:
                  "16px",
              }}
            >

              <div>

                <span
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    color:
                      "#6b7280",
                    marginBottom:
                      "4px",
                  }}
                >
                  Created
                </span>

                <strong>
                  {formatDateTime(
                    quotation?.createdAt
                  )}
                </strong>

              </div>

              <div>

                <span
                  style={{
                    display:
                      "block",
                    fontSize:
                      "12px",
                    color:
                      "#6b7280",
                    marginBottom:
                      "4px",
                  }}
                >
                  Sent
                </span>

                <strong>
                  {formatDateTime(
                    quotation?.sentAt
                  )}
                </strong>

              </div>

              {quotation?.acceptedAt && (
                <div>

                  <span
                    style={{
                      display:
                        "block",
                      fontSize:
                        "12px",
                      color:
                        "#6b7280",
                      marginBottom:
                        "4px",
                    }}
                  >
                    Accepted
                  </span>

                  <strong>
                    {formatDateTime(
                      quotation.acceptedAt
                    )}
                  </strong>

                </div>
              )}

              {quotation?.rejectedAt && (
                <div>

                  <span
                    style={{
                      display:
                        "block",
                      fontSize:
                        "12px",
                      color:
                        "#6b7280",
                      marginBottom:
                        "4px",
                    }}
                  >
                    Rejected
                  </span>

                  <strong>
                    {formatDateTime(
                      quotation.rejectedAt
                    )}
                  </strong>

                </div>
              )}

            </div>

          </section>

        </div>

        {/* ====================================================
            RIGHT SIDEBAR
            ==================================================== */}

        <aside
          style={{
            position:
              "sticky",
            top:
              "20px",
          }}
        >

          {/* TOTAL */}

          <section
            style={{
              padding:
                "20px",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "12px",
              background:
                "#ffffff",
              marginBottom:
                "16px",
            }}
          >

            <h2
              style={{
                marginTop:
                  0,
              }}
            >
              Price Summary
            </h2>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap:
                  "16px",
                paddingBottom:
                  "12px",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >

              <span>
                Subtotal
              </span>

              <strong>
                {formatCurrency(
                  quotation?.subtotal
                )}
              </strong>

            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap:
                  "16px",
                paddingTop:
                  "14px",
              }}
            >

              <strong>
                Total
              </strong>

              <strong
                style={{
                  fontSize:
                    "22px",
                }}
              >
                {formatCurrency(
                  quotation?.totalAmount
                )}
              </strong>

            </div>

          </section>

          {/* RESPONSE */}

          {canRespond && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "12px",
                background:
                  "#ffffff",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                Respond to Quotation
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",
                  lineHeight:
                    1.5,
                  fontSize:
                    "14px",
                }}
              >
                Review the pricing and
                choose whether you want
                to accept or reject this
                quotation.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowAcceptConfirmation(
                    true
                  )
                }
                disabled={
                  Boolean(action)
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "10px",
                }}
              >
                {action === "accept"
                  ? "Accepting..."
                  : "Accept Quotation"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowRejectConfirmation(
                    true
                  )
                }
                disabled={
                  Boolean(action)
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "10px",
                }}
              >
                {action === "reject"
                  ? "Rejecting..."
                  : "Reject Quotation"}
              </button>

            </section>
          )}

          {/* ACCEPTED */}

          {isAccepted && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #a7f3d0",
                borderRadius:
                  "12px",
                background:
                  "#ecfdf5",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                Quotation Accepted
              </h2>

              <p
                style={{
                  margin:
                    "0 0 16px",
                  color:
                    "#047857",
                  lineHeight:
                    1.5,
                }}
              >
                You have accepted this
                quotation successfully.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/checkout?quotationId=${quotationId}`
                  )
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "10px",
                }}
              >
                Proceed to Order
              </button>

            </section>
          )}

          {/* REJECTED */}

          {isRejected && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #fecaca",
                borderRadius:
                  "12px",
                background:
                  "#fef2f2",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                Quotation Rejected
              </h2>

              <p
                style={{
                  margin:
                    0,
                  color:
                    "#b91c1c",
                  lineHeight:
                    1.5,
                }}
              >
                You have rejected this
                quotation.
              </p>

            </section>
          )}

          {/* EXPIRED */}

          {isExpired && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "12px",
                background:
                  "#f9fafb",
              }}
            >

              <h2
                style={{
                  marginTop:
                    0,
                }}
              >
                Quotation Expired
              </h2>

              <p
                style={{
                  margin:
                    0,
                  color:
                    "#6b7280",
                  lineHeight:
                    1.5,
                }}
              >
                This quotation is no
                longer available for
                acceptance.
              </p>

            </section>
          )}

        </aside>

      </div>

      {/* ======================================================
          ACCEPT CONFIRMATION
          ====================================================== */}

      {showAcceptConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position:
              "fixed",
            inset:
              0,
            zIndex:
              1000,
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding:
              "20px",
            background:
              "rgba(0, 0, 0, 0.45)",
          }}
        >

          <div
            style={{
              width:
                "100%",
              maxWidth:
                "460px",
              padding:
                "24px",
              borderRadius:
                "12px",
              background:
                "#ffffff",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
          >

            <h2
              style={{
                marginTop:
                  0,
              }}
            >
              Accept Quotation?
            </h2>

            <p
              style={{
                color:
                  "#4b5563",
                lineHeight:
                  1.6,
              }}
            >
              Are you sure you want
              to accept{" "}
              <strong>
                {getQuotationNumber(
                  quotation
                )}
              </strong>{" "}
              for{" "}
              <strong>
                {formatCurrency(
                  quotation?.totalAmount
                )}
              </strong>
              ?
            </p>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap:
                  "10px",
                marginTop:
                  "20px",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowAcceptConfirmation(
                    false
                  )
                }
                disabled={
                  Boolean(action)
                }
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={
                  handleAccept
                }
                disabled={
                  Boolean(action)
                }
              >
                {action === "accept"
                  ? "Accepting..."
                  : "Yes, Accept"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ======================================================
          REJECT CONFIRMATION
          ====================================================== */}

      {showRejectConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position:
              "fixed",
            inset:
              0,
            zIndex:
              1000,
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding:
              "20px",
            background:
              "rgba(0, 0, 0, 0.45)",
          }}
        >

          <div
            style={{
              width:
                "100%",
              maxWidth:
                "460px",
              padding:
                "24px",
              borderRadius:
                "12px",
              background:
                "#ffffff",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
          >

            <h2
              style={{
                marginTop:
                  0,
              }}
            >
              Reject Quotation?
            </h2>

            <p
              style={{
                color:
                  "#4b5563",
                lineHeight:
                  1.6,
              }}
            >
              Are you sure you want
              to reject{" "}
              <strong>
                {getQuotationNumber(
                  quotation
                )}
              </strong>
              ?
            </p>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap:
                  "10px",
                marginTop:
                  "20px",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setShowRejectConfirmation(
                    false
                  )
                }
                disabled={
                  Boolean(action)
                }
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={
                  handleReject
                }
                disabled={
                  Boolean(action)
                }
              >
                {action === "reject"
                  ? "Rejecting..."
                  : "Yes, Reject"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default QuotationDetailsPage;
