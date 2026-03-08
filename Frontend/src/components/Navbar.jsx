
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImg from '../assets/alibaba-logo.png.png';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../assets/Artboard 4.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.warn('LocalStorage access blocked or failed:', err);
                setUser(null);
            }
        };

        window.addEventListener('scroll', handleScroll);
        checkUser();

        window.addEventListener('storage', checkUser);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkUser);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            console.warn('Could not clear storage on logout:', err);
        }
        setUser(null);
        setShowDropdown(false);
        toast.success('Đã đăng xuất thành công');
        navigate('/');
    };

    const toggleDropdown = () => {
        if (user) {
            setShowDropdown(!showDropdown);
        } else {
            navigate('/login');
        }
    };

    const isAiPage = location.pathname === '/ai-consultant';

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={logoImg} alt="ALIBABA FOOD Logo" className="navbar-logo-img" style={{ height: '50px', objectFit: 'contain' }} />
                    </Link>
                </div>

                <ul className="navbar-links">
                    <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>HOME</Link></li>
                    <li><Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>MENU</Link></li>
                    <li><Link to="/news" className={location.pathname === '/news' ? 'active' : ''}>NEWS</Link></li>
                    <li><Link to="/ai-consultant" className={location.pathname === '/ai-consultant' ? 'active' : ''}>FOOD CONSULTANT</Link></li>
                    <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>ABOUT US</Link></li>
                </ul>

                <div className="navbar-actions">
                    <div className="search-bar">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>

                    <div className="user-profile-container" ref={dropdownRef}>
                        <button className={`icon-btn user-btn ${user ? 'has-user' : ''}`} onClick={toggleDropdown}>
                            {user && (user.AvatarUrl || user.avatarUrl) ? (
                                <img src={user.AvatarUrl || user.avatarUrl} alt="User Avatar" className="navbar-avatar-img" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                                </svg>
                            )}
                        </button>

                        {showDropdown && user && (
                            <div className="user-dropdown-menu">
                                <div className="dropdown-header">
                                    <p className="user-name">{user.FullName || user.fullName}</p>
                                    <p className="user-email">{user.Email || user.email}</p>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Cập nhật thông tin
                                </Link>
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="icon-btn cart-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
=======
=======
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../assets/Artboard 4.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container container">
        <div className="navbar-logo">
          <a href="#">
            <img
              src={logoImg}
              alt="ALIBABA FOOD Logo"
              className="navbar-logo-img"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </a>
        </div>

        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              className={location.pathname === "/menu" ? "active" : ""}
            >
              MENU
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={location.pathname === "/news" ? "active" : ""}
            >
              NEWS
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className={location.pathname === "/support" ? "active" : ""}
            >
              SUPPORT
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              ABOUT US
            </Link>
          </li>
          <li>
            <Link
              to="/supplier"
              className={
                location.pathname.startsWith("/supplier") ? "active" : ""
              }
            >
              SUPPLIER
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <div className="search-bar">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <button className="icon-btn user-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
            </svg>
          </button>
          <button className="icon-btn cart-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );

};

export default Navbar;
