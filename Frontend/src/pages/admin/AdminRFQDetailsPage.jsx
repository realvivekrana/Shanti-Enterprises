// ============================================================
// SHANTI ENTERPRISES
// Admin RFQ Details + Quotation Page
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
  useParams,
} from "react-router-dom";

import {
  cancelAdminRFQ,
  getAdminRFQById,
  updateAdminRFQStatus,
} from "../../api/rfqApi";

import {
  createAdminQuotation,
} from "../../api/quotationApi";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "reviewing",
    label: "Under Review",
  },
  {
    value: "quoted",
    label: "Quoted",
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
    value: "cancelled",
    label: "Cancelled",
  },
];

// ============================================================
// HELPERS
// ============================================================

const getRFQId = (
  rfq
) =>
  rfq?._id ||
  rfq?.id ||
  "";

const getRFQNumber = (
  rfq
) =>
  rfq?.rfqNumber ||
  "RFQ";

const getCustomer = (
  rfq
) =>
  rfq?.customer ||
  rfq?.user ||
  rfq?.createdBy ||
  null;

const getCustomerName = (
  rfq
) => {
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
    "Customer"
  );
};

const getCustomerEmail = (
  rfq
) => {
  const customer =
    getCustomer(rfq);

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

const getCustomerPhone = (
  rfq
) => {
  const customer =
    getCustomer(rfq);

  if (
    typeof customer ===
    "object" &&
    customer
  ) {
    return (
      customer.phone ||
      customer.mobile ||
      customer.phoneNumber ||
      ""
    );
  }

  return (
    rfq?.customerPhone ||
    rfq?.phone ||
    ""
  );
};

const getProductName = (
  item
) =>
  item?.product?.name ||
  item?.product?.title ||
  item?.productName ||
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
    product.images.length
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

const getStatusLabel = (
  status
) =>
  STATUS_OPTIONS.find(
    (option) =>
      option.value ===
      status
  )?.label ||
  status ||
  "Unknown";

const getTotalQuantity = (
  items = []
) =>
  items.reduce(
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

// ============================================================
// COMPONENT
// ============================================================

function AdminRFQDetailsPage() {
  const {
    rfqId,
  } = useParams();

  const navigate =
    useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [rfq, setRFQ] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [showCancelConfirmation, setShowCancelConfirmation] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  // ==========================================================
  // QUOTATION STATE
  // ==========================================================

  const [quotationPrices, setQuotationPrices] =
    useState({});

  const [quotationNote, setQuotationNote] =
    useState("");

  const [quotationValidUntil, setQuotationValidUntil] =
    useState("");

  const [isCreatingQuotation, setIsCreatingQuotation] =
    useState(false);

  const [createdQuotation, setCreatedQuotation] =
    useState(null);

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
            await getAdminRFQById(
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

          setSelectedStatus(
            receivedRFQ.status ||
              "pending"
          );
        } catch (err) {
          console.error(
            "Admin RFQ details error:",
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
  // UPDATE STATUS
  // ==========================================================

  const handleStatusUpdate =
    async () => {
      if (
        !rfqId ||
        !selectedStatus ||
        isUpdatingStatus
      ) {
        return;
      }

      if (
        selectedStatus ===
        rfq?.status
      ) {
        setSuccessMessage(
          "RFQ status is already set to this value."
        );

        return;
      }

      try {
        setIsUpdatingStatus(
          true
        );

        setError("");
        setSuccessMessage("");

        const response =
          await updateAdminRFQStatus(
            rfqId,
            selectedStatus
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

          setSelectedStatus(
            updatedRFQ.status ||
              selectedStatus
          );
        } else {
          setRFQ(
            (currentRFQ) =>
              currentRFQ
                ? {
                    ...currentRFQ,
                    status:
                      selectedStatus,
                  }
                : currentRFQ
          );
        }

        setSuccessMessage(
          "RFQ status updated successfully."
        );
      } catch (err) {
        console.error(
          "Update RFQ status error:",
          err
        );

        setError(
          err?.response
            ?.data?.message ||
            err?.response
              ?.data?.error ||
            err?.message ||
            "Unable to update RFQ status."
        );
      } finally {
        setIsUpdatingStatus(
          false
        );
      }
    };

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
        setIsCancelling(
          true
        );

        setError("");
        setSuccessMessage("");

        const response =
          await cancelAdminRFQ(
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

          setSelectedStatus(
            updatedRFQ.status ||
              "cancelled"
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

          setSelectedStatus(
            "cancelled"
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
          "Cancel admin RFQ error:",
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
  // QUOTATION PRICE CHANGE
  // ==========================================================

  const handleQuotationPriceChange = (
    productId,
    value
  ) => {
    setQuotationPrices(
      (currentPrices) => ({
        ...currentPrices,
        [productId]: value,
      })
    );
  };

  // ==========================================================
  // QUOTATION TOTAL
  // ==========================================================

  const getQuotationItemTotal = (
    item
  ) => {
    const productId =
      item?.product?._id ||
      item?.product ||
      item?.productId ||
      "";

    const quantity =
      Number(
        item?.quantity || 0
      );

    const unitPrice =
      Number(
        quotationPrices[productId] || 0
      );

    return quantity * unitPrice;
  };

  const quotationSubtotal =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        getQuotationItemTotal(
          item
        ),
      0
    );

  // ==========================================================
  // CREATE QUOTATION
  // ==========================================================

  const handleCreateQuotation =
    async () => {
      if (
        !rfqId ||
        !items.length ||
        isCreatingQuotation
      ) {
        return;
      }

      setError("");
      setSuccessMessage("");

      const quotationItems =
        items.map(
          (item) => {
            const productId =
              item?.product?._id ||
              item?.product ||
              item?.productId ||
              "";

            return {
              productId,
              quantity:
                Number(
                  item?.quantity || 0
                ),
              unitPrice:
                Number(
                  quotationPrices[
                    productId
                  ] || 0
                ),
            };
          }
        );

      const invalidItem =
        quotationItems.find(
          (item) =>
            !item.productId ||
            item.quantity < 1 ||
            !Number.isFinite(
              item.unitPrice
            ) ||
            item.unitPrice < 0
        );

      if (invalidItem) {
        setError(
          "Please enter a valid unit price for every requested product."
        );

        return;
      }

      if (
        !quotationValidUntil
      ) {
        setError(
          "Please select a quotation validity date."
        );

        return;
      }

      const validUntilDate =
        new Date(
          `${quotationValidUntil}T23:59:59`
        );

      if (
        Number.isNaN(
          validUntilDate.getTime()
        )
      ) {
        setError(
          "Please select a valid quotation expiry date."
        );

        return;
      }

      if (
        validUntilDate <
        new Date()
      ) {
        setError(
          "Quotation validity date must be in the future."
        );

        return;
      }

      try {
        setIsCreatingQuotation(
          true
        );

        const response =
          await createAdminQuotation({
            rfqId,
            items:
              quotationItems,
            note:
              quotationNote.trim(),
            validUntil:
              validUntilDate.toISOString(),
          });

        const quotation =
          response?.quotation ||
          response?.data?.quotation ||
          response?.data ||
          null;

        setCreatedQuotation(
          quotation
        );

        setSuccessMessage(
          response?.message ||
            "Quotation created successfully."
        );

        // The backend changes the related RFQ
        // to quoted when quotation creation succeeds.
        setRFQ(
          (currentRFQ) =>
            currentRFQ
              ? {
                  ...currentRFQ,
                  status:
                    "quoted",
                }
              : currentRFQ
        );

        setSelectedStatus(
          "quoted"
        );
      } catch (err) {
        console.error(
          "Create quotation error:",
          err
        );

        setError(
          err?.response
            ?.data?.message ||
            err?.response
              ?.data?.error ||
            err?.message ||
            "Unable to create quotation."
        );
      } finally {
        setIsCreatingQuotation(
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
              RFQ Details
            </h1>

            <p>
              Loading RFQ...
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
          Loading RFQ details...
        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR
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
              ADMIN
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
                  "/admin/rfqs"
                )
              }
            >
              Back to RFQs
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const rfqNumber =
    getRFQNumber(
      rfq
    );

  const currentStatus =
    rfq?.status ||
    "pending";

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

  const customerName =
    getCustomerName(
      rfq
    );

  const customerEmail =
    getCustomerEmail(
      rfq
    );

  const customerPhone =
    getCustomerPhone(
      rfq
    );

  const canCancel =
    ![
      "cancelled",
      "accepted",
      "rejected",
    ].includes(
      currentStatus
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
            ADMIN · WHOLESALE
          </span>

          <h1>
            {rfqNumber}
          </h1>

          <p>
            Review customer requirements
            and manage this RFQ.
          </p>

        </div>

        <Link
          to="/admin/rfqs"
        >
          ← All RFQs
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
          TOP SUMMARY
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
            Products
          </span>

          <strong>
            {items.length}
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
            Total Quantity
          </span>

          <strong>
            {totalQuantity}
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
            Submitted
          </span>

          <strong>
            {formatDateTime(
              rfq?.createdAt
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
            "minmax(0, 1fr) 340px",
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

          {/* CUSTOMER */}

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
              Customer Details
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
                      "5px",
                  }}
                >
                  Name
                </span>

                <strong>
                  {customerName}
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
                      "5px",
                  }}
                >
                  Email
                </span>

                <strong>
                  {customerEmail ||
                    "—"}
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
                      "5px",
                  }}
                >
                  Phone
                </span>

                <strong>
                  {customerPhone ||
                    "—"}
                </strong>

              </div>

            </div>

          </section>

          {/* PRODUCTS */}

          <section
            style={{
              marginBottom:
                "20px",
            }}
          >

            <h2>
              Requested Products
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
                  No products found.
                </div>
              ) : (
                items.map(
                  (
                    item,
                    index
                  ) => {
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
                                "0 0 8px",
                            }}
                          >
                            {getProductName(
                              item
                            )}
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
                                item?.quantity
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
              CREATE QUOTATION
              ====================================================== */}

          {currentStatus !== "cancelled" &&
            currentStatus !== "accepted" &&
            currentStatus !== "rejected" &&
            !createdQuotation && (
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
                    marginBottom:
                      "20px",
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
                        "5px",
                    }}
                  >
                    ADMIN QUOTATION
                  </span>

                  <h2
                    style={{
                      margin:
                        "0 0 8px",
                    }}
                  >
                    Create Quotation
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
                    Enter the wholesale unit price for
                    every requested product.
                  </p>

                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "12px",
                  }}
                >

                  {items.map(
                    (
                      item,
                      index
                    ) => {
                      const productId =
                        item?.product?._id ||
                        item?.product ||
                        item?.productId ||
                        `item-${index}`;

                      const quantity =
                        Number(
                          item?.quantity || 0
                        );

                      const unitPrice =
                        Number(
                          quotationPrices[
                            productId
                          ] || 0
                        );

                      const itemTotal =
                        quantity *
                        unitPrice;

                      return (
                        <div
                          key={
                            productId
                          }
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "minmax(0, 1fr) 140px 150px",
                            gap:
                              "14px",
                            alignItems:
                              "end",
                            padding:
                              "16px",
                            border:
                              "1px solid #e5e7eb",
                            borderRadius:
                              "10px",
                            background:
                              "#f9fafb",
                          }}
                        >

                          <div>

                            <strong
                              style={{
                                display:
                                  "block",
                                marginBottom:
                                  "5px",
                              }}
                            >
                              {getProductName(
                                item
                              )}
                            </strong>

                            <span
                              style={{
                                fontSize:
                                  "13px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              Requested:
                              {" "}
                              {quantity}
                              {item?.unit
                                ? ` ${item.unit}`
                                : ""}
                            </span>

                          </div>

                          <div>

                            <label
                              htmlFor={`quotation-price-${productId}`}
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "6px",
                              }}
                            >
                              Unit Price
                            </label>

                            <input
                              id={`quotation-price-${productId}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                quotationPrices[
                                  productId
                                ] ?? ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleQuotationPriceChange(
                                  productId,
                                  event.target.value
                                )
                              }
                              placeholder="0.00"
                              disabled={
                                isCreatingQuotation
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

                          </div>

                          <div>

                            <span
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "6px",
                              }}
                            >
                              Total
                            </span>

                            <strong
                              style={{
                                display:
                                  "block",
                                padding:
                                  "10px 12px",
                                borderRadius:
                                  "8px",
                                background:
                                  "#ffffff",
                                border:
                                  "1px solid #e5e7eb",
                              }}
                            >
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits:
                                    2,
                                  maximumFractionDigits:
                                    2,
                                }
                              )}
                            </strong>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* QUOTATION NOTE */}

                <div
                  style={{
                    marginTop:
                      "18px",
                  }}
                >

                  <label
                    htmlFor="quotation-note"
                    style={{
                      display:
                        "block",
                      fontWeight:
                        700,
                      marginBottom:
                        "7px",
                    }}
                  >
                    Quotation Note
                  </label>

                  <textarea
                    id="quotation-note"
                    value={
                      quotationNote
                    }
                    onChange={(
                      event
                    ) =>
                      setQuotationNote(
                        event.target.value
                      )
                    }
                    maxLength={1000}
                    rows={4}
                    placeholder="Add pricing terms, delivery information, payment terms or any other note..."
                    disabled={
                      isCreatingQuotation
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
                      resize:
                        "vertical",
                      boxSizing:
                        "border-box",
                    }}
                  />

                  <div
                    style={{
                      marginTop:
                        "5px",
                      textAlign:
                        "right",
                      fontSize:
                        "12px",
                      color:
                        "#6b7280",
                    }}
                  >
                    {
                      quotationNote.length
                    }/1000
                  </div>

                </div>

                {/* VALID UNTIL */}

                <div
                  style={{
                    marginTop:
                      "14px",
                    maxWidth:
                      "280px",
                  }}
                >

                  <label
                    htmlFor="quotation-valid-until"
                    style={{
                      display:
                        "block",
                      fontWeight:
                        700,
                      marginBottom:
                        "7px",
                    }}
                  >
                    Valid Until
                  </label>

                  <input
                    id="quotation-valid-until"
                    type="date"
                    value={
                      quotationValidUntil
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(
                      event
                    ) =>
                      setQuotationValidUntil(
                        event.target.value
                      )
                    }
                    disabled={
                      isCreatingQuotation
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
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>

                {/* TOTAL */}

                <div
                  style={{
                    marginTop:
                      "20px",
                    padding:
                      "16px",
                    borderRadius:
                      "10px",
                    background:
                      "#f9fafb",
                    border:
                      "1px solid #e5e7eb",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap:
                        "16px",
                    }}
                  >

                    <span
                      style={{
                        fontWeight:
                          700,
                      }}
                    >
                      Quotation Total
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "22px",
                      }}
                    >
                      ₹
                      {quotationSubtotal.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        }
                      )}
                    </strong>

                  </div>

                </div>

                {/* CREATE BUTTON */}

                <button
                  type="button"
                  onClick={
                    handleCreateQuotation
                  }
                  disabled={
                    isCreatingQuotation ||
                    !items.length
                  }
                  style={{
                    width:
                      "100%",
                    marginTop:
                      "16px",
                    padding:
                      "13px 16px",
                  }}
                >
                  {isCreatingQuotation
                    ? "Creating Quotation..."
                    : "Create Quotation"}
                </button>

              </section>
            )}

          {/* ======================================================
              CREATED QUOTATION
              ====================================================== */}

          {createdQuotation && (
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
                marginBottom:
                  "20px",
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
                    "#047857",
                  marginBottom:
                    "5px",
                }}
              >
                QUOTATION CREATED
              </span>

              <h2
                style={{
                  margin:
                    "0 0 12px",
                }}
              >
                {createdQuotation.quotationNumber ||
                  "Quotation created"}
              </h2>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap:
                    "14px",
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
                        "#047857",
                      marginBottom:
                        "4px",
                    }}
                  >
                    Status
                  </span>

                  <strong>
                    {createdQuotation.status ||
                      "sent"}
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
                        "#047857",
                      marginBottom:
                        "4px",
                    }}
                  >
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      createdQuotation.totalAmount ||
                        quotationSubtotal
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
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
                        "#047857",
                      marginBottom:
                        "4px",
                    }}
                  >
                    Valid Until
                  </span>

                  <strong>
                    {formatDateTime(
                      createdQuotation.validUntil
                    )}
                  </strong>

                </div>

              </div>

            </section>
          )}

          {/* OVERALL REQUIREMENT */}

          {rfq?.message && (
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
                }}
              >
                {rfq.message}
              </p>

            </section>
          )}

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

          {/* STATUS */}

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
              Manage Status
            </h2>

            <label
              htmlFor="admin-rfq-status"
              style={{
                display:
                  "block",
                fontWeight:
                  600,
                marginBottom:
                  "8px",
              }}
            >
              RFQ Status
            </label>

            <select
              id="admin-rfq-status"
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
                isUpdatingStatus ||
                isCancelling ||
                isCreatingQuotation
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
                boxSizing:
                  "border-box",
              }}
            >

              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={
                      option.value
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

            <button
              type="button"
              onClick={
                handleStatusUpdate
              }
              disabled={
                isUpdatingStatus ||
                isCancelling ||
                selectedStatus ===
                  currentStatus
              }
              style={{
                width:
                  "100%",
                marginTop:
                  "12px",
              }}
            >
              {isUpdatingStatus
                ? "Updating..."
                : "Update Status"}
            </button>

          </section>

          {/* QUOTATION STATUS */}

          {createdQuotation && (
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
                Quotation
              </h2>

              <p
                style={{
                  margin:
                    "0 0 12px",
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                A quotation has been created
                for this RFQ.
              </p>

              <strong>
                {createdQuotation.quotationNumber ||
                  "Quotation"}
              </strong>

            </section>
          )}

          {/* RFQ INFORMATION */}

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
              RFQ Information
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
                  RFQ Number
                </span>

                <strong>
                  {rfqNumber}
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
                  Created
                </span>

                <strong>
                  {formatDateTime(
                    rfq?.createdAt
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
                  Updated
                </span>

                <strong>
                  {formatDateTime(
                    rfq?.updatedAt
                  )}
                </strong>

              </div>

            </div>

          </section>

          {/* CANCEL */}

          {canCancel && (
            <section
              style={{
                padding:
                  "20px",
                border:
                  "1px solid #fecaca",
                borderRadius:
                  "12px",
                background:
                  "#fffafa",
              }}
            >

              <h3>
                Danger Zone
              </h3>

              <p
                style={{
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.5,
                }}
              >
                Cancel this RFQ if it
                should no longer be
                processed.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowCancelConfirmation(
                    true
                  )
                }
                disabled={
                  isCancelling ||
                  isUpdatingStatus
                }
              >
                Cancel RFQ
              </button>

            </section>
          )}

        </aside>

      </div>

      {/* ======================================================
          CANCEL MODAL
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
                  : "Yes, Cancel"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminRFQDetailsPage;