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
    id: "#ORD-4830",
    image: UNSPLASH("1512058564366-18510be2db19"),
    item: "Crispy Chicken Rice × 2",
    customer: "Alice Wong",
    total: "165,000₫",
    status: "pending",
    time: "1 min ago",
    note: "No dark meat please",
  },
  {
    id: "#ORD-4829",
    image: UNSPLASH("1558618666-fcd25c85cd64"),
    item: "Bubble Milk Tea × 3",
    customer: "Bob Chen",
    total: "90,000₫",
    status: "confirmed",
    time: "5 min ago",
    note: "",
  },
  {
    id: "#ORD-4828",
    image: UNSPLASH("1512621776951-a57141f2eefd"),
    item: "Caesar Salad × 1",
    customer: "Carol Lee",
    total: "55,000₫",
    status: "preparing",
    time: "12 min ago",
    note: "Dressing on side",
  },
  {
    id: "#ORD-4827",
    image: UNSPLASH("1569718212165-3a8278d5f624"),
    item: "Signature Pho × 2",
    customer: "David Park",
    total: "112,000₫",
    status: "ready",
    time: "18 min ago",
    note: "",
  },
  {
    id: "#ORD-4826",
    image: UNSPLASH("1482049016688-2d3e1b311543"),
    item: "BBQ Banh Mi × 4",
    customer: "Emma Smith",
    total: "108,000₫",
    status: "delivered",
    time: "35 min ago",
    note: "",
  },
  {
    id: "#ORD-4825",
    image: UNSPLASH("1617196034183-421b4040ed20"),
    item: "Salmon Sushi Box × 1",
    customer: "Frank Kim",
    total: "75,000₫",
    status: "cancelled",
    time: "52 min ago",
    note: "Customer cancelled",
  },
  {
    id: "#ORD-4824",
    image: UNSPLASH("1509042239860-f550ce710b93"),
    item: "Egg Coffee × 2",
    customer: "Grace Liu",
    total: "76,000₫",
    status: "delivered",
    time: "1 hr ago",
    note: "",
  },
  {
    id: "#ORD-4823",
    image: UNSPLASH("1551024506-0bccd828d307"),
    item: "Matcha Donut × 6",
    customer: "Henry Tan",
    total: "84,000₫",
    status: "delivered",
    time: "1.5 hrs ago",
    note: "Gift wrap please",
  },
];

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "delivered"];

const STATUS_META = {
  pending: {
    label: "Pending",
    cls: "so-st-pending",
    icon: "⏳",
    next: "Confirm Order",
    color: "#f97316",
  },
  confirmed: {
    label: "Confirmed",
    cls: "so-st-confirmed",
    icon: "✅",
    next: "Start Preparing",
    color: "#3b82f6",
  },
  preparing: {
    label: "Preparing",
    cls: "so-st-preparing",
    icon: "👨‍🍳",
    next: "Mark Ready",
    color: "#8b5cf6",
  },
  ready: {
    label: "Ready",
    cls: "so-st-ready",
    icon: "🔔",
    next: "Mark Delivered",
    color: "#0ea5e9",
  },
  delivered: {
    label: "Delivered",
    cls: "so-st-delivered",
    icon: "🎉",
    next: null,
    color: "#134e15",
  },
  cancelled: {
    label: "Cancelled",
    cls: "so-st-cancelled",
    icon: "❌",
    next: null,
    color: "#dc2626",
  },
};

const FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
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
          <div className="so-hero-badge">🧾 Orders Manager</div>
          <h1 className="so-hero-title">Order Management</h1>
          <p className="so-hero-sub">
            Track, advance, and manage all customer orders in real time — all in
            one professional dashboard.
          </p>
          <div className="so-hero-chips">
            <span className="so-hero-chip">⚡ Live Updates</span>
            <span className="so-hero-chip">📊 Full Pipeline</span>
            <span className="so-hero-chip">🔔 Instant Actions</span>
          </div>
        </div>
        {/* Floating revenue card */}
        <div className="so-hero-revenue-card">
          <div className="so-rev-label">Today's Revenue</div>
          <div className="so-rev-val">{totalRevenue}</div>
          <div className="so-rev-note">
            <span className="so-rev-dot" /> {counts["Delivered"] || 0} orders
            delivered
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="so-stats-bar" data-reveal>
        {[
          {
            icon: "⏳",
            label: "Pending",
            val: counts["Pending"] || 0,
            cls: "so-sb-pending",
            bg: STAT_BG[0],
          },
          {
            icon: "👨‍🍳",
            label: "Preparing",
            val: counts["Preparing"] || 0,
            cls: "so-sb-preparing",
            bg: STAT_BG[1],
          },
          {
            icon: "🔔",
            label: "Ready",
            val: counts["Ready"] || 0,
            cls: "so-sb-ready",
            bg: STAT_BG[2],
          },
          {
            icon: "🎉",
            label: "Delivered",
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
            placeholder="Search by order ID, customer, or item..."
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
              alt="no orders"
              className="so-empty-img"
            />
            <div className="so-empty-title">No orders found</div>
            <div className="so-empty-sub">
              Try adjusting your filter or search term.
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
                          Customer: {order.customer}
                        </div>
                        <div className="so-detail-item-total">
                          Total: {order.total}
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
                            ❌ Cancel Order
                          </button>
                        )}
                      {(order.status === "cancelled" ||
                        order.status === "delivered") && (
                        <span className="so-final-tag">
                          {order.status === "delivered"
                            ? "✅ Order Complete"
                            : "🚫 Order Cancelled"}
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
