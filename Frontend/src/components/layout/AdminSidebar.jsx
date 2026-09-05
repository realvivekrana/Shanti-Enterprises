// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Sidebar
// Mobile First • Premium Responsive UI
// ============================================================

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import "./DashboardSidebar.css";

// ============================================================
// NAV ITEMS
// ============================================================

const ADMIN_NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: Grid2X2,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    to: "/admin/rfqs",
    label: "RFQs",
    icon: ClipboardList,
  },
  {
    to: "/admin/quotations",
    label: "Quotations",
    icon: FileText,
  },
  {
    to: "/admin/inventory",
    label: "Inventory",
    icon: Boxes,
  },
  {
    to: "/admin/shipments",
    label: "Shipments",
    icon: Truck,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: FileText,
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: User,
  },
];

// ============================================================
// ADMIN SIDEBAR
// ============================================================

function AdminSidebar({
  isOpen,
  onClose,
}) {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {
      onClose?.();
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
  };

  // ==========================================================
  // NAV LINK CLASS
  // ==========================================================

  const getLinkClass = ({ isActive }) =>
    `dash-sidebar-link ${isActive ? "dash-sidebar-link-active" : ""}`;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>
      {/* OVERLAY (MOBILE) */}

      {isOpen && (
        <div
          className="dash-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dash-sidebar dash-sidebar-admin ${isOpen ? "dash-sidebar-open" : ""}`}
        aria-label="Admin dashboard navigation"
      >

        {/* HEADER */}

        <div className="dash-sidebar-header">

          <div className="dash-sidebar-user">

            <div className="dash-sidebar-avatar dash-sidebar-avatar-admin">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="dash-sidebar-user-info">
              <strong>{user?.name || "Admin"}</strong>
              <span>{user?.email || "Administrator"}</span>
            </div>

          </div>

          <button
            type="button"
            className="dash-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAV */}

        <nav className="dash-sidebar-nav" aria-label="Admin navigation">

          {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={getLinkClass}
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}

        </nav>

        {/* FOOTER */}

        <div className="dash-sidebar-footer">
          <button
            type="button"
            className="dash-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;