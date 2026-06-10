import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./SupplierNavbar.css";
import logoImg from "../../assets/Artboard 4.png";

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Trang Chủ" },
  { id: "dashboard", icon: "📊", label: "Bảng Điều Khiển" },
  { id: "post", icon: "➕", label: "Đăng Món" },
  { id: "orders", icon: "🧾", label: "Đơn Hàng" },
  { id: "inventory", icon: "📦", label: "Kho Hàng" },
  { id: "notifications", icon: "🔔", label: "Thông Báo" },
];

/**
 * Shared supplier navigation bar.
 *
 * Props:
 *  activePage         – one of: "home" | "post" | "orders" | "inventory" | "notifications" | "profile"
 *  onNavigate(page)   – navigation callback
 *  onSwitchToCustomer – callback for "← Trang KH" button
 *  notifCount         – unread notification badge count (default 0)
 */
const SupplierNavbar = ({
  activePage = "home",
  onNavigate,
  onSwitchToCustomer,
  notifCount = 0,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (page) => {
    onNavigate?.(page);
    setMobileOpen(false);
  };

  return (
    <nav className="snav">
      <div className="snav-inner">
        {/* Logo */}
        <a
          href="#"
          className="snav-logo"
          onClick={(e) => {
            e.preventDefault();
            handleNav("home");
          }}
        >
          <img src={logoImg} alt="Alibaba Food" />
        </a>

        {/* Nav tabs */}
        <ul className={`snav-tabs ${mobileOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`snav-tab ${activePage === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="snav-tab-icon-wrap">
                  {item.icon}
                  {item.id === "notifications" && notifCount > 0 && (
                    <span className="snav-notif-dot">{notifCount}</span>
                  )}
                </span>
                <span className="snav-tab-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Right: Tôi */}
        <div className="snav-actions">
          <button
            className={`snav-tab ${activePage === "profile" ? "active" : ""}`}
            onClick={() => handleNav("profile")}
          >
            <span className="snav-tab-icon-wrap">👤</span>
            <span className="snav-tab-label">Tôi</span>
          </button>
          <button
            className="snav-tab logout-tab"
            onClick={async () => {
              try {
                await api.post("/Auth/logout");
              } catch (err) {
                // ignore errors from logout API; proceed to clear local state
              }
              try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              } catch (err) {
                console.warn("Could not clear storage on logout:", err);
              }
              toast.success("Đã đăng xuất");
              navigate("/login");
            }}
          >
            <span className="snav-tab-icon-wrap">⇦</span>
            <span className="snav-tab-label">Đăng xuất</span>
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="snav-hamburger"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};

export default SupplierNavbar;
