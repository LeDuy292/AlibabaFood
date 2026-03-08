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
  order: UNSPLASH("1512621776951-a57141f2eefd", 200, 140),
  review: UNSPLASH("1512058564366-18510be2db19", 200, 140),
  warning: UNSPLASH("1493770348161-369560ae357d", 200, 140),
  system: UNSPLASH("1466978913421-dad2ebd01d17", 200, 140),
};

const INITIAL_NOTIFS = [
  /* TODAY */
  {
    id: 1,
    group: "Today",
    type: "review",
    icon: "⭐",
    title: "New 5-star review",
    body: "John Smith left a 5-star review on your Crispy Chicken Rice.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    group: "Today",
    type: "order",
    icon: "🧾",
    title: "New order received",
    body: "Order #ORD-4830 — Crispy Chicken Rice × 2 from Alice Wong.",
    time: "5 min ago",
    read: false,
  },
  {
    id: 3,
    group: "Today",
    type: "warning",
    icon: "⚠️",
    title: "Item expiring soon",
    body: "Signature Pho has only 1.5 hours left. Reduce price or remove listing.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 4,
    group: "Today",
    type: "order",
    icon: "✅",
    title: "Order #ORD-4827 ready",
    body: "Signature Pho × 2 for David Park is ready for pickup.",
    time: "22 min ago",
    read: true,
  },
  {
    id: 5,
    group: "Today",
    type: "system",
    icon: "🔔",
    title: "Scheduled maintenance",
    body: "Planned downtime tonight 2:00 – 3:00 AM. Please plan accordingly.",
    time: "1 hr ago",
    read: true,
  },
  {
    id: 6,
    group: "Today",
    type: "review",
    icon: "💬",
    title: "Review reply needed",
    body: "Carol Lee left a comment on Caesar Salad. She has a question.",
    time: "1.5 hr ago",
    read: true,
  },
  /* YESTERDAY */
  {
    id: 7,
    group: "Yesterday",
    type: "order",
    icon: "🎉",
    title: "Order #ORD-4826 delivered",
    body: "Emma Smith picked up BBQ Banh Mi × 4. Payment confirmed.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 8,
    group: "Yesterday",
    type: "warning",
    icon: "📦",
    title: "Low stock alert",
    body: "Broken Rice with Pork is nearly sold out — only 1 serving left!",
    time: "Yesterday",
    read: true,
  },
  {
    id: 9,
    group: "Yesterday",
    type: "system",
    icon: "💳",
    title: "Payout processed",
    body: "Your weekly payout of 1,240,000₫ has been sent to your bank.",
    time: "Yesterday",
    read: true,
  },
  /* EARLIER */
  {
    id: 10,
    group: "Earlier",
    type: "review",
    icon: "⭐",
    title: "New 4-star review",
    body: "Lily H. rated your Bubble Milk Tea 4 stars. Great job!",
    time: "2 days ago",
    read: true,
  },
  {
    id: 11,
    group: "Earlier",
    type: "system",
    icon: "🏆",
    title: "Top Supplier badge earned",
    body: "Congratulations! You've earned the Top Supplier badge this week.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 12,
    group: "Earlier",
    type: "order",
    icon: "🧾",
    title: "Order #ORD-4815 complete",
    body: "All items for this order have been delivered successfully.",
    time: "4 days ago",
    read: true,
  },
];

const TYPE_FILTERS = ["All", "Orders", "Warnings", "Reviews", "System"];

const typeOf = (t) => {
  if (t === "order") return "Orders";
  if (t === "warning") return "Warnings";
  if (t === "review") return "Reviews";
  return "System";
};

const SupplierNotifications = ({ onNavigate, onSwitchToCustomer }) => {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [filter, setFilter] = useState("All");
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
    (n) => filter === "All" || typeOf(n.type) === filter,
  );
  const groups = ["Today", "Yesterday", "Earlier"];
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
          <div className="sn-hero-badge">🔔 Notification Center</div>
          <h1 className="sn-hero-title">
            Notifications
            {unreadCount > 0 && (
              <span className="sn-unread-bubble">{unreadCount}</span>
            )}
          </h1>
          <p className="sn-hero-sub">
            Stay on top of orders, reviews, warnings, and system alerts — all in
            one place.
          </p>
          <div className="sn-hero-chips">
            <span className="sn-hero-chip">⚡ Real-Time</span>
            <span className="sn-hero-chip">📊 All Channels</span>
            <span className="sn-hero-chip">✓ Quick Actions</span>
          </div>
        </div>
        {/* Floating unread summary card */}
        <div className="sn-hero-summary-card">
          <div className="sn-sum-label">Unread Alerts</div>
          <div className="sn-sum-val">{unreadCount}</div>
          <div className="sn-sum-rows">
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-order" />
              <span>Orders</span>
              <strong>{unreadOrders}</strong>
            </div>
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-review" />
              <span>Reviews</span>
              <strong>{unreadReviews}</strong>
            </div>
            <div className="sn-sum-row">
              <span className="sn-sum-dot sn-dot-warning" />
              <span>Warnings</span>
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
            label: "Total",
            val: notifs.length,
            cls: "sn-sb-total",
            bg: HERO_PHOTOS[3],
          },
          {
            icon: "📬",
            label: "Unread",
            val: unreadCount,
            cls: "sn-sb-unread",
            bg: HERO_PHOTOS[0],
          },
          {
            icon: "🧾",
            label: "Orders",
            val: notifs.filter((n) => n.type === "order").length,
            cls: "sn-sb-order",
            bg: TYPE_IMG.order,
          },
          {
            icon: "⭐",
            label: "Reviews",
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
              f === "All"
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
          ✓ Mark all as read
        </button>
      </div>

      {/* ── Grouped List ── */}
      <div className="sn-list-wrap" data-reveal>
        {filtered.length === 0 ? (
          <div className="sn-empty">
            <img
              src={UNSPLASH("1493770348161-369560ae357d", 400, 260)}
              alt="no notifications"
              className="sn-empty-img"
            />
            <div className="sn-empty-title">All caught up!</div>
            <div className="sn-empty-sub">
              No notifications match your current filter.
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
                        title="Dismiss"
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
