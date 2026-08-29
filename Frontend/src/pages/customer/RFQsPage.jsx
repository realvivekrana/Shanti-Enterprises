// ============================================================
// SHANTI ENTERPRISES
// RFQs Page
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
} from "react-router-dom";

import {
  getMyRFQs,
} from "../../api/rfqApi";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "pending",
  },

  reviewing: {
    label: "Under Review",
    className: "reviewing",
  },

  quoted: {
    label: "Quoted",
    className: "quoted",
  },

  accepted: {
    label: "Accepted",
    className: "accepted",
  },

  rejected: {
    label: "Rejected",
    className: "rejected",
  },

  cancelled: {
    label: "Cancelled",
    className: "cancelled",
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatusConfig = (
  status
) => {
  return (
    STATUS_CONFIG[
      status
    ] || {
      label:
        status || "Unknown",
      className: "unknown",
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

const getRFQNumber = (
  rfq
) => {
  return (
    rfq?.rfqNumber ||
    "RFQ"
  );
};

const getProductName = (
  item
) => {
  return (
    item?.product?.name ||
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
    product.images.length
  ) {
    const firstImage =
      product.images[0];

    if (
      typeof firstImage ===
      "string"
    ) {
      return firstImage;
    }

    return (
      firstImage?.url ||
      firstImage?.secure_url ||
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
  date
) => {
  if (!date) {
    return "—";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
// RFQS PAGE
// ============================================================

function RFQsPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfqs, setRFQs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      totalRFQs: 0,
      totalPages: 0,
    });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // ==========================================================
  // FETCH RFQS
  // ==========================================================

  const loadRFQs =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getMyRFQs({
              page,
              limit: 10,
              ...(status
                ? {
                    status,
                  }
                : {}),
            });

          const receivedRFQs =
            Array.isArray(
              response?.rfqs
            )
              ? response.rfqs
              : Array.isArray(
                    response?.data
                      ?.rfqs
                  )
                ? response.data
                    .rfqs
                : [];

          setRFQs(
            receivedRFQs
          );

          const receivedPagination =
            response?.pagination ||
            response?.data
              ?.pagination;

          if (
            receivedPagination
          ) {
            setPagination({
              page:
                Number(
                  receivedPagination.page
                ) || page,

              limit:
                Number(
                  receivedPagination.limit
                ) || 10,

              totalRFQs:
                Number(
                  receivedPagination.totalRFQs
                ) || 0,

              totalPages:
                Number(
                  receivedPagination.totalPages
                ) || 0,
            });
          } else {
            setPagination({
              page,
              limit: 10,
              totalRFQs:
                receivedRFQs.length,
              totalPages:
                receivedRFQs.length
                  ? 1
                  : 0,
            });
          }
        } catch (err) {
          console.error(
            "Get RFQs error:",
            err
          );

          setError(
            err?.response
              ?.data?.message ||
              err?.response
                ?.data?.error ||
              err?.message ||
              "Unable to load your RFQs."
          );
        } finally {
          setLoading(false);
        }
      },
      [page, status]
    );

  // ==========================================================
  // INITIAL / FILTER LOAD
  // ==========================================================

  useEffect(() => {
    loadRFQs();
  }, [loadRFQs]);

  // ==========================================================
  // SUCCESS MESSAGE FROM NAVIGATION
  // ==========================================================

  useEffect(() => {
    const message =
      location.state
        ?.successMessage;

    if (!message) {
      return;
    }

    setSuccessMessage(
      message
    );

    window.history.replaceState(
      {},
      document.title
    );

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
  }, [location.state]);

  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange =
    (event) => {
      setStatus(
        event.target.value
      );

      setPage(1);
    };

  // ==========================================================
  // CLEAR FILTER
  // ==========================================================

  const handleClearFilter =
    () => {
      setStatus("");
      setPage(1);
    };

  // ==========================================================
  // OPEN RFQ
  // ==========================================================

  const handleOpenRFQ = (
    rfq
  ) => {
    const rfqId =
      getRFQId(rfq);

    if (!rfqId) {
      return;
    }

    navigate(
      `/rfq/${rfqId}`
    );
  };

  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  const handlePreviousPage =
    () => {
      setPage(
        (currentPage) =>
          Math.max(
            currentPage - 1,
            1
          )
      );
    };

  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  const handleNextPage =
    () => {
      setPage(
        (currentPage) =>
          Math.min(
            currentPage + 1,
            pagination.totalPages ||
              currentPage
          )
      );
    };

  // ==========================================================
  // RETRY
  // ==========================================================

  const handleRetry =
    () => {
      loadRFQs();
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
              My RFQs
            </h1>

            <p>
              Manage your wholesale
              requests for quotation.
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
            Loading your RFQs...
          </p>
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
            My RFQs
          </h1>

          <p>
            Track and manage your
            wholesale requests for
            quotation.
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
            to="/products"
            className="product-details-add-button"
          >
            Browse Products
          </Link>

        </div>

      </div>

      {/* ======================================================
          SUCCESS MESSAGE
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
          FILTER BAR
          ====================================================== */}

      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          gap:
            "16px",
          flexWrap:
            "wrap",
          marginBottom:
            "20px",
          padding:
            "16px",
          border:
            "1px solid #e5e7eb",
          borderRadius:
            "12px",
          background:
            "#ffffff",
        }}
      >

        <div>

          <strong>
            RFQ Requests
          </strong>

          <p
            style={{
              margin:
                "4px 0 0",
              color:
                "#6b7280",
              fontSize:
                "14px",
            }}
          >
            {pagination.totalRFQs}{" "}
            total request
            {pagination.totalRFQs !==
            1
              ? "s"
              : ""}
          </p>

        </div>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px",
          }}
        >

          <label
            htmlFor="rfq-status-filter"
            style={{
              fontWeight:
                600,
            }}
          >
            Status
          </label>

          <select
            id="rfq-status-filter"
            value={status}
            onChange={
              handleStatusChange
            }
            style={{
              minWidth:
                "170px",
              padding:
                "9px 12px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "8px",
              background:
                "#ffffff",
            }}
          >

            <option value="">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="reviewing">
              Under Review
            </option>

            <option value="quoted">
              Quoted
            </option>

            <option value="accepted">
              Accepted
            </option>

            <option value="rejected">
              Rejected
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

          {status && (
            <button
              type="button"
              onClick={
                handleClearFilter
              }
            >
              Clear
            </button>
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
              "16px",
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

          <p
            style={{
              margin:
                "0 0 12px",
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={
              handleRetry
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {!error &&
        rfqs.length === 0 && (
          <div
            style={{
              padding:
                "60px 24px",
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

            <div
              style={{
                fontSize:
                  "48px",
                marginBottom:
                  "12px",
              }}
            >
              📋
            </div>

            <h2>
              {status
                ? "No RFQs found"
                : "You haven't submitted any RFQs yet"}
            </h2>

            <p
              style={{
                maxWidth:
                  "520px",
                margin:
                  "8px auto 0",
                color:
                  "#6b7280",
              }}
            >
              {status
                ? `There are no RFQs with the "${getStatusConfig(status).label}" status.`
                : "Request a wholesale quote for products you're interested in and your requests will appear here."}
            </p>

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >

              <Link
                to="/products"
                className="product-details-add-button"
              >
                Browse Products
              </Link>

            </div>

          </div>
        )}

      {/* ======================================================
          RFQ LIST
          ====================================================== */}

      {rfqs.length > 0 && (
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

          {rfqs.map(
            (rfq) => {
              const rfqId =
                getRFQId(
                  rfq
                );

              const rfqNumber =
                getRFQNumber(
                  rfq
                );

              const statusConfig =
                getStatusConfig(
                  rfq.status
                );

              const items =
                Array.isArray(
                  rfq.items
                )
                  ? rfq.items
                  : [];

              const totalQuantity =
                getTotalQuantity(
                  items
                );

              const firstItem =
                items[0];

              const remainingItems =
                Math.max(
                  items.length - 1,
                  0
                );

              return (
                <article
                  key={
                    rfqId ||
                    rfqNumber
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

                  {/* ==================================================
                      TOP ROW
                      ================================================== */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "flex-start",
                      justifyContent:
                        "space-between",
                      gap:
                        "16px",
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <div>

                      <p
                        style={{
                          margin:
                            "0 0 6px",
                          fontSize:
                            "13px",
                          color:
                            "#6b7280",
                        }}
                      >
                        RFQ Number
                      </p>

                      <h2
                        style={{
                          margin:
                            0,
                          fontSize:
                            "20px",
                        }}
                      >
                        {rfqNumber}
                      </h2>

                    </div>

                    <span
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        padding:
                          "6px 10px",
                        borderRadius:
                          "999px",
                        background:
                          "#f3f4f6",
                        color:
                          "#374151",
                        fontSize:
                          "13px",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        statusConfig.label
                      }
                    </span>

                  </div>

                  {/* ==================================================
                      RFQ META
                      ================================================== */}

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap:
                        "12px",
                      marginTop:
                        "20px",
                    }}
                  >

                    <div
                      style={{
                        padding:
                          "12px",
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
                          color:
                            "#6b7280",
                          marginBottom:
                            "4px",
                        }}
                      >
                        Submitted
                      </span>

                      <strong>
                        {formatDate(
                          rfq.createdAt
                        )}
                      </strong>

                    </div>

                    <div
                      style={{
                        padding:
                          "12px",
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
                          color:
                            "#6b7280",
                          marginBottom:
                            "4px",
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
                          "12px",
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
                          color:
                            "#6b7280",
                          marginBottom:
                            "4px",
                        }}
                      >
                        Total Quantity
                      </span>

                      <strong>
                        {totalQuantity}
                      </strong>

                    </div>

                  </div>

                  {/* ==================================================
                      FIRST PRODUCT
                      ================================================== */}

                  {firstItem && (
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "14px",
                        marginTop:
                          "18px",
                        paddingTop:
                          "18px",
                        borderTop:
                          "1px solid #e5e7eb",
                      }}
                    >

                      {/* IMAGE */}

                      <div
                        style={{
                          width:
                            "64px",
                          height:
                            "64px",
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

                        {getProductImage(
                          firstItem
                        ) ? (
                          <img
                            src={getProductImage(
                              firstItem
                            )}
                            alt={getProductName(
                              firstItem
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

                      {/* PRODUCT INFO */}

                      <div
                        style={{
                          flex:
                            1,
                          minWidth:
                            0,
                        }}
                      >

                        <strong
                          style={{
                            display:
                              "block",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {
                            getProductName(
                              firstItem
                            )
                          }
                        </strong>

                        <span
                          style={{
                            display:
                              "block",
                            marginTop:
                              "4px",
                            color:
                              "#6b7280",
                            fontSize:
                              "14px",
                          }}
                        >
                          Quantity:{" "}
                          {
                            firstItem.quantity
                          }

                          {firstItem.unit
                            ? ` ${firstItem.unit}`
                            : ""}
                        </span>

                      </div>

                      {remainingItems >
                        0 && (
                        <span
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "13px",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          +{" "}
                          {
                            remainingItems
                          }{" "}
                          more
                        </span>
                      )}

                    </div>
                  )}

                  {/* ==================================================
                      MESSAGE
                      ================================================== */}

                  {rfq.message && (
                    <div
                      style={{
                        marginTop:
                          "16px",
                        padding:
                          "12px",
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
                            600,
                          color:
                            "#6b7280",
                          marginBottom:
                            "4px",
                        }}
                      >
                        Requirement
                      </span>

                      <p
                        style={{
                          margin:
                            0,
                          color:
                            "#374151",
                          lineHeight:
                            1.5,
                        }}
                      >
                        {rfq.message}
                      </p>

                    </div>
                  )}

                  {/* ==================================================
                      ACTION
                      ================================================== */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "flex-end",
                      marginTop:
                        "18px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenRFQ(
                          rfq
                        )
                      }
                      disabled={
                        !rfqId
                      }
                    >
                      View RFQ Details →
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      {rfqs.length > 0 &&
        pagination.totalPages >
          1 && (
          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap:
                "16px",
              marginTop:
                "24px",
              padding:
                "16px",
            }}
          >

            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                page <= 1
              }
            >
              ← Previous
            </button>

            <span
              style={{
                fontSize:
                  "14px",
                color:
                  "#4b5563",
              }}
            >
              Page{" "}
              <strong>
                {pagination.page ||
                  page}
              </strong>{" "}
              of{" "}
              <strong>
                {
                  pagination.totalPages
                }
              </strong>
            </span>

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                page >=
                pagination.totalPages
              }
            >
              Next →
            </button>

          </div>
        )}

    </div>
  );
}

export default RFQsPage;