// ============================================================
// SHANTI ENTERPRISES
// Customer Dashboard
// Frontend Phase 4 - Customer
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  getMyOrders,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

function CustomerDashboardPage() {
  const {
    user,
  } = useAuth();

  const {
    totalItems,
    subtotal,
  } = useCart();

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMyOrders();

      const orderList =
        response?.orders ||
        response?.data?.orders ||
        response?.data ||
        [];

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard orders error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <Loading
        message="Loading dashboard..."
      />
    );
  }

  return (
    <section className="app-page">

      <div>

        <h1>
          Welcome,{" "}
          {user?.name ||
            "Customer"}
        </h1>

        <p>
          Manage your account,
          orders and shopping from
          one place.
        </p>

      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadOrders}
        />
      )}

      {/* ====================================================
          STATS
          ==================================================== */}

      <div>

        <div>
          <h2>
            {orders.length}
          </h2>

          <p>
            Total Orders
          </p>
        </div>

        <div>
          <h2>
            {totalItems}
          </h2>

          <p>
            Cart Items
          </p>
        </div>

        <div>
          <h2>
            ₹
            {subtotal.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            Cart Value
          </p>
        </div>

      </div>

      {/* ====================================================
          QUICK ACTIONS
          ==================================================== */}

      <div>

        <h2>
          Quick Actions
        </h2>

        <div>

          <Link to="/products">
            Browse Products
          </Link>

          <Link to="/cart">
            View Cart
          </Link>

          <Link to="/orders">
            My Orders
          </Link>

          <Link to="/profile">
            My Profile
          </Link>

          <Link to="/addresses">
            Saved Addresses
          </Link>

        </div>

      </div>

      {/* ====================================================
          RECENT ORDERS
          ==================================================== */}

      <div>

        <h2>
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <div>

            <p>
              You have not placed
              any orders yet.
            </p>

            <Link to="/products">
              Start Shopping
            </Link>

          </div>
        ) : (
          orders
            .slice(0, 5)
            .map(
              (order) => {
                const orderId =
                  order._id ||
                  order.id;

                const status =
                  order.status ||
                  order.orderStatus ||
                  "Pending";

                const total =
                  Number(
                    order.totalAmount ??
                      order.total ??
                      order.grandTotal ??
                      0
                  );

                return (
                  <article
                    key={orderId}
                  >

                    <h3>
                      Order #
                      {orderId}
                    </h3>

                    <p>
                      Status:{" "}
                      <strong>
                        {status}
                      </strong>
                    </p>

                    <p>
                      Total: ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <Link
                      to={`/orders/${orderId}`}
                    >
                      View Order
                    </Link>

                  </article>
                );
              }
            )
        )}

      </div>

      {/* ====================================================
          ACCOUNT
          ==================================================== */}

      <div>

        <h2>
          Account
        </h2>

        <p>
          Name:{" "}
          {user?.name || "-"}
        </p>

        <p>
          Email:{" "}
          {user?.email || "-"}
        </p>

        <p>
          Phone:{" "}
          {user?.phone || "-"}
        </p>

        <Link to="/profile">
          Manage Profile
        </Link>

      </div>

    </section>
  );
}

export default CustomerDashboardPage;