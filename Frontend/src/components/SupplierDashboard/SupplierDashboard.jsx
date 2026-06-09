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
    customer: "Nguyễn Văn A",
    items: "Coca Cola Original 330ml × 2",
    total: "20.000đ",
    time: "5 phút trước",
    status: "confirmed",
  },
  {
    id: "#ORD-2417",
    customer: "Trần Thị B",
    items: "Bánh Oreo Socola × 1",
    total: "18.000đ",
    time: "12 phút trước",
    status: "preparing",
  },
  {
    id: "#ORD-2416",
    customer: "Lê Văn C",
    items: "Sữa Vinamilk Không Đường 1L × 1",
    total: "38.000đ",
    time: "28 phút trước",
    status: "delivered",
  },
  {
    id: "#ORD-2415",
    customer: "Phạm Thị D",
    items: "Mì Hảo Hảo Tôm Chua Cay × 2",
    total: "10.000đ",
    time: "45 phút trước",
    status: "delivered",
  },
  {
    id: "#ORD-2414",
    customer: "Võ Văn E",
    items: "Snack Lay's Khoai Tây × 1",
    total: "15.000đ",
    time: "1 giờ trước",
    status: "pending",
  },
  {
    id: "#ORD-2413",
    customer: "Lý Thị F",
    items: "Bánh AFC Rau Củ × 1",
    total: "32.000đ",
    time: "2 giờ trước",
    status: "cancelled",
  },
];

const TOP_PRODUCTS = [
  {
    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Coca Cola Original 330ml",
    meta: "316 đơn · 4.9 ★",
    revenue: "3,160,000đ",
  },
  {
    img: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Pepsi Lon 330ml",
    meta: "284 đơn · 4.8 ★",
    revenue: "2,556,000đ",
  },
  {
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Sữa Vinamilk Không Đường 1L",
    meta: "197 đơn · 5.0 ★",
    revenue: "7,486,000đ",
  },
  {
    img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Bánh Oreo Socola",
    meta: "144 đơn · 4.8 ★",
    revenue: "2,592,000đ",
  },
  {
    img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=80&h=80&q=80",
    name: "Snack Lay's Khoai Tây",
    meta: "131 đơn · 4.7 ★",
    revenue: "1,965,000đ",
  },
];

const NOTIFICATIONS = [
  {
    icon: "🛎️",
    type: "order",
    title: "Đã nhận đơn hàng mới #2418",
    time: "5 phút trước",
    unread: true,
  },
  {
    icon: "⚠️",
    type: "warning",
    title: "Cơm Gà sắp hết hạn (còn 3h)",
    time: "20 phút trước",
    unread: true,
  },
  {
    icon: "⭐",
    type: "star",
    title: "Đánh giá 5★ mới từ Nguyễn A.",
    time: "1 giờ trước",
    unread: false,
  },
  {
    icon: "ℹ️",
    type: "info",
    title: "Bảo trì hệ thống lúc 2:00 SA",
    time: "3 giờ trước",
    unread: false,
  },
  {
    icon: "🛎️",
    type: "order",
    title: "Đơn hàng #2416 đã giao thành công",
    time: "4 giờ trước",
    unread: false,
  },
];

/* ── Orders Analytics data (12 months) ── */
const MONTHLY_DATA = [
  { label: "Th1", offline: 14, online: 28 },
  { label: "Th2", offline: 19, online: 35 },
  { label: "Th3", offline: 38, online: 62 },
  { label: "Th4", offline: 28, online: 52 },
  { label: "Th5", offline: 45, online: 68 },
  { label: "Th6", offline: 52, online: 55 },
  { label: "Th7", offline: 60, online: 71 },
  { label: "Th8", offline: 48, online: 64 },
  { label: "Th9", offline: 55, online: 73 },
  { label: "Th10", offline: 63, online: 80 },
  { label: "Th11", offline: 70, online: 85 },
  { label: "Th12", offline: 76, online: 91 },
];

const EARNINGS_SEGMENTS = [
  { label: "Tại Thu Ngân", color: "#1e2d5a", pct: 58 },
  { label: "Trực Tuyến", color: "#f97316", pct: 42 },
];

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const NAV_TABS = [
  { id: "overview", label: "Tổng Quan", icon: "📊" },
  { id: "orders", label: "Đơn Hàng", icon: "🛎️" },
  { id: "products", label: "Sản Phẩm", icon: "🥗" },
  { id: "analytics", label: "Phân Tích", icon: "📈" },
];

const SIDEBAR_ITEMS = [
  {
    section: "Quản Lý",
    items: [
      { id: "overview", icon: "📊", label: "Tổng Quan", badge: null },
      { id: "orders", icon: "🛎️", label: "Đơn Hàng", badge: "4" },
      { id: "products", icon: "🥗", label: "Sản Phẩm", badge: null },
      { id: "analytics", icon: "📈", label: "Phân Tích", badge: null },
      { id: "customers", icon: "👥", label: "Khách Hàng", badge: null },
    ],
  },
  {
    section: "Cài Đặt",
    items: [
      { id: "profile", icon: "🏪", label: "Hồ Sơ Cửa Hàng", badge: null },
      { id: "payments", icon: "💳", label: "Thanh Toán", badge: null },
      { id: "support", icon: "💬", label: "Hỗ Trợ", badge: "1" },
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
                  ● {d.offline} đơn tại thu ngân
                </text>
                <text
                  x={bX + 10}
                  y={bY + 48}
                  fontSize="10"
                  fontWeight="700"
                  fill="#f97316"
                >
                  ● {d.online} đơn trực tuyến
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
          Đơn tại thu ngân
        </span>
        <span className="sd-lc-legend-item">
          <span className="sd-lc-dot" style={{ background: "#f97316" }} />{" "}
          Đơn trực tuyến
        </span>
        <button className="sd-lc-filter-btn">Hàng tháng ▾</button>
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
          Tháng này
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
              <h1>Tổng Quan Cửa Hàng</h1>
              <p>Chào mừng trở lại 👋 — đây là hiệu suất cửa hàng của bạn hôm nay.</p>
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
              <RippleBtn className="sd-btn-primary">➕ Thêm Món Mới</RippleBtn>
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
              <div className="sd-kpi-label">Doanh Thu Hôm Nay</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon blue">🛎️</div>
                <span className="sd-kpi-trend up">↑ 8.1%</span>
              </div>
              <div className="sd-kpi-value">38</div>
              <div className="sd-kpi-label">Đơn Hàng Hôm Nay</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon orange">🥗</div>
                <span className="sd-kpi-trend down">↓ 2.0%</span>
              </div>
              <div className="sd-kpi-value">24</div>
              <div className="sd-kpi-label">Món Đang Hoạt Động</div>
            </div>
            <div className="sd-kpi-card">
              <div className="sd-kpi-top">
                <div className="sd-kpi-icon purple">⭐</div>
                <span className="sd-kpi-trend up">↑ 0.2</span>
              </div>
              <div className="sd-kpi-value">4.87</div>
              <div className="sd-kpi-label">Đánh Giá TB</div>
            </div>
          </div>

          {/* ── Orders Analytics + Earnings ── */}
          <div className="sd-grid-3-1">
            {/* Orders Analytics */}
            <div className="sd-card">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Phân Tích Đơn Hàng</h3>
              </div>
              <OrdersLineChart />
            </div>

            {/* Earnings donut */}
            <div className="sd-card sd-card--center">
              <div className="sd-card-head">
                <h3 className="sd-card-title">Thu Nhập</h3>
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
                <h3 className="sd-card-title">Đơn Hàng Gần Đây</h3>
                <button
                  className="sd-card-link"
                  onClick={() => onNavigate?.("orders")}
                >
                  Xem tất cả →
                </button>
              </div>
              <table className="sd-orders-table">
                <thead>
                  <tr>
                    <th>Mã Đơn Hàng</th>
                    <th>Khách Hàng</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
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
                <h3 className="sd-card-title">Sản Phẩm Hàng Đầu</h3>
                <button
                  className="sd-card-link"
                  onClick={() => onNavigate?.("inventory")}
                >
                  Xem tất cả →
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
                <h3 className="sd-card-title">Thông Báo</h3>
                <span className="sd-card-link">Đánh dấu đã đọc</span>
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
                <h3 className="sd-card-title">Thao Tác Nhanh</h3>
              </div>
              <div className="sd-actions-grid">
                <button className="sd-action-btn">
                  <span>➕</span>
                  <span>Thêm Món</span>
                </button>
                <button className="sd-action-btn">
                  <span>📋</span>
                  <span>Xem Đơn Hàng</span>
                </button>
                <button className="sd-action-btn">
                  <span>📦</span>
                  <span>Kho Hàng</span>
                </button>
                <button className="sd-action-btn">
                  <span>💬</span>
                  <span>Nhắn Tin Khách</span>
                </button>
                <button className="sd-action-btn">
                  <span>📊</span>
                  <span>Báo Cáo Tháng</span>
                </button>
                <button className="sd-action-btn">
                  <span>⚙️</span>
                  <span>Cài Đặt Cửa Hàng</span>
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
