// ============================================================
// SHANTI ENTERPRISES
// Main Layout
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Outlet,
} from "react-router-dom";

import {
  Header,
  Footer,
} from "../components/layout";

// ============================================================
// MAIN LAYOUT
// ============================================================

function MainLayout() {
  return (
    <div className="app-layout">

      <Header />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;