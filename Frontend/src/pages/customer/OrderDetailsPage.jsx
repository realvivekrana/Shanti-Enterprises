// ============================================================
// SHANTI ENTERPRISES
// Order Details Page
// Frontend Phase 4 - Customer
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
  getOrderById,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

import OrderTracking from "../../components/customer/OrderTracking";

// ============================================================
// ORDER DETAILS
// ============================================================

function OrderDetailsPage() {
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
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getOrderById(
          orderId
        );

      const orderData =
        response?.order ||
        response?.data?.order ||
        response?.data ||
        response;

      setOrder(
        orderData
      );
    } catch (err) {
      console.error(
        "Order details error:",
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
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading order..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="app-page">

        <ErrorMessage
          message={error}
          onRetry={loadOrder}
        />

      </section>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!order) {
    return (
      <section className="app-page">

        <EmptyState
          title="Order not found"
          message="The requested order could not be found."
        />

        <Link to="/orders">
          Back to Orders
        </Link>

      </section>
    );
  }

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const status =
    order.status ||
    order.orderStatus ||
    "Pending";

  const paymentStatus =
    order.paymentStatus ||
    "Pending";

  const total =
    Number(
      order.totalAmount ??
        order.total ??
        order.grandTotal ??
        0
    );

  const address =
    order.shippingAddress ||
    order.deliveryAddress ||
    {};

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <Link to="/orders">
        ← Back to My Orders
      </Link>

      <h1>
        Order Details
      </h1>

      <h2>
        Order #
        {order._id ||
          order.id}
      </h2>

      {order.createdAt && (
        <p>
          Ordered on{" "}
          {new Date(
            order.createdAt
          ).toLocaleDateString(
            "en-IN"
          )}
        </p>
      )}

      {/* ====================================================
          STATUS
          ==================================================== */}

      <div>

        <p>
          Order Status
        </p>

        <strong>
          {status}
        </strong>

      </div>

      <div>

        <p>
          Payment Status
        </p>

        <strong>
          {paymentStatus}
        </strong>

      </div>

      <hr />

      {/* ====================================================
          TRACKING
          ==================================================== */}

      <OrderTracking
        order={order}
      />

      <hr />

      {/* ====================================================
          DELIVERY ADDRESS
          ==================================================== */}

      <h2>
        Delivery Address
      </h2>

      {address.name && (
        <p>
          {address.name}
        </p>
      )}

      {address.phone && (
        <p>
          {address.phone}
        </p>
      )}

      {address.address && (
        <p>
          {address.address}
        </p>
      )}

      {(address.city ||
        address.state ||
        address.pincode) && (
        <p>
          {address.city},{" "}
          {address.state} -{" "}
          {address.pincode}
        </p>
      )}

      <hr />

      {/* ====================================================
          PRODUCTS
          ==================================================== */}

      <h2>
        Products
      </h2>

      {items.map(
        (item, index) => {

          const itemPrice =
            Number(
              item.price || 0
            );

          const quantity =
            Number(
              item.quantity || 0
            );

          return (
            <article
              key={
                item._id ||
                item.productId ||
                index
              }
            >

              <h3>
                {item.name ||
                  item.productName ||
                  "Product"}
              </h3>

              <p>
                Price: ₹
                {itemPrice.toLocaleString(
                  "en-IN"
                )}
              </p>

              <p>
                Quantity:{" "}
                {quantity}
              </p>

              <p>
                Total: ₹
                {(
                  itemPrice *
                  quantity
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

            </article>
          );
        }
      )}

      <hr />

      {/* ====================================================
          TOTAL
          ==================================================== */}

      <h2>
        Order Total
      </h2>

      <h2>
        ₹
        {total.toLocaleString(
          "en-IN"
        )}
      </h2>

    </section>
  );
}

export default OrderDetailsPage;