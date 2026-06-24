import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import "./Login.css";
import logoImg from "../assets/alibaba-logo.png.png";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.body.classList.add("auth-body-active");
    
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "350325390044-6fufn7lrrnvo75elgab42vnafvh54slp.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "360", 
            text: "signin_with",
            shape: "pill"
          }
        );
      }
    };

    return () => {
      document.body.classList.remove("auth-body-active");
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Ignore if already removed
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Đăng nhập thành công!");
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Small delay to let user see the success toast
        setTimeout(() => {
          const user = response.data.data.user || {};
          const userRole =
            user.roleName ||
            user.RoleName ||
            user.role_name ||
            user.role ||
            user.role_id ||
            user.roleId ||
            user.Role ||
            user.RoleId;

          const roleSlug =
            typeof userRole === "string" ? userRole.toLowerCase() : userRole;

          const isSupplierRole =
            roleSlug === "supplier" || roleSlug === 2 || roleSlug === "2";

          const isAdminRole =
            roleSlug === "admin" || roleSlug === 1 || roleSlug === "1";

          if (isSupplierRole) {
            navigate("/supplier");
          } else if (isAdminRole) {
            navigate("/admin"); // You can create admin route later
          } else {
            navigate("/"); // Customer and other roles go to home
          }
        }, 1000);
      } else {
        toast.error(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể kết nối đến máy chủ";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const googleToken = response.credential;
      const apiResponse = await api.post("/auth/google-login", {
        idToken: googleToken,
      });

      if (apiResponse.data.success) {
        toast.success("Đăng nhập bằng Google thành công!");
        localStorage.setItem("token", apiResponse.data.data.token);
        localStorage.setItem("user", JSON.stringify(apiResponse.data.data.user));

        setTimeout(() => {
          const user = apiResponse.data.data.user || {};
          const userRole =
            user.roleName ||
            user.RoleName ||
            user.role_name ||
            user.role ||
            user.role_id ||
            user.roleId ||
            user.Role ||
            user.RoleId;

          const roleSlug =
            typeof userRole === "string" ? userRole.toLowerCase() : userRole;

          const isSupplierRole =
            roleSlug === "supplier" || roleSlug === 2 || roleSlug === "2";

          const isAdminRole =
            roleSlug === "admin" || roleSlug === 1 || roleSlug === "1";

          if (isSupplierRole) {
            navigate("/supplier");
          } else if (isAdminRole) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error(apiResponse.data.message || "Đăng nhập Google thất bại");
      }
    } catch (error) {
      console.error("Google Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể kết nối đến máy chủ";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-fullscreen-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920)`,
      }}
    >
      <div className="glass-blob glass-blob-1"></div>
      <div className="glass-blob glass-blob-2"></div>

      <div className="auth-glass-card">
        <div className="auth-logo-center">
          <Link to="/">
            <img src={logoImg} alt="ALIBABA FOOD" />
          </Link>
        </div>

        <div className="auth-glass-header">
          <h2>Chào mừng trở lại</h2>
          <p>Đăng nhập tài khoản của bạn để tiếp tục đặt hàng</p>
        </div>

        <form className="auth-glass-form" onSubmit={handleSubmit}>
          <div className="form-group-glass">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Địa chỉ Email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-glass">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <div className="form-options-glass">
            <label className="checkbox-glass">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
            <Link to="#" className="forgot-password-glass">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="glass-submit-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            {!loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="btn-arrow"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </form>

        <div className="auth-divider-glass">
          <span>hoặc đăng nhập bằng</span>
        </div>

        <div className="social-login-glass" style={{ display: "flex", justifyContent: "center", minHeight: "44px", marginTop: "1rem" }}>
          <div id="google-signin-btn"></div>
        </div>

        <p className="auth-footer-glass">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
