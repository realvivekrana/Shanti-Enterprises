import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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