// ============================================================
// SHANTI ENTERPRISES
// Admin Order Details Page
// Frontend Phase 5 - Order Management
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
      <section className="app-page">

        <Link to="/admin/orders">
          ← Order Management
        </Link>

        <ErrorMessage
          message={error}
          onRetry={loadOrder}
        />

      </section>
    );
  }

  if (!order) {
    return (
      <section className="app-page">

        <Link to="/admin/orders">
          ← Order Management
        </Link>

        <h1>
          Order Not Found
        </h1>

        <p>
          The requested order
          could not be found.
        </p>

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

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin/orders">
          ← Order Management
        </Link>

        <h1>
          Order Details
        </h1>

        <p>
          Order #{orderId}
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadOrder}
        />
      )}

      {/* ====================================================
          SUCCESS
          ==================================================== */}

      {success && (
        <div>

          <strong>
            Success
          </strong>

          <p>
            {success}
          </p>

        </div>
      )}

      {/* ====================================================
          ORDER SUMMARY
          ==================================================== */}

      <div>

        <h2>
          Order Summary
        </h2>

        <p>
          Order ID:{" "}
          {orderId}
        </p>

        <p>
          Date:{" "}
          {formattedDate}
        </p>

        <p>
          Total: ₹
          {total.toLocaleString(
            "en-IN"
          )}
        </p>

      </div>

      {/* ====================================================
          ORDER STATUS
          ==================================================== */}

      <div>

        <h2>
          Order Status
        </h2>

        <p>
          Current Status:{" "}
          {currentStatus}
        </p>

        <label htmlFor="adminOrderStatus">
          Update Status
        </label>

        <select
          id="adminOrderStatus"
          value={
            currentStatus
          }
          disabled={updating}
          onChange={(event) =>
            handleStatusChange(
              event.target.value
            )
          }
        >

          {ORDER_STATUSES.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status
                  .charAt(0)
                  .toUpperCase() +
                  status.slice(1)}
              </option>
            )
          )}

        </select>

        {updating && (
          <p>
            Updating status...
          </p>
        )}

      </div>

      {/* ====================================================
          CUSTOMER
          ==================================================== */}

      <div>

        <h2>
          Customer Information
        </h2>

        <p>
          Name:{" "}
          {customerName}
        </p>

        <p>
          Email:{" "}
          {customerEmail}
        </p>

        <p>
          Phone:{" "}
          {customerPhone}
        </p>

      </div>

      {/* ====================================================
          SHIPPING ADDRESS
          ==================================================== */}

      <div>

        <h2>
          Shipping Address
        </h2>

        {address ? (
          <div>

            <p>
              {address.name ||
                address.fullName ||
                customerName}
            </p>

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
          <p>
            Shipping address
            not available.
          </p>
        )}

      </div>

      {/* ====================================================
          PAYMENT
          ==================================================== */}

      <div>

        <h2>
          Payment
        </h2>

        <p>
          Method:{" "}
          {paymentMethod}
        </p>

        <p>
          Status:{" "}
          {paymentStatus}
        </p>

      </div>

      {/* ====================================================
          ORDER ITEMS
          ==================================================== */}

      <div>

        <h2>
          Order Items
        </h2>

        {items.length ===
        0 ? (
          <p>
            No order items found.
          </p>
        ) : (
          <div>

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
                  >

                    {itemImage && (
                      <img
                        src={
                          itemImage
                        }
                        alt={
                          itemName
                        }
                        style={{
                          width:
                            "100px",
                          height:
                            "80px",
                          objectFit:
                            "contain",
                        }}
                      />
                    )}

                    <h3>
                      {itemName}
                    </h3>

                    <p>
                      Quantity:{" "}
                      {quantity}
                    </p>

                    <p>
                      Unit Price: ₹
                      {itemPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>
                      Item Total: ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* ====================================================
          PRICE BREAKDOWN
          ==================================================== */}

      <div>

        <h2>
          Price Breakdown
        </h2>

        {subtotal > 0 && (
          <p>
            Subtotal: ₹
            {subtotal.toLocaleString(
              "en-IN"
            )}
          </p>
        )}

        {shipping > 0 && (
          <p>
            Shipping: ₹
            {shipping.toLocaleString(
              "en-IN"
            )}
          </p>
        )}

        {tax > 0 && (
          <p>
            Tax: ₹
            {tax.toLocaleString(
              "en-IN"
            )}
          </p>
        )}

        <h3>
          Grand Total: ₹
          {total.toLocaleString(
            "en-IN"
          )}
        </h3>

      </div>

    </section>
  );
}

export default AdminOrderDetailsPage;