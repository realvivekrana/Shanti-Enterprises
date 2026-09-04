// ============================================================
// SHANTI ENTERPRISES
// Admin Quotation Details Page
// Admin - Wholesale Quotation Management
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

import "./AdminQuotationDetailsPage.css";

import {
  cancelAdminQuotation,
  getAdminQuotationById,
  updateAdminQuotationStatus,
} from "../../api/quotationApi";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_OPTIONS = [
  "pending",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

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
    "Quotation"
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
    getCustomer(quotation);

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
  quotation
) => {
  const customer =
    getCustomer(quotation);

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

const getProductUnit = (
  item
) => {
  return (
    item?.unit ||
    item?.product?.unit ||
    "piece"
  );
};

const getQuantity = (
  item
) => {
  return Number(
    item?.quantity || 0
  );
};

const getUnitPrice = (
  item
) => {
  return Number(
    item?.unitPrice || 0
  );
};

const getItemTotal = (
  item
) => {
  if (
    item?.totalPrice !==
      undefined &&
    item?.totalPrice !==
      null
  ) {
    return Number(
      item.totalPrice
    );
  }

  return (
    getQuantity(item) *
    getUnitPrice(item)
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

// ============================================================
// COMPONENT
// ============================================================

function AdminQuotationDetailsPage() {
  const {
    quotationId,
  } = useParams();

  const navigate =
    useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    quotation,
    setQuotation,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");

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
            await getAdminQuotationById(
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
            throw new Error(
              "Quotation data was not found."
            );
          }

          setQuotation(
            receivedQuotation
          );

          setSelectedStatus(
            receivedQuotation.status ||
              "pending"
          );
        } catch (err) {
          console.error(
            "Admin quotation details error:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.response?.data
                ?.error ||
              err?.message ||
              "Unable to load quotation."
          );
        } finally {
          setLoading(false);
        }
      },
      [quotationId]
    );

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    loadQuotation();
  }, [loadQuotation]);

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusUpdate =
    async () => {
      if (
        !quotationId ||
        !selectedStatus
      ) {
        return;
      }

      if (
        selectedStatus ===
        quotation?.status
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );
        setError("");

        const response =
          await updateAdminQuotationStatus(
            quotationId,
            selectedStatus
          );

        const updatedQuotation =
          response?.quotation ||
          response?.data?.quotation;

        if (
          updatedQuotation
        ) {
          setQuotation(
            (current) => ({
              ...current,
              ...updatedQuotation,
            })
          );
        } else {
          await loadQuotation();
        }
      } catch (err) {
        console.error(
          "Update quotation status error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.response?.data
              ?.error ||
            err?.message ||
            "Unable to update quotation status."
        );

        setSelectedStatus(
          quotation?.status ||
            "pending"
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ==========================================================
  // CANCEL QUOTATION
  // ==========================================================

  const handleCancel =
    async () => {
      if (!quotationId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this quotation?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          true
        );
        setError("");

        await cancelAdminQuotation(
          quotationId
        );

        await loadQuotation();
      } catch (err) {
        console.error(
          "Cancel quotation error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.response?.data
              ?.error ||
            err?.message ||
            "Unable to cancel quotation."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="app-page admin-quotation-details-page">

        <div className="page-header">

          <div>

            <span className="page-eyebrow">
              ADMIN
            </span>

            <h1>
              Quotation Details
            </h1>

            <p>
              Loading quotation information...
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
          Loading quotation...
        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (
    !quotation &&
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
              Quotation Details
            </h1>

            <p>
              Unable to load this quotation.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/quotations"
              )
            }
          >
            ← Back to Quotations
          </button>

        </div>

        <section
          style={{
            padding:
              "30px",
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

          <p
            style={{
              margin:
                "0 0 16px",
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadQuotation
            }
          >
            Try Again
          </button>

        </section>

      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const status =
    quotation?.status ||
    "pending";

  const items =
    Array.isArray(
      quotation?.items
    )
      ? quotation.items
      : [];

  const subtotal =
    Number(
      quotation?.subtotal || 0
    );

  const totalAmount =
    Number(
      quotation?.totalAmount ??
        subtotal
    );

  const canCancel =
    ![
      "accepted",
      "rejected",
      "expired",
    ].includes(status);

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
            ADMIN
          </span>

          <h1>
            {
              getQuotationNumber(
                quotation
              )
            }
          </h1>

          <p>
            Wholesale quotation
            details and management.
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
            to="/admin/quotations"
          >
            ← All Quotations
          </Link>

          {quotation?.rfq?._id && (
            <Link
              to={`/admin/rfqs/${quotation.rfq._id}`}
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
          TOP INFO
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

        {/* STATUS */}

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
                "8px",
            }}
          >
            Status
          </span>

          <span
            style={{
              display:
                "inline-flex",
              padding:
                "7px 12px",
              borderRadius:
                "999px",
              fontSize:
                "13px",
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

        </section>

        {/* RFQ */}

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
                "8px",
            }}
          >
            RFQ Number
          </span>

          <strong>
            {
              getRFQNumber(
                quotation
              )
            }
          </strong>

        </section>

        {/* TOTAL */}

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
                "8px",
            }}
          >
            Total Amount
          </span>

          <strong
            style={{
              fontSize:
                "24px",
            }}
          >
            {formatCurrency(
              totalAmount
            )}
          </strong>

        </section>

      </div>

      {/* ======================================================
          CUSTOMER + QUOTATION META
          ====================================================== */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap:
            "20px",
          marginBottom:
            "20px",
        }}
      >

        {/* CUSTOMER */}

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
            Customer
          </h2>

          <div
            style={{
              display:
                "grid",
              gap:
                "10px",
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
                }}
              >
                Name
              </span>

              <strong>
                {
                  getCustomerName(
                    quotation
                  )
                }
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
                }}
              >
                Email
              </span>

              <span>
                {
                  getCustomerEmail(
                    quotation
                  ) ||
                  "—"
                }
              </span>

            </div>

          </div>

        </section>

        {/* QUOTATION META */}

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

          <div
            style={{
              display:
                "grid",
              gap:
                "10px",
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
                }}
              >
                Created
              </span>

              <span>
                {
                  formatDateTime(
                    quotation?.createdAt
                  )
                }
              </span>

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
                }}
              >
                Valid Until
              </span>

              <span>
                {
                  formatDate(
                    quotation?.validUntil
                  )
                }
              </span>

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
                }}
              >
                Sent At
              </span>

              <span>
                {
                  formatDateTime(
                    quotation?.sentAt
                  )
                }
              </span>

            </div>

          </div>

        </section>

      </div>

      {/* ======================================================
          ITEMS
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
            No quotation items found.
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
                  "700px",
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
                    Total
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
                        item?.product?._id ||
                        item?.product ||
                        index
                      }
                      style={{
                        borderTop:
                          "1px solid #f3f4f6",
                      }}
                    >

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
                          Unit:{" "}
                          {
                            getProductUnit(
                              item
                            )
                          }
                        </span>

                      </td>

                      <td
                        style={{
                          padding:
                            "16px",
                          textAlign:
                            "center",
                        }}
                      >
                        {
                          getQuantity(
                            item
                          )
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "16px",
                          textAlign:
                            "right",
                        }}
                      >
                        {formatCurrency(
                          getUnitPrice(
                            item
                          )
                        )}
                      </td>

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
                          getItemTotal(
                            item
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

      {/* ======================================================
          TOTALS
          ====================================================== */}

      <section
        style={{
          display:
            "flex",
          justifyContent:
            "flex-end",
          marginBottom:
            "20px",
        }}
      >

        <div
          style={{
            width:
              "100%",
            maxWidth:
              "380px",
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

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              paddingBottom:
                "10px",
            }}
          >

            <span>
              Subtotal
            </span>

            <strong>
              {formatCurrency(
                subtotal
              )}
            </strong>

          </div>

          <div
            style={{
              borderTop:
                "1px solid #e5e7eb",
              paddingTop:
                "12px",
              display:
                "flex",
              justifyContent:
                "space-between",
              fontSize:
                "18px",
            }}
          >

            <strong>
              Total
            </strong>

            <strong>
              {formatCurrency(
                totalAmount
              )}
            </strong>

          </div>

        </div>

      </section>

      {/* ======================================================
          NOTE
          ====================================================== */}

      {quotation?.note && (
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
            marginBottom:
              "20px",
          }}
        >

          <h2>
            Note
          </h2>

          <p
            style={{
              margin:
                0,
              whiteSpace:
                "pre-wrap",
              color:
                "#374151",
            }}
          >
            {
              quotation.note
            }
          </p>

        </section>
      )}

      {/* ======================================================
          ADMIN ACTIONS
          ====================================================== */}

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
          marginBottom:
            "30px",
        }}
      >

        <h2>
          Manage Quotation
        </h2>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "12px",
            flexWrap:
              "wrap",
          }}
        >

          {/* STATUS SELECT */}

          <select
            value={
              selectedStatus
            }
            onChange={(
              event
            ) =>
              setSelectedStatus(
                event.target.value
              )
            }
            disabled={
              actionLoading
            }
            style={{
              minWidth:
                "180px",
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
              (option) => (
                <option
                  key={
                    option
                  }
                  value={
                    option
                  }
                >
                  {
                    getStatusLabel(
                      option
                    )
                  }
                </option>
              )
            )}

          </select>

          {/* UPDATE */}

          <button
            type="button"
            onClick={
              handleStatusUpdate
            }
            disabled={
              actionLoading ||
              !selectedStatus ||
              selectedStatus ===
                quotation?.status
            }
          >
            {actionLoading
              ? "Updating..."
              : "Update Status"}
          </button>

          {/* CANCEL */}

          {canCancel && (
            <button
              type="button"
              onClick={
                handleCancel
              }
              disabled={
                actionLoading
              }
            >
              {actionLoading
                ? "Processing..."
                : "Cancel Quotation"}
            </button>
          )}

        </div>

      </section>

    </div>
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AdminQuotationDetailsPage;