// ============================================================
// SHANTI ENTERPRISES
// Admin RFQs Page
// Admin - Wholesale RFQ Management
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
  getAdminRFQs,
} from "../../api/rfqApi";

import "./AdminRFQsPage.css";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
  },

  reviewing: {
    label: "Under Review",
  },

  quoted: {
    label: "Quoted",
  },

  accepted: {
    label: "Accepted",
  },

  rejected: {
    label: "Rejected",
  },

  cancelled: {
    label: "Cancelled",
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatusLabel = (
  status
) => {
  return (
    STATUS_CONFIG[
      status
    ]?.label ||
    status ||
    "Unknown"
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

const getCustomerName = (
  rfq
) => {
  const customer =
    rfq?.customer ||
    rfq?.user ||
    rfq?.createdBy;

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

const getCustomerEmail = (
  rfq
) => {
  const customer =
    rfq?.customer ||
    rfq?.user ||
    rfq?.createdBy;

  if (
    typeof customer ===
      "object" &&
    customer
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

const getItemCount = (
  rfq
) => {
  if (
    !Array.isArray(
      rfq?.items
    )
  ) {
    return 0;
  }

  return rfq.items.length;
};

const getTotalQuantity = (
  rfq
) => {
  if (
    !Array.isArray(
      rfq?.items
    )
  ) {
    return 0;
  }

  return rfq.items.reduce(
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

const getFirstProductName = (
  rfq
) => {
  const firstItem =
    rfq?.items?.[0];

  return (
    firstItem?.product?.name ||
    firstItem?.product?.title ||
    firstItem?.productName ||
    "Product"
  );
};

// ============================================================
// ADMIN RFQS PAGE
// ============================================================

function AdminRFQsPage() {
  const navigate =
    useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfqs, setRFQs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
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

  // ==========================================================
  // LOAD RFQS
  // ==========================================================

  const loadRFQs =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getAdminRFQs({
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
            "Admin RFQs error:",
            err
          );

          setError(
            err?.response
              ?.data?.message ||
              err?.response
                ?.data?.error ||
              err?.message ||
              "Unable to load RFQs."
          );
        } finally {
          setLoading(false);
        }
      },
      [page, status]
    );

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    loadRFQs();
  }, [loadRFQs]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredRFQs =
    normalizedSearch
      ? rfqs.filter(
          (rfq) => {
            const rfqNumber =
              getRFQNumber(
                rfq
              ).toLowerCase();

            const customerName =
              getCustomerName(
                rfq
              ).toLowerCase();

            const customerEmail =
              getCustomerEmail(
                rfq
              ).toLowerCase();

            const productName =
              getFirstProductName(
                rfq
              ).toLowerCase();

            return (
              rfqNumber.includes(
                normalizedSearch
              ) ||
              customerName.includes(
                normalizedSearch
              ) ||
              customerEmail.includes(
                normalizedSearch
              ) ||
              productName.includes(
                normalizedSearch
              )
            );
          }
        )
      : rfqs;

  // ==========================================================
  // SEARCH CHANGE
  // ==========================================================

  const handleSearchChange =
    (event) => {
      setSearch(
        event.target.value
      );
    };

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
  // CLEAR FILTERS
  // ==========================================================

  const handleClearFilters =
    () => {
      setSearch("");
      setStatus("");
      setPage(1);
    };

  // ==========================================================
  // OPEN RFQ
  // ==========================================================

  const handleOpenRFQ =
    (rfq) => {
      const rfqId =
        getRFQId(rfq);

      if (!rfqId) {
        return;
      }

      navigate(
        `/admin/rfqs/${rfqId}`
      );
    };

  // ==========================================================
  // PREVIOUS
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
  // NEXT
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
      <div className="app-page admin-rfqs-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              ADMIN
            </span>

            <h1>
              RFQ Management
            </h1>

            <p>
              Manage customer wholesale
              quotation requests.
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
          Loading RFQs...
        </div>

      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="app-page admin-rfqs-page">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="page-header">

        <div>

          <span className="page-eyebrow">
            ADMIN
          </span>

          <h1>
            RFQ Management
          </h1>

          <p>
            Manage customer wholesale
            requests for quotation.
          </p>

        </div>

        <Link
          to="/admin"
        >
          ← Dashboard
        </Link>

      </div>

      {/* ======================================================
          SUMMARY
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

        <div
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
              color:
                "#6b7280",
              fontSize:
                "13px",
              marginBottom:
                "6px",
            }}
          >
            Total RFQs
          </span>

          <strong
            style={{
              fontSize:
                "24px",
            }}
          >
            {
              pagination.totalRFQs
            }
          </strong>

        </div>

        <div
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
              color:
                "#6b7280",
              fontSize:
                "13px",
              marginBottom:
                "6px",
            }}
          >
            Showing
          </span>

          <strong
            style={{
              fontSize:
                "24px",
            }}
          >
            {
              filteredRFQs.length
            }
          </strong>

        </div>

        <div
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
              color:
                "#6b7280",
              fontSize:
                "13px",
              marginBottom:
                "6px",
            }}
          >
            Current Page
          </span>

          <strong
            style={{
              fontSize:
                "24px",
            }}
          >
            {
              pagination.page ||
              page
            }
          </strong>

        </div>

      </div>

      {/* ======================================================
          FILTER BAR
          ====================================================== */}

      <section
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) 200px auto",
          gap:
            "12px",
          padding:
            "16px",
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

        {/* SEARCH */}

        <input
          type="search"
          value={search}
          onChange={
            handleSearchChange
          }
          placeholder="Search by RFQ number, customer, email or product..."
          style={{
            width:
              "100%",
            padding:
              "11px 12px",
            border:
              "1px solid #d1d5db",
            borderRadius:
              "8px",
            boxSizing:
              "border-box",
          }}
        />

        {/* STATUS */}

        <select
          value={status}
          onChange={
            handleStatusChange
          }
          style={{
            width:
              "100%",
            padding:
              "11px 12px",
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

        {/* CLEAR */}

        <button
          type="button"
          onClick={
            handleClearFilters
          }
          disabled={
            !search &&
            !status
          }
        >
          Clear
        </button>

      </section>

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
              loadRFQs
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* ======================================================
          EMPTY
          ====================================================== */}

      {!error &&
        filteredRFQs.length ===
          0 && (
          <section
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
              No RFQs found
            </h2>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              {search ||
              status
                ? "Try changing your search or filter."
                : "There are no customer RFQs yet."}
            </p>

          </section>
        )}

      {/* ======================================================
          RFQ TABLE
          ====================================================== */}

      {filteredRFQs.length >
        0 && (
        <section
          style={{
            overflowX:
              "auto",
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "12px",
          }}
        >

          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
              minWidth:
                "900px",
            }}
          >

            <thead>

              <tr>

                <th
                  style={{
                    textAlign:
                      "left",
                    padding:
                      "14px 16px",
                    borderBottom:
                      "1px solid #e5e7eb",
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
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  Customer
                </th>

                <th
                  style={{
                    textAlign:
                      "left",
                    padding:
                      "14px 16px",
                    borderBottom:
                      "1px solid #e5e7eb",
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
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  Qty
                </th>

                <th
                  style={{
                    textAlign:
                      "left",
                    padding:
                      "14px 16px",
                    borderBottom:
                      "1px solid #e5e7eb",
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
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    textAlign:
                      "right",
                    padding:
                      "14px 16px",
                    borderBottom:
                      "1px solid #e5e7eb",
                  }}
                >
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRFQs.map(
                (rfq) => {
                  const rfqId =
                    getRFQId(
                      rfq
                    );

                  return (
                    <tr
                      key={
                        rfqId ||
                        getRFQNumber(
                          rfq
                        )
                      }
                    >

                      {/* RFQ */}

                      <td
                        style={{
                          padding:
                            "16px",
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >

                        <strong>
                          {
                            getRFQNumber(
                              rfq
                            )
                          }
                        </strong>

                      </td>

                      {/* CUSTOMER */}

                      <td
                        style={{
                          padding:
                            "16px",
                          borderBottom:
                            "1px solid #f3f4f6",
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

                      </td>

                      {/* PRODUCT */}

                      <td
                        style={{
                          padding:
                            "16px",
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >

                        <strong
                          style={{
                            display:
                              "block",
                          }}
                        >
                          {
                            getFirstProductName(
                              rfq
                            )
                          }
                        </strong>

                        {getItemCount(
                          rfq
                        ) > 1 && (
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
                            +{" "}
                            {getItemCount(
                              rfq
                            ) -
                              1}{" "}
                            more product
                            {getItemCount(
                              rfq
                            ) -
                              1 !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        )}

                      </td>

                      {/* QUANTITY */}

                      <td
                        style={{
                          padding:
                            "16px",
                          textAlign:
                            "center",
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >

                        <strong>
                          {
                            getTotalQuantity(
                              rfq
                            )
                          }
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td
                        style={{
                          padding:
                            "16px",
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >

                        <span
                          style={{
                            display:
                              "inline-flex",
                            padding:
                              "6px 10px",
                            borderRadius:
                              "999px",
                            background:
                              "#f3f4f6",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          {
                            getStatusLabel(
                              rfq.status
                            )
                          }
                        </span>

                      </td>

                      {/* DATE */}

                      <td
                        style={{
                          padding:
                            "16px",
                          borderBottom:
                            "1px solid #f3f4f6",
                        }}
                      >
                        {formatDate(
                          rfq.createdAt
                        )}
                      </td>

                      {/* ACTION */}

                      <td
                        style={{
                          padding:
                            "16px",
                          textAlign:
                            "right",
                          borderBottom:
                            "1px solid #f3f4f6",
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
                          View →
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </section>
      )}

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      {pagination.totalPages >
        1 && (
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            gap:
              "16px",
            marginTop:
              "20px",
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

          <span>
            Page{" "}
            <strong>
              {
                pagination.page ||
                page
              }
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

export default AdminRFQsPage;