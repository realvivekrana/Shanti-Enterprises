// ============================================================
// SHANTI ENTERPRISES
// Admin Quotations Page
// Admin - Wholesale Quotation Management
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  getAdminQuotations,
} from "../../api/quotationApi";

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Statuses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "sent",
    label: "Sent",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "expired",
    label: "Expired",
  },
];

// ============================================================
// HELPERS
// ============================================================

const getQuotationId = (
  quotation
) => {
  return (
    quotation?._id ||
    quotation?.id ||
    ""
  );
};

const getQuotationNumber = (
  quotation
) => {
  return (
    quotation?.quotationNumber ||
    "—"
  );
};

const getRFQNumber = (
  quotation
) => {
  return (
    quotation?.rfq?.rfqNumber ||
    quotation?.rfqNumber ||
    "—"
  );
};

const getCustomer = (
  quotation
) => {
  return (
    quotation?.user ||
    quotation?.customer ||
    quotation?.createdBy ||
    null
  );
};

const getCustomerName = (
  quotation
) => {
  const customer =
    getCustomer(
      quotation
    );

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
    quotation?.customerName ||
    "Customer"
  );
};

const getCustomerEmail = (
  quotation
) => {
  const customer =
    getCustomer(
      quotation
    );

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
    quotation?.customerEmail ||
    quotation?.email ||
    ""
  );
};

const getTotalAmount = (
  quotation
) => {
  return Number(
    quotation?.totalAmount ??
      quotation?.subtotal ??
      0
  );
};

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

const getStatusStyle = (
  status
) => {
  const styles = {
    pending: {
      background:
        "#fff7ed",
      color:
        "#c2410c",
      border:
        "1px solid #fed7aa",
    },

    sent: {
      background:
        "#eff6ff",
      color:
        "#1d4ed8",
      border:
        "1px solid #bfdbfe",
    },

    accepted: {
      background:
        "#ecfdf5",
      color:
        "#047857",
      border:
        "1px solid #a7f3d0",
    },

    rejected: {
      background:
        "#fef2f2",
      color:
        "#b91c1c",
      border:
        "1px solid #fecaca",
    },

    expired: {
      background:
        "#f3f4f6",
      color:
        "#4b5563",
      border:
        "1px solid #d1d5db",
    },
  };

  return (
    styles[status] || {
      background:
        "#f3f4f6",
      color:
        "#4b5563",
      border:
        "1px solid #d1d5db",
    }
  );
};

const formatCurrency = (
  value
) => {
  return `₹${Number(
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

// ============================================================
// COMPONENT
// ============================================================

function AdminQuotationsPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    quotations,
    setQuotations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState(
    searchParams.get(
      "status"
    ) || ""
  );

  const [
    page,
    setPage,
  ] = useState(
    Number(
      searchParams.get(
        "page"
      )
    ) || 1
  );

  const [
    limit,
    setLimit,
  ] = useState(
    Number(
      searchParams.get(
        "limit"
      )
    ) || 10
  );

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 10,
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

          const params = {
            page,
            limit,
          };

          if (
            status.trim()
          ) {
            params.status =
              status.trim();
          }

          const response =
            await getAdminQuotations(
              params
            );

          const receivedQuotations =
            response?.quotations ||
            response?.data
              ?.quotations ||
            response?.data ||
            [];

          const receivedPagination =
            response?.pagination ||
            response?.data
              ?.pagination ||
            null;

          setQuotations(
            Array.isArray(
              receivedQuotations
            )
              ? receivedQuotations
              : []
          );

          if (
            receivedPagination
          ) {
            setPagination(
              {
                page:
                  Number(
                    receivedPagination.page
                  ) || page,

                limit:
                  Number(
                    receivedPagination.limit
                  ) || limit,

                totalQuotations:
                  Number(
                    receivedPagination.totalQuotations
                  ) || 0,

                totalPages:
                  Number(
                    receivedPagination.totalPages
                  ) || 1,
              }
            );
          } else {
            setPagination(
              {
                page,
                limit,
                totalQuotations:
                  receivedQuotations.length,
                totalPages: 1,
              }
            );
          }
        } catch (err) {
          console.error(
            "Admin quotations error:",
            err
          );

          setError(
            err?.response
              ?.data
              ?.message ||
              err?.response
                ?.data
                ?.error ||
              err?.message ||
              "Unable to load quotations."
          );

          setQuotations(
            []
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        limit,
        status,
      ]
    );

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    loadQuotations();
  }, [
    loadQuotations,
  ]);

  // ==========================================================
  // SYNC URL
  // ==========================================================

  useEffect(() => {
    const params = {};

    if (
      status.trim()
    ) {
      params.status =
        status.trim();
    }

    if (page > 1) {
      params.page =
        String(page);
    }

    if (limit !== 10) {
      params.limit =
        String(limit);
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }, [
    status,
    page,
    limit,
    setSearchParams,
  ]);

  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange =
    (
      event
    ) => {
      setStatus(
        event.target.value
      );

      setPage(1);
    };

  // ==========================================================
  // LIMIT CHANGE
  // ==========================================================

  const handleLimitChange =
    (
      event
    ) => {
      const nextLimit =
        Number(
          event.target.value
        ) || 10;

      setLimit(
        nextLimit
      );

      setPage(1);
    };

  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  const handlePreviousPage =
    () => {
      if (
        page <= 1
      ) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage - 1
      );
    };

  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  const handleNextPage =
    () => {
      if (
        page >=
        pagination.totalPages
      ) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage + 1
      );
    };

  // ==========================================================
  // RETRY
  // ==========================================================

  const handleRetry =
    () => {
      loadQuotations();
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    quotations.length ===
      0
  ) {
    return (
      <div className="app-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              ADMIN · WHOLESALE
            </span>

            <h1>
              Quotations
            </h1>

            <p>
              Manage customer quotations
              created from RFQs.
            </p>

          </div>

          <Link
            to="/admin/rfqs"
          >
            RFQs
          </Link>

        </div>

        <div
          style={{
            padding:
              "60px 20px",
            textAlign:
              "center",
            color:
              "#6b7280",
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
            ADMIN · WHOLESALE
          </span>

          <h1>
            Quotations
          </h1>

          <p>
            Manage wholesale quotations
            created from customer RFQs.
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
            View RFQs
          </Link>

          <Link
            to="/admin"
          >
            Dashboard
          </Link>

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
            borderRadius:
              "10px",
            background:
              "#fef2f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecaca",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap:
              "12px",
            flexWrap:
              "wrap",
          }}
        >

          <span>
            {error}
          </span>

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
          FILTERS
          ====================================================== */}

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
          marginBottom:
            "20px",
        }}
      >

        <div
          style={{
            display:
              "flex",
            alignItems:
              "end",
            gap:
              "16px",
            flexWrap:
              "wrap",
            justifyContent:
              "space-between",
          }}
        >

          <div>

            <label
              htmlFor="quotation-status"
              style={{
                display:
                  "block",
                fontWeight:
                  600,
                marginBottom:
                  "7px",
              }}
            >
              Filter by Status
            </label>

            <select
              id="quotation-status"
              value={
                status
              }
              onChange={
                handleStatusChange
              }
              style={{
                minWidth:
                  "200px",
                padding:
                  "10px 12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
                background:
                  "#ffffff",
              }}
            >

              {STATUS_OPTIONS.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value ||
                      "all"
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label
              htmlFor="quotation-limit"
              style={{
                display:
                  "block",
                fontWeight:
                  600,
                marginBottom:
                  "7px",
              }}
            >
              Per Page
            </label>

            <select
              id="quotation-limit"
              value={
                limit
              }
              onChange={
                handleLimitChange
              }
              style={{
                minWidth:
                  "120px",
                padding:
                  "10px 12px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
                background:
                  "#ffffff",
              }}
            >

              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>

            </select>

          </div>

        </div>

      </section>

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div
        style={{
          marginBottom:
            "14px",
          color:
            "#6b7280",
          fontSize:
            "14px",
        }}
      >
        Showing{" "}
        <strong>
          {
            quotations.length
          }
        </strong>{" "}
        quotation
        {quotations.length !==
        1
          ? "s"
          : ""}

        {pagination.totalQuotations >
          0 && (
          <>
            {" "}
            out of{" "}
            <strong>
              {
                pagination.totalQuotations
              }
            </strong>
          </>
        )}
      </div>

      {/* ======================================================
          QUOTATION TABLE
          ====================================================== */}

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
        }}
      >

        {quotations.length ===
        0 ? (
          <div
            style={{
              padding:
                "60px 20px",
              textAlign:
                "center",
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
              📄
            </div>

            <h2>
              No Quotations Found
            </h2>

            <p
              style={{
                color:
                  "#6b7280",
                marginBottom:
                  "20px",
              }}
            >
              {status
                ? `There are no ${getStatusLabel(
                    status
                  ).toLowerCase()} quotations.`
                : "No quotations have been created yet."}
            </p>

            <Link
              to="/admin/rfqs"
            >
              Go to RFQs
            </Link>

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
                minWidth:
                  "1050px",
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
                      textAlign:
                        "left",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Quotation
                  </th>

                  <th
                    style={{
                      textAlign:
                        "left",
                      padding:
                        "14px 16px",
                    }}
                  >
                    RFQ
                  </th>

                  <th
                    style={{
                      textAlign:
                        "left",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Customer
                  </th>

                  <th
                    style={{
                      textAlign:
                        "right",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Total
                  </th>

                  <th
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      textAlign:
                        "left",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Created
                  </th>

                  <th
                    style={{
                      textAlign:
                        "right",
                      padding:
                        "14px 16px",
                    }}
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {quotations.map(
                  (
                    quotation
                  ) => {
                    const quotationId =
                      getQuotationId(
                        quotation
                      );

                    const quotationStatus =
                      quotation?.status ||
                      "pending";

                    return (
                      <tr
                        key={
                          quotationId
                        }
                        style={{
                          borderTop:
                            "1px solid #f3f4f6",
                        }}
                      >

                        {/* QUOTATION */}

                        <td
                          style={{
                            padding:
                              "16px",
                          }}
                        >

                          <strong>
                            {
                              getQuotationNumber(
                                quotation
                              )
                            }
                          </strong>

                          {quotation?.validUntil && (
                            <span
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "4px",
                                fontSize:
                                  "12px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              Valid until{" "}
                              {
                                formatDate(
                                  quotation.validUntil
                                )
                              }
                            </span>
                          )}

                        </td>

                        {/* RFQ */}

                        <td
                          style={{
                            padding:
                              "16px",
                          }}
                        >

                          {quotation?.rfq?._id ? (
                            <Link
                              to={`/admin/rfqs/${quotation.rfq._id}`}
                            >
                              {
                                getRFQNumber(
                                  quotation
                                )
                              }
                            </Link>
                          ) : (
                            getRFQNumber(
                              quotation
                            )
                          )}

                        </td>

                        {/* CUSTOMER */}

                        <td
                          style={{
                            padding:
                              "16px",
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",
                            }}
                          >
                            {
                              getCustomerName(
                                quotation
                              )
                            }
                          </strong>

                          {getCustomerEmail(
                            quotation
                          ) && (
                            <span
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "4px",
                                fontSize:
                                  "12px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                getCustomerEmail(
                                  quotation
                                )
                              }
                            </span>
                          )}

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
                            getTotalAmount(
                              quotation
                            )
                          )}
                        </td>

                        {/* STATUS */}

                        <td
                          style={{
                            padding:
                              "16px",
                            textAlign:
                              "center",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              padding:
                                "7px 12px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              whiteSpace:
                                "nowrap",
                              ...getStatusStyle(
                                quotationStatus
                              ),
                            }}
                          >
                            {
                              getStatusLabel(
                                quotationStatus
                              )
                            }
                          </span>

                        </td>

                        {/* CREATED */}

                        <td
                          style={{
                            padding:
                              "16px",
                            color:
                              "#4b5563",
                          }}
                        >
                          {
                            formatDate(
                              quotation?.createdAt
                            )
                          }
                        </td>

                        {/* ACTION */}

                        <td
                          style={{
                            padding:
                              "16px",
                            textAlign:
                              "right",
                          }}
                        >

                          {quotationId ? (
                            <Link
                              to={`/admin/quotations/${quotationId}`}
                            >
                              View Details
                            </Link>
                          ) : (
                            "—"
                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      {pagination.totalPages >
        1 && (
        <div
          style={{
            marginTop:
              "20px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap:
              "12px",
            flexWrap:
              "wrap",
          }}
        >

          <button
            type="button"
            onClick={
              handlePreviousPage
            }
            disabled={
              page <= 1 ||
              loading
            }
          >
            ← Previous
          </button>

          <span
            style={{
              color:
                "#4b5563",
              fontSize:
                "14px",
            }}
          >
            Page{" "}
            <strong>
              {page}
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
                pagination.totalPages ||
              loading
            }
          >
            Next →
          </button>

        </div>
      )}

      {/* ======================================================
          REFRESH
          ====================================================== */}

      <div
        style={{
          marginTop:
            "20px",
          textAlign:
            "right",
        }}
      >

        <button
          type="button"
          onClick={
            loadQuotations
          }
          disabled={
            loading
          }
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

    </div>
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AdminQuotationsPage;