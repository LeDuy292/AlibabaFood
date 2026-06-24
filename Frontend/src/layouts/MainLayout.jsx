import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingAIChat from "../components/FloatingAIChat";

const MainLayout = () => {
  const location = useLocation();
  const isAiPage = location.pathname === "/ai-consultant";

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Outlet />
      </main>

      {!isAiPage && <FloatingAIChat />}
      {!isAiPage && <Footer />}
    </div>
  );
};

export default MainLayout;
