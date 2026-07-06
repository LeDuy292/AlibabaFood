import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BarChart3,
  Bell,
  Home,
  LogOut,
  Package,
  PlusCircle,
  ReceiptText,
  UserRound,
} from "lucide-react";
import api from "../../services/api";
import "./SupplierNavbar.css";
import logoImg from "../../assets/Artboard 4.png";

const NAV_ITEMS = [
  { id: "home", Icon: Home, label: "Trang chủ" },
  { id: "dashboard", Icon: BarChart3, label: "Bảng điều khiển" },
  { id: "post", Icon: PlusCircle, label: "Đăng món" },
  { id: "orders", Icon: ReceiptText, label: "Đơn hàng" },
  { id: "inventory", Icon: Package, label: "Kho hàng" },
  { id: "notifications", Icon: Bell, label: "Thông báo" },
];

const SupplierNavbar = ({
  activePage = "home",
  onNavigate,
  notifCount = 0,
}) => {
  const navigate = useNavigate();

  const handleNav = (page) => {
    onNavigate?.(page);
  };

  const handleLogout = async () => {
    try {
      await api.post("/Auth/logout");
    } catch {
      // Continue with local logout when the API is unavailable.
    }
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (err) {
      console.warn("Could not clear storage on logout:", err);
    }
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <nav className="snav">
      <div className="snav-inner">
        <button className="snav-logo" type="button" onClick={() => handleNav("home")}>
          <img src={logoImg} alt="Alibaba Food" />
          <span className="snav-badge">Supplier</span>
        </button>

        <ul className="snav-tabs">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`snav-tab ${activePage === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
                type="button"
              >
                <span className="snav-tab-icon-wrap">
                  {React.createElement(item.Icon, { size: 20, "aria-hidden": "true" })}
                  {item.id === "notifications" && notifCount > 0 && (
                    <span className="snav-notif-dot">{notifCount}</span>
                  )}
                </span>
                <span className="snav-tab-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="snav-actions">
          <button
            className={`snav-tab ${activePage === "profile" ? "active" : ""}`}
            onClick={() => handleNav("profile")}
            type="button"
          >
            <span className="snav-tab-icon-wrap"><UserRound size={20} aria-hidden="true" /></span>
            <span className="snav-tab-label">Tôi</span>
          </button>
          <button className="snav-tab logout-tab" onClick={handleLogout} type="button">
            <span className="snav-tab-icon-wrap"><LogOut size={20} aria-hidden="true" /></span>
            <span className="snav-tab-label">Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SupplierNavbar;

