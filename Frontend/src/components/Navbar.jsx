import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bot,
  Home,
  Newspaper,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  UsersRound,
  Utensils,
} from "lucide-react";
import "./Navbar.css";
import logoImg from "../assets/alibaba-logo.png.png";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";

const primaryLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/menu", label: "Menu" },
  { to: "/news", label: "Tin tức" },
  { to: "/community", label: "Cộng đồng" },
  { to: "/ai-consultant", label: "Tư vấn món ăn" },
  { to: "/about", label: "Giới thiệu" },
];

const mobileLinks = [
  { to: "/", label: "Trang chủ", Icon: Home },
  { to: "/menu", label: "Menu", Icon: Utensils },
  { to: "/community", label: "Cộng đồng", Icon: UsersRound },
  { to: "/ai-consultant", label: "AI", Icon: Bot },
  { to: "/cart", label: "Giỏ hàng", Icon: ShoppingBag, isCart: true },
];

const isActivePath = (pathname, target) => {
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      setHidden(currentScrollY > lastScrollY && currentScrollY > 120);
      lastScrollY = currentScrollY;
    };

    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (err) {
        console.warn("LocalStorage access blocked or failed:", err);
        setUser(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("storage", checkUser);
    checkUser();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (err) {
      console.warn("Could not clear storage on logout:", err);
    }
    setUser(null);
    setShowDropdown(false);
    toast.success("Đã đăng xuất thành công");
    navigate("/");
  };

  const toggleDropdown = () => {
    if (user) {
      setShowDropdown((value) => !value);
    } else {
      navigate("/login");
    }
  };

  const isDarkPage =
    location.pathname === "/ai-consultant" ||
    location.pathname === "/blind-bag" ||
    location.pathname === "/community";

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${isDarkPage && !scrolled ? "navbar-on-dark" : ""} ${hidden ? "navbar-hidden" : ""}`}
      >
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo" aria-label="AlibabaFood home">
            <img src={logoImg} alt="AlibabaFood" className="navbar-logo-img" />
          </Link>

          <ul className="navbar-links" aria-label="Primary navigation">
            {primaryLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={isActivePath(location.pathname, item.to) ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <label className="search-bar" aria-label="Tìm kiếm món ăn">
              <Search className="search-icon" size={18} aria-hidden="true" />
              <input type="search" placeholder="Tìm kiếm" />
            </label>

            <div className="user-profile-container" ref={dropdownRef}>
              <button
                className={`icon-btn user-btn ${user ? "has-user" : ""} ${user && (user.AvatarUrl || user.avatarUrl) ? "has-avatar" : ""}`}
                onClick={toggleDropdown}
                aria-label={user ? "Mở tài khoản" : "Đăng nhập"}
                aria-expanded={showDropdown}
              >
                {user && (user.AvatarUrl || user.avatarUrl) ? (
                  <img
                    src={user.AvatarUrl || user.avatarUrl}
                    alt="User Avatar"
                    className="navbar-avatar-img"
                  />
                ) : (
                  <UserRound size={22} aria-hidden="true" />
                )}
              </button>

              {showDropdown && user && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-name">{user.FullName || user.fullName}</p>
                    <p className="user-email">{user.Email || user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserRound size={18} aria-hidden="true" />
                    Cập nhật thông tin
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <button
              className="icon-btn cart-btn"
              onClick={() => navigate("/cart")}
              aria-label="Mở giỏ hàng"
            >
              <ShoppingCart size={23} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="cart-count-badge">{totalItems > 9 ? "9+" : totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {mobileLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-bottom-link ${isActivePath(location.pathname, item.to) ? "active" : ""}`}
          >
            <span className="mobile-bottom-icon-wrap">
              {React.createElement(item.Icon, { size: 21, "aria-hidden": "true" })}
              {item.isCart && totalItems > 0 && (
                <span className="mobile-cart-dot">{totalItems > 9 ? "9+" : totalItems}</span>
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;

