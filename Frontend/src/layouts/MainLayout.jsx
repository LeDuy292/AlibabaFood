import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const isAiPage = location.pathname === "/ai-consultant";

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Outlet />
      </main>

      {!isAiPage && <Footer />}
    </div>
  );
};

export default MainLayout;
