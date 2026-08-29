// ============================================================
// SHANTI ENTERPRISES
// Customer Quotations Page
// Frontend - Wholesale Quotations
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getQuotations,
} from "../../api/quotationApi";

// ============================================================
// HELPERS
// ============================================================

const getQuotationId = (quotation) =>
  quotation?._id ||
  quotation?.id ||
  quotation?.quotationId ||
  "";

const getQuotationNumber = (quotation) =>
  quotation?.quotationNumber ||
  "Quotation";

const getRFQNumber = (quotation) =>
  quotation?.rfq?.rfqNumber ||
  quotation?.rfqNumber ||
  "—";

const getStatusLabel = (status) => {
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

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

const formatCurrency = (value) =>
  `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

const getQuotationTotal = (quotation) => {
  if (
    quotation?.totalAmount !== undefined &&
    quotation?.totalAmount !== null
  ) {
    return Number(
      quotation.totalAmount
    );
  }

  if (
    quotation?.totalPrice !== undefined &&
    quotation?.totalPrice !== null
  ) {
    return Number(
      quotation.totalPrice
    );
  }

  if (
    quotation?.grandTotal !== undefined &&
    quotation?.grandTotal !== null
  ) {
    return Number(
      quotation.grandTotal
    );
  }

  if (
    quotation?.subtotal !== undefined &&
    quotation?.subtotal !== null
  ) {
    return Number(
      quotation.subtotal
    );
  }

  if (
    Array.isArray(
      quotation?.items
    )
  ) {
    return quotation.items.reduce(
      (total, item) => {
        const itemTotal =
          item?.totalPrice ??
          Number(item?.quantity || 0) *
            Number(item?.unitPrice || 0);

        return (
          total +
          Number(itemTotal || 0)
        );
      },
      0
    );
  }

  return 0;
};

const getStatusStyle = (status) => {
  const styles = {
    pending: {
      background: "#fff7ed",
      color: "#c2410c",
      border: "1px solid #fed7aa",
    },

    sent: {
      background: "#eff6ff",
      color: "#1d4ed8",
      border: "1px solid #bfdbfe",
    },

    accepted: {
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    },

    rejected: {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    },

    expired: {
      background: "#f3f4f6",
      color: "#4b5563",
      border: "1px solid #d1d5db",
    },
  };

  return (
    styles[status] || {
      background: "#f3f4f6",
      color: "#4b5563",
      border: "1px solid #d1d5db",
    }
  );
};

// ============================================================
// COMPONENT
// ============================================================

function QuotationsPage() {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [quotations, setQuotations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 20,
      totalQuotations: 0,
      totalPages: 1,
    });

  // ==========================================================
  // LOAD QUOTATIONS
  // ==========================================================

  const loadQuotations =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getQuotations({
              page,
              limit: 20,
            });

          const receivedQuotations =
            Array.isArray(
              response?.quotations
            )
              ? response.quotations
              : Array.isArray(
                  response?.data?.quotations
                )
              ? response.data.quotations
              : Array.isArray(
                  response?.data
                )
              ? response.data
              : [];

          const receivedPagination =
            response?.pagination ||
            response?.data?.pagination ||
            {
              page,
              limit: 20,
              totalQuotations:
                receivedQuotations.length,
              totalPages: 1,
            };

          setQuotations(
            receivedQuotations
          );

          setPagination(
            receivedPagination
          );
        } catch (err) {
          console.error(
            "Load quotations error:",
            err
          );

          setQuotations([]);

          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Unable to load quotations."
          );
        } finally {
          setLoading(false);
        }
      },
      [page]
    );

  // ==========================================================
  // EFFECT
  // ==========================================================

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  // ==========================================================
  // OPEN QUOTATION
  // ==========================================================

  const handleOpenQuotation =
    (quotation) => {
      const quotationId =
        getQuotationId(
          quotation
        );

      if (!quotationId) {
        return;
      }

      navigate(
        `/quotations/${quotationId}`
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
              My Quotations
            </h1>

            <p>
              Review quotations received
              from Shanti Enterprises.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          Loading quotations...
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
            My Quotations
          </h1>

          <p>
            Review quotations received
            from Shanti Enterprises.
          </p>
        </div>

        <Link to="/rfqs">
          ← My RFQs
        </Link>
      </div>

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#b91c1c",
            border:
              "1px solid #fecaca",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
            }}
          >
            {error}
          </div>

          <button
            type="button"
            onClick={
              loadQuotations
            }
          >
            Try Again
          </button>
        </div>
      )}

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            padding: "18px",
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            Total Quotations
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {
              pagination.totalQuotations ??
              quotations.length
            }
          </div>
        </div>

        <div
          style={{
            padding: "18px",
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            Pending Response
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {
              quotations.filter(
                (quotation) =>
                  quotation?.status ===
                  "sent"
              ).length
            }
          </div>
        </div>

        <div
          style={{
            padding: "18px",
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            Accepted
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {
              quotations.filter(
                (quotation) =>
                  quotation?.status ===
                  "accepted"
              ).length
            }
          </div>
        </div>
      </div>

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {!error &&
        quotations.length === 0 && (
          <section
            style={{
              padding: "50px 20px",
              textAlign: "center",
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
            }}
          >
            <h2>
              No Quotations Yet
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
              }}
            >
              You don't have any
              quotations yet.
            </p>

            <Link to="/rfqs">
              View My RFQs
            </Link>
          </section>
        )}

      {/* ======================================================
          QUOTATIONS TABLE
          ====================================================== */}

      {quotations.length > 0 && (
        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                margin: 0,
              }}
            >
              Quotations
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Review quotation details
              and respond to the supplier.
            </p>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
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
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    Quotation
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    RFQ
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    Amount
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "right",
                      fontSize: "13px",
                      color: "#6b7280",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {quotations.map(
                  (
                    quotation,
                    index
                  ) => {
                    const quotationId =
                      getQuotationId(
                        quotation
                      );

                    const status =
                      quotation?.status ||
                      "pending";

                    return (
                      <tr
                        key={
                          quotationId ||
                          index
                        }
                        style={{
                          borderTop:
                            "1px solid #f3f4f6",
                        }}
                      >
                        {/* QUOTATION */}

                        <td
                          style={{
                            padding: "16px",
                            fontWeight: 700,
                          }}
                        >
                          {
                            getQuotationNumber(
                              quotation
                            )
                          }
                        </td>

                        {/* RFQ */}

                        <td
                          style={{
                            padding: "16px",
                          }}
                        >
                          {
                            getRFQNumber(
                              quotation
                            )
                          }
                        </td>

                        {/* STATUS */}

                        <td
                          style={{
                            padding: "16px",
                          }}
                        >
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
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              ...getStatusStyle(
                                status
                              ),
                            }}
                          >
                            {
                              getStatusLabel(
                                status
                              )
                            }
                          </span>
                        </td>

                        {/* AMOUNT */}

                        <td
                          style={{
                            padding: "16px",
                            fontWeight: 700,
                          }}
                        >
                          {formatCurrency(
                            getQuotationTotal(
                              quotation
                            )
                          )}
                        </td>

                        {/* DATE */}

                        <td
                          style={{
                            padding: "16px",
                          }}
                        >
                          {formatDate(
                            quotation?.createdAt
                          )}
                        </td>

                        {/* ACTION */}

                        <td
                          style={{
                            padding: "16px",
                            textAlign:
                              "right",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenQuotation(
                                quotation
                              )
                            }
                            disabled={
                              !quotationId
                            }
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      {pagination.totalPages >
        1 && (
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={
              handlePreviousPage
            }
            disabled={page <= 1}
          >
            ← Previous
          </button>

          <span>
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

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default QuotationsPage;