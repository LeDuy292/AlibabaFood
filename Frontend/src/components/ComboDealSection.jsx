import React, { useState } from "react";
import "./ComboDealSection.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const parseVND = (str) => parseInt(String(str).replace(/[^0-9]/g, "")) || 0;

const combos = [
  {
    id: 1,
    name: "Breakfast food",
    price: "55,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Pho Special",
    price: "65,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Berry Tart",
    price: "75,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Burger Combo",
    price: "99,000đ",
    rating: 5,
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Asian Noodle Bowl",
    price: "79,000đ",
    rating: 4,
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=500&q=80",
  },
];

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="combo-star-rating">
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

const SmileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
    <path
      d="M8 14s1.5 2 4 2 4-2 4-2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="10" r="1" fill="white" />
    <circle cx="15" cy="10" r="1" fill="white" />
  </svg>
);

const ComboDealSection = () => {
  const [startIdx, setStartIdx] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart({
      name: item.name,
      price: parseVND(item.price),
      quantity: 1,
      image: item.img,
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ!`);
  };

  const handleBuyNow = (item) => {
    addToCart({
      name: item.name,
      price: parseVND(item.price),
      quantity: 1,
      image: item.img,
    });
    navigate("/checkout");
  };

  const visible = combos.slice(startIdx, startIdx + CARDS_PER_VIEW);
  const canPrev = startIdx > 0;
  const canNext = startIdx < combos.length - CARDS_PER_VIEW;

  return (
    <section className="combo-deal-section">
      <div className="container">
        {/* Pill label */}
        <div className="combo-label-pill">Combo Deal</div>

        {/* Cards */}
        <div className="combo-grid">
          {visible.map((item) => (
            <div className="combo-card" key={item.id}>
              {/* Smile icon top-right */}
              <div className="combo-smile-btn">
                <SmileIcon />
              </div>

              {/* Circular image */}
              <div className="combo-card-img">
                <img src={item.img} alt={item.name} />
              </div>

              {/* Card body */}
              <div className="combo-card-body">
                <div className="combo-card-top">
                  <span className="combo-name">{item.name}</span>
                  <button
                    className="combo-add-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="combo-card-bottom">
                  <StarRating count={item.rating} />
                  <div className="combo-price-row">
                    <span className="combo-price">{item.price}</span>
                    <button
                      className="combo-buy-now-btn"
                      onClick={() => handleBuyNow(item)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="combo-nav">
          <button
            className="combo-nav-btn"
            onClick={() => setStartIdx((i) => Math.max(0, i - 1))}
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
            className="combo-nav-btn"
            onClick={() =>
              setStartIdx((i) =>
                Math.min(combos.length - CARDS_PER_VIEW, i + 1),
              )
            }
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

export default ComboDealSection;
