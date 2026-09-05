// ============================================================
// SHANTI ENTERPRISES
// Customer Dashboard Layout (Sidebar + Content)
// Mobile First • Premium Responsive UI
// ============================================================

import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import {
  Menu,
} from "lucide-react";

import CustomerSidebar from "../components/layout/CustomerSidebar";

import "../components/layout/DashboardSidebar.css";

// ============================================================
// CUSTOMER DASHBOARD LAYOUT
// ============================================================

function CustomerDashboardLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="dash-layout">

      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ==================================================
          CONTENT
          ================================================== */}

      <div className="dash-layout-content">

        {/* MOBILE TOPBAR */}

        <div className="dash-layout-topbar">

          <button
            type="button"
            className="dash-layout-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <span className="dash-layout-topbar-title">
            My Account
          </span>

        </div>

        <Outlet />

      </div>

    </div>
  );
}

export default CustomerDashboardLayout;