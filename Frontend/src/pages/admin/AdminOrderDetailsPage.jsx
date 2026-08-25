// ============================================================
// SHANTI ENTERPRISES
// Admin Order Details Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAdminOrderById,
  updateOrderStatus,
} from "../../api/adminOrderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// ORDER STATUSES
// ============================================================

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// ============================================================
// ADMIN ORDER DETAILS PAGE
// ============================================================

function AdminOrderDetailsPage() {
  const {
    orderId,
  } = useParams();

  const [
    order,
    setOrder,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminOrderById(
          orderId
        );

      const orderData =
        response?.order ||
        response?.data?.order ||
        response?.data ||
        response;

      if (!orderData) {
        throw new Error(
          "Order not found."
        );
      }

      setOrder(
        orderData
      );
    } catch (err) {
      console.error(
        "Admin order details error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
        err.message ||
        "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange =
    async (
      newStatus
    ) => {
      if (!orderId) {
        return;
      }

      try {
        setUpdating(true);
        setError("");
        setSuccess("");

        await updateOrderStatus(
          orderId,
          newStatus
        );

        setOrder(
          (current) => ({
            ...current,
            status:
              newStatus,
          })
        );

        setSuccess(
          "Order status updated successfully."
        );
      } catch (err) {
        console.error(
          "Order status update error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to update order status."
        );
      } finally {
        setUpdating(false);
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading order details..."
      />
    );
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (error && !order) {
    return (
      <section className="admin-order-details-page">

        <div className="admin-order-details-container">

          <Link
            to="/admin/orders"
            className="admin-order-details-back"
          >
            ← Order Management
          </Link>

          <ErrorMessage
            message={error}
            onRetry={loadOrder}
          />

        </div>

      </section>
    );
  }

  if (!order) {
    return (
      <section className="admin-order-details-page">

        <div className="admin-order-details-container">

          <Link
            to="/admin/orders"
            className="admin-order-details-back"
          >
            ← Order Management
          </Link>

          <div className="admin-order-not-found">

            <h1>
              Order Not Found
            </h1>

            <p>
              The requested order could
              not be found.
            </p>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // ORDER DATA
  // ==========================================================

  const currentStatus =
    (
      order.status ||
      order.orderStatus ||
      "pending"
    )
      .toString()
      .toLowerCase();

  const customer =
    typeof order.user ===
    "object"
      ? order.user
      : typeof order.customer ===
        "object"
        ? order.customer
        : null;

  const customerName =
    customer?.name ||
    customer?.fullName ||
    order.customerName ||
    order.userName ||
    "Customer";

  const customerEmail =
    customer?.email ||
    order.email ||
    "N/A";

  const customerPhone =
    customer?.phone ||
    customer?.mobile ||
    order.phone ||
    order.mobile ||
    "N/A";

  const total = Number(
    order.totalAmount ??
    order.totalPrice ??
    order.grandTotal ??
    order.total ??
    0
  );

  const subtotal = Number(
    order.subtotal ??
    order.subTotal ??
    0
  );

  const shipping = Number(
    order.shippingFee ??
    order.shippingCost ??
    order.deliveryFee ??
    0
  );

  const tax = Number(
    order.tax ??
    order.taxAmount ??
    0
  );

  const paymentStatus =
    order.paymentStatus ||
    order.payment?.status ||
    "N/A";

  const paymentMethod =
    order.paymentMethod ||
    order.payment?.method ||
    "N/A";

  const createdAt =
    order.createdAt ||
    order.created_at ||
    order.date;

  const formattedDate =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleString(
          "en-IN"
        )
      : "N/A";

  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : Array.isArray(
          order.orderItems
        )
        ? order.orderItems
        : [];

  const address =
    order.shippingAddress ||
    order.deliveryAddress ||
    order.address ||
    null;

  const getStatusLabel = (
    status
  ) => {
    return (
      status
        .charAt(0)
        .toUpperCase() +
      status.slice(1)
    );
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-order-details-page">

      <div className="admin-order-details-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-order-details-header">

          <div>

            <Link
              to="/admin/orders"
              className="admin-order-details-back"
            >
              ← Order Management
            </Link>

            <span className="admin-order-details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              Order #{orderId}
            </h1>

            <p>
              Review customer, payment,
              shipping and order information.
            </p>

          </div>

          <span
            className={`admin-order-details-status ${currentStatus}`}
          >
            {getStatusLabel(
              currentStatus
            )}
          </span>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-order-details-error">

            <ErrorMessage
              message={error}
              onRetry={loadOrder}
            />

          </div>
        )}

        {/* ==================================================
            SUCCESS
            ================================================== */}

        {success && (
          <div className="admin-order-details-success">

            <strong>
              ✓ Success
            </strong>

            <span>
              {success}
            </span>

          </div>
        )}

        {/* ==================================================
            TOP SUMMARY
            ================================================== */}

        <div className="admin-order-details-summary">

          <div>

            <span>
              ORDER ID
            </span>

            <strong>
              #{orderId}
            </strong>

          </div>

          <div>

            <span>
              ORDER DATE
            </span>

            <strong>
              {formattedDate}
            </strong>

          </div>

          <div>

            <span>
              ORDER TOTAL
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="admin-order-details-grid">

          {/* ==================================================
              LEFT
              ================================================== */}

          <div className="admin-order-details-main">

            {/* ==================================================
                ORDER STATUS
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    ORDER STATUS
                  </span>

                  <h2>
                    Manage Order
                  </h2>

                </div>

              </div>

              <div className="admin-status-update-box">

                <div>

                  <span>
                    Current Status
                  </span>

                  <strong
                    className={`admin-order-status-text ${currentStatus}`}
                  >
                    {getStatusLabel(
                      currentStatus
                    )}
                  </strong>

                </div>

                <div>

                  <label
                    htmlFor="adminOrderStatus"
                  >
                    Update Status
                  </label>

                  <select
                    id="adminOrderStatus"
                    value={
                      currentStatus
                    }
                    disabled={
                      updating
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value
                      )
                    }
                  >

                    {ORDER_STATUSES.map(
                      (
                        status
                      ) => (
                        <option
                          key={
                            status
                          }
                          value={
                            status
                          }
                        >
                          {getStatusLabel(
                            status
                          )}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              {updating && (
                <p className="admin-order-updating-message">
                  Updating order status...
                </p>
              )}

            </div>

            {/* ==================================================
                ORDER ITEMS
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    PRODUCTS
                  </span>

                  <h2>
                    Order Items
                  </h2>

                </div>

                <span className="admin-items-count">
                  {items.length} items
                </span>

              </div>

              {items.length ===
              0 ? (
                <div className="admin-no-items">
                  No order items found.
                </div>
              ) : (
                <div className="admin-order-items">

                  {items.map(
                    (
                      item,
                      index
                    ) => {

                      const product =
                        typeof item.product ===
                        "object"
                          ? item.product
                          : null;

                      const itemName =
                        item.name ||
                        item.productName ||
                        product?.name ||
                        product?.title ||
                        "Product";

                      const quantity =
                        Number(
                          item.quantity ??
                          item.qty ??
                          1
                        );

                      const itemPrice =
                        Number(
                          item.price ??
                          item.unitPrice ??
                          product?.price ??
                          0
                        );

                      const itemTotal =
                        itemPrice *
                        quantity;

                      const itemImage =
                        item.image ||
                        product?.image ||
                        (
                          Array.isArray(
                            product?.images
                          )
                            ? product
                                .images[0]
                            : ""
                        );

                      return (
                        <article
                          key={
                            item._id ||
                            item.id ||
                            index
                          }
                          className="admin-order-item"
                        >

                          <div className="admin-order-item-image">

                            {itemImage ? (
                              <img
                                src={
                                  itemImage
                                }
                                alt={
                                  itemName
                                }
                              />
                            ) : (
                              <span>
                                📦
                              </span>
                            )}

                          </div>

                          <div className="admin-order-item-info">

                            <h3>
                              {itemName}
                            </h3>

                            <p>
                              Quantity:{" "}
                              {quantity}
                            </p>

                            <span>
                              Unit Price: ₹
                              {itemPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                          <strong className="admin-order-item-total">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                PRICE BREAKDOWN
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    PAYMENT SUMMARY
                  </span>

                  <h2>
                    Price Breakdown
                  </h2>

                </div>

              </div>

              <div className="admin-price-breakdown">

                {subtotal > 0 && (
                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                )}

                {shipping > 0 && (
                  <div>

                    <span>
                      Shipping
                    </span>

                    <strong>
                      ₹
                      {shipping.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                )}

                {tax > 0 && (
                  <div>

                    <span>
                      Tax
                    </span>

                    <strong>
                      ₹
                      {tax.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                )}

                <div className="admin-grand-total">

                  <span>
                    Grand Total
                  </span>

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              RIGHT SIDEBAR
              ================================================== */}

          <aside className="admin-order-details-sidebar">

            {/* ==================================================
                CUSTOMER
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    CUSTOMER
                  </span>

                  <h2>
                    Customer Information
                  </h2>

                </div>

              </div>

              <div className="admin-customer-info">

                <div className="admin-customer-avatar">
                  {customerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3>
                  {customerName}
                </h3>

                <p>
                  {customerEmail}
                </p>

                <p>
                  {customerPhone}
                </p>

              </div>

            </div>

            {/* ==================================================
                SHIPPING
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    DELIVERY
                  </span>

                  <h2>
                    Shipping Address
                  </h2>

                </div>

              </div>

              {address ? (
                <div className="admin-shipping-address">

                  <strong>
                    {address.name ||
                      address.fullName ||
                      customerName}
                  </strong>

                  <p>
                    {address.addressLine1 ||
                      address.address ||
                      address.street ||
                      ""}
                  </p>

                  {address.addressLine2 && (
                    <p>
                      {
                        address.addressLine2
                      }
                    </p>
                  )}

                  <p>
                    {address.city ||
                      ""}

                    {address.city &&
                      address.state
                      ? ", "
                      : ""}

                    {address.state ||
                      ""}
                  </p>

                  <p>
                    {address.pincode ||
                      address.zipCode ||
                      address.postalCode ||
                      ""}
                  </p>

                  <p>
                    {address.country ||
                      "India"}
                  </p>

                </div>
              ) : (
                <p className="admin-not-available">
                  Shipping address not available.
                </p>
              )}

            </div>

            {/* ==================================================
                PAYMENT
                ================================================== */}

            <div className="admin-details-card">

              <div className="admin-details-card-header">

                <div>

                  <span>
                    PAYMENT
                  </span>

                  <h2>
                    Payment Information
                  </h2>

                </div>

              </div>

              <div className="admin-payment-info">

                <div>

                  <span>
                    METHOD
                  </span>

                  <strong>
                    {paymentMethod}
                  </strong>

                </div>

                <div>

                  <span>
                    STATUS
                  </span>

                  <strong
                    className={`admin-payment-status ${paymentStatus
                      .toString()
                      .toLowerCase()}`}
                  >
                    {paymentStatus}
                  </strong>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default AdminOrderDetailsPage;