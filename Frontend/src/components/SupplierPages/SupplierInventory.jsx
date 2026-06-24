import React, { useState, useEffect } from "react";
import "./SupplierInventory.css";
import SupplierNavbar from "./SupplierNavbar";
import { INITIAL_ITEMS } from "./supplierInventoryData";
import {
  getSupplierFoodItems,
  updateFoodItem as apiUpdateFoodItem,
  deleteFoodItem as apiDeleteFoodItem,
} from "../../services/supplierService";

const UNSPLASH = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const STORE_PHOTOS = [
  UNSPLASH("1555396273-367ea4eb4db5", 800, 500),
  UNSPLASH("1414235077428-338989a2e8c0", 800, 500),
  UNSPLASH("1466978913421-dad2ebd01d17", 800, 500),
  UNSPLASH("1504674900247-0877df9cc836", 800, 500),
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=80";

const CATEGORIES = [
  "Tất cả",
  "Đồ Uống",
  "Sữa",
  "Bánh Quy",
  "Snack",
  "Bánh",
  "Mì Gói",
  "Đồ Ăn Chín",
  "Bánh mì",
  "Trứng",
  "Trái Cây",
  "Đồ ăn sẵn",
  "Đồ ăn nhanh",
  "Kem",
];

const urgencyClass = (h, qty) => {
  if (qty === 0) return "si-urg-out";
  if (h < 2) return "si-urg-red";
  if (h < 4) return "si-urg-orange";
  return "si-urg-green";
};
const urgencyBarWidth = (h) => {
  const pct = Math.min(100, (h / 12) * 100);
  return `${pct}%`;
};
const fmtExpiry = (h) => {
  if (h < 1) return `Còn ${Math.round(h * 60)} phút`;
  if (h < 24) return `Còn ${h} giờ`;
  return `Còn ${Math.floor(h / 24)} ngày`;
};

const SupplierInventory = ({
  onNavigate,
  onSwitchToCustomer,
  items: itemsProp,
  setItems: setItemsProp,
}) => {
  const [localItems, setLocalItems] = useState(INITIAL_ITEMS);
  const items = itemsProp !== undefined ? itemsProp : localItems;
  const setItems = itemsProp !== undefined ? setItemsProp : setLocalItems;
  const [catFilter, setCatFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch food items from API
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const foodItems = await getSupplierFoodItems();
        if (foodItems && foodItems.length > 0) {
          // Transform API data to match the component's expected format
          const transformedItems = foodItems.map((item) => {
            const qty = item.quantity_available ?? item.quantityAvailable ?? 0;
            const discountPrice =
              item.discounted_price ?? item.discountedPrice ?? 0;
            const expiryValue = item.expiry_time ?? item.expiryTime;
            const imageUrl =
              item.image_url ?? item.imageUrl ?? item.image ?? null;
            const categoryName =
              item.category_name ?? item.categoryName ?? "Khác";
            return {
              id: item.item_id ?? item.itemId,
              name: item.item_name ?? item.itemName ?? "Không tên",
              category: categoryName,
              emoji: "🍽️",
              price: `${Number(discountPrice || 0).toLocaleString()}đ`,
              qty,
              expireH: expiryValue
                ? Math.max(
                    0,
                    Math.floor(
                      (new Date(expiryValue) - new Date()) / (1000 * 60 * 60),
                    ),
                  )
                : 0,
              image: imageUrl,
              isNew: false,
              status: qty > 0 ? "active" : "out",
            };
          });
          setItems(transformedItems);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        // Keep using INITIAL_ITEMS if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [setItems]);

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

  const saveEdit = async (id) => {
    const n = parseInt(editQty, 10);
    if (!isNaN(n) && n >= 0) {
      try {
        // Call API to update food item
        await apiUpdateFoodItem(id, { quantityAvailable: n });
        setItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? { ...it, qty: n, status: n === 0 ? "out" : "active" }
              : it,
          ),
        );
      } catch (error) {
        console.error("Error updating food item:", error);
        // Still update local state even if API fails
        setItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? { ...it, qty: n, status: n === 0 ? "out" : "active" }
              : it,
          ),
        );
      }
    }
    setEditId(null);
    setEditQty("");
  };

  const removeItem = async (id) => {
    try {
      // Call API to delete food item
      await apiDeleteFoodItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (error) {
      console.error("Error deleting food item:", error);
      // Still update local state even if API fails
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const filtered = items.filter((it) => {
    const matchCat = catFilter === "Tất cả" || it.category === catFilter;
    const matchSearch =
      !search || it.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItems = items.length;
  const lowStock = items.filter((i) => i.qty > 0 && i.qty < 5).length;
  const expiringToday = items.filter(
    (i) => i.expireH <= 12 && i.qty > 0,
  ).length;
  const outOfStock = items.filter((i) => i.qty === 0).length;

  return (
    <div className="si-root">
      <SupplierNavbar
        activePage="inventory"
        onNavigate={onNavigate}
        onSwitchToCustomer={onSwitchToCustomer}
      />

      {/* ── Hero Header ── */}
      <div className="si-hero">
        <div className="si-hero-bg">
          {STORE_PHOTOS.map((src, i) => (
            <div
              key={i}
              className="si-hero-photo"
              style={{
                backgroundImage: `url(${src})`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}
          <div className="si-hero-overlay" />
        </div>
        <div className="si-hero-content">
          <div className="si-header-badge">📦 Quản Lý Kho Hàng</div>
          <h1 className="si-page-title">Kho Thực Phẩm Của Bạn</h1>
          <p className="si-page-sub">
            Quản lý tồn kho, theo dõi hạn sử dụng, và giữ thực đơn của bạn luôn
            tươi mới — tất cả ở một nơi.
          </p>
          <button className="si-hero-cta" onClick={() => onNavigate?.("post")}>
            ➕ Thêm Món Mới
          </button>
        </div>
        <div className="si-hero-store-card">
          <img src={STORE_PHOTOS[0]} alt="store" className="si-store-avatar" />
          <div>
            <div className="si-store-name">Green Kitchen</div>
            <div className="si-store-status">
              <span className="si-store-dot" />
              Open Now
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="si-stats-bar" data-reveal>
        {[
          {
            icon: "🍽️",
            label: "Tổng Số Món",
            val: totalItems,
            cls: "si-sb-total",
            bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "⚠️",
            label: "Sắp Hết",
            val: lowStock,
            cls: "si-sb-low",
            bg: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "⏱️",
            label: "Hết Hạn Hôm Nay",
            val: expiringToday,
            cls: "si-sb-expiring",
            bg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "❌",
            label: "Hết Hàng",
            val: outOfStock,
            cls: "si-sb-out",
            bg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=200&q=60",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`si-stat-card ${s.cls}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="si-stat-card-img"
              style={{ backgroundImage: `url(${s.bg})` }}
            />
            <div className="si-stat-card-body">
              <span className="si-sp-icon">{s.icon}</span>
              <div className="si-sp-val">{s.val}</div>
              <div className="si-sp-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="si-controls" data-reveal>
        <div className="si-search-wrap">
          <span className="si-search-icon">🔍</span>
          <input
            className="si-search"
            placeholder="Tìm món ăn theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="si-cat-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`si-cat-btn ${catFilter === c ? "active" : ""}`}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button className="si-add-btn" onClick={() => onNavigate?.("post")}>
          ➕ Thêm Món Mới
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="si-grid" data-reveal>
        {filtered.length === 0 ? (
          <div className="si-empty">
            <img
              src="https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&h=280&q=70"
              alt="empty"
              className="si-empty-img"
            />
            <div className="si-empty-title">Không tìm thấy món nào</div>
            <div className="si-empty-sub">
              Hãy thử từ khóa hoặc bộ lọc khác.
            </div>
            <button
              className="si-add-btn"
              style={{ marginTop: 16 }}
              onClick={() => onNavigate?.("post")}
            >
              ➕ Đăng Món Đầu Tiên
            </button>
          </div>
        ) : (
          <>
            {filtered.map((item, i) => {
              const urg = urgencyClass(item.expireH, item.qty);
              const isEditing = editId === item.id;
              return (
                <div
                  key={item.id}
                  className={`si-card ${urg}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* Photo */}
                  <div className="si-card-photo-wrap">
                    <img
                      src={item.image || FALLBACK_IMG}
                      alt={item.name}
                      className="si-card-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                    {item.isNew && <div className="si-new-badge">✨ MỚI</div>}
                    <div
                      className={`si-card-status-badge ${item.qty === 0 ? "out" : urg}`}
                    >
                      {item.qty === 0
                        ? "Hết hàng"
                        : item.expireH < 2
                          ? "Sắp hết hạn"
                          : "Hiệu lực"}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="si-card-body">
                    <div className="si-card-header-row">
                      <div>
                        <div className="si-card-name">{item.name}</div>
                        <div className="si-card-cat">
                          {item.emoji} {item.category}
                        </div>
                      </div>
                      <div className="si-card-price">{item.price}</div>
                    </div>

                    {/* Expiry bar */}
                    <div className="si-expiry-row">
                      <div className="si-expiry-label-row">
                        <span className="si-expiry-label">
                          {item.qty === 0
                            ? "⛔ Hết hàng"
                            : `⏱ ${fmtExpiry(item.expireH)}`}
                        </span>
                        <span className="si-qty-chip">
                          <span
                            className={`si-qty-dot ${item.qty === 0 ? "zero" : item.qty < 5 ? "low" : "ok"}`}
                          />
                          Còn {item.qty}
                        </span>
                      </div>
                      <div className="si-expiry-bar-bg">
                        <div
                          className="si-expiry-bar-fill"
                          style={{
                            width:
                              item.qty === 0
                                ? "0%"
                                : urgencyBarWidth(item.expireH),
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="si-card-footer">
                      {isEditing ? (
                        <div className="si-qty-edit-row">
                          <input
                            className="si-qty-input"
                            type="number"
                            min="0"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(item.id);
                              if (e.key === "Escape") setEditId(null);
                            }}
                            autoFocus
                          />
                          <button
                            className="si-save-btn"
                            onClick={() => saveEdit(item.id)}
                          >
                            ✓ Lưu
                          </button>
                          <button
                            className="si-cancel-btn"
                            onClick={() => setEditId(null)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="si-edit-btn"
                          onClick={() => {
                            setEditId(item.id);
                            setEditQty(String(item.qty));
                          }}
                        >
                          ✏️ Sửa SL
                        </button>
                      )}
                      <button
                        className="si-del-btn"
                        onClick={() => removeItem(item.id)}
                        title="Xóa món"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="si-add-card" onClick={() => onNavigate?.("post")}>
              <div
                className="si-add-card-bg"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&h=400&q=70)`,
                }}
              />
              <div className="si-add-card-overlay" />
              <div className="si-add-card-body">
                <div className="si-add-card-icon">➕</div>
                <div className="si-add-card-title">Thêm Món Mới</div>
                <div className="si-add-card-sub">
                  Đăng món mới và tiếp cận 50,000+ khách hàng
                </div>
                <span className="si-add-card-btn">Đăng ngay →</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierInventory;
