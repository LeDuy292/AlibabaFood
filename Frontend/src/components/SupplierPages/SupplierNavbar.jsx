import React, { useState } from "react";
import "./SupplierNavbar.css";
import logoImg from "../../assets/Artboard 4.png";

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "post", icon: "➕", label: "Post Item" },
  { id: "orders", icon: "🧾", label: "Orders" },
  { id: "inventory", icon: "📦", label: "Inventory" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
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
            <span className="snav-tab-label">Me</span>
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
