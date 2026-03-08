import React, { useState, useEffect } from "react";
import "./SupplierInventory.css";
import SupplierNavbar from "./SupplierNavbar";

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

const INITIAL_ITEMS = [
  {
    id: 1,
    emoji: "🍗",
    image: UNSPLASH("1512058564366-18510be2db19"),
    name: "Crispy Chicken Rice",
    category: "Rice",
    qty: 12,
    price: "55,000₫",
    expireH: 3,
    status: "active",
  },
  {
    id: 2,
    emoji: "🥗",
    image: UNSPLASH("1512621776951-a57141f2eefd"),
    name: "Caesar Salad Bowl",
    category: "Salad",
    qty: 4,
    price: "55,000₫",
    expireH: 5,
    status: "active",
  },
  {
    id: 3,
    emoji: "🧋",
    image: UNSPLASH("1558618666-fcd25c85cd64"),
    name: "Bubble Milk Tea",
    category: "Drinks",
    qty: 20,
    price: "30,000₫",
    expireH: 8,
    status: "active",
  },
  {
    id: 4,
    emoji: "🍜",
    image: UNSPLASH("1569718212165-3a8278d5f624"),
    name: "Signature Pho",
    category: "Noodles",
    qty: 2,
    price: "65,000₫",
    expireH: 1.5,
    status: "active",
  },
  {
    id: 5,
    emoji: "🥐",
    image: UNSPLASH("1482049016688-2d3e1b311543"),
    name: "BBQ Banh Mi",
    category: "Sandwich",
    qty: 9,
    price: "27,000₫",
    expireH: 4,
    status: "active",
  },
  {
    id: 6,
    emoji: "🍣",
    image: UNSPLASH("1617196034183-421b4040ed20"),
    name: "Salmon Sushi Box",
    category: "Sushi",
    qty: 0,
    price: "85,000₫",
    expireH: 2,
    status: "out",
  },
  {
    id: 7,
    emoji: "☕",
    image: UNSPLASH("1509042239860-f550ce710b93"),
    name: "Hanoi Egg Coffee",
    category: "Drinks",
    qty: 7,
    price: "38,000₫",
    expireH: 6,
    status: "active",
  },
  {
    id: 8,
    emoji: "🍩",
    image: UNSPLASH("1551024506-0bccd828d307"),
    name: "Matcha Cream Donut",
    category: "Dessert",
    qty: 3,
    price: "22,000₫",
    expireH: 9,
    status: "active",
  },
  {
    id: 9,
    emoji: "🍱",
    image: UNSPLASH("1547592180-85f783d837c4"),
    name: "Seafood Bento Box",
    category: "Bento",
    qty: 6,
    price: "72,000₫",
    expireH: 3.5,
    status: "active",
  },
  {
    id: 10,
    emoji: "🥩",
    image: UNSPLASH("1432139555-477436a943be"),
    name: "Broken Rice with Pork",
    category: "Rice",
    qty: 1,
    price: "48,000₫",
    expireH: 1,
    status: "active",
  },
];

const CATEGORIES = [
  "All",
  "Rice",
  "Salad",
  "Drinks",
  "Noodles",
  "Sandwich",
  "Sushi",
  "Dessert",
  "Bento",
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
  if (h < 1) return `${Math.round(h * 60)} min left`;
  if (h < 24) return `${h}h left`;
  return `${Math.floor(h / 24)}d left`;
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
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState("");

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

  const saveEdit = (id) => {
    const n = parseInt(editQty, 10);
    if (!isNaN(n) && n >= 0) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? { ...it, qty: n, status: n === 0 ? "out" : "active" }
            : it,
        ),
      );
    }
    setEditId(null);
    setEditQty("");
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const filtered = items.filter((it) => {
    const matchCat = catFilter === "All" || it.category === catFilter;
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
          <div className="si-header-badge">📦 Inventory Manager</div>
          <h1 className="si-page-title">Your Food Inventory</h1>
          <p className="si-page-sub">
            Manage stock levels, track expiry windows, and keep your menu fresh
            — all in one place.
          </p>
          <button className="si-hero-cta" onClick={() => onNavigate?.("post")}>
            ➕ Add New Item
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
            label: "Total Items",
            val: totalItems,
            cls: "si-sb-total",
            bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "⚠️",
            label: "Low Stock",
            val: lowStock,
            cls: "si-sb-low",
            bg: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "⏱️",
            label: "Expiring Today",
            val: expiringToday,
            cls: "si-sb-expiring",
            bg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=200&q=60",
          },
          {
            icon: "❌",
            label: "Out of Stock",
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
            placeholder="Search items by name..."
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
          ➕ Add New Item
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
            <div className="si-empty-title">No items found</div>
            <div className="si-empty-sub">
              Try a different search term or category filter.
            </div>
            <button
              className="si-add-btn"
              style={{ marginTop: 16 }}
              onClick={() => onNavigate?.("post")}
            >
              ➕ Post Your First Item
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
                    {item.isNew && <div className="si-new-badge">✨ NEW</div>}
                    <div
                      className={`si-card-status-badge ${item.qty === 0 ? "out" : urg}`}
                    >
                      {item.qty === 0
                        ? "Out of Stock"
                        : item.expireH < 2
                          ? "Expiring Soon"
                          : "Active"}
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
                            ? "⛔ Out of stock"
                            : `⏱ ${fmtExpiry(item.expireH)}`}
                        </span>
                        <span className="si-qty-chip">
                          <span
                            className={`si-qty-dot ${item.qty === 0 ? "zero" : item.qty < 5 ? "low" : "ok"}`}
                          />
                          {item.qty} left
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
                            ✓ Save
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
                          ✏️ Edit Qty
                        </button>
                      )}
                      <button
                        className="si-del-btn"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
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
                <div className="si-add-card-title">Add New Item</div>
                <div className="si-add-card-sub">
                  Post a new dish and reach 50,000+ customers
                </div>
                <span className="si-add-card-btn">Post Now →</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierInventory;
