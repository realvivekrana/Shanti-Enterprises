// ============================================================
// SHANTI ENTERPRISES
// RFQ Details Page
// Customer - Wholesale
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  cancelRFQ,
  getRFQById,
} from "../../api/rfqApi";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    description:
      "Your request has been submitted and is waiting for review.",
  },

  reviewing: {
    label: "Under Review",
    description:
      "Our team is currently reviewing your requirements.",
  },

  quoted: {
    label: "Quoted",
    description:
      "A quote has been prepared for your request.",
  },

  accepted: {
    label: "Accepted",
    description:
      "Your quote has been accepted.",
  },

  rejected: {
    label: "Rejected",
    description:
      "This RFQ has been rejected.",
  },

  cancelled: {
    label: "Cancelled",
    description:
      "This RFQ has been cancelled.",
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatusConfig = (
  status
) => {
  return (
    STATUS_CONFIG[status] || {
      label:
        status || "Unknown",
      description:
        "Current RFQ status.",
    }
  );
};

const getRFQId = (
  rfq
) => {
  return (
    rfq?._id ||
    rfq?.id ||
    ""
  );
};

const getProductName = (
  item
) => {
  return (
    item?.product?.name ||
    item?.product?.title ||
    item?.productName ||
    "Product"
  );
};

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

const getTotalQuantity = (
  items = []
) => {
  return items.reduce(
    (
      total,
      item
    ) =>
      total +
      Number(
        item?.quantity || 0
      ),
    0
  );
};

// ============================================================
// RFQ DETAILS PAGE
// ============================================================

function RFQDetailsPage() {
  const {
    rfqId,
  } = useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfq, setRFQ] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false);

  const [
    showCancelConfirmation,
    setShowCancelConfirmation,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState(
    location.state
      ?.successMessage || ""
  );

  // ==========================================================
  // LOAD RFQ
  // ==========================================================

  const loadRFQ =
    useCallback(
      async () => {
        if (!rfqId) {
          setError(
            "RFQ ID is missing."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getRFQById(
              rfqId
            );

          const receivedRFQ =
            response?.rfq ||
            response?.data?.rfq ||
            response?.data ||
            null;

          if (!receivedRFQ) {
            setRFQ(null);

            setError(
              "RFQ could not be found."
            );

            return;
          }

          setRFQ(
            receivedRFQ
          );
        } catch (err) {
          console.error(
            "Get RFQ details error:",
            err
          );

          setError(
            err?.response
              ?.data?.message ||
              err?.response
                ?.data?.error ||
              err?.message ||
              "Unable to load RFQ details."
          );
        } finally {
          setLoading(false);
        }
      },
      [rfqId]
    );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRFQ();
  }, [loadRFQ]);

  // ==========================================================
  // SUCCESS MESSAGE TIMER
  // ==========================================================

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setSuccessMessage(
            ""
          );
        },
        5000
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [successMessage]);

  // ==========================================================
  // CANCEL RFQ
  // ==========================================================

  const handleCancelRFQ =
    async () => {
      if (
        !rfqId ||
        isCancelling
      ) {
        return;
      }

      try {
        setIsCancelling(true);
        setError("");

        const response =
          await cancelRFQ(
            rfqId
          );

        const updatedRFQ =
          response?.rfq ||
          response?.data?.rfq ||
          response?.data ||
          null;

        if (updatedRFQ) {
          setRFQ(
            updatedRFQ
          );
        } else {
          setRFQ(
            (currentRFQ) =>
              currentRFQ
                ? {
                    ...currentRFQ,
                    status:
                      "cancelled",
                  }
                : currentRFQ
          );
        }

        setShowCancelConfirmation(
          false
        );

        setSuccessMessage(
          "RFQ cancelled successfully."
        );
      } catch (err) {
        console.error(
          "Cancel RFQ error:",
          err
        );

        setError(
          err?.response
            ?.data?.message ||
            err?.response
              ?.data?.error ||
            err?.message ||
            "Unable to cancel RFQ."
        );
      } finally {
        setIsCancelling(
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
              WHOLESALE
            </span>

            <h1>
              RFQ Details
            </h1>

            <p>
              Loading your request...
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

          <p>
            Loading RFQ details...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (
    error &&
    !rfq
  ) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              WHOLESALE
            </span>

            <h1>
              RFQ Details
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
            border:
              "1px solid #fecaca",
            color:
              "#b91c1c",
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
                loadRFQ
              }
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/rfqs"
                )
              }
            >
              Back to My RFQs
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // RFQ DATA
  // ==========================================================

  const rfqNumber =
    rfq?.rfqNumber ||
    `RFQ-${rfqId}`;

  const status =
    rfq?.status ||
    "pending";

  const statusConfig =
    getStatusConfig(
      status
    );

  const items =
    Array.isArray(
      rfq?.items
    )
      ? rfq.items
      : [];

  const totalQuantity =
    getTotalQuantity(
      items
    );

  const canCancel =
    ![
      "cancelled",
      "accepted",
      "rejected",
    ].includes(
      status
    );

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
            RFQ Details
          </h1>

          <p>
            Review your wholesale
            quotation request.
          </p>

        </div>

      </div>

      {/* ======================================================
          BACK
          ====================================================== */}

      <div
        style={{
          marginBottom:
            "20px",
        }}
      >

        <Link
          to="/rfqs"
        >
          ← Back to My RFQs
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
          RFQ HEADER CARD
          ====================================================== */}

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

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "flex-start",
            gap:
              "16px",
            flexWrap:
              "wrap",
          }}
        >

          <div>

            <span
              style={{
                display:
                  "block",
                color:
                  "#6b7280",
                fontSize:
                  "13px",
                marginBottom:
                  "5px",
              }}
            >
              RFQ Number
            </span>

            <h2
              style={{
                margin:
                  0,
              }}
            >
              {rfqNumber}
            </h2>

          </div>

          <span
            style={{
              display:
                "inline-flex",
              padding:
                "8px 14px",
              borderRadius:
                "999px",
              background:
                "#f3f4f6",
              color:
                "#374151",
              fontWeight:
                700,
              fontSize:
                "14px",
            }}
          >
            {statusConfig.label}
          </span>

        </div>

        <p
          style={{
            margin:
              "16px 0 0",
            color:
              "#4b5563",
          }}
        >
          {
            statusConfig.description
          }
        </p>

      </section>

      {/* ======================================================
          RFQ META
          ====================================================== */}

      <section
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

        <div
          style={{
            padding:
              "16px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "10px",
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
            Submitted
          </span>

          <strong>
            {formatDateTime(
              rfq?.createdAt
            )}
          </strong>

        </div>

        <div
          style={{
            padding:
              "16px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "10px",
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
            Products
          </span>

          <strong>
            {items.length}
          </strong>

        </div>

        <div
          style={{
            padding:
              "16px",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "10px",
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
            Total Quantity
          </span>

          <strong>
            {totalQuantity}
          </strong>

        </div>

      </section>

      {/* ======================================================
          PRODUCTS
          ====================================================== */}

      <section
        style={{
          marginBottom:
            "20px",
        }}
      >

        <div
          style={{
            marginBottom:
              "12px",
          }}
        >

          <h2
            style={{
              margin:
                0,
            }}
          >
            Requested Products
          </h2>

        </div>

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

          {items.length === 0 ? (
            <div
              style={{
                padding:
                  "24px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "10px",
                background:
                  "#ffffff",
              }}
            >
              No products found
              in this RFQ.
            </div>
          ) : (
            items.map(
              (
                item,
                index
              ) => {
                const productName =
                  getProductName(
                    item
                  );

                const image =
                  getProductImage(
                    item
                  );

                return (
                  <article
                    key={
                      item?._id ||
                      item?.productId ||
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
                        "10px",
                      background:
                        "#ffffff",
                      flexWrap:
                        "wrap",
                    }}
                  >

                    {/* IMAGE */}

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
                              "11px",
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
                          "220px",
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
                            "#4b5563",
                        }}
                      >
                        Quantity:{" "}
                        <strong>
                          {
                            item?.quantity ||
                            0
                          }
                        </strong>
                      </p>

                      {item?.unit && (
                        <p
                          style={{
                            margin:
                              "0 0 6px",
                            color:
                              "#4b5563",
                          }}
                        >
                          Unit:{" "}
                          <strong>
                            {
                              item.unit
                            }
                          </strong>
                        </p>
                      )}

                      {item?.note && (
                        <div
                          style={{
                            marginTop:
                              "12px",
                            padding:
                              "10px 12px",
                            borderRadius:
                              "8px",
                            background:
                              "#f9fafb",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              color:
                                "#6b7280",
                              marginBottom:
                                "4px",
                            }}
                          >
                            Product
                            Requirement
                          </span>

                          <p
                            style={{
                              margin:
                                0,
                              lineHeight:
                                1.5,
                            }}
                          >
                            {
                              item.note
                            }
                          </p>

                        </div>
                      )}

                    </div>

                  </article>
                );
              }
            )
          )}

        </div>

      </section>

      {/* ======================================================
          OVERALL REQUIREMENT
          ====================================================== */}

      {rfq?.message && (
        <section
          style={{
            marginBottom:
              "20px",
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
            Overall Requirement
          </h2>

          <p
            style={{
              margin:
                0,
              lineHeight:
                1.7,
              whiteSpace:
                "pre-wrap",
              color:
                "#374151",
            }}
          >
            {rfq.message}
          </p>

        </section>
      )}

      {/* ======================================================
          QUOTE INFORMATION
          ====================================================== */}

      {(rfq?.quote ||
        rfq?.quotedPrice ||
        rfq?.totalQuote ||
        rfq?.quoteAmount) && (
        <section
          style={{
            marginBottom:
              "20px",
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
            Quote
          </h2>

          {rfq?.quote?.amount ||
          rfq?.quotedPrice ||
          rfq?.totalQuote ||
          rfq?.quoteAmount ? (
            <p>
              Quote Amount:{" "}
              <strong>
                ₹
                {Number(
                  rfq?.quote
                    ?.amount ||
                    rfq?.quotedPrice ||
                    rfq?.totalQuote ||
                    rfq?.quoteAmount
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </p>
          ) : null}

          {rfq?.quote?.message && (
            <p
              style={{
                marginBottom:
                  0,
              }}
            >
              {
                rfq.quote
                  .message
              }
            </p>
          )}

        </section>
      )}

      {/* ======================================================
          UPDATED
          ====================================================== */}

      {rfq?.updatedAt && (
        <p
          style={{
            color:
              "#6b7280",
            fontSize:
              "13px",
          }}
        >
          Last updated:{" "}
          {formatDateTime(
            rfq.updatedAt
          )}
        </p>
      )}

      {/* ======================================================
          ACTIONS
          ====================================================== */}

      <div
        style={{
          display:
            "flex",
          gap:
            "12px",
          flexWrap:
            "wrap",
          marginTop:
            "20px",
          paddingTop:
            "20px",
          borderTop:
            "1px solid #e5e7eb",
        }}
      >

        <Link
          to="/rfqs"
        >
          ← My RFQs
        </Link>

        {canCancel && (
          <button
            type="button"
            onClick={() =>
              setShowCancelConfirmation(
                true
              )
            }
            disabled={
              isCancelling
            }
          >
            Cancel RFQ
          </button>
        )}

      </div>

      {/* ======================================================
          CANCEL CONFIRMATION
          ====================================================== */}

      {showCancelConfirmation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position:
              "fixed",
            inset:
              0,
            background:
              "rgba(0, 0, 0, 0.45)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding:
              "20px",
            zIndex:
              1000,
          }}
        >

          <div
            style={{
              width:
                "100%",
              maxWidth:
                "460px",
              background:
                "#ffffff",
              borderRadius:
                "12px",
              padding:
                "24px",
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
              Cancel RFQ?
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
              to cancel{" "}
              <strong>
                {rfqNumber}
              </strong>
              ? This action cannot
              be undone.
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
                  setShowCancelConfirmation(
                    false
                  )
                }
                disabled={
                  isCancelling
                }
              >
                Keep RFQ
              </button>

              <button
                type="button"
                onClick={
                  handleCancelRFQ
                }
                disabled={
                  isCancelling
                }
              >
                {isCancelling
                  ? "Cancelling..."
                  : "Yes, Cancel RFQ"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default RFQDetailsPage;