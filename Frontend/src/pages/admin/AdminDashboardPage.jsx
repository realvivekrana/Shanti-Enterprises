// ============================================================
// SHANTI ENTERPRISES — AdminDashboardPage
// Professional Admin Dashboard
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdminDashboardStats } from "../../api/adminDashboardApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// HELPERS
// ============================================================

const getNum = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      const number = Number(value);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return 0;
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  to,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--se-border)",
        borderRadius: 16,
        padding: "22px 22px 18px",
        boxShadow: "var(--shadow-sm)",
        borderTop: `4px solid ${accent}`,
        transition: "all .22s",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.boxShadow =
          "var(--shadow-md)";
        event.currentTarget.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow =
          "var(--shadow-sm)";
        event.currentTarget.style.transform = "";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${accent}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon}
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--se-text-4)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
      </div>

      <p
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          color: "var(--se-navy)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </p>

      <p
        style={{
          fontSize: 13,
          color: "var(--se-text-3)",
          marginBottom: to ? 14 : 0,
        }}
      >
        {sub}
      </p>

      {to && (
        <Link
          to={to}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: accent,
          }}
        >
          Manage →
        </Link>
      )}
    </div>
  );
}

// ============================================================
// NAV ITEM
// ============================================================

function NavItem({
  to,
  icon,
  label,
  desc,
}) {
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        borderRadius: 12,
        border: "1px solid var(--se-border)",
        background: "#fff",
        transition: "all .2s",
        textDecoration: "none",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor =
          "var(--se-teal-light)";

        event.currentTarget.style.background =
          "var(--se-teal-soft)";

        event.currentTarget.style.transform =
          "translateX(3px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor =
          "var(--se-border)";

        event.currentTarget.style.background =
          "#fff";

        event.currentTarget.style.transform = "";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 11,
          background: "var(--se-surface-2)",
          border: "1px solid var(--se-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--se-text)",
            marginBottom: 2,
          }}
        >
          {label}
        </p>

        <p
          style={{
            fontSize: 12,
            color: "var(--se-text-3)",
          }}
        >
          {desc}
        </p>
      </div>

      <span
        style={{
          color: "var(--se-text-4)",
        }}
      >
        →
      </span>
    </Link>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  to,
  icon,
  label,
  accent,
}) {
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "18px 14px",
        borderRadius: 14,
        border: "1px solid var(--se-border)",
        background: "#fff",
        transition: "all .2s",
        textDecoration: "none",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor =
          `${accent}60`;

        event.currentTarget.style.background =
          `${accent}08`;

        event.currentTarget.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor =
          "var(--se-border)";

        event.currentTarget.style.background =
          "#fff";

        event.currentTarget.style.transform = "";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--se-text)",
          textAlign: "center",
        }}
      >
        {label}
      </p>
    </Link>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminDashboardStats();

      setStats(
        response?.stats ||
          response?.data?.stats ||
          response?.data ||
          response
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admin dashboard."
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
      <div
        style={{
          padding: "64px 20px",
        }}
      >
        <Loading message="Loading admin dashboard…" />
      </div>
    );
  }

  // ==========================================================
  // STATS
  // ==========================================================

  const totalUsers = getNum(
    stats?.totalUsers,
    stats?.users,
    stats?.userCount
  );

  const totalProducts = getNum(
    stats?.totalProducts,
    stats?.products,
    stats?.productCount
  );

  const totalOrders = getNum(
    stats?.totalOrders,
    stats?.orders,
    stats?.orderCount
  );

  const totalCategories = getNum(
    stats?.totalCategories,
    stats?.categories,
    stats?.categoryCount
  );

  const totalRevenue = getNum(
    stats?.totalRevenue,
    stats?.revenue,
    stats?.sales
  );

  const pendingOrders = getNum(
    stats?.pendingOrders
  );

  const deliveredOrders = getNum(
    stats?.deliveredOrders
  );

  const cancelledOrders = getNum(
    stats?.cancelledOrders
  );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      style={{
        background: "var(--se-bg)",
        minHeight: "calc(100vh - 68px)",
      }}
    >
      {/* ======================================================
          HERO BANNER
          ====================================================== */}

      <div
        style={{
          background:
            "linear-gradient(135deg, var(--se-navy) 0%, #0F2942 100%)",
          padding: "40px 0 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            top: -100,
            right: -60,
            borderRadius: "50%",
            border:
              "1px solid rgba(13,148,136,.15)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            bottom: -60,
            left: "40%",
            borderRadius: "50%",
            background:
              "rgba(13,148,136,.06)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            width: "min(100% - 40px, 1240px)",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background:
                      "var(--se-teal)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  ⚙️
                </div>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      "var(--se-teal-light)",
                    letterSpacing: ".1em",
                    textTransform:
                      "uppercase",
                  }}
                >
                  Administration
                </span>
              </div>

              <h1
                style={{
                  color: "#fff",
                  fontSize:
                    "clamp(1.6rem,2.5vw,2.2rem)",
                  fontWeight: 800,
                  letterSpacing:
                    "-0.03em",
                  marginBottom: 6,
                }}
              >
                Admin Dashboard
              </h1>

              <p
                style={{
                  color: "#94A3B8",
                  fontSize: 15,
                }}
              >
                Manage your Shanti Enterprises
                store from one place.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                style={{
                  height: 40,
                  padding: "0 18px",
                  background:
                    "rgba(255,255,255,.08)",
                  border:
                    "1px solid rgba(255,255,255,.15)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "none",
                  transform: "none",
                }}
              >
                ↻ Refresh
              </button>

              <Link
                to="/admin/products/new"
                style={{
                  height: 40,
                  padding: "0 20px",
                  background:
                    "var(--se-teal)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow:
                    "0 4px 14px rgba(13,148,136,.4)",
                }}
              >
                + Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div
        style={{
          width: "min(100% - 40px, 1240px)",
          margin: "0 auto",
          padding: "32px 0 72px",
        }}
      >
        {/* ====================================================
            ERROR
            ==================================================== */}

        {error && (
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ErrorMessage
              message={error}
              onRetry={loadDashboard}
            />
          </div>
        )}

        {/* ====================================================
            MAIN STATS
            ==================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: 18,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon="👥"
            label="Users"
            value={formatNumber(totalUsers)}
            sub="Registered customers"
            accent="#2563EB"
            to="/admin/users"
          />

          <StatCard
            icon="📦"
            label="Products"
            value={formatNumber(totalProducts)}
            sub="In catalogue"
            accent="#7C3AED"
            to="/admin/products"
          />

          <StatCard
            icon="🛒"
            label="Orders"
            value={formatNumber(totalOrders)}
            sub="Total orders"
            accent="#0891B2"
            to="/admin/orders"
          />

          <StatCard
            icon="🗂️"
            label="Categories"
            value={formatNumber(
              totalCategories
            )}
            sub="Product categories"
            accent="#D97706"
            to="/admin/categories"
          />

          <StatCard
            icon="💰"
            label="Revenue"
            value={formatCurrency(
              totalRevenue
            )}
            sub="Total store revenue"
            accent="#059669"
          />
        </div>

        {/* ====================================================
            LOWER GRID
            ==================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >
          {/* ================================================
              ORDER OVERVIEW
              ================================================ */}

          <div
            style={{
              background: "#fff",
              border:
                "1px solid var(--se-border)",
              borderRadius: 16,
              padding: "22px 24px",
              boxShadow:
                "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color:
                      "var(--se-text-4)",
                    letterSpacing:
                      ".1em",
                    textTransform:
                      "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Order Management
                </p>

                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                  }}
                >
                  Order Overview
                </h2>
              </div>

              <Link
                to="/admin/orders"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color:
                    "var(--se-teal)",
                }}
              >
                View All →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",
                gap: 14,
              }}
            >
              {[
                {
                  label: "Pending",
                  value: pendingOrders,
                  icon: "⏳",
                  bg: "var(--se-warning-bg)",
                  color:
                    "var(--se-warning)",
                  border: "#FDE68A",
                },
                {
                  label: "Delivered",
                  value:
                    deliveredOrders,
                  icon: "✅",
                  bg: "var(--se-success-bg)",
                  color:
                    "var(--se-success)",
                  border: "#A7F3D0",
                },
                {
                  label: "Cancelled",
                  value:
                    cancelledOrders,
                  icon: "❌",
                  bg: "var(--se-danger-bg)",
                  color:
                    "var(--se-danger)",
                  border: "#FECACA",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    textAlign: "center",
                    padding:
                      "16px 12px",
                    borderRadius: 12,
                    background: item.bg,
                    border:
                      `1px solid ${item.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      marginBottom: 8,
                    }}
                  >
                    {item.icon}
                  </div>

                  <p
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color:
                        item.color,
                      letterSpacing:
                        "-0.04em",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {item.value}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        item.color,
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================
              QUICK ACTIONS
              ================================================ */}

          <div
            style={{
              background: "#fff",
              border:
                "1px solid var(--se-border)",
              borderRadius: 16,
              padding: "22px 24px",
              boxShadow:
                "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color:
                    "var(--se-text-4)",
                  letterSpacing:
                    ".1em",
                  textTransform:
                    "uppercase",
                  marginBottom: 4,
                }}
              >
                Shortcuts
              </p>

              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                }}
              >
                Quick Actions
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4,1fr)",
                gap: 10,
              }}
            >
              <QuickAction
                to="/admin/products/new"
                icon="➕"
                label="Add Product"
                accent="#7C3AED"
              />

              <QuickAction
                to="/admin/categories/new"
                icon="🗂️"
                label="Add Category"
                accent="#D97706"
              />

              <QuickAction
                to="/admin/orders"
                icon="🛒"
                label="Orders"
                accent="#0891B2"
              />

              <QuickAction
                to="/admin/users"
                icon="👥"
                label="Users"
                accent="#2563EB"
              />
            </div>
          </div>
        </div>

        {/* ====================================================
            STORE MANAGEMENT
            ==================================================== */}

        <div
          style={{
            background: "#fff",
            border:
              "1px solid var(--se-border)",
            borderRadius: 16,
            padding: "22px 24px",
            boxShadow:
              "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                  "var(--se-text-4)",
                letterSpacing:
                  ".1em",
                textTransform:
                  "uppercase",
                marginBottom: 4,
              }}
            >
              Store Management
            </p>

            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              All Sections
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: 12,
            }}
          >
            <NavItem
              to="/admin/products"
              icon="📦"
              label="Products"
              desc="Add, edit and manage products"
            />

            <NavItem
              to="/admin/categories"
              icon="🗂️"
              label="Categories"
              desc="Organize product categories"
            />

            <NavItem
              to="/admin/orders"
              icon="🛒"
              label="Orders"
              desc="Review and manage customer orders"
            />

            <NavItem
              to="/admin/users"
              icon="👥"
              label="Users"
              desc="Manage registered customers"
            />

            <NavItem
              to="/admin/rfqs"
              icon="📋"
              label="RFQs"
              desc="Handle wholesale quote requests"
            />

            <NavItem
              to="/admin/quotations"
              icon="🧾"
              label="Quotations"
              desc="Manage sent quotations"
            />

            <NavItem
              to="/admin/inventory"
              icon="🏷️"
              label="Inventory"
              desc="Monitor and adjust stock levels"
            />

            <NavItem
              to="/admin/shipments"
              icon="🚚"
              label="Shipments"
              desc="Track and update shipment status"
            />

            <NavItem
              to="/admin/reports"
              icon="📊"
              label="Reports"
              desc="Revenue and analytics reports"
            />

            <NavItem
              to="/admin/analytics"
              icon="📈"
              label="Analytics"
              desc="Sales trends and performance"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          RESPONSIVE
          ====================================================== */}

      <style>
        {`
          @media (max-width: 1050px) {
            div[style*="grid-template-columns: repeat(5,1fr)"] {
              grid-template-columns: repeat(3,1fr) !important;
            }
          }

          @media (max-width: 760px) {
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }

            div[style*="grid-template-columns: repeat(3,1fr)"] {
              grid-template-columns: repeat(2,1fr) !important;
            }

            div[style*="grid-template-columns: repeat(5,1fr)"] {
              grid-template-columns: repeat(2,1fr) !important;
            }
          }

          @media (max-width: 520px) {
            div[style*="grid-template-columns: repeat(2,1fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AdminDashboardPage;