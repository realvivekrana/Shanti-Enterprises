// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard
// Frontend Phase 5 - Admin
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
  getMyOrders,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboardPage() {
  const {
    user,
  } = useAuth();

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

  // ==========================================================
  // LOAD DASHBOARD DATA
  // ==========================================================

  const loadDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * At this stage we are using
         * the existing order API.
         *
         * Later this will be replaced
         * with the dedicated admin
         * dashboard API.
         */

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
          "Admin dashboard error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading admin dashboard..."
      />
    );
  }

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) => {
        const status =
          order.status ||
          order.orderStatus ||
          "pending";

        return (
          String(status)
            .toLowerCase() ===
          "pending"
        );
      }
    ).length;

  const totalRevenue =
    orders.reduce(
      (total, order) => {
        return (
          total +
          Number(
            order.totalAmount ??
              order.total ??
              order.grandTotal ??
              0
          )
        );
      },
      0
    );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Welcome,{" "}
          {user?.name ||
            "Administrator"}
        </p>

        <p>
          Manage your Shanti
          Enterprises store from
          here.
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={
            loadDashboard
          }
        />
      )}

      {/* ====================================================
          STATS
          ==================================================== */}

      <div>

        {/* ORDERS */}

        <div>

          <h2>
            {totalOrders}
          </h2>

          <p>
            Total Orders
          </p>

        </div>

        {/* PENDING */}

        <div>

          <h2>
            {pendingOrders}
          </h2>

          <p>
            Pending Orders
          </p>

        </div>

        {/* REVENUE */}

        <div>

          <h2>
            ₹
            {totalRevenue.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            Order Revenue
          </p>

        </div>

        {/* PRODUCTS */}

        <div>

          <h2>
            —
          </h2>

          <p>
            Total Products
          </p>

        </div>

        {/* USERS */}

        <div>

          <h2>
            —
          </h2>

          <p>
            Total Users
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

          <Link to="/admin/products">
            Manage Products
          </Link>

          <Link to="/admin/categories">
            Manage Categories
          </Link>

          <Link to="/admin/orders">
            Manage Orders
          </Link>

          <Link to="/admin/users">
            Manage Users
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
          <p>
            No orders found.
          </p>
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

    </section>
  );
}

export default AdminDashboardPage;