// ============================================================
// SHANTI ENTERPRISES
// Admin Analytics Page
// Frontend Phase 5 - Analytics
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminDashboardStats,
  getAdminSalesAnalytics,
} from "../../api/adminDashboardApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// ADMIN ANALYTICS PAGE
// ============================================================

function AdminAnalyticsPage() {
  const [
    stats,
    setStats,
  ] = useState(null);

  const [
    sales,
    setSales,
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
  // LOAD ANALYTICS
  // ==========================================================

  const loadAnalytics =
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResponse,
          salesResponse,
        ] = await Promise.all([
          getAdminDashboardStats(),
          getAdminSalesAnalytics({
            period: "30d",
          }),
        ]);

        const dashboardData =
          dashboardResponse?.stats ||
          dashboardResponse?.data?.stats ||
          dashboardResponse?.data ||
          dashboardResponse;

        let salesData = [];

        if (
          Array.isArray(
            salesResponse
          )
        ) {
          salesData =
            salesResponse;
        } else if (
          Array.isArray(
            salesResponse?.sales
          )
        ) {
          salesData =
            salesResponse.sales;
        } else if (
          Array.isArray(
            salesResponse?.data
          )
        ) {
          salesData =
            salesResponse.data;
        } else if (
          Array.isArray(
            salesResponse?.data?.sales
          )
        ) {
          salesData =
            salesResponse.data.sales;
        }

        setStats(
          dashboardData
        );

        setSales(
          salesData
        );
      } catch (err) {
        console.error(
          "Admin analytics error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading analytics..."
      />
    );
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getNumber = (
    ...values
  ) => {
    for (
      const value of values
    ) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const number =
          Number(value);

        if (
          !Number.isNaN(
            number
          )
        ) {
          return number;
        }
      }
    }

    return 0;
  };

  const totalUsers =
    getNumber(
      stats?.totalUsers,
      stats?.users,
      stats?.userCount
    );

  const totalProducts =
    getNumber(
      stats?.totalProducts,
      stats?.products,
      stats?.productCount
    );

  const totalOrders =
    getNumber(
      stats?.totalOrders,
      stats?.orders,
      stats?.orderCount
    );

  const totalCategories =
    getNumber(
      stats?.totalCategories,
      stats?.categories,
      stats?.categoryCount
    );

  const totalRevenue =
    getNumber(
      stats?.totalRevenue,
      stats?.revenue,
      stats?.sales
    );

  const pendingOrders =
    getNumber(
      stats?.pendingOrders
    );

  const deliveredOrders =
    getNumber(
      stats?.deliveredOrders
    );

  const cancelledOrders =
    getNumber(
      stats?.cancelledOrders
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

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          Analytics
        </h1>

        <p>
          Monitor your store
          performance and sales.
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={
            loadAnalytics
          }
        />
      )}

      {/* ====================================================
          REFRESH
          ==================================================== */}

      <button
        type="button"
        onClick={
          loadAnalytics
        }
      >
        Refresh Analytics
      </button>

      {/* ====================================================
          OVERVIEW
          ==================================================== */}

      <div>

        <article>

          <h2>
            Total Users
          </h2>

          <p>
            {totalUsers.toLocaleString(
              "en-IN"
            )}
          </p>

        </article>

        <article>

          <h2>
            Total Products
          </h2>

          <p>
            {totalProducts.toLocaleString(
              "en-IN"
            )}
          </p>

        </article>

        <article>

          <h2>
            Total Orders
          </h2>

          <p>
            {totalOrders.toLocaleString(
              "en-IN"
            )}
          </p>

        </article>

        <article>

          <h2>
            Categories
          </h2>

          <p>
            {totalCategories.toLocaleString(
              "en-IN"
            )}
          </p>

        </article>

        <article>

          <h2>
            Total Revenue
          </h2>

          <p>
            ₹
            {totalRevenue.toLocaleString(
              "en-IN"
            )}
          </p>

        </article>

      </div>

      {/* ====================================================
          ORDER STATUS
          ==================================================== */}

      <div>

        <h2>
          Order Overview
        </h2>

        <p>
          Pending Orders:{" "}
          {pendingOrders}
        </p>

        <p>
          Delivered Orders:{" "}
          {deliveredOrders}
        </p>

        <p>
          Cancelled Orders:{" "}
          {cancelledOrders}
        </p>

      </div>

      {/* ====================================================
          SALES
          ==================================================== */}

      <div>

        <h2>
          Sales — Last 30 Days
        </h2>

        {sales.length ===
        0 ? (
          <EmptyState
            title="No sales data"
            message="Sales analytics data is not available yet."
          />
        ) : (
          <div>

            {sales.map(
              (
                item,
                index
              ) => {

                const date =
                  item.date ||
                  item.day ||
                  item.label ||
                  `Day ${
                    index + 1
                  }`;

                const amount =
                  getNumber(
                    item.amount,
                    item.revenue,
                    item.sales,
                    item.total
                  );

                const orderCount =
                  getNumber(
                    item.orders,
                    item.orderCount,
                    item.count
                  );

                return (
                  <article
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                  >

                    <h3>
                      {date}
                    </h3>

                    <p>
                      Sales: ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>
                      Orders:{" "}
                      {orderCount}
                    </p>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminAnalyticsPage;