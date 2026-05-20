import React, { useState } from "react";
import "./HotDealSection.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const parseVND = (str) => parseInt(String(str).replace(/[^0-9]/g, "")) || 0;

const filters = [
  "Near-Expiry Deals",
  "Best Seller",
  "Best Price",
  "Expiring Soon",
];

const deals = [
  {
    id: 1,
    name: "Bữa Sáng Dinh Dưỡng",
    price: "55,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Cơm Trộn Bibimbap Đặc Biệt",
    price: "75,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
    tag: "Best Price",
  },
  {
    id: 3,
    name: "Thịt Nướng Bulgogi Hàn Quốc",
    price: "89,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    tag: "Near-Expiry Deals",
  },
  {
    id: 4,
    name: "Cá Hồi Nướng Sốt Teriyaki",
    price: "120,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    tag: "Expiring Soon",
  },
  {
    id: 5,
    name: "Mì Ý Sốt Kem Carbonara",
    price: "65,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80",
    tag: "Best Seller",
  },
];

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i <= count ? "#f59e0b" : "#d1d5db"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

const filterLabels = {
  "Near-Expiry Deals": "Ưu Đãi Giờ Vàng",
  "Best Seller": "Best Seller",
  "Best Price": "Giá Tốt Nhất",
  "Expiring Soon": "Deal Sốc Cận Giờ"
};

const HotDealSection = ({ userLocation, onChangeLocation }) => {
  const [activeFilter, setActiveFilter] = useState("Near-Expiry Deals");
  const [startIdx, setStartIdx] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (deal) => {
    addToCart({
      name: deal.name,
      price: parseVND(deal.price),
      quantity: 1,
      image: deal.img,
    });
    toast.success(`Đã thêm "${deal.name}" vào giỏ!`);
  };

  const handleBuyNow = (deal) => {
    addToCart({
      name: deal.name,
      price: parseVND(deal.price),
      quantity: 1,
      image: deal.img,
    });
    navigate("/checkout");
  };

  const filtered =
    activeFilter === "Near-Expiry Deals"
      ? deals
      : deals.filter((d) => d.tag === activeFilter);

  const visible = filtered.slice(startIdx, startIdx + CARDS_PER_VIEW);

  const handlePrev = () => setStartIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setStartIdx((i) => Math.min(filtered.length - CARDS_PER_VIEW, i + 1));

  const canPrev = startIdx > 0;
  const canNext = startIdx < filtered.length - CARDS_PER_VIEW;

  if (!userLocation) return null;

  return (
    <section className="hot-deal-section">
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 className="hot-deal-title" style={{ marginBottom: "10px" }}>ƯU ĐÃI CỰC KHỦNG</h2>
        </div>

        {/* Filter Tabs */}
        <div className="hot-deal-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`hot-deal-filter-btn ${activeFilter === f ? "active" : ""} ${f === "Near-Expiry Deals" ? "outline" : "filled"}`}
              onClick={() => {
                setActiveFilter(f);
                setStartIdx(0);
              }}
            >
              {filterLabels[f] || f}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="hot-deal-grid">
          {visible.length > 0 ? (
            visible.map((deal) => (
              <div className="deal-card" key={deal.id}>
                <div className="deal-card-img">
                  <img src={deal.img} alt={deal.name} />
                </div>
                <div className="deal-card-body">
                  <div className="deal-card-top">
                    <span className="deal-name">{deal.name}</span>
                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(deal)}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                  <div className="deal-card-bottom">
                    <StarRating count={deal.rating} />
                    <div className="deal-price-row">
                      <span className="deal-price">{deal.price}</span>
                      <button
                        className="buy-now-btn"
                        onClick={() => handleBuyNow(deal)}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">Không có sản phẩm nào trong danh mục này.</p>
          )}
        </div>

        {/* Navigation */}
        <div className="hot-deal-nav">
          <button
            className="nav-arrow-btn"
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="nav-arrow-btn"
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HotDealSection;
