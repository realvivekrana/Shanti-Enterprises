// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Layout (Sidebar + Content)
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

import AdminSidebar from "../components/layout/AdminSidebar";

import "../components/layout/DashboardSidebar.css";

// ============================================================
// ADMIN DASHBOARD LAYOUT
// ============================================================

function AdminDashboardLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="dash-layout">

      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <AdminSidebar
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
            Admin Panel
          </span>

        </div>

        <Outlet />

      </div>

    </div>
  );
}

export default AdminDashboardLayout;