import React, { useState, useRef, useEffect } from "react";
import "./SupplierPost.css";
import SupplierNavbar from "./SupplierNavbar";

const CATEGORIES = [
  "🍱 Cơm",
  "🍜 Mì & Phở",
  "🥗 Salad & Đồ ăn tốt cho sức khỏe",
  "🥐 Bánh Mì & Bánh Ngọt",
  "🧋 Đồ Uống & Tráng Miệng",
  "🍣 Sushi & Đồ Nhật",
  "🌮 Đồ Ăn Nhanh",
  "🍛 Cà Ri & Món Hầm",
  "🥩 BBQ & Đồ Nướng",
  "🍰 Bánh Kem & Kẹo Ngọt",
];

const INSPIRATION_PHOTOS = [
  { image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=320&h=200&q=80", label: "Coca Cola 330ml" },
  { image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=320&h=200&q=80", label: "Pepsi 330ml" },
  { image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=320&h=200&q=80", label: "Sữa Vinamilk 1L" },
  { image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=320&h=200&q=80", label: "Bánh Oreo" },
  { image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=320&h=200&q=80", label: "Snack Lay's" },
  { image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=320&h=200&q=80", label: "Mì Hảo Hảo" },
];

const RippleBtn = ({
  children,
  className = "",
  onClick,
  style,
  type = "button",
}) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const wave = document.createElement("span");
    wave.classList.add("sp-ripple-wave");
    wave.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
    onClick && onClick(e);
  };
  return (
    <button
      ref={ref}
      type={type}
      className={`sp-ripple-btn ${className}`}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  );
};

const SupplierPost = ({ onNavigate, onSwitchToCustomer, onAddItem }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    quantity: "",
    expiryHours: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.06 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((f) => ({ ...f, image: file.name }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập tên món.";
    if (!form.category) errs.category = "Vui lòng chọn danh mục.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Nhập giá bán hợp lệ.";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 1)
      errs.quantity = "Nhập số lượng hợp lệ.";
    if (
      !form.expiryHours ||
      isNaN(form.expiryHours) ||
      Number(form.expiryHours) <= 0
    )
      errs.expiryHours = "Nhập thời gian hết hạn hợp lệ.";
    return errs;
  };

  const getCategoryEmoji = (cat) => (cat ? cat.trim().split(" ")[0] : "🍽️");
  const getCategoryShort = (cat) => (cat ? cat.replace(/^[^\s]+\s/, "") : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (onAddItem) {
      onAddItem({
        id: Date.now(),
        emoji: getCategoryEmoji(form.category),
        image: preview || null,
        name: form.name,
        category: getCategoryShort(form.category),
        qty: Number(form.quantity),
        price: `${Number(form.price).toLocaleString()}₫`,
        expireH: Number(form.expiryHours),
        status: Number(form.quantity) > 0 ? "active" : "out",
        isNew: true,
      });
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      quantity: "",
      expiryHours: "",
      description: "",
      image: "",
    });
    setPreview(null);
    setErrors({});
    setSubmitted(false);
  };

  const discount =
    form.price &&
    form.originalPrice &&
    Number(form.originalPrice) > Number(form.price)
      ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
      : null;

  return (
    <div className="sp-root">
      <SupplierNavbar
        activePage="post"
        onNavigate={onNavigate}
        onSwitchToCustomer={onSwitchToCustomer}
      />

      {/* ── Page Header ── */}
      <div className="sp-page-header">
        {/* Background image collage */}
        <div className="sp-header-bg">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="sp-header-bg-img"
          />
          <div className="sp-header-bg-overlay" />
        </div>
        <div className="sp-header-inner">
          <div className="sp-header-badge">➕ Thêm Món Mới</div>
          <h1 className="sp-page-title">Đăng Món Mới</h1>
          <p className="sp-page-sub">
            Chỉ mất <strong>60 giây</strong> — món của bạn sẽ tiếp cận{" "}
            <strong>50,000+</strong> khách hàng ngay lập tức.
          </p>
          {/* Quick stats row */}
          <div className="sp-header-stats">
            <div className="sp-hstat">
              <span className="sp-hstat-val">60s</span>
              <span className="sp-hstat-l">Để đăng 1 món</span>
            </div>
            <div className="sp-hstat-div" />
            <div className="sp-hstat">
              <span className="sp-hstat-val">50k+</span>
              <span className="sp-hstat-l">Khách hàng</span>
            </div>
            <div className="sp-hstat-div" />
            <div className="sp-hstat">
              <span className="sp-hstat-val">Miễn phí</span>
              <span className="sp-hstat-l">Không hoa hồng</span>
            </div>
          </div>
        </div>
        <div className="sp-header-orb sp-orb-1" />
        <div className="sp-header-orb sp-orb-2" />
      </div>

      {/* ── Inspiration Photo Strip ── */}
      <div className="sp-insp-strip">
        {INSPIRATION_PHOTOS.map((p, i) => (
          <div key={i} className="sp-insp-item">
            <img src={p.image} alt={p.label} loading="lazy" />
            <div className="sp-insp-overlay">
              <span className="sp-insp-label">{p.label}</span>
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        /* ── Success Screen ── */
        <div className="sp-success-wrap" data-reveal>
          <div className="sp-success-card">
            {/* Success background image */}
            <div className="sp-success-bg">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&h=400&q=80"
                alt=""
              />
              <div className="sp-success-bg-overlay" />
            </div>
            <div className="sp-success-body">
                  <div className="sp-success-icon">🎉</div>
                  <h2 className="sp-success-title">Đăng món thành công!</h2>
                  <p className="sp-success-sub">
                    <strong>{form.name}</strong> đã được đăng và hiển thị cho khách hàng.
                  </p>
                  <div className="sp-success-meta">
                    <span>📦 {form.quantity} phần</span>
                    <span>💰 {Number(form.price).toLocaleString()}₫</span>
                    <span>⏱ {form.expiryHours} giờ</span>
                  </div>
                  <div className="sp-success-btns">
                    <RippleBtn
                      className="sp-btn-primary"
                      onClick={() => onNavigate?.("inventory")}
                    >
                      📦 Xem trong Kho
                    </RippleBtn>
                    <RippleBtn className="sp-btn-ghost" onClick={resetForm}>
                      ➕ Đăng món mới
                    </RippleBtn>
                    <RippleBtn
                      className="sp-btn-ghost"
                      onClick={() => onNavigate?.("home")}
                    >
                      🏠 Về Trang Chủ
                    </RippleBtn>
                  </div>
                </div>
          </div>
        </div>
      ) : (
        <div className="sp-layout">
          {/* ── Form ── */}
          <form className="sp-form" onSubmit={handleSubmit} noValidate>
            {/* Basic Info */}
            <div className="sp-form-section" data-reveal>
                <div className="sp-section-img">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=200&q=70"
                  alt=""
                />
                <div className="sp-section-img-overlay">
                  <h3 className="sp-section-title sp-section-title-light">
                    📝 Thông tin cơ bản
                  </h3>
                </div>
              </div>
              <div className="sp-section-body">
                <div className="sp-field">
                  <label className="sp-label">
                    Tên sản phẩm <span className="sp-req">*</span>
                  </label>
                  <input
                    className={`sp-input ${errors.name ? "sp-input-err" : ""}`}
                    placeholder="Ví dụ: Hộp Cơm Thịt Giòn"
                    value={form.name}
                    onChange={set("name")}
                    maxLength={80}
                  />
                  {errors.name && (
                    <span className="sp-err-msg">{errors.name}</span>
                  )}
                </div>

                <div className="sp-field">
                  <label className="sp-label">
                    Danh mục <span className="sp-req">*</span>
                  </label>
                  <select
                    className={`sp-select ${errors.category ? "sp-input-err" : ""}`}
                    value={form.category}
                    onChange={set("category")}
                  >
                    <option value="">— Chọn danh mục —</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="sp-err-msg">{errors.category}</span>
                  )}
                </div>

                <div className="sp-field">
                  <label className="sp-label">Mô tả</label>
                  <textarea
                    className="sp-textarea"
                    placeholder="Mô tả ngắn — thành phần, khẩu phần, hương vị..."
                    rows={4}
                    value={form.description}
                    onChange={set("description")}
                    maxLength={300}
                  />
                  <span className="sp-char-count">
                    {form.description.length}/300
                  </span>
                </div>
              </div>
              {/* end sp-section-body */}
            </div>

            {/* Pricing */}
            <div className="sp-form-section" data-reveal>
                <div className="sp-section-img">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&h=200&q=70"
                  alt=""
                />
                <div className="sp-section-img-overlay">
                  <h3 className="sp-section-title sp-section-title-light">
                    💰 Giá bán
                  </h3>
                </div>
              </div>
              <div className="sp-section-body">
                <div className="sp-row-2">
                  <div className="sp-field">
                    <label className="sp-label">
                      Giá bán (₫) <span className="sp-req">*</span>
                    </label>
                    <input
                      className={`sp-input ${errors.price ? "sp-input-err" : ""}`}
                      type="number"
                      placeholder="e.g. 25000"
                      value={form.price}
                      onChange={set("price")}
                      min={0}
                    />
                    {errors.price && (
                      <span className="sp-err-msg">{errors.price}</span>
                    )}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">
                      Giá gốc (₫) <span className="sp-opt">(tùy chọn)</span>
                    </label>
                    <input
                      className="sp-input"
                      type="number"
                      placeholder="e.g. 45000"
                      value={form.originalPrice}
                      onChange={set("originalPrice")}
                      min={0}
                    />
                  </div>
                </div>
                {discount !== null && (
                  <div className="sp-discount-badge">
                    🔥 Giảm {discount}% — ưu đãi hấp dẫn!
                  </div>
                )}
              </div>
              {/* end sp-section-body */}
            </div>

            {/* Supply & Timing */}
            <div className="sp-form-section" data-reveal>
                <div className="sp-section-img">
                <img
                  src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&h=200&q=70"
                  alt=""
                />
                <div className="sp-section-img-overlay">
                  <h3 className="sp-section-title sp-section-title-light">
                    📦 Số lượng & Thời gian
                  </h3>
                </div>
              </div>
              <div className="sp-section-body">
                <div className="sp-row-2">
                  <div className="sp-field">
                    <label className="sp-label">
                      Số phần có sẵn <span className="sp-req">*</span>
                    </label>
                    <input
                      className={`sp-input ${errors.quantity ? "sp-input-err" : ""}`}
                      type="number"
                      placeholder="e.g. 10"
                      value={form.quantity}
                      onChange={set("quantity")}
                      min={1}
                    />
                    {errors.quantity && (
                      <span className="sp-err-msg">{errors.quantity}</span>
                    )}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">
                      Thời gian đến khi hết (giờ) <span className="sp-req">*</span>
                    </label>
                    <input
                      className={`sp-input ${errors.expiryHours ? "sp-input-err" : ""}`}
                      type="number"
                      placeholder="e.g. 3.5"
                      value={form.expiryHours}
                      onChange={set("expiryHours")}
                      min={0.5}
                      step={0.5}
                    />
                    {errors.expiryHours && (
                      <span className="sp-err-msg">{errors.expiryHours}</span>
                    )}
                  </div>
                </div>
              </div>
              {/* end sp-section-body */}
            </div>

            {/* Photo Upload */}
            <div className="sp-form-section" data-reveal>
                <div className="sp-section-img">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&h=200&q=70"
                  alt=""
                />
                <div className="sp-section-img-overlay">
                  <h3 className="sp-section-title sp-section-title-light">
                    📷 Ảnh sản phẩm
                  </h3>
                </div>
              </div>
              <div className="sp-section-body">
                <div
                  className="sp-upload-zone"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith("image/")) {
                      setPreview(URL.createObjectURL(file));
                      setForm((f) => ({ ...f, image: file.name }));
                    }
                  }}
                >
                      {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="sp-upload-preview"
                    />
                  ) : (
                    <div className="sp-upload-placeholder">
                      <span className="sp-upload-icon">📤</span>
                      <span className="sp-upload-text">
                        Nhấp hoặc kéo thả ảnh
                      </span>
                      <span className="sp-upload-hint">
                        JPG, PNG tối đa 5 MB
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sp-file-hidden"
                  onChange={handleImageChange}
                />
                {preview && (
                  <button
                    type="button"
                    className="sp-remove-img"
                    onClick={() => {
                      setPreview(null);
                      setForm((f) => ({ ...f, image: "" }));
                    }}
                  >
                    ✕ Xóa ảnh
                  </button>
                )}
                {/* Sample food photos to inspire */}
                {!preview && (
                  <div className="sp-photo-hints">
                    <p className="sp-photo-hint-label">💡 Photo inspiration:</p>
                    <div className="sp-photo-hint-row">
                      {[
                        "photo-1512058564366-18510be2db19",
                        "photo-1567620905732-2d1ec7ab7445",
                        "photo-1540189549336-e6e99c3679fe",
                      ].map((id, i) => (
                        <img
                          key={i}
                          src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=160&h=110&q=70`}
                          alt=""
                          className="sp-photo-hint-img"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* end sp-section-body */}
            </div>

            {/* Submit */}
              <div className="sp-form-actions" data-reveal>
              <RippleBtn type="submit" className="sp-btn-primary sp-btn-submit">
                🚀 Đăng món
              </RippleBtn>
              <RippleBtn
                type="button"
                className="sp-btn-ghost"
                onClick={resetForm}
              >
                🔄 Đặt lại
              </RippleBtn>
            </div>
          </form>

          {/* ── Live Preview ── */}
          <aside className="sp-preview-panel">
            <div className="sp-preview-header">
              <div className="sp-preview-header-icon">👁</div>
              <div>
                <h3 className="sp-preview-title">Live Preview</h3>
                <p className="sp-preview-subtitle">What customers see</p>
              </div>
            </div>

            <div className="sp-preview-card">
              <div className="sp-preview-img-wrap">
                {preview ? (
                  <img src={preview} alt="preview" className="sp-preview-img" />
                ) : (
                  <div className="sp-preview-img-placeholder">
                    <img
                      src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&h=220&q=70"
                      alt="placeholder"
                      className="sp-preview-placeholder-img"
                    />
                    <div className="sp-preview-placeholder-label">
                      📷 Your photo will appear here
                    </div>
                  </div>
                )}
                {discount !== null && (
                  <span className="sp-preview-badge">-{discount}%</span>
                )}
                {form.expiryHours && (
                  <span className="sp-preview-countdown">
                    ⏱ {form.expiryHours}h left
                  </span>
                )}
                {/* Store chip */}
                <span className="sp-preview-store">🏪 Green Kitchen</span>
              </div>
              <div className="sp-preview-body">
                <h4 className="sp-preview-name">
                  {form.name || (
                    <span className="sp-preview-placeholder-text">
                      Item name will appear here
                    </span>
                  )}
                </h4>
                {form.category && (
                  <div className="sp-preview-category">{form.category}</div>
                )}
                {form.description && (
                  <p className="sp-preview-desc">
                    {form.description.slice(0, 100)}
                    {form.description.length > 100 ? "…" : ""}
                  </p>
                )}
                <div className="sp-preview-footer">
                  <div className="sp-preview-price-row">
                    {form.price && (
                      <span className="sp-preview-price">
                        {Number(form.price || 0).toLocaleString()}₫
                      </span>
                    )}
                    {form.originalPrice &&
                      Number(form.originalPrice) > Number(form.price) && (
                        <span className="sp-preview-original">
                          {Number(form.originalPrice).toLocaleString()}₫
                        </span>
                      )}
                  </div>
                  {form.quantity && (
                    <span className="sp-preview-qty">
                      📦 {form.quantity} left
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live store card */}
            <div className="sp-store-card">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=200&q=70"
                alt="Store"
                className="sp-store-card-bg"
              />
              <div className="sp-store-card-overlay" />
              <div className="sp-store-card-body">
                <div className="sp-store-avatar">🏪</div>
                <div>
                  <div className="sp-store-name">Green Kitchen</div>
                  <div className="sp-store-meta">
                    ⭐ 4.9 &nbsp;·&nbsp; 234 reviews &nbsp;·&nbsp;{" "}
                    <span className="sp-store-open">● Open Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="sp-tips">
              <h4 className="sp-tips-title">💡 Tips for Better Sales</h4>
              <ul className="sp-tips-list">
                <li>
                  📸 Clear, well-lit photos increase orders by 3× vs. no photo.
                </li>
                <li>⏱ Set a realistic expiry — customers trust accuracy.</li>
                <li>
                  🔥 Even 20% off creates urgency and drives instant purchases.
                </li>
                <li>
                  ✍️ Keep descriptions short and appetizing — focus on flavor.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default SupplierPost;
