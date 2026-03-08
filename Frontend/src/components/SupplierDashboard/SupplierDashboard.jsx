import React, { useState, useRef, useEffect } from "react";
import "./SupplierDashboard.css";
import SupplierNavbar from "../SupplierPages/SupplierNavbar";

/* ─────────────────────────────────────────────
   Ripple Button
───────────────────────────────────────────── */
const RippleBtn = ({ children, className = "", onClick, style }) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const wave = document.createElement("span");
    wave.className = "sd-ripple-wave";
    wave.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
    onClick && onClick(e);
  };
  return (
    <button
      ref={ref}
      className={`sd-ripple-btn ${className}`}
      style={style}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const WEEKLY_REVENUE = [
  { day: "T2", primary: 420000, secondary: 180000 },
  { day: "T3", primary: 380000, secondary: 210000 },
  { day: "T4", primary: 530000, secondary: 160000 },
  { day: "T5", primary: 610000, secondary: 220000 },
  { day: "T6", primary: 720000, secondary: 290000 },
  { day: "T7", primary: 890000, secondary: 340000 },
  { day: "CN", primary: 960000, secondary: 380000 },
];

const RECENT_ORDERS = [
  {
    id: "#ORD-2418",
    customer: "Alex Johnson",
    items: "Chicken Rice × 2",
    total: "50,000₫",
    time: "5 min ago",
    status: "confirmed",
  },
  {
    id: "#ORD-2417",
    customer: "Sarah Williams",
    items: "Banh Mi × 3",
    total: "54,000₫",
    time: "12 min ago",
    status: "preparing",
  },
  {
    id: "#ORD-2416",
    customer: "Michael Brown",
    items: "Beef Pho × 1",
    total: "45,000₫",
    time: "28 min ago",
    status: "delivered",
  },
  {
    id: "#ORD-2415",
    customer: "Emily Davis",
    items: "Bun Bo × 2",
    total: "90,000₫",
    time: "45 min ago",
    status: "delivered",
  },
  {
    id: "#ORD-2414",
    customer: "Chris Wilson",
    items: "Fried Rice × 1",
    total: "35,000₫",
    time: "1h ago",
    status: "pending",
  },
  {
    id: "#ORD-2413",
    customer: "Lisa Anderson",
    items: "Quang Noodles × 2",
    total: "70,000₫",
    time: "2h ago",
    status: "cancelled",
  },
];

const TOP_PRODUCTS = [
  {
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Chicken Rice Hoi An",
    meta: "234 orders · 4.9 ★",
    revenue: "5,850,000₫",
  },
  {
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Special Beef Pho",
    meta: "178 orders · 4.8 ★",
    revenue: "8,010,000₫",
  },
  {
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Banh Mi Sandwich",
    meta: "156 orders · 4.7 ★",
    revenue: "2,808,000₫",
  },
  {
    img: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Bun Bo Hue",
    meta: "132 orders · 4.9 ★",
    revenue: "5,940,000₫",
  },
  {
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Broken Rice & Rib",
    meta: "118 orders · 4.6 ★",
    revenue: "4,720,000₫",
  },
];

const NOTIFICATIONS = [
  {
    icon: "🛎️",
    type: "order",
    title: "New order #2418 received",
    time: "5 min ago",
    unread: true,
  },
  {
    icon: "⚠️",
    type: "warning",
    title: "Chicken Rice expiring soon (3h left)",
    time: "20 min ago",
    unread: true,
  },
  {
    icon: "⭐",
    type: "star",
    title: "New 5★ review from Alex J.",
    time: "1h ago",
    unread: false,
  },
  {
    icon: "ℹ️",
    type: "info",
    title: "System maintenance at 2:00 AM",
    time: "3h ago",
    unread: false,
  },
  {
    icon: "🛎️",
    type: "order",
    title: "Order #2416 delivered successfully",
    time: "4h ago",
    unread: false,
  },
];

/* ── Orders Analytics data (12 months) ── */
const MONTHLY_DATA = [
  { label: "Jan", offline: 14, online: 28 },
  { label: "Feb", offline: 19, online: 35 },
  { label: "Mar", offline: 38, online: 62 },
  { label: "Apr", offline: 28, online: 52 },
  { label: "May", offline: 45, online: 68 },
  { label: "Jun", offline: 52, online: 55 },
  { label: "Jul", offline: 60, online: 71 },
  { label: "Aug", offline: 48, online: 64 },
  { label: "Sep", offline: 55, online: 73 },
  { label: "Oct", offline: 63, online: 80 },
  { label: "Nov", offline: 70, online: 85 },
  { label: "Dec", offline: 76, online: 91 },
];

const EARNINGS_SEGMENTS = [
  { label: "Offline", color: "#1e2d5a", pct: 58 },
  { label: "Online", color: "#f97316", pct: 42 },
];

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const NAV_TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "orders", label: "Orders", icon: "🛎️" },
  { id: "products", label: "Products", icon: "🥗" },
  { id: "analytics", label: "Analytics", icon: "📈" },
];

const SIDEBAR_ITEMS = [
  {
    section: "Management",
    items: [
      { id: "overview", icon: "📊", label: "Overview", badge: null },
      { id: "orders", icon: "🛎️", label: "Orders", badge: "4" },
      { id: "products", icon: "🥗", label: "Products", badge: null },
      { id: "analytics", icon: "📈", label: "Analytics", badge: null },
      { id: "customers", icon: "👥", label: "Customers", badge: null },
    ],
  },
  {
    section: "Settings",
    items: [
      { id: "profile", icon: "🏪", label: "Store Profile", badge: null },
      { id: "payments", icon: "💳", label: "Payments", badge: null },
      { id: "support", icon: "💬", label: "Support", badge: "1" },
    ],
  },
];

/* ── SVG line chart helpers ── */
const LC_W = 580,
  LC_H = 210,
  LC_PL = 36,
  LC_PR = 12,
  LC_PT = 14,
  LC_PB = 28;
const LC_CW = LC_W - LC_PL - LC_PR;
const LC_CH = LC_H - LC_PT - LC_PB;
const LC_N = MONTHLY_DATA.length;
const LC_STEP = LC_CW / (LC_N - 1);
const lc_x = (i) => LC_PL + i * LC_STEP;
const lc_y = (v) => LC_PT + LC_CH - (v / 100) * LC_CH;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const OrdersLineChart = () => {
  const [tip, setTip] = useState(null);
  const [animProg, setAnimProg] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let start = null;
    const duration = 1600;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setAnimProg(easeOutCubic(p));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const offline = MONTHLY_DATA.map((d, i) => [lc_x(i), lc_y(d.offline)]);
  const online = MONTHLY_DATA.map((d, i) => [lc_x(i), lc_y(d.online)]);
  const pts = (arr) => arr.map((p) => p.join(",")).join(" ");
  const area = (arr) => {
    const base = lc_y(0);
    return `M ${arr[0][0]},${base} ${arr.map((p) => `L ${p[0]},${p[1]}`).join(" ")} L ${arr[arr.length - 1][0]},${base} Z`;
  };
  const yTicks = [0, 20, 40, 60, 80, 100];
  const clipW = LC_PL + LC_CW * animProg + 4;

  return (
    <div className="sd-lc-wrap">
      <svg viewBox={`0 0 ${LC_W} ${LC_H}`} className="sd-lc-svg">
        <defs>
          <clipPath id="lc-reveal">
            <rect x={0} y={0} width={clipW} height={LC_H} />
          </clipPath>
          <filter
            id="lc-tip-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12" />
          </filter>
          <linearGradient id="lg-navy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2d5a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1e2d5a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lg-orange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={LC_PL}
              y1={lc_y(v)}
              x2={LC_W - LC_PR}
              y2={lc_y(v)}
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
            <text
              x={LC_PL - 5}
              y={lc_y(v) + 4}
              textAnchor="end"
              fontSize="9"
              fill="#9ca3af"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Area fills — revealed left-to-right */}
        <g clipPath="url(#lc-reveal)">
          <path d={area(offline)} fill="url(#lg-navy)" />
          <path d={area(online)} fill="url(#lg-orange)" />
        </g>

        {/* Lines — revealed left-to-right */}
        <g clipPath="url(#lc-reveal)">
          <polyline
            points={pts(offline)}
            fill="none"
            stroke="#1e2d5a"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points={pts(online)}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* Hover column highlight */}
        {tip !== null && (
          <rect
            x={lc_x(tip) - LC_STEP / 2}
            y={LC_PT}
            width={LC_STEP}
            height={LC_CH}
            fill="#6b7280"
            fillOpacity="0.08"
            rx="4"
            pointerEvents="none"
          />
        )}

        {/* Dots — fade in progressively */}
        {MONTHLY_DATA.map((d, i) => {
          const opacity = Math.max(0, Math.min(1, animProg * LC_N - i));
          return (
            <g
              key={i}
              onMouseEnter={() => setTip(i)}
              onMouseLeave={() => setTip(null)}
              opacity={opacity}
            >
              <rect
                x={lc_x(i) - LC_STEP / 2}
                y={LC_PT}
                width={LC_STEP}
                height={LC_CH}
                fill="transparent"
                style={{ cursor: "crosshair" }}
              />
              <circle
                cx={lc_x(i)}
                cy={lc_y(d.offline)}
                r={tip === i ? 5 : 3.5}
                fill="#1e2d5a"
                stroke="#fff"
                strokeWidth="1.8"
              />
              <circle
                cx={lc_x(i)}
                cy={lc_y(d.online)}
                r={tip === i ? 5 : 3.5}
                fill="#f97316"
                stroke="#fff"
                strokeWidth="1.8"
              />
            </g>
          );
        })}

        {/* Pulsing ring on last data point */}
        {animProg >= 0.98 &&
          (() => {
            const li = MONTHLY_DATA.length - 1;
            const last = MONTHLY_DATA[li];
            return (
              <>
                <circle
                  cx={lc_x(li)}
                  cy={lc_y(last.online)}
                  r="7"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  className="sd-lc-pulse"
                />
                <circle
                  cx={lc_x(li)}
                  cy={lc_y(last.offline)}
                  r="7"
                  fill="none"
                  stroke="#1e2d5a"
                  strokeWidth="1.5"
                  className="sd-lc-pulse"
                />
              </>
            );
          })()}

        {/* Tooltip */}
        {tip !== null &&
          (() => {
            const d = MONTHLY_DATA[tip];
            const tx = lc_x(tip);
            const peakY = Math.min(lc_y(d.offline), lc_y(d.online));
            const bW = 148,
              bH = 56;
            const bX = Math.min(
              Math.max(tx - bW / 2, LC_PL),
              LC_W - LC_PR - bW,
            );
            const bY = Math.max(peakY - bH - 8, 2);
            return (
              <g pointerEvents="none">
                <rect
                  x={bX}
                  y={bY}
                  width={bW}
                  height={bH}
                  rx="8"
                  fill="white"
                  filter="url(#lc-tip-shadow)"
                />
                <text
                  x={bX + bW / 2}
                  y={bY + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6b7280"
                >
                  {d.label} 2025
                </text>
                <text
                  x={bX + 10}
                  y={bY + 32}
                  fontSize="10"
                  fontWeight="700"
                  fill="#1e2d5a"
                >
                  ● {d.offline} offline orders
                </text>
                <text
                  x={bX + 10}
                  y={bY + 48}
                  fontSize="10"
                  fontWeight="700"
                  fill="#f97316"
                >
                  ● {d.online} online orders
                </text>
              </g>
            );
          })()}

        {/* X labels */}
        {MONTHLY_DATA.map((d, i) => (
          <text
            key={i}
            x={lc_x(i)}
            y={LC_H - 4}
            textAnchor="middle"
            fontSize="8.5"
            fill="#9ca3af"
          >
            {d.label}
          </text>
        ))}
      </svg>

      <div className="sd-lc-legend">
        <span className="sd-lc-legend-item">
          <span className="sd-lc-dot" style={{ background: "#1e2d5a" }} />{" "}
          Offline orders
        </span>
        <span className="sd-lc-legend-item">
          <span className="sd-lc-dot" style={{ background: "#f97316" }} />{" "}
          Online orders
        </span>
        <button className="sd-lc-filter-btn">Monthly ▾</button>
      </div>
    </div>
  );
};

/* ── Donut chart ── */
const R_D = 40,
  CX_D = 60,
  CY_D = 60;
const CIRC_D = 2 * Math.PI * R_D;

const EarningsDonut = () => {
  const [animProg, setAnimProg] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setAnimProg(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const segs = EARNINGS_SEGMENTS.reduce(
    ({ list, cum }, seg) => {
      const fullArc = (seg.pct / 100) * CIRC_D;
      const arc = fullArc * animProg;
      const rot = -90 + (cum / CIRC_D) * 360;
      return { list: [...list, { ...seg, arc, rot }], cum: cum + fullArc };
    },
    { list: [], cum: 0 },
  ).list;

  return (
    <div className="sd-donut-wrap">
      <svg viewBox="0 0 120 120" className="sd-donut-svg">
        <circle
          cx={CX_D}
          cy={CY_D}
          r={R_D}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="18"
        />
        {segs.map((seg, i) => (
          <circle
            key={i}
            cx={CX_D}
            cy={CY_D}
            r={R_D}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${seg.arc} ${CIRC_D - seg.arc}`}
            strokeDashoffset="0"
            transform={`rotate(${seg.rot}, ${CX_D}, ${CY_D})`}
          />
        ))}
        <text
          x={CX_D}
          y={CY_D - 4}
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#1f2937"
        >
          $452
        </text>
        <text
          x={CX_D}
          y={CY_D + 11}
          textAnchor="middle"
          fontSize="7.5"
          fill="#9ca3af"
        >
          This month
        </text>
      </svg>
      <div className="sd-donut-legend">
        {EARNINGS_SEGMENTS.map((seg) => (
          <div key={seg.label} className="sd-donut-legend-item">
            <span className="sd-donut-dot" style={{ background: seg.color }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const SupplierDashboard = ({ onNavigate, onSwitchToCustomer }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="sd-root">
      {/* ══════════════════════════════
          NAVBAR (shared)
      ══════════════════════════════ */}
      <SupplierNavbar
        activePage="home"
        onNavigate={onNavigate}
        onSwitchToCustomer={onSwitchToCustomer}
        notifCount={2}
      />

      {/* ══════════════════════════════
          BODY
      ══════════════════════════════ */}
      <div className="sd-body">
        {/* ── Main ── */}
        <main className="sd-main">
          {/* Page header */}
          <div className="sd-page-header">
            <div>
              <h1>Store Overview</h1>
              <p>Welcome back 👋 — here's your store performance today.</p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span className="sd-header-date">📅 {today}</span>
              <RippleBtn className="sd-btn-primary">➕ Add New Item</RippleBtn>
            </div>
          </div>

          {/* ── KPI Cards ── */}
          <div className="sd-kpi-grid">
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon green">💰</div>
                <span className="sd-kpi-trend up">↑ 12.4%</span>
              </div>
              <div className="sd-kpi-value">4,320,000₫</div>
              <div className="sd-kpi-label">Today's Revenue</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon blue">🛎️</div>
                <span className="sd-kpi-trend up">↑ 8.1%</span>
              </div>
              <div className="sd-kpi-value">38</div>
              <div className="sd-kpi-label">Today's Orders</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon orange">🥗</div>
                <span className="sd-kpi-trend down">↓ 2.0%</span>
              </div>
              <div className="sd-kpi-value">24</div>
              <div className="sd-kpi-label">Active Menu Items</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon purple">⭐</div>
                <span className="sd-kpi-trend up">↑ 0.2</span>
              </div>
              <div className="sd-kpi-value">4.87</div>
              <div className="sd-kpi-label">Avg. Rating</div>
            </div>
          </div>

          {/* ── Orders Analytics + Earnings ── */}
          <div className="sd-grid-3-1">
            {/* Orders Analytics */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Orders Analytics</h3>
              </div>
              <OrdersLineChart />
            </div>

            {/* Earnings donut */}
            <div className="sd-card sd-card--center">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Earnings</h3>
                <span className="sd-card-link">···</span>
              </div>
              <EarningsDonut />
            </div>
          </div>

          {/* ── Recent Orders + Top Products ── */}
          <div className="sd-grid-2" style={{ marginBottom: 24 }}>
            {/* Recent orders */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Recent Orders</h3>
                <button
                  className="sd-card-link"
                  onClick={() => onNavigate?.("orders")}
                >
                  View all →
                </button>
              </div>
              <table className="sd-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="sd-order-id">{order.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customer}</div>
                        <div style={{ fontSize: ".77rem", color: "#9ca3af" }}>
                          {order.items}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{order.total}</td>
                      <td>
                        <span className={`sd-badge ${order.status}`}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top products */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Top Products</h3>
                <button
                  className="sd-card-link"
                  onClick={() => onNavigate?.("inventory")}
                >
                  View all →
                </button>
              </div>
              <div className="sd-products-list">
                {TOP_PRODUCTS.map((p, i) => (
                  <div className="sd-product-row" key={p.name}>
                    <span className={`sd-product-rank ${i < 3 ? "top" : ""}`}>
                      {i === 0
                        ? "🥇"
                        : i === 1
                          ? "🥈"
                          : i === 2
                            ? "🥉"
                            : `#${i + 1}`}
                    </span>
                    <img src={p.img} alt={p.name} className="sd-product-img" />
                    <div className="sd-product-info">
                      <div className="sd-product-name">{p.name}</div>
                      <div className="sd-product-meta">{p.meta}</div>
                    </div>
                    <div className="sd-product-revenue">{p.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Notifications + Quick Actions ── */}
          <div className="sd-grid-2">
            {/* Notifications */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Notifications</h3>
                <span className="sd-card-link">Mark all read</span>
              </div>
              <div className="sd-notif-list">
                {NOTIFICATIONS.map((n, i) => (
                  <div
                    key={i}
                    className={`sd-notif-item ${n.unread ? "unread" : ""}`}
                  >
                    <div className={`sd-notif-dot ${n.type}`}>{n.icon}</div>
                    <div className="sd-notif-text">
                      <strong>{n.title}</strong>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Quick Actions</h3>
              </div>
              <div className="sd-actions-grid">
                <button className="sd-action-btn">
                  <span>➕</span>
                  <span>Add Item</span>
                </button>
                <button className="sd-action-btn">
                  <span>📋</span>
                  <span>View Orders</span>
                </button>
                <button className="sd-action-btn">
                  <span>📦</span>
                  <span>Inventory</span>
                </button>
                <button className="sd-action-btn">
                  <span>💬</span>
                  <span>Message Customer</span>
                </button>
                <button className="sd-action-btn">
                  <span>📊</span>
                  <span>Monthly Report</span>
                </button>
                <button className="sd-action-btn">
                  <span>⚙️</span>
                  <span>Store Settings</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
