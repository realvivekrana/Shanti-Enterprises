// ============================================================
// SHANTI ENTERPRISES
// Customer Dashboard Sidebar
// Mobile First • Premium Responsive UI
// ============================================================

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Repeat,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import "./DashboardSidebar.css";

// ============================================================
// NAV ITEMS
// ============================================================

const CUSTOMER_NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/orders",
    label: "My Orders",
    icon: ShoppingBag,
  },
  {
    to: "/rfqs",
    label: "My RFQs",
    icon: ClipboardList,
  },
  {
    to: "/quotations",
    label: "Quotations",
    icon: FileText,
  },
  {
    to: "/bulk-quotes",
    label: "Bulk Quotes",
    icon: Package,
  },
  {
    to: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    to: "/shipments",
    label: "Track Shipments",
    icon: Truck,
  },
  {
    to: "/returns",
    label: "Returns",
    icon: Repeat,
  },
  {
    to: "/invoices",
    label: "Invoices",
    icon: FileText,
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    to: "/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
];

// ============================================================
// CUSTOMER SIDEBAR
// ============================================================

function CustomerSidebar({
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
        className={`dash-sidebar ${isOpen ? "dash-sidebar-open" : ""}`}
        aria-label="Customer dashboard navigation"
      >

        {/* HEADER */}

        <div className="dash-sidebar-header">

          <div className="dash-sidebar-user">

            <div className="dash-sidebar-avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="dash-sidebar-user-info">
              <strong>{user?.name || "Customer"}</strong>
              <span>{user?.email || "Welcome back"}</span>
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

        <nav className="dash-sidebar-nav" aria-label="Customer navigation">

          {CUSTOMER_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
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

export default CustomerSidebar;