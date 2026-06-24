import React, { useState, useEffect, useRef } from "react";
import "./SupplierHome.css";
import SupplierNavbar from "./SupplierNavbar";
import {
  getSupplierProfile,
  getSupplierStats,
  getSupplierOrders,
  getPopularProducts,
  getSupplierReviews,
  getSupplierFoodItems,
  updateFoodItem,
} from "../../services/supplierService";
import toast from "react-hot-toast";

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
    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Coca Cola Original 330ml",
    supplier: "Siêu thị WinMart",
    price: "10.000đ",
    orders: "316 đơn",
    rating: "4.9",
    reviews: "68 đánh giá",
    timeLeft: "2h 10m",
    badge: "HOT",
  },
  {
    img: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Pepsi Lon 330ml",
    supplier: "Siêu thị WinMart",
    price: "9.000đ",
    orders: "284 đơn",
    rating: "4.8",
    reviews: "54 đánh giá",
    timeLeft: "1h 55m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Sữa Vinamilk Không Đường 1L",
    supplier: "Siêu thị WinMart",
    price: "38.000đ",
    orders: "197 đơn",
    rating: "5.0",
    reviews: "41 đánh giá",
    timeLeft: "3h 20m",
    badge: "TOP",
  },
  {
    img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Bánh Oreo Socola",
    supplier: "Tiệm bánh Ngọt Ngào",
    price: "18.000đ",
    orders: "144 đơn",
    rating: "4.8",
    reviews: "29 đánh giá",
    timeLeft: "0h 58m",
    badge: "HOT",
  },
  {
    img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Snack Lay's Khoai Tây",
    supplier: "Siêu thị Bach Hoa Xanh",
    price: "15.000đ",
    orders: "131 đơn",
    rating: "4.7",
    reviews: "36 đánh giá",
    timeLeft: "4h 05m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Bánh AFC Rau Củ",
    supplier: "Siêu thị Bach Hoa Xanh",
    price: "32.000đ",
    orders: "87 đơn",
    rating: "4.9",
    reviews: "22 đánh giá",
    timeLeft: "2h 42m",
    badge: "",
  },
  {
    img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Mì Hảo Hảo Tôm Chua Cay",
    supplier: "Siêu thị WinMart",
    price: "5.000đ",
    orders: "402 đơn",
    rating: "4.8",
    reviews: "76 đánh giá",
    timeLeft: "1h 28m",
    badge: "HOT",
  },
  {
    img: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=400&h=240&q=80",
    name: "Xúc Xích CP",
    supplier: "Siêu thị Bach Hoa Xanh",
    price: "28.000đ",
    orders: "112 đơn",
    rating: "4.7",
    reviews: "31 đánh giá",
    timeLeft: "3h 12m",
    badge: "TOP",
  },
];

const CARD_W = 296; // 280px card + 16px gap

const PopularCarousel = ({ items }) => {
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const halfWidth = useRef(items.length * CARD_W);

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
  }, [items]);

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
        aria-label="Trước"
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
          {[...items, ...items].map((p, i) => (
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
                    {p.badge === "HOT"
                      ? "🔥 NÓNG"
                      : p.badge === "TOP"
                        ? "🏆 HÀNG ĐẦU"
                        : p.badge}
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
                  <span className="pop-card-price">{p.price}/suần</span>
                  <RippleBtn className="pop-detail-btn">
                    Xem Chi Tiết →
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
        aria-label="Tiếp"
      >
        ›
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FOOD REVIEWS MARQUEE (module-scope data & card)
───────────────────────────────────────────── */
const REVIEWS_A = [
  {
    dish: "🍜 Phở Bò Đậm Đà",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Nước dùng đậm đà, thịt bò mềm. Chỉ 35k lúc 8h tối — vẫn đáng xếp hàng trong mưa!",
    img: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Tuấn Anh.",
  },
  {
    dish: "🍱 Cơm Gà Giòn",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Da gà giòn rụm, cơm tơi xốp, nước tương gừng tuyệt hảo. Mua được 3 suất cuối lúc 7:30 — quá xứng đáng!",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Hoa L.",
  },
  {
    dish: "🥗 Salad Caesar Cao Cấp",
    shop: "Bếp Xanh",
    stars: 4,
    text: "Rất tươi, nước xốt vừa vặn, bánh mì giòn. Lựa chọn lý tưởng cho bữa trưa văn phòng!",
    img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Quỳnh A.",
  },
  {
    dish: "🥐 Bánh Mì Thịt Nướng",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Bánh giòn, nhân thịt dồi dào, xốt cà chua hoàn hảo. Combo 2 bánh + nước chỉ 45k — sẽ ghé lại!",
    img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Nam T.",
  },
  {
    dish: "🍛 Bún Chả Cá",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Chả cá béo ngậy, đồ chua tuyệt vời. Bếp sạch sẽ, phục vụ chu đáo — đánh giá 5 sao chuẩn!",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&h=240&q=80",
    buyer: "Chí B.",
  },
  {
    dish: "☕ Cà Phê Trứng Hà Nội",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Kem trứng bông mịn, cà phê đậm vị. Chỉ 38k — nhâm nhi đủ cả buổi sáng!",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Thu H.",
  },
];
const REVIEWS_B = [
  {
    dish: "🍣 Hộp Sushi Cá Hồi 8 Miếng",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Cá hồi tươi, không phải đồ đông lạnh! Giảm 40% lúc 9h tối — phải mua lẹ. Chất lượng nhà hàng giá hạt dẻ.",
    img: "https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Minh K.",
  },
  {
    dish: "🍝 Mì Ý Bò Bằm",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Thịt bò mềm tan, sốt thảo mộc cực thơm. Một món ăn khó quên. 55k mà no ứ hự!",
    img: "https://images.unsplash.com/photo-1543826173-1beeb97525d8?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Việt V.",
  },
  {
    dish: "🍰 Bánh Phô Mai Dâu Tây",
    shop: "Bếp Xanh",
    stars: 4,
    text: "Mềm mịn, dâu tươi roi rói. Rẻ hơn chán vạn mấy cái quán cà phê lớn. Mua luôn 3 hộp về ăn dần!",
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Diệu L.",
  },
  {
    dish: "🌮 Burrito Rau Củ",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Nhồi đầy ắp rau củ, xốt salsa dịu nhẹ, cuốn chặt tay. Lựa chọn healthy best chóp khu này — tuần nào cũng gọi!",
    img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Phương V.",
  },
  {
    dish: "🍱 Cơm Tấm Sườn Bì Chả",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Sườn nướng cháy cạnh, bì giòn, chả trứng béo. Đậm chất miền Nam. Chờ 15 phút mà bõ công!",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Tiến D.",
  },
  {
    dish: "🍩 Bánh Donut Kem Matcha",
    shop: "Bếp Xanh",
    stars: 5,
    text: "Ngoài giòn, trong nhân matcha béo ngậy. Hộp 6 cái sale 30% — mua đi biếu ai cũng khen ngợi!",
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=80&h=80&q=80",
    buyer: "Ngọc N.",
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

/* ─────────────────────────────────────────────
   New Orders Section
───────────────────────────────────────────── */
const NEW_ORDERS_DATA = [
  {
    id: "#ORD-4821",
    emoji: "🍗",
    items: ["Cơm Gà Hội An × 2", "Trà Đá × 2"],
    customer: "Nguyễn Văn A",
    custAvatar: "🧑",
    total: "165,000₫",
    timeAgo: "2 phút trước",
    urgency: "high",
    step: 0,
    note: "Ít cay, không ngò",
  },
  {
    id: "#ORD-4820",
    emoji: "🧋",
    items: ["Trà Sữa Trân Châu × 3"],
    customer: "Lê Thị B",
    custAvatar: "👩",
    total: "90,000₫",
    timeAgo: "8 phút trước",
    urgency: "medium",
    step: 1,
    note: "",
  },
  {
    id: "#ORD-4819",
    emoji: "🥗",
    items: ["Salad Gà Caesar × 1", "Nước Cam × 1"],
    customer: "Trần Văn C",
    custAvatar: "🧑‍💼",
    total: "78,000₫",
    timeAgo: "15 phút trước",
    urgency: "low",
    step: 2,
    note: "Nước xốt để riêng",
  },
  {
    id: "#ORD-4818",
    emoji: "🍜",
    items: ["Phở Đặc Biệt × 2"],
    customer: "Phạm Thị D",
    custAvatar: "👩‍🍽️",
    total: "112,000₫",
    timeAgo: "22 phút trước",
    urgency: "low",
    step: 3,
    note: "",
  },
];

const NO_PIPELINE = ["Đã Nhận", "Đã Xác Nhận", "Đang Chuẩn Bị", "Đã Xong"];
const NO_CONFIRM_LABELS = ["✓ Xác Nhận", "👨‍🍳 Chuẩn Bị", "🔔 Xong"];
const NO_STATUS_LABEL = [
  "Chờ xử lý",
  "Đang chuẩn bị",
  "Đang làm",
  "Hoàn thành",
];
const NO_STATUS_CLS = [
  "no-st-pending",
  "no-st-confirmed",
  "no-st-making",
  "no-st-ready",
];

const NewOrdersSection = ({ orders: ordersProp, onAdvanceOrder }) => {
  const [orders, setOrders] = useState(ordersProp);

  useEffect(() => {
    setOrders(ordersProp);
  }, [ordersProp]);

  const advance = (idx) => {
    setOrders((prev) =>
      prev.map((o, i) =>
        i === idx ? { ...o, step: Math.min(o.step + 1, 3) } : o,
      ),
    );
    if (onAdvanceOrder && orders[idx]) {
      onAdvanceOrder(orders[idx].id);
    }
  };

  return (
    <section className="sl-new-orders-section" data-reveal>
      <div className="sl-container">
        {/* Header */}
        <div className="no-header">
          <div className="no-header-left">
            <div className="sl-chip">
              <span className="no-live-dot" /> Cập nhật trực tiếp
            </div>
            <h2 className="sl-section-h2">
              <span className="sl-gradient-text">Đơn Hàng</span> Mới
            </h2>
          </div>
          <button className="sl-link-btn no-view-all">
            Xem tất cả đơn hàng →
          </button>
        </div>

        {/* Summary stats */}
        <div className="no-stats-row">
          {[
            { icon: "⏳", val: "3", label: "Chờ xử lý", cls: "no-sp-pending" },
            { icon: "🔄", val: "5", label: "Đang xử lý", cls: "no-sp-active" },
            { icon: "✅", val: "28", label: "Xong hôm nay", cls: "no-sp-done" },
            { icon: "💰", val: "1.4trđ", label: "Doanh thu", cls: "no-sp-rev" },
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
                  <span className="no-done-tag">✅ Đã hoàn thành</span>
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
  const [popularItems, setPopularItems] = useState(POPULAR_ITEMS);
  const [reviews, setReviews] = useState([...REVIEWS_A, ...REVIEWS_B]);
  const [newOrders, setNewOrders] = useState(NEW_ORDERS_DATA);
  const [supplierItems, setSupplierItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [supplierProfile, setSupplierProfile] = useState({
    businessName: "Bếp Xanh",
    description: "",
    addressLine1: "",
    city: "",
  });
  const [supplierStats, setSupplierStats] = useState({
    total_food_saved_kg: 0,
    total_revenue: 0,
    average_rating: 0,
    total_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  const normalizeSupplierStats = (stats) => {
    if (!stats)
      return {
        total_food_saved_kg: 0,
        total_revenue: 0,
        average_rating: 0,
        total_orders: 0,
      };

    return {
      total_food_saved_kg:
        stats.total_food_saved_kg ??
        stats.totalFoodSavedKg ??
        stats.total_food_saved_kg ??
        0,
      total_revenue:
        stats.total_revenue ?? stats.totalRevenue ?? stats.TotalRevenue ?? 0,
      average_rating:
        stats.average_rating ?? stats.averageRating ?? stats.AverageRating ?? 0,
      total_orders:
        stats.total_orders ?? stats.totalOrders ?? stats.TotalOrders ?? 0,
    };
  };

  // Fetch data from API
  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true);
        // Fetch supplier profile
        const profileData = await getSupplierProfile();
        if (profileData) {
          setSupplierProfile({
            businessName:
              profileData.businessName ??
              profileData.BusinessName ??
              "Bếp Xanh",
            description:
              profileData.description ?? profileData.Description ?? "",
            addressLine1:
              profileData.addressLine1 ?? profileData.AddressLine1 ?? "",
            city: profileData.city ?? profileData.City ?? "",
          });
        }

        // Fetch supplier stats
        const statsData = await getSupplierStats();
        setSupplierStats(normalizeSupplierStats(statsData));

        // Fetch popular products
        const popularData = await getPopularProducts();
        if (popularData && popularData.length > 0) {
          setPopularItems(popularData);
        }

        // Fetch supplier reviews
        const reviewsData = await getSupplierReviews();
        if (reviewsData && reviewsData.length > 0) {
          setReviews(reviewsData);
        }

        // Fetch new orders
        const ordersData = await getSupplierOrders("pending");
        if (ordersData && ordersData.length > 0) {
          setNewOrders(ordersData);
        }
        // Fetch supplier items (for SupplierHome editing)
        const itemsData = await getSupplierFoodItems();
        if (itemsData && itemsData.length > 0) {
          setSupplierItems(itemsData);
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        // Keep using hardcoded data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);

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
              🌿 Nền Tảng Chống Lãng Phí Thực Phẩm Số 1 Việt Nam
            </div>
            <h1 className="sl-hero-h1">
              Biến Thực Phẩm Cuối ngày <br />
              <span className="sl-gradient-text-hero">Thành Doanh Thu</span>
              <br />
              Thực Tế
            </h1>
            <p className="sl-hero-sub">
              Đăng sản phẩm cuối ngày chỉ trong <strong>60 giây</strong>. Tiếp
              cận <strong>50,000+</strong> khách hàng. Tăng thu nhập từ hàng cận
              date.
            </p>
            <div className="sl-hero-btns">
              <RippleBtn
                className="sl-btn-hero-primary"
                onClick={onGoToDashboard}
              >
                📈 Đến Bảng Phân Tích
              </RippleBtn>
              <RippleBtn
                className="sl-btn-hero-ghost"
                onClick={() => onNavigate?.("post")}
              >
                ➕ Đăng Món Mới
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
                <strong ref={counterRef}>5,230+</strong> cửa hàng đã tham gia
              </span>
            </div>
          </div>

          {/* Supplier Image */}
          <div className="sl-hero-mockup">
            <div className="supplier-img-container">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"
                alt="Ảnh nhà cung cấp Alibaba Food"
                className="supplier-hero-img"
              />
              <div className="supplier-img-overlay" />
              <div className="supplier-img-label">
                <span className="sil-badge">
                  🏪 {supplierProfile.businessName}
                </span>
                <span className="sil-status">● Đang Mở Cửa</span>
              </div>
            </div>
            <div className="float-card float-card-1">
              <span>🎉</span>
              <div>
                <strong>Đơn Hàng Mới!</strong>
                <br />
                <small>2x Cơm Gà Hội An</small>
              </div>
            </div>
            <div className="float-card float-card-2">
              <span>🌿</span>
              <div>
                <strong>Đã Cứu 156kg CO₂</strong>
                <br />
                <small>Tháng này</small>
              </div>
            </div>
            <div className="float-card float-card-3">
              <span>⭐</span>
              <div>
                <strong>Đánh Giá 5 Sao Mới</strong>
                <br />
                <small>"Ngon tuyệt vời!"</small>
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
            <div className="sl-chip">🔥 Bán chạy trên nền tảng</div>
            <h2 className="sl-section-h2">
              Món Ăn <span className="sl-gradient-text">Được Yêu Thích</span>{" "}
              Nhất
            </h2>
            <div className="sl-section-sub-row">
              <a href="#" className="pop-view-all-link">
                Xem tất cả →
              </a>
            </div>
          </div>

          <PopularCarousel items={popularItems} />
        </div>
      </section>

      {/* ══════════════════════════════
          MY ITEMS (Supplier editable list + detail modal)
      ══════════════════════════════ */}
      <section className="sl-my-items" data-reveal>
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">🧾 Danh Sách Món Của Tôi</div>
            <h2 className="sl-section-h2">
              Món Đang Bán <span className="sl-gradient-text">(Quản lý)</span>
            </h2>
            <div className="sl-section-sub-row">
              <small>
                Nhấn vào 1 món để xem chi tiết và sửa (chỉ Supplier).
              </small>
            </div>
          </div>

          <div className="mi-grid">
            {(supplierItems.length > 0 ? supplierItems : []).map((it, i) => {
              const itemId =
                it.id ?? it.itemId ?? it.foodItemId ?? it.food_item_id;
              const name =
                it.itemName ??
                it.ItemName ??
                it.name ??
                it.Name ??
                it.item_name ??
                "Không tên";
              const img =
                it.imageUrl ??
                it.image_url ??
                it.img ??
                it.image ??
                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=60";
              const price =
                it.discountedPrice ??
                it.discountPrice ??
                it.price ??
                it.originalPrice ??
                it.original_price ??
                0;
              return (
                <div
                  key={i}
                  className="mi-card"
                  onClick={() => {
                    setSelectedItem(it);
                    setItemModalOpen(true);
                  }}
                >
                  <div className="mi-img-wrap">
                    <img src={img} alt={name} />
                  </div>
                  <div className="mi-body">
                    <div className="mi-name">{name}</div>
                    <div className="mi-price">
                      {Number(price).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Item Detail / Edit Modal */}
      {itemModalOpen && selectedItem && (
        <div
          className="mi-modal-overlay"
          onClick={() => setItemModalOpen(false)}
        >
          <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết món</h3>
            <div className="mi-modal-grid">
              <div className="mi-modal-img">
                <img
                  src={
                    selectedItem.imageUrl ??
                    selectedItem.image_url ??
                    selectedItem.img ??
                    selectedItem.image
                  }
                  alt=""
                />
              </div>
              <div className="mi-modal-form">
                <label>Tên</label>
                <input
                  defaultValue={
                    selectedItem.itemName ??
                    selectedItem.ItemName ??
                    selectedItem.name
                  }
                  id="mi-name"
                />
                <label>Mô tả</label>
                <textarea
                  defaultValue={
                    selectedItem.description ??
                    selectedItem.Description ??
                    selectedItem.desc
                  }
                  id="mi-desc"
                />
                <label>Giá gốc</label>
                <input
                  defaultValue={
                    selectedItem.originalPrice ??
                    selectedItem.original_price ??
                    selectedItem.price
                  }
                  id="mi-original"
                />
                <label>Giá giảm</label>
                <input
                  defaultValue={
                    selectedItem.discountedPrice ?? selectedItem.discountPrice
                  }
                  id="mi-discount"
                />
                <label>Số lượng</label>
                <input
                  defaultValue={
                    selectedItem.quantityAvailable ??
                    selectedItem.quantity ??
                    selectedItem.qty
                  }
                  id="mi-qty"
                />
                <div className="mi-modal-actions">
                  <button
                    className="pc-btn pc-btn-outline"
                    onClick={() => setItemModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="pc-btn pc-btn-filled"
                    onClick={async () => {
                      try {
                        const payload = {
                          itemName: document.getElementById("mi-name").value,
                          description: document.getElementById("mi-desc").value,
                          originalPrice:
                            Number(
                              document.getElementById("mi-original").value,
                            ) || 0,
                          discountedPrice:
                            Number(
                              document.getElementById("mi-discount").value,
                            ) || 0,
                          quantityAvailable:
                            Number(document.getElementById("mi-qty").value) ||
                            0,
                        };
                        const id =
                          selectedItem.id ??
                          selectedItem.itemId ??
                          selectedItem.foodItemId ??
                          selectedItem.food_item_id;
                        await updateFoodItem(id, payload);
                        // update local list
                        setSupplierItems((prev) =>
                          prev.map((p) => {
                            const pid =
                              p.id ??
                              p.itemId ??
                              p.foodItemId ??
                              p.food_item_id;
                            if (pid === id) return { ...p, ...payload };
                            return p;
                          }),
                        );
                        toast.success("Cập nhật món thành công");
                        setItemModalOpen(false);
                      } catch (err) {
                        console.error("Update item failed", err);
                        toast.error("Cập nhật món thất bại");
                      }
                    }}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          NEW ORDERS
      ══════════════════════════════ */}
      <NewOrdersSection
        orders={newOrders}
        onAdvanceOrder={async (orderId) => {
          try {
            // Call API to update order status
            // await updateOrderStatus(orderId, 'confirmed');
            console.log("Advance order:", orderId);
          } catch (error) {
            console.error("Error advancing order:", error);
          }
        }}
      />

      {/* ══════════════════════════════
          STORE OVERVIEW (MERGED)
      ══════════════════════════════ */}
      <section className="sl-weekly-section" data-reveal>
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">📊 Tổng Quan Cửa Hàng</div>
            <div className="sl-section-sub-row">
              <h2 className="sl-section-h2">
                Cửa hàng <span className="sl-gradient-text">tuần này</span>
              </h2>
              <a href="#" className="pop-view-all-link">
                Xem toàn bộ báo cáo →
              </a>
            </div>
          </div>

          <div className="ov-grid">
            {[
              {
                icon: "🥗",
                val: supplierStats
                  ? `${supplierStats.total_food_saved_kg} kg`
                  : "85 suất",
                label: "Thực Phẩm Được Cứu",
                sub: "↑ +12% so với tuần trước",
                good: true,
              },
              {
                icon: "💰",
                val: `${Number(supplierStats.total_revenue || 0).toLocaleString("vi-VN")}₫`,
                label: "Doanh Thu",
                sub: "↑ +8% so với tuần trước",
                good: true,
              },
              {
                icon: "⭐",
                val: `${Number(supplierStats.average_rating || 0).toFixed(1)} ★`,
                label: "Điểm Đánh Giá",
                sub: `${Number(supplierStats.total_orders || 0)} đánh giá`,
                good: false,
              },
              {
                icon: "🏆",
                val: "Cơm Gà Hội An",
                label: "Bán Chạy Nhất",
                sub: "45 suất/tuần",
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
                <h2 className="sl-section-h2-sm">🔔 Thông Báo</h2>
                <span className="np-unread-badge">2 chưa đọc</span>
              </div>
              <p className="np-subtitle">Cập nhật mới nhất từ cửa hàng</p>
            </div>
            <div className="np-list">
              {[
                {
                  icon: "⭐",
                  text: "Đánh giá 5 sao mới từ Nguyễn Văn A",
                  time: "5 phút",
                  type: "success",
                  unread: true,
                },
                {
                  icon: "⚠️",
                  text: "Salad Caesar sắp hết hạn — Cần xử lý",
                  time: "20 phút",
                  type: "warn",
                  unread: true,
                },
                {
                  icon: "✅",
                  text: "Đơn hàng #ORD-4815 đã hoàn thành · +120,000₫",
                  time: "1 giờ",
                  type: "success",
                  unread: false,
                },
                {
                  icon: "📦",
                  text: "Khách đã lấy: Cơm Gà Hội An × 2",
                  time: "2 giờ",
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
                  <span className="np-time">{n.time} trước</span>
                </div>
              ))}
            </div>
            <a href="#" className="np-see-all">
              Xem tất cả thông báo →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PRICING
      ══════════════════════════════ */}
      <section className="sl-pricing" id="pricing">
        <div className="sl-container">
          <div className="sl-section-header">
            <div className="sl-chip">💰 Giá & Gói</div>
            <h2 className="sl-section-h2">
              Gói dành cho mọi <span className="sl-gradient-text">quy mô</span>
            </h2>
            <p className="sl-section-sub">
              Bắt đầu miễn phí, nâng cấp khi bạn cần thêm tính năng.
            </p>
          </div>

          <div className="pricing-grid">
            {[
              {
                name: "Cơ Bản",
                color: "#f8faf6",
                badge: null,
                price: "Miễn phí",
                period: "",
                features: [
                  "Đăng món không giới hạn",
                  "Quản lý đơn cơ bản",
                  "Bảng chỉ số chính (KPI)",
                  "Đồng hồ đếm ngược tự động",
                  "Chat với khách hàng",
                  "❌ Báo cáo nâng cao",
                  "❌ Hỗ trợ ưu tiên",
                ],
                btn: "Bắt đầu",
                btnClass: "outline",
              },
              {
                name: "PRO",
                color: "linear-gradient(135deg,#c8ddac,#b3d99a)",
                badge: "🔥 PHỔ BIẾN",
                price: "99,000₫",
                period: "/tháng",
                features: [
                  "Gồm tất cả tính năng Cơ Bản",
                  "Báo cáo chi tiết & xuất PDF",
                  "Hỗ trợ ưu tiên 24/7",
                  "Được tới 5 tài khoản nhân viên",
                  "Báo cáo tác động CO₂",
                  "API tích hợp POS",
                  "Hỗ trợ onboarding 1:1",
                ],
                btn: "Nâng cấp ngay",
                btnClass: "filled",
              },
              {
                name: "Doanh Nghiệp",
                color: "#f8faf6",
                badge: null,
                price: "Tùy chỉnh",
                period: "",
                features: [
                  "Gồm tất cả tính năng Pro",
                  "Tích hợp API đầy đủ",
                  "Số lượng tài khoản nhân viên không giới hạn",
                  "SLA & hỗ trợ 24/7",
                  "Phát triển tính năng theo yêu cầu",
                  "Đào tạo tại chỗ",
                  "Báo cáo tùy chỉnh",
                ],
                btn: "Liên hệ bán hàng",
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
            <div className="sl-chip">❓ Câu Hỏi Thường Gặp</div>
            <h2 className="sl-section-h2">
              Mọi điều <span className="sl-gradient-text">bạn cần biết</span>
            </h2>
          </div>
          <div className="faq-grid">
            {[
              {
                q: "Làm sao để đăng ký làm nhà cung cấp?",
                a: "Rất đơn giản: 1) Điền thông tin cửa hàng, 2) Tải giấy phép an toàn thực phẩm, 3) Chờ duyệt trong vòng 24 giờ. Sau khi duyệt xong bạn có thể đăng sản phẩm ngay.",
              },
              {
                q: "AlibabaFood thu phí gì trên mỗi đơn hàng?",
                a: "Gói Cơ Bản hoàn toàn miễn phí. Gói Pro phí cố định 99,000₫/tháng — không thu hoa hồng trên từng đơn. Bạn giữ 100% doanh thu.",
              },
              {
                q: "Tôi có rút tiền về tài khoản ngân hàng được không?",
                a: "Có. Rút bất cứ lúc nào về tài khoản ngân hàng hoặc ví điện tử (Momo, ZaloPay). Tiền về trong 1–3 ngày giao dịch.",
              },
              {
                q: "Hệ thống an toàn thực phẩm hoạt động như thế nào?",
                a: "Ứng dụng tự tính khung an toàn theo loại thực phẩm (ví dụ: cơm chín: 4h, bánh mì: 6h). Khi quá thời gian, bài đăng sẽ ẩn tự động. Ba vi phạm có thể dẫn tới khóa tài khoản.",
              },
              {
                q: "Tôi cần chuẩn bị thiết bị gì?",
                a: "Chỉ cần một điện thoại thông minh (iOS hoặc Android) có camera và kết nối internet. Không cần máy tính hay thiết bị phụ trợ khác.",
              },
              {
                q: "Nền tảng có hỗ trợ tiếng Anh không?",
                a: "Có. AlibabaFood hỗ trợ cả tiếng Việt và tiếng Anh. Bạn có thể chuyển ngôn ngữ trong phần cài đặt.",
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
              Còn Thực Phẩm Thừa
              <br />
              <span className="sl-gradient-text-light">Hôm nay</span>?
            </h2>
            <p className="cta-sub">
              Đăng trong <strong>60 giây</strong> — tiếp cận hơn{" "}
              <strong>50,000</strong> khách hàng đang chờ mua.
            </p>
            <div className="cta-btns">
              <RippleBtn
                className="sl-btn-cta-primary"
                onClick={() => onNavigate?.("post")}
              >
                ➕ Đăng Món Ngay
              </RippleBtn>
              <RippleBtn className="sl-btn-cta-ghost" onClick={onGoToDashboard}>
                📊 Đến Bảng Điều Khiển
              </RippleBtn>
            </div>
            <p className="cta-small">
              ✅ Miễn phí đăng &nbsp;·&nbsp; ✅ Bật bán ngay lập tức
              &nbsp;·&nbsp; ✅ Hỗ trợ 24/7
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
                Nền tảng giảm lãng phí thực phẩm số 1 Việt Nam — kết nối nhà
                cung cấp với người tiêu dùng thông minh.
              </p>
              <div className="footer-socials">
                <a href="#">📘</a>
                <a href="#">📸</a>
                <a href="#">🎵</a>
                <a href="#">💼</a>
              </div>
            </div>
            <div className="sl-footer-col">
              <h4>Nhà Cung Cấp</h4>
              <ul>
                <li>
                  <a href="#">Trang chủ</a>
                </li>
                <li>
                  <a href="#">Bảng điều khiển</a>
                </li>
                <li>
                  <a href="#">Quản lý đơn hàng</a>
                </li>
                <li>
                  <a href="#">Câu hỏi</a>
                </li>
              </ul>
            </div>
            <div className="sl-footer-col">
              <h4>Chính Sách</h4>
              <ul>
                <li>
                  <a href="#">Điều khoản sử dụng</a>
                </li>
                <li>
                  <a href="#">Chính sách an toàn thực phẩm</a>
                </li>
                <li>
                  <a href="#">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="#">Quy trình khiếu nại</a>
                </li>
              </ul>
            </div>
            <div className="sl-footer-col">
              <h4>Hỗ Trợ</h4>
              <ul>
                <li>
                  📞 <strong>1900-xxxx</strong> (Miễn phí)
                </li>
                <li>💬 Zalo OA: AlibabaFood</li>
                <li>📧 supplier@alibabafood.vn</li>
                <li>🕐 Hỗ trợ 8:00 – 22:00</li>
              </ul>
            </div>
          </div>
          <div className="sl-footer-bottom">
            <p>
              © 2026 Alibaba Food. Bản quyền thuộc Alibaba Food. &nbsp;·&nbsp;
              Phiên bản 2.4.1
            </p>
            <div className="footer-legal">
              <a href="#">Trang chủ</a>
              <a href="#">Điều khoản</a>
              <a href="#">Chính sách an toàn thực phẩm</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupplierHome;
