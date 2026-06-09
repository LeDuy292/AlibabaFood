import React, { useState, useEffect } from "react";
import "./SupplierOrders.css";
import SupplierNavbar from "./SupplierNavbar";

const UNSPLASH = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/* Hero crossfader — restaurant / kitchen scenes */
const HERO_PHOTOS = [
  UNSPLASH("1555396273-367ea4eb4db5", 1200, 600),
  UNSPLASH("1466978913421-dad2ebd01d17", 1200, 600),
  UNSPLASH("1414235077428-338989a2e8c0", 1200, 600),
  UNSPLASH("1504674900247-0877df9cc836", 1200, 600),
];

/* Per-dish food photo */
const FOOD_FALLBACK = UNSPLASH("1504674900247-0877df9cc836");

const SAMPLE_ORDERS = [
  {
    id: "#ORD-6001",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80",
    item: "Coca Cola Original 330ml × 2",
    customer: "Nguyễn Văn A",
    total: "20.000đ",
    status: "pending",
    time: "1 phút trước",
    note: "",
  },
  {
    id: "#ORD-6000",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=600&q=80",
    item: "Pepsi Lon 330ml × 3",
    customer: "Trần Thị B",
    total: "27.000đ",
    status: "confirmed",
    time: "5 phút trước",
    note: "",
  },
  {
    id: "#ORD-5999",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80",
    item: "Mì Hảo Hảo Tôm Chua Cay × 4",
    customer: "Lê Văn C",
    total: "20.000đ",
    status: "preparing",
    time: "12 phút trước",
    note: "Thêm ớt",
  },
  {
    id: "#ORD-5998",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    item: "Sữa Vinamilk 1L × 1",
    customer: "Phạm Thị D",
    total: "38.000đ",
    status: "ready",
    time: "18 phút trước",
    note: "Giao ngoài cửa",
  },
  {
    id: "#ORD-5997",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    item: "Bánh Oreo Socola × 2",
    customer: "Võ Văn E",
    total: "36.000đ",
    status: "delivered",
    time: "35 phút trước",
    note: "",
  },
  {
    id: "#ORD-5996",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    item: "Snack Lay's Khoai Tây × 1",
    customer: "Lý Thị F",
    total: "15.000đ",
    status: "cancelled",
    time: "52 phút trước",
    note: "Khách hủy",
  },
  {
    id: "#ORD-5995",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    item: "Bánh AFC Rau Củ × 1",
    customer: "Bùi Văn G",
    total: "32.000đ",
    status: "delivered",
    time: "1 giờ trước",
    note: "",
  },
  {
    id: "#ORD-5994",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
    item: "Trứng gà hộp 10 quả × 1",
    customer: "Đặng Thị H",
    total: "36.000đ",
    status: "delivered",
    time: "1.5 giờ trước",
    note: "Vui lòng gói gọn",
  },
];

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "delivered"];

const STATUS_META = {
  pending: {
    label: "Chờ duyệt",
    cls: "so-st-pending",
    icon: "⏳",
    next: "Xác nhận đơn",
    color: "#f97316",
  },
  confirmed: {
    label: "Đã xác nhận",
    cls: "so-st-confirmed",
    icon: "✅",
    next: "Bắt đầu chuẩn bị",
    color: "#3b82f6",
  },
  preparing: {
    label: "Đang chuẩn bị",
    cls: "so-st-preparing",
    icon: "👨‍🍳",
    next: "Đã xong",
    color: "#8b5cf6",
  },
  ready: {
    label: "Đã xong",
    cls: "so-st-ready",
    icon: "🔔",
    next: "Đã giao hàng",
    color: "#0ea5e9",
  },
  delivered: {
    label: "Đã giao",
    cls: "so-st-delivered",
    icon: "🎉",
    next: null,
    color: "#134e15",
  },
  cancelled: {
    label: "Đã hủy",
    cls: "so-st-cancelled",
    icon: "❌",
    next: null,
    color: "#dc2626",
  },
};

const FILTERS = [
  "Tất cả",
  "Chờ duyệt",
  "Đã xác nhận",
  "Đang chuẩn bị",
  "Đã xong",
  "Đã giao",
  "Đã hủy",
];

/* Stat card background scenes */
const STAT_BG = [
  UNSPLASH("1504674900247-0877df9cc836", 400, 220),
  UNSPLASH("1546069901-ba9599a7e63c", 400, 220),
  UNSPLASH("1414235077428-338989a2e8c0", 400, 220),
  UNSPLASH("1466978913421-dad2ebd01d17", 400, 220),
];

const SupplierOrders = ({ onNavigate, onSwitchToCustomer }) => {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [heroPhi, setHeroPhi] = useState(0);

  /* Hero crossfader */
  useEffect(() => {
    const t = setInterval(
      () => setHeroPhi((p) => (p + 1) % HERO_PHOTOS.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  /* Scroll-reveal */
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

  const advance = (id) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUS_FLOW.indexOf(o.status);
        return idx < STATUS_FLOW.length - 1
          ? { ...o, status: STATUS_FLOW[idx + 1] }
          : o;
      }),
    );

  const cancel = (id) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)),
    );

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter.toLowerCase();
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = FILTERS.slice(1).reduce((acc, f) => {
    acc[f] = orders.filter((o) => o.status === f.toLowerCase()).length;
    return acc;
  }, {});
  counts["All"] = orders.length;

  const totalRevenue =
    orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + parseInt(o.total.replace(/[^0-9]/g, ""), 10), 0)
      .toLocaleString("vi-VN") + "₫";

  return (
    <div className="so-root">
      <SupplierNavbar
        activePage="orders"
        onNavigate={onNavigate}
        onSwitchToCustomer={onSwitchToCustomer}
      />

      {/* ── Hero ── */}
      <div className="so-hero">
        <div className="so-hero-bg">
          {HERO_PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`so-hero-photo ${i === heroPhi ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="so-hero-overlay" />
        </div>
        <div className="so-hero-content">
          <div className="so-hero-badge">🧾 Quản Lý Đơn Hàng</div>
          <h1 className="so-hero-title">Quản Lý Đơn Hàng</h1>
          <p className="so-hero-sub">
            Theo dõi, cập nhật và quản lý tất cả đơn hàng của khách theo thời gian thực — trên một bảng điều khiển chuyên nghiệp.
          </p>
          <div className="so-hero-chips">
            <span className="so-hero-chip">⚡ Cập Nhật Trực Tiếp</span>
            <span className="so-hero-chip">📊 Toàn Bộ Tiến Trình</span>
            <span className="so-hero-chip">🔔 Thao Tác Nhanh</span>
          </div>
        </div>
        {/* Floating revenue card */}
        <div className="so-hero-revenue-card">
          <div className="so-rev-label">Doanh Thu Hôm Nay</div>
          <div className="so-rev-val">{totalRevenue}</div>
          <div className="so-rev-note">
            <span className="so-rev-dot" /> {counts["Đã giao"] || 0} đơn đã giao
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="so-stats-bar" data-reveal>
        {[
          {
            icon: "⏳",
            label: "Chờ duyệt",
            val: counts["Pending"] || 0,
            cls: "so-sb-pending",
            bg: STAT_BG[0],
          },
          {
            icon: "👨‍🍳",
            label: "Đang chuẩn bị",
            val: counts["Preparing"] || 0,
            cls: "so-sb-preparing",
            bg: STAT_BG[1],
          },
          {
            icon: "🔔",
            label: "Đã xong",
            val: counts["Ready"] || 0,
            cls: "so-sb-ready",
            bg: STAT_BG[2],
          },
          {
            icon: "🎉",
            label: "Đã giao",
            val: counts["Delivered"] || 0,
            cls: "so-sb-delivered",
            bg: STAT_BG[3],
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`so-stat-card ${s.cls}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="so-stat-card-img"
              style={{ backgroundImage: `url(${s.bg})` }}
            />
            <div className="so-stat-card-body">
              <div className="so-sc-icon">{s.icon}</div>
              <div className="so-sc-val">{s.val}</div>
              <div className="so-sc-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="so-controls" data-reveal>
        <div className="so-search-wrap">
          <span className="so-search-icon">🔍</span>
          <input
            className="so-search"
            placeholder="Tìm kiếm mã đơn hàng, khách hàng, hoặc món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="so-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`so-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {counts[f] > 0 && (
                <span className="so-filter-count">{counts[f]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders List ── */}
      <div className="so-list" data-reveal>
        {filtered.length === 0 ? (
          <div className="so-empty">
            <img
              src={UNSPLASH("1493770348161-369560ae357d", 400, 280)}
              alt="không có đơn hàng"
              className="so-empty-img"
            />
            <div className="so-empty-title">Không tìm thấy đơn hàng nào</div>
            <div className="so-empty-sub">
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </div>
          </div>
        ) : (
          filtered.map((order, i) => {
            const meta = STATUS_META[order.status];
            const isExpanded = expanded === order.id;
            return (
              <div
                key={order.id}
                className={`so-row ${isExpanded ? "so-row-open" : ""}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* ── Main Row ── */}
                <div
                  className="so-row-main"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  {/* Food photo */}
                  <div className="so-row-photo-wrap">
                    <img
                      src={order.image || FOOD_FALLBACK}
                      alt={order.item}
                      className="so-row-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FOOD_FALLBACK;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="so-row-info">
                    <span className="so-row-id">{order.id}</span>
                    <span className="so-row-item">{order.item}</span>
                    <span className="so-row-customer">👤 {order.customer}</span>
                  </div>

                  {/* Status + time */}
                  <div className="so-row-mid">
                    <span className={`so-status-badge ${meta.cls}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <span className="so-row-time">🕐 {order.time}</span>
                  </div>

                  {/* Total + toggle */}
                  <div className="so-row-right">
                    <span className="so-row-total">{order.total}</span>
                    <span className="so-expand-icon">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* ── Expanded Detail ── */}
                {isExpanded && (
                  <div className="so-row-detail">
                    {/* Timeline pipeline */}
                    <div className="so-pipeline">
                      {STATUS_FLOW.map((s, si) => {
                        const cur = STATUS_FLOW.indexOf(order.status);
                        const isDone = si < cur;
                        const isCur = si === cur;
                        return (
                          <div
                            key={s}
                            className={`so-pipe-step ${isDone ? "done" : ""} ${isCur ? "current" : ""}`}
                          >
                            <div className="so-pipe-dot" />
                            <div className="so-pipe-label">
                              {STATUS_META[s].label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order note */}
                    {order.note && (
                      <div className="so-note">
                        <span>📝</span>
                        <span>{order.note}</span>
                      </div>
                    )}

                    {/* Item photo strip in detail */}
                    <div className="so-detail-photo-strip">
                      <img
                        src={order.image || FOOD_FALLBACK}
                        alt={order.item}
                        className="so-detail-photo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FOOD_FALLBACK;
                        }}
                      />
                      <div className="so-detail-photo-info">
                        <div className="so-detail-item-name">{order.item}</div>
                        <div className="so-detail-item-customer">
                          Khách hàng: {order.customer}
                        </div>
                        <div className="so-detail-item-total">
                          Tổng cộng: {order.total}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="so-detail-actions">
                      {meta.next && (
                        <button
                          className="so-btn-advance"
                          onClick={() => advance(order.id)}
                        >
                          {meta.icon} {meta.next}
                        </button>
                      )}
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            className="so-btn-cancel"
                            onClick={() => cancel(order.id)}
                          >
                            ❌ Hủy Đơn Hàng
                          </button>
                        )}
                      {(order.status === "cancelled" ||
                        order.status === "delivered") && (
                        <span className="so-final-tag">
                          {order.status === "delivered"
                            ? "✅ Đơn Hàng Hoàn Tất"
                            : "🚫 Đơn Hàng Đã Hủy"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;
