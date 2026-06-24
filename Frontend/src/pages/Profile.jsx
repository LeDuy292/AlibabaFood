import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    email: "",
    username: "",
    fullName: "",
    phone: "",
    avatarUrl: "",
    roleName: "",
    createdAt: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("auth/me");
        if (response.data.success && response.data.data) {
          const userData = response.data.data;
          // Normalize backend keys (e.g. RoleName, FullName) to match local state
          const normalizedUser = {
            userId: userData.userId || userData.UserId,
            email: userData.email || userData.Email,
            username: userData.username || userData.Username,
            fullName: userData.fullName || userData.FullName || "",
            phone: userData.phone || userData.Phone || "",
            avatarUrl: userData.avatarUrl || userData.AvatarUrl || "",
            roleName: userData.roleName || userData.RoleName || "Customer",
            createdAt: userData.createdAt || userData.CreatedAt || "",
          };
          setUser(normalizedUser);
          setFormData({
            fullName: normalizedUser.fullName,
            phone: normalizedUser.phone,
            avatarUrl: normalizedUser.avatarUrl,
          });
        } else {
          toast.error("Không thể lấy thông tin người dùng");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("auth/update-profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
      });

      if (response.data.success && response.data.data) {
        toast.success("Cập nhật thông tin thành công!");
        
        // The API returns the updated user info
        const updatedUser = response.data.data;
        const normalizedUser = {
          userId: updatedUser.userId || updatedUser.UserId || user.userId,
          email: updatedUser.email || updatedUser.Email || user.email,
          username: updatedUser.username || updatedUser.Username || user.username,
          fullName: updatedUser.fullName || updatedUser.FullName,
          phone: updatedUser.phone || updatedUser.Phone || "",
          avatarUrl: updatedUser.avatarUrl || updatedUser.AvatarUrl || "",
          roleName: updatedUser.roleName || updatedUser.RoleName || user.roleName,
          createdAt: updatedUser.createdAt || updatedUser.CreatedAt || user.createdAt,
        };

        // Save updated user to localStorage
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setUser(normalizedUser);

        // Dispatch storage event to notify Navbar and other components immediately
        window.dispatchEvent(new Event("storage"));
      } else {
        toast.error(response.data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-spinner"></div>
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  // Get initials for placeholder avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <div className="profile-header-banner"></div>
        
        <div className="profile-avatar-section">
          <div className="profile-avatar-container">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt="Avatar Preview"
                className="profile-avatar-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                }}
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {getInitials(formData.fullName || user.username)}
              </div>
            )}
          </div>
          <h2 className="profile-user-name">{user.fullName || user.username}</h2>
          <span className="profile-role-badge">{user.roleName.toUpperCase()}</span>
        </div>

        <form onSubmit={handleSubmit} className="profile-form-body">
          <div className="profile-form-grid">
            {/* Account Info - Read Only */}
            <div className="profile-section-title">Thông tin tài khoản (Chỉ đọc)</div>
            
            <div className="profile-input-group readonly">
              <label>Email</label>
              <input type="text" value={user.email} readOnly />
            </div>

            <div className="profile-input-group readonly">
              <label>Tên đăng nhập</label>
              <input type="text" value={user.username} readOnly />
            </div>

            <div className="profile-input-group readonly">
              <label>Ngày tham gia</label>
              <input type="text" value={formatDate(user.createdAt)} readOnly />
            </div>

            {/* Profile Info - Editable */}
            <div className="profile-section-title">Thông tin cá nhân</div>

            <div className="profile-input-group">
              <label htmlFor="fullName">Họ và tên <span className="required-star">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="profile-input-group">
              <label htmlFor="avatarUrl">Đường dẫn ảnh đại diện (URL)</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
