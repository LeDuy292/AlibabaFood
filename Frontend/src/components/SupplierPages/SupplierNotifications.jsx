import React, { useState, useEffect } from "react";
import "./SupplierNotifications.css";
import SupplierNavbar from "./SupplierNavbar";

const UNSPLASH = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/* Hero crossfading background photos */
const HERO_PHOTOS = [
  UNSPLASH("1555396273-367ea4eb4db5", 1200, 550),
  UNSPLASH("1414235077428-338989a2e8c0", 1200, 550),
  UNSPLASH("1466978913421-dad2ebd01d17", 1200, 550),
  UNSPLASH("1504674900247-0877df9cc836", 1200, 550),
];

/* Small thumbnail per notification type */
const TYPE_IMG = {
  order: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=200&h=140&q=80",
  review: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&h=140&q=80",
  warning: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=200&h=140&q=80",
  system: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&h=140&q=80",
};

const INITIAL_NOTIFS = [
  /* HÔM NAY */
  {
    id: 1,
    group: "Hôm nay",
    type: "review",
    icon: "⭐",
    title: "Đánh giá mới",
    body: "Nguyễn Văn A đã để lại đánh giá 5 sao cho Coca Cola của bạn.",
    time: "2 phút trước",
    read: false,
  },
  {
    id: 2,
    group: "Hôm nay",
    type: "order",
    icon: "🧾",
    title: "Đơn hàng mới",
    body: "Đơn hàng #ORD-6001 — Coca Cola Original 330ml × 2 từ Phạm Thị B.",
    time: "5 phút trước",
    read: false,
  },
  {
    id: 3,
    group: "Hôm nay",
    type: "warning",
    icon: "⚠️",
    title: "Sản phẩm sắp hết hạn",
    body: "Mì Hảo Hảo Tôm Chua Cay có hạn sử dụng ngắn, cân nhắc giảm giá.",
    time: "18 phút trước",
    read: false,
  },
  {
    id: 4,
    group: "Hôm nay",
    type: "order",
    icon: "✅",
    title: "Đơn #ORD-5998 đã sẵn sàng",
    body: "Sữa Vinamilk 1L × 1 của Trần Văn C đã sẵn sàng để giao.",
    time: "22 phút trước",
    read: true,
  },
  {
    id: 5,
    group: "Hôm nay",
    type: "system",
    icon: "🔔",
    title: "Bảo trì hệ thống",
    body: "Bảo trì định kỳ 02:00–03:00. Vui lòng lưu ý cập nhật giờ giao hàng.",
    time: "1 giờ trước",
    read: true,
  },
  {
    id: 6,
    group: "Hôm nay",
    type: "review",
    icon: "💬",
    title: "Cần trả lời đánh giá",
    body: "Lê Thị D đã bình luận về Bánh Oreo — vui lòng phản hồi khách hàng.",
    time: "1.5 giờ trước",
    read: true,
  },
  /* HÔM QUA */
  {
    id: 7,
    group: "Hôm qua",
    type: "order",
    icon: "🎉",
    title: "Đơn #ORD-5995 đã giao",
    body: "Bánh AFC Rau Củ × 1 đã được giao cho khách. Thanh toán hoàn tất.",
    time: "Hôm qua",
    read: true,
  },
  {
    id: 8,
    group: "Hôm qua",
    type: "warning",
    icon: "📦",
    title: "Cảnh báo tồn kho thấp",
    body: "Trứng gà hộp 10 quả sắp hết — chỉ còn 2 hộp.",
    time: "Hôm qua",
    read: true,
  },
  {
    id: 9,
    group: "Hôm qua",
    type: "system",
    icon: "💳",
    title: "Đã chuyển tiền",
    body: "Khoản thanh toán tuần này: 1,240,000₫ đã được chuyển vào tài khoản của bạn.",
    time: "Hôm qua",
    read: true,
  },
  /* CŨ HƠN */
  {
    id: 10,
    group: "Cũ hơn",
    type: "review",
    icon: "⭐",
    title: "Đánh giá mới",
    body: "Khách hàng đã đánh giá Bánh Oreo 4 sao.",
    time: "2 ngày trước",
    read: true,
  },
  {
    id: 11,
    group: "Cũ hơn",
    type: "system",
    icon: "🏆",
    title: "Đạt huy hiệu Nhà Cung Cấp",
    body: "Chúc mừng! Bạn đã được trao huy hiệu Top Nhà Cung Cấp tuần này.",
    time: "3 ngày trước",
    read: true,
  },
  {
    id: 12,
    group: "Cũ hơn",
    type: "order",
    icon: "🧾",
    title: "Đơn #ORD-5994 hoàn tất",
    body: "Trứng gà hộp 10 quả đã được giao thành công.",
    time: "4 ngày trước",
    read: true,
  },
];

const TYPE_FILTERS = ["Tất cả", "Đơn hàng", "Cảnh báo", "Đánh giá", "Hệ thống"];

const typeOf = (t) => {
  if (t === "order") return "Đơn hàng";
  if (t === "warning") return "Cảnh báo";
  if (t === "review") return "Đánh giá";
  return "Hệ thống";
};

const SupplierNotifications = ({ onNavigate, onSwitchToCustomer }) => {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [filter, setFilter] = useState("Tất cả");
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

  const markRead = (id) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifs.filter(
    (n) => filter === "Tất cả" || typeOf(n.type) === filter,
  );
  const groups = ["Hôm nay", "Hôm qua", "Cũ hơn"];
  const unreadCount = notifs.filter((n) => !n.read).length;
  const unreadOrders = notifs.filter(
    (n) => !n.read && n.type === "order",
  ).length;
  const unreadReviews = notifs.filter(
    (n) => !n.read && n.type === "review",
  ).length;
  const unreadWarn = notifs.filter(
    (n) => !n.read && n.type === "warning",
  ).length;

  return (
    <div className="sn-root">
      <SupplierNavbar
        activePage="notifications"
        onNavigate={onNavigate}
        onSwitchToCustomer={onSwitchToCustomer}
      />

      {/* ── Hero ── */}
      <div className="sn-hero">
        <div className="sn-hero-bg">
          {HERO_PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`sn-hero-photo ${i === heroPhi ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="sn-hero-overlay" />
        </div>
        <div className="sn-hero-content">
          <div className="sn-hero-badge">🔔 Trung Tâm Thông Báo</div>
          <h1 className="sn-hero-title">
            Thông Báo
            {unreadCount > 0 && (
              <span className="sn-unread-bubble">{unreadCount}</span>
            )}
          </h1>
          <p className="sn-hero-sub">
            Luôn cập nhật đơn hàng, đánh giá, cảnh báo và thông báo hệ thống — tất cả ở một nơi.
          </p>
          <div className="sn-hero-chips">
            <span className="sn-hero-chip">⚡ Thời Gian Thực</span>
            <span className="sn-hero-chip">📊 Mọi Kênh</span>
            <span className="sn-hero-chip">✓ Thao Tác Nhanh</span>
          </div>
        </div>
        {/* Floating unread summary card */}
        <div className="sn-hero-summary-card">
          <div className="sn-sum-label">Chưa Đọc</div>
          <div className="sn-sum-val">{unreadCount}</div>
          <div className="sn-sum-rows">
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-order" />
              <span>Đơn Hàng</span>
              <strong>{unreadOrders}</strong>
            </div>
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-review" />
              <span>Đánh Giá</span>
              <strong>{unreadReviews}</strong>
            </div>
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-warning" />
              <span>Cảnh Báo</span>
              <strong>{unreadWarn}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="sn-stats-bar" data-reveal>
        {[
          {
            icon: "🔔",
            label: "Tổng cộng",
            val: notifs.length,
            cls: "sn-sb-total",
            bg: HERO_PHOTOS[3],
          },
          {
            icon: "📬",
            label: "Chưa đọc",
            val: unreadCount,
            cls: "sn-sb-unread",
            bg: HERO_PHOTOS[0],
          },
          {
            icon: "🧾",
            label: "Đơn hàng",
            val: notifs.filter((n) => n.type === "order").length,
            cls: "sn-sb-order",
            bg: TYPE_IMG.order,
          },
          {
            icon: "⭐",
            label: "Đánh giá",
            val: notifs.filter((n) => n.type === "review").length,
            cls: "sn-sb-review",
            bg: TYPE_IMG.review,
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`sn-stat-card ${s.cls}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="sn-stat-card-img"
              style={{ backgroundImage: `url(${s.bg})` }}
            />
            <div className="sn-stat-card-body">
              <div className="sn-sc-icon">{s.icon}</div>
              <div className="sn-sc-val">{s.val}</div>
              <div className="sn-sc-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="sn-controls" data-reveal>
        <div className="sn-filters">
          {TYPE_FILTERS.map((f) => {
            const cnt =
              f === "Tất cả"
                ? unreadCount
                : notifs.filter((n) => !n.read && typeOf(n.type) === f).length;
            return (
              <button
                key={f}
                className={`sn-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {cnt > 0 && <span className="sn-filter-dot" />}
              </button>
            );
          })}
        </div>
        <button
          className="sn-mark-all"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          ✓ Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* ── Grouped List ── */}
      <div className="sn-list-wrap revealed">
        {filtered.length === 0 ? (
          <div className="sn-empty">
            <img
              src={UNSPLASH("1493770348161-369560ae357d", 400, 260)}
              alt="no notifications"
              className="sn-empty-img"
            />
            <div className="sn-empty-title">Không có thông báo mới!</div>
            <div className="sn-empty-sub">
              Không có thông báo nào khớp với bộ lọc của bạn.
            </div>
          </div>
        ) : (
          groups.map((g) => {
            const groupItems = filtered.filter((n) => n.group === g);
            if (groupItems.length === 0) return null;
            return (
              <div key={g} className="sn-group">
                <div className="sn-group-label">
                  <span className="sn-group-label-text">{g}</span>
                  <span className="sn-group-count">{groupItems.length}</span>
                </div>
                <div className="sn-group-items">
                  {groupItems.map((n, i) => (
                    <div
                      key={n.id}
                      className={`sn-item ${n.read ? "sn-read" : "sn-unread"} sn-type-${n.type}`}
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => markRead(n.id)}
                    >
                      {/* Icon circle */}
                      <div className={`sn-icon-circle sn-ic-${n.type}`}>
                        <span className="sn-item-icon">{n.icon}</span>
                        {!n.read && <span className="sn-dot" />}
                      </div>

                      {/* Main text */}
                      <div className="sn-item-body">
                        <div className="sn-item-title">{n.title}</div>
                        <div className="sn-item-text">{n.body}</div>
                        <div className="sn-item-time">🕐 {n.time}</div>
                      </div>

                      {/* Thumbnail photo */}
                      <div className="sn-item-thumb-wrap">
                        <img
                          src={TYPE_IMG[n.type]}
                          alt={n.type}
                          className="sn-item-thumb"
                        />
                      </div>

                      {/* Dismiss */}
                      <button
                        className="sn-dismiss"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        title="Bỏ qua"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupplierNotifications;
