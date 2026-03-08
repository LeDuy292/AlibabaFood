import React, { useState, useEffect, useRef } from "react";
import "./SupplierHome.css";
import SupplierNavbar from "./SupplierNavbar";

/* ─────────────────────────────────────────────
   FAQ Item
───────────────────────────────────────────── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-q">
        <span>{q}</span>
        <span className="faq-chevron">{open ? "▲" : "▼"}</span>
      </div>
      <div className="faq-a">{a}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Ripple Button Component
───────────────────────────────────────────── */
const RippleBtn = ({ children, className = "", onClick, style, type }) => {
  const ref = useRef(null);
  const handleClick = (e) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const r = d / 2;
    const wave = document.createElement("span");
    wave.classList.add("ripple-wave");
    wave.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - r}px;top:${e.clientY - rect.top - r}px`;
    btn.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
    onClick && onClick(e);
  };
  return (
    <button
      ref={ref}
      type={type}
      className={`ripple-btn ${className}`}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────────
   Popular Products Carousel Component
───────────────────────────────────────────── */
const POPULAR_ITEMS = [
  {
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Hoi An Chicken Rice",
    supplier: "Green Kitchen",
    price: "25,000₫",
    orders: "234 orders",
    rating: "4.9",
    reviews: "45 reviews",
    timeLeft: "2h 15m",
    badge: "HOT",
  },
  {
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Classic Banh Mi",
    supplier: "Bao Viet Bakery",
    price: "18,000₫",
    orders: "156 orders",
    rating: "4.8",
    reviews: "32 reviews",
    timeLeft: "1h 45m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Seafood Bento Box",
    supplier: "Sushi House",
    price: "45,000₫",
    orders: "89 orders",
    rating: "5.0",
    reviews: "28 reviews",
    timeLeft: "3h 22m",
    badge: "TOP",
  },
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Bubble Milk Tea",
    supplier: "Tea Lover Café",
    price: "22,000₫",
    orders: "512 orders",
    rating: "4.7",
    reviews: "120 reviews",
    timeLeft: "0h 58m",
    badge: "HOT",
  },
  {
    img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Tiramisu Cake",
    supplier: "Sweet Bakery",
    price: "35,000₫",
    orders: "98 orders",
    rating: "4.9",
    reviews: "41 reviews",
    timeLeft: "4h 10m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Signature Pho",
    supplier: "Pho Nam",
    price: "28,000₫",
    orders: "176 orders",
    rating: "4.8",
    reviews: "67 reviews",
    timeLeft: "1h 30m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Chicken Caesar Salad",
    supplier: "Green Kitchen",
    price: "32,000₫",
    orders: "142 orders",
    rating: "4.9",
    reviews: "55 reviews",
    timeLeft: "2h 50m",
    badge: "TOP",
  },
  {
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Iced Black Coffee",
    supplier: "Highlands Coffee",
    price: "28,000₫",
    orders: "287 orders",
    rating: "4.8",
    reviews: "98 reviews",
    timeLeft: "0h 45m",
    badge: "",
  },
];

const CARD_W = 296; // 280px card + 16px gap

const PopularCarousel = () => {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const halfWidth = useRef(POPULAR_ITEMS.length * CARD_W);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = halfWidth.current;
    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += 1.5;
        if (posRef.current >= half) posRef.current -= half;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const scrollCards = (dir) => {
    const half = halfWidth.current;
    posRef.current =
      (((posRef.current + dir * CARD_W * 2) % half) + half) % half;
  };

  return (
    <div className="pop-carousel-outer">
      <button
        className="pop-nav-btn"
        onClick={() => scrollCards(-1)}
        aria-label="Previous"
      >
        ‹
      </button>
      <div
        className="pop-carousel-viewport"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div ref={trackRef} className="pop-carousel-track">
          {[...POPULAR_ITEMS, ...POPULAR_ITEMS].map((p, i) => (
            <div key={i} className="pop-card">
              <div className="pop-card-img-wrap">
                <img
                  src={p.img}
                  alt={p.name}
                  className="pop-card-img"
                  loading="lazy"
                />
                <div className="pop-card-img-dim" />
                {p.badge && (
                  <span
                    className={`pop-badge pop-badge-${p.badge.toLowerCase()}`}
                  >
                    {p.badge === "HOT" ? "🔥" : "🏆"} {p.badge}
                  </span>
                )}
                <div className="pop-card-countdown">⏱ {p.timeLeft}</div>
              </div>
              <div className="pop-card-body">
                <h3 className="pop-card-name">{p.name}</h3>
                <p className="pop-card-supplier">🏪 {p.supplier}</p>
                <div className="pop-card-stats">
                  <span className="pop-stat pop-stat-rating">
                    ⭐ {p.rating}
                  </span>
                  <span className="pop-stat pop-stat-orders">
                    📦 {p.orders}
                  </span>
                  <span className="pop-stat pop-stat-review">
                    💬 {p.reviews}
                  </span>
                </div>
                <div className="pop-card-footer">
                  <span className="pop-card-price">{p.price}/serving</span>
                  <RippleBtn className="pop-detail-btn">
                    View Details →
                  </RippleBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="pop-nav-btn"
        onClick={() => scrollCards(1)}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   New Orders Section
───────────────────────────────────────────── */
const NEW_ORDERS_DATA = [
  {
    id: "#ORD-4821",
    emoji: "🍗",
    items: ["Crispy Chicken Rice × 2", "Iced Tea × 2"],
    customer: "John Smith",
    custAvatar: "🧑",
    total: "165,000₫",
    timeAgo: "2 min ago",
    urgency: "high",
    step: 0,
    note: "Less spicy, no cilantro",
  },
  {
    id: "#ORD-4820",
    emoji: "🧋",
    items: ["Bubble Milk Tea × 3"],
    customer: "Sarah Lee",
    custAvatar: "👩",
    total: "90,000₫",
    timeAgo: "8 min ago",
    urgency: "medium",
    step: 1,
    note: "",
  },
  {
    id: "#ORD-4819",
    emoji: "🥗",
    items: ["Chicken Caesar Salad × 1", "Orange Juice × 1"],
    customer: "Mike Chen",
    custAvatar: "🧑‍💼",
    total: "78,000₫",
    timeAgo: "15 min ago",
    urgency: "low",
    step: 2,
    note: "Dressing on the side",
  },
  {
    id: "#ORD-4818",
    emoji: "🍜",
    items: ["Signature Pho × 2"],
    customer: "Emily Davis",
    custAvatar: "👩‍🍽️",
    total: "112,000₫",
    timeAgo: "22 min ago",
    urgency: "low",
    step: 3,
    note: "",
  },
];

const NO_PIPELINE = ["Received", "Confirmed", "Preparing", "Ready"];
const NO_CONFIRM_LABELS = ["✓ Confirm", "👨‍🍳 Prepare", "🔔 Mark Ready"];
const NO_STATUS_LABEL = ["Pending", "Confirmed", "Preparing", "Ready"];
const NO_STATUS_CLS = [
  "no-st-pending",
  "no-st-confirmed",
  "no-st-making",
  "no-st-ready",
];

const NewOrdersSection = () => {
  const [orders, setOrders] = useState(NEW_ORDERS_DATA);
  const advance = (idx) =>
    setOrders((prev) =>
      prev.map((o, i) =>
        i === idx ? { ...o, step: Math.min(o.step + 1, 3) } : o,
      ),
    );

  return (
    <section className="sl-new-orders-section" data-reveal>
      <div className="sl-container">
        {/* Header */}
        <div className="no-header">
          <div className="no-header-left">
            <div className="sl-chip">
              <span className="no-live-dot" /> Real-time Updates
            </div>
            <h2 className="sl-section-h2">
              Recent <span className="sl-gradient-text">Orders</span>
            </h2>
          </div>
          <button className="sl-link-btn no-view-all">View all orders →</button>
        </div>

        {/* Summary stats */}
        <div className="no-stats-row">
          {[
            { icon: "⏳", val: "3", label: "Awaiting", cls: "no-sp-pending" },
            { icon: "🔄", val: "5", label: "Processing", cls: "no-sp-active" },
            { icon: "✅", val: "28", label: "Done Today", cls: "no-sp-done" },
            { icon: "💰", val: "1.4M₫", label: "Revenue", cls: "no-sp-rev" },
          ].map((s, i) => (
            <div key={i} className={`no-stat-pill ${s.cls}`}>
              <span className="nsp-icon">{s.icon}</span>
              <div className="nsp-text">
                <div className="nsp-val">{s.val}</div>
                <div className="nsp-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact order list */}
        <div className="no-list">
          {orders.map((order, i) => (
            <div
              key={i}
              className={`no-row no-urgency-${order.urgency}${order.step === 3 ? " no-row-done" : ""}`}
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              <div className="no-row-avatar">{order.emoji}</div>

              <div className="no-row-info">
                <span className="no-row-id">{order.id}</span>
                <span className="no-row-customer">
                  {order.custAvatar} {order.customer}
                </span>
              </div>

              <div className="no-row-mid">
                <span
                  className={`no-status-badge ${NO_STATUS_CLS[order.step]}`}
                >
                  {NO_STATUS_LABEL[order.step]}
                </span>
                <span className="no-row-time">🕐 {order.timeAgo}</span>
              </div>

              <div className="no-row-right">
                <span className="no-row-total">{order.total}</span>
                {order.step < 3 ? (
                  <RippleBtn
                    className="no-btn-confirm"
                    onClick={() => advance(i)}
                  >
                    {NO_CONFIRM_LABELS[order.step]}
                  </RippleBtn>
                ) : (
                  <span className="no-done-tag">✅ Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const SupplierHome = ({ onSwitchToCustomer, onGoToDashboard, onNavigate }) => {
  /* Scroll reveal for all [data-reveal] elements */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Counter animation for trust stat */
  const counterRef = useRef(null);
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const target = 5230;
    const duration = 1800;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const startTime = performance.now();
        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(ease * target).toLocaleString() + "+";
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="sl-root">
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
          HERO
      ══════════════════════════════ */}
      <section className="sl-hero">
        {/* Animated orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="sl-hero-inner">
          <div className="sl-hero-text">
            <div className="sl-hero-pill">
              🌿 Vietnam’s #1 Platform Against Food Waste
            </div>
            <h1 className="sl-hero-h1">
              Turn Surplus Food <br />
              <span className="sl-gradient-text-hero">Into Real</span>
              <br />
              Revenue
            </h1>
            <p className="sl-hero-sub">
              Post end-of-day items in just <strong>60 seconds</strong>. Reach{" "}
              <strong>50,000+</strong> customers. Earn more from near-expiry
              stock.
            </p>
            <div className="sl-hero-btns">
              <RippleBtn
                className="sl-btn-hero-primary"
                onClick={onGoToDashboard}
              >
                📈 Go to Dashboard
              </RippleBtn>
              <RippleBtn
                className="sl-btn-hero-ghost"
                onClick={() => onNavigate?.("post")}
              >
                ➕ Post New Item
              </RippleBtn>
            </div>
            <div className="sl-hero-trust">
              <div className="trust-avatars">
                {["🧑‍🍳", "👩‍🍳", "🧑‍💼", "👩‍💼", "🧑‍🍽️"].map((e, i) => (
                  <span key={i} className="trust-av">
                    {e}
                  </span>
                ))}
              </div>
              <span className="trust-text">
                <strong ref={counterRef}>5,230+</strong> suppliers have joined
              </span>
            </div>
          </div>

          {/* Supplier Image */}
          <div className="sl-hero-mockup">
            <div className="supplier-img-container">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"
                alt="Alibaba Food Supplier"
                className="supplier-hero-img"
              />
              <div className="supplier-img-overlay" />
              <div className="supplier-img-label">
                <span className="sil-badge">🏪 Green Kitchen</span>
                <span className="sil-status">● Now Open</span>
              </div>
            </div>
            <div className="float-card float-card-1">
              <span>🎉</span>
              <div>
                <strong>New Order!</strong>
                <br />
                <small>2x Chicken Rice</small>
              </div>
            </div>
            <div className="float-card float-card-2">
              <span>🌿</span>
              <div>
                <strong>156kg CO₂ Saved</strong>
                <br />
                <small>This month</small>
              </div>
            </div>
            <div className="float-card float-card-3">
              <span>⭐</span>
              <div>
                <strong>New 5-Star Review</strong>
                <br />
                <small>"Absolutely delicious!"</small>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="sl-scroll-hint">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ══════════════════════════════
          POPULAR PRODUCTS (MOVED UP)
      ══════════════════════════════ */}
      <section className="sl-popular-products" data-reveal>
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">🔥 Best-selling on the platform</div>
            <h2 className="sl-section-h2">
              Most <span className="sl-gradient-text">Loved</span> Dishes
            </h2>
            <div className="sl-section-sub-row">
              <a href="#" className="pop-view-all-link">
                View all →
              </a>
            </div>
          </div>

          <PopularCarousel />
        </div>
      </section>

      {/* ══════════════════════════════
          NEW ORDERS
      ══════════════════════════════ */}
      <NewOrdersSection />

      {/* ══════════════════════════════
          STORE OVERVIEW (MERGED)
      ══════════════════════════════ */}
      <section className="sl-weekly-section" data-reveal>
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">📊 Store Overview</div>
            <div className="sl-section-sub-row">
              <h2 className="sl-section-h2">
                Your store <span className="sl-gradient-text">this week</span>
              </h2>
              <a href="#" className="pop-view-all-link">
                View full report →
              </a>
            </div>
          </div>

          <div className="ov-grid">
            {[
              {
                icon: "🥗",
                val: "85 servings",
                label: "Food Rescued",
                sub: "↑ +12% vs last week",
                good: true,
              },
              {
                icon: "💰",
                val: "2,800,000₫",
                label: "Revenue",
                sub: "↑ +8% vs last week",
                good: true,
              },
              {
                icon: "⭐",
                val: "4.7 ★",
                label: "Rating Score",
                sub: "42 new reviews",
                good: false,
              },
              {
                icon: "🏆",
                val: "Chicken Rice",
                label: "Best Seller",
                sub: "45 servings/week",
                good: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="ov-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="ov-icon">{item.icon}</div>
                <div className="ov-val">{item.val}</div>
                <div className="ov-label">{item.label}</div>
                <div className={`ov-sub${item.good ? " ov-sub-good" : ""}`}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          NOTIFICATIONS
      ══════════════════════════════ */}
      <section className="sl-notif-section" data-reveal>
        <div className="sl-container">
          <div className="notif-panel">
            <div className="np-header">
              <div className="np-title-row">
                <h2 className="sl-section-h2-sm">🔔 Notifications</h2>
                <span className="np-unread-badge">2 unread</span>
              </div>
              <p className="np-subtitle">Latest updates from your store</p>
            </div>
            <div className="np-list">
              {[
                {
                  icon: "⭐",
                  text: "New 5-star review from John Smith",
                  time: "5 min",
                  type: "success",
                  unread: true,
                },
                {
                  icon: "⚠️",
                  text: "Caesar Salad is expiring soon — action required",
                  time: "20 min",
                  type: "warn",
                  unread: true,
                },
                {
                  icon: "✅",
                  text: "Order #ORD-4815 completed · +120,000₫",
                  time: "1 hr",
                  type: "success",
                  unread: false,
                },
                {
                  icon: "📦",
                  text: "Customer picked up: Crispy Chicken Rice × 2",
                  time: "2 hrs",
                  type: "info",
                  unread: false,
                },
              ].map((n, i) => (
                <div
                  key={i}
                  className={`np-item np-${n.type}${n.unread ? " np-unread" : ""}`}
                  style={{ "--ni-delay": `${0.15 + i * 0.11}s` }}
                >
                  <div className={`np-icon-wrap np-icon-${n.type}`}>
                    {n.icon}
                  </div>
                  <div className="np-body">
                    <div className="np-text">{n.text}</div>
                    {n.unread && <span className="np-dot" />}
                  </div>
                  <span className="np-time">{n.time} ago</span>
                </div>
              ))}
            </div>
            <a href="#" className="np-see-all">
              View all notifications →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOD REVIEWS MARQUEE
      ══════════════════════════════ */}
      {(() => {
        const REVIEWS_A = [
          {
            dish: "🍜 Rich Beef Pho",
            shop: "Green Kitchen",
            stars: 5,
            text: "Deeply flavored broth, tender beef. Only 35k at 8pm — still worth queuing up in the rain!",
            img: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "James T.",
          },
          {
            dish: "🍱 Crispy Chicken Rice",
            shop: "Green Kitchen",
            stars: 5,
            text: "Perfectly crispy skin, fluffy rice, amazing ginger soy sauce. Grabbed the last 3 portions at 7:30 — so worth it!",
            img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Lily H.",
          },
          {
            dish: "🥗 Premium Caesar Salad",
            shop: "Green Kitchen",
            stars: 4,
            text: "Super fresh, perfectly balanced dressing, crunchy croutons. Ideal healthy office lunch option!",
            img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Amy Q.",
          },
          {
            dish: "🥐 BBQ Banh Mi",
            shop: "Green Kitchen",
            stars: 5,
            text: "Crispy bun, generous meat, perfect tomato sauce. Combo of 2 + drink for 45k — coming back every time!",
            img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Nathan T.",
          },
          {
            dish: "🍛 Fish Cake Noodles",
            shop: "Green Kitchen",
            stars: 5,
            text: "Buttery fish cakes, great pickled side. Clean kitchen, attentive service — solid 5 stars!",
            img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&h=240&q=80",
            buyer: "Barry C.",
          },
          {
            dish: "☕ Hanoi Egg Coffee",
            shop: "Green Kitchen",
            stars: 5,
            text: "Fluffy egg cream, rich dark coffee underneath. Only 38k — enjoyed it the whole morning shift!",
            img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Tina H.",
          },
        ];
        const REVIEWS_B = [
          {
            dish: "🍣 8-Piece Salmon Sushi Box",
            shop: "Green Kitchen",
            stars: 5,
            text: "Fresh salmon, not frozen! 40% off at 9pm — grab it fast. Restaurant quality at half price.",
            img: "https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Kevin M.",
          },
          {
            dish: "🍝 Beef Bolognese Pasta",
            shop: "Green Kitchen",
            stars: 5,
            text: "Pull-apart tender beef, complex herby sauce. One of those dishes you never forget. 55k and you're full till dinner!",
            img: "https://images.unsplash.com/photo-1543826173-1beeb97525d8?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Victor K.",
          },
          {
            dish: "🍰 Strawberry Cheesecake",
            shop: "Green Kitchen",
            stars: 4,
            text: "Silky smooth, fresh strawberries on top. Way cheaper than the big cafés. Bought 3 boxes at once!",
            img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Diana L.",
          },
          {
            dish: "🌮 Veggie Burrito",
            shop: "Green Kitchen",
            stars: 5,
            text: "Packed with veggies, mild salsa, tightly rolled. Best healthy option in the area — ordering every Friday!",
            img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Phoebe V.",
          },
          {
            dish: "🍱 Broken Rice with Pork",
            shop: "Green Kitchen",
            stars: 5,
            text: "Charred pork ribs, shredded pork skin, silky egg loaf. Authentic southern flavor. Queued 15 min — worth every second!",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Tyler D.",
          },
          {
            dish: "🍩 Matcha Cream Donut",
            shop: "Green Kitchen",
            stars: 5,
            text: "Crispy outside, thick matcha cream inside. Box of 6 at 30% off — perfect gift, got so many compliments!",
            img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=80&h=80&q=80",
            buyer: "Grace N.",
          },
        ];
        const ReviewCard = ({ r }) => (
          <div className="rv-card">
            <img className="rv-dish-img" src={r.img} alt={r.dish} />
            <div className="rv-body">
              <div className="rv-top">
                <span className="rv-dish">{r.dish}</span>
                <span className="rv-stars">{"⭐".repeat(r.stars)}</span>
              </div>
              <p className="rv-text">{r.text}</p>
              <span className="rv-buyer">— {r.buyer}</span>
            </div>
          </div>
        );
        return (
          <section className="sl-reviews">
            <div
              className="sl-section-header"
              style={{ textAlign: "center", marginBottom: "36px" }}
            >
              <div className="sl-chip">� What customers are saying</div>
              <h2 className="sl-section-h2">
                Reviews on your <span className="sl-gradient-text">dishes</span>
              </h2>
            </div>
            {/* Row 1 — left */}
            <div className="rv-track-wrap rv-left">
              <div className="rv-track">
                {[...REVIEWS_A, ...REVIEWS_A].map((r, i) => (
                  <ReviewCard key={i} r={r} />
                ))}
              </div>
            </div>
            {/* Row 2 — right */}
            <div
              className="rv-track-wrap rv-right"
              style={{ marginTop: "20px" }}
            >
              <div className="rv-track">
                {[...REVIEWS_B, ...REVIEWS_B].map((r, i) => (
                  <ReviewCard key={i} r={r} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══════════════════════════════
          PRICING
      ══════════════════════════════ */}
      <section className="sl-pricing" id="pricing">
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">💰 Pricing</div>
            <h2 className="sl-section-h2">
              Plans for every <span className="sl-gradient-text">scale</span>
            </h2>
            <p className="sl-section-sub">
              Start free, upgrade when you need more.
            </p>
          </div>
          <div className="pricing-grid">
            {[
              {
                name: "STARTER",
                color: "#f8faf6",
                badge: null,
                price: "Free",
                period: "/month",
                features: [
                  "Unlimited food listings",
                  "Basic order management",
                  "Core KPI dashboard",
                  "Auto countdown timer",
                  "Customer chat",
                  "❌ Advanced reports",
                  "❌ Priority support",
                ],
                btn: "Get Started",
                btnClass: "outline",
              },
              {
                name: "PRO",
                color: "linear-gradient(135deg,#c8ddac,#b3d99a)",
                badge: "🔥 POPULAR",
                price: "99,000₫",
                period: "/month",
                features: [
                  "All Starter features",
                  "Detailed reports & PDF export",
                  "Priority support 24/7",
                  "Up to 5 staff accounts",
                  "CO₂ stats & impact report",
                  "POS integration API",
                  "1-on-1 onboarding support",
                ],
                btn: "Upgrade Now",
                btnClass: "filled",
              },
              {
                name: "ENTERPRISE",
                color: "#f8faf6",
                badge: null,
                price: "Custom",
                period: "",
                features: [
                  "All Pro features",
                  "Full API integration",
                  "Unlimited staff accounts",
                  "Dedicated SLA & 24/7 support",
                  "Custom feature development",
                  "On-site team training",
                  "Custom reporting",
                ],
                btn: "Contact Sales",
                btnClass: "outline",
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`pricing-card ${p.badge ? "pricing-featured" : ""}`}
                style={{ background: p.color }}
              >
                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                <div className="pc-name">{p.name}</div>
                <div className="pc-price">
                  {p.price}
                  <span className="pc-period">{p.period}</span>
                </div>
                <ul className="pc-features">
                  {p.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
                <button className={`pc-btn pc-btn-${p.btnClass}`}>
                  {p.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FAQ
      ══════════════════════════════ */}
      <section className="sl-faq" id="faq">
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">❓ Frequently Asked Questions</div>
            <h2 className="sl-section-h2">
              Everything you{" "}
              <span className="sl-gradient-text">need to know</span>
            </h2>
          </div>
          <div className="faq-grid">
            {[
              {
                q: "How do I register as a supplier?",
                a: "It's simple: 1) Fill in your store info, 2) Upload your food safety license, 3) Wait up to 24h for approval. After that you can start listing immediately.",
              },
              {
                q: "What fees does AlibabaFood charge per order?",
                a: "The Starter plan is completely free. The Pro plan charges a flat 99,000₫/month — no commission on individual orders. You keep 100% of your revenue.",
              },
              {
                q: "Can I withdraw earnings to my bank account?",
                a: "Yes! Withdraw anytime to your bank account or e-wallets (Momo, ZaloPay). Funds arrive within 1–3 business days.",
              },
              {
                q: "How does the food safety system work?",
                a: "The app auto-calculates safe windows based on food type (cooked rice: 4h, bread: 6h, etc.). When the window expires, listings are auto-hidden. Three violations result in account suspension.",
              },
              {
                q: "What equipment do I need?",
                a: "Just one smartphone (iOS or Android) with a camera and internet connection. No computer, printer, or additional hardware required.",
              },
              {
                q: "Is the platform available in English?",
                a: "Yes! AlibabaFood supports both Vietnamese and English. The dashboard and all features are fully bilingual.",
              },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL
      ══════════════════════════════ */}
      <section className="sl-cta">
        {/* Image collage background */}
        <div className="cta-collage">
          <img
            src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&h=1000&q=70"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&h=1000&q=70"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&h=1000&q=70"
            alt=""
          />
          <img
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&h=1000&q=70"
            alt=""
          />
        </div>
        <div className="cta-collage-overlay" />
        <div className="sl-container">
          <div className="cta-inner">
            <div className="cta-icon-row">🥡🌿✨</div>
            <h2 className="cta-h2">
              Have Surplus Food
              <br />
              <span className="sl-gradient-text-light">Today</span>?
            </h2>
            <p className="cta-sub">
              Post in just <strong>60 seconds</strong> — reach 50,000+ hungry
              customers waiting to buy.
            </p>
            <div className="cta-btns">
              <RippleBtn
                className="sl-btn-cta-primary"
                onClick={() => onNavigate?.("post")}
              >
                ➕ Post Food Now
              </RippleBtn>
              <RippleBtn className="sl-btn-cta-ghost" onClick={onGoToDashboard}>
                📊 Go to Dashboard
              </RippleBtn>
            </div>
            <p className="cta-small">
              ✅ Free to list &nbsp;·&nbsp; ✅ Go live instantly &nbsp;·&nbsp;
              ✅ 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer className="sl-footer">
        <div className="sl-container">
          <div className="sl-footer-grid">
            <div className="sl-footer-brand">
              <img
                src="/alibaba-logo.png"
                alt="Alibaba Food"
                className="footer-logo"
              />
              <p>
                Vietnam's #1 food waste reduction platform — connecting
                suppliers with smart consumers.
              </p>
              <div className="footer-socials">
                <a href="#">📘</a>
                <a href="#">📸</a>
                <a href="#">🎵</a>
                <a href="#">💼</a>
              </div>
            </div>
            <div className="sl-footer-col">
              <h4>Supplier</h4>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li>
                  <a href="#">Order Management</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="sl-footer-col">
              <h4>Policies</h4>
              <ul>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Food Safety Policy</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Dispute Process</a>
                </li>
              </ul>
            </div>
            <div className="sl-footer-col">
              <h4>Support</h4>
              <ul>
                <li>
                  📞 <strong>1900-xxxx</strong> (Free)
                </li>
                <li>💬 Zalo OA: AlibabaFood</li>
                <li>📧 supplier@alibabafood.vn</li>
                <li>🕐 Support 8:00 – 22:00</li>
              </ul>
            </div>
          </div>
          <div className="sl-footer-bottom">
            <p>
              © 2026 Alibaba Food. All rights reserved. &nbsp;·&nbsp; Version
              2.4.1
            </p>
            <div className="footer-legal">
              <a href="#">Home</a>
              <a href="#">Terms</a>
              <a href="#">Food Safety Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupplierHome;
