import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../components/HotDealSection.css'; // Re-use the styles
import './NearbyDishesList.css';

const parseVND = (str) => parseInt(String(str).replace(/[^0-9]/g, "")) || 0;

const mockNearbyProducts = [
  {
    id: 101,
    name: "Cơm gà xối mỡ (cận date 2h)",
    price: "25,000đ",
    rating: 5,
    img: "https://69ab316afa9e210ee0efdb51.imgix.net/combo/385e2de92960bf175397022922e830ec3e1d9301.png"
  },
  {
    id: 102,
    name: "Bánh mì thịt nướng (cận 4h)",
    price: "15,000đ",
    rating: 4,
    img: "https://69ab316afa9e210ee0efdb51.imgix.net/combo/7288f57270d47346fb655f0ba4b8edc4e7fbff3a.png"
  },
  {
    id: 103,
    name: "Trà sữa trân châu (cận 1h)",
    price: "20,000đ",
    rating: 4,
    img: "https://69ab316afa9e210ee0efdb51.imgix.net/combo/171f11ed73ce02b9e403d52cc6114e9a8f27cfc5.png"
  },
  {
    id: 104,
    name: "Salad gà quay (cận 3h)",
    price: "30,000đ",
    rating: 5,
    img: "https://69ab316afa9e210ee0efdb51.imgix.net/combo/1e8ba846430bde1bdebfb7cfdb261e479a29e472.png"
  }
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

const NearbyDishesList = ({ userLocation, onChangeLocation }) => {
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

  if (!userLocation) return null;

  const visible = mockNearbyProducts.slice(startIdx, startIdx + CARDS_PER_VIEW);

  const handlePrev = () => setStartIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setStartIdx((i) => Math.min(mockNearbyProducts.length - CARDS_PER_VIEW, i + 1));

  const canPrev = startIdx > 0;
  const canNext = startIdx < mockNearbyProducts.length - CARDS_PER_VIEW;

  return (
    <section className="hot-deal-section">
      <div className="container">
        
        {/* Info Bar moved here from MenuCategoriesSection */}
        <div className="info-bar">
          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="info-main">Hôm nay 07:00 - 12:00</p>
              <p className="info-sub">Giờ hoạt động</p>
            </div>
          </div>
 
          <div className="info-divider"></div>
 
          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2" />
              </svg>
            </span>
            <div>
              <p className="info-main">Da Nang City, VietNam</p>
              <p className="info-sub">Vị trí của chúng tôi</p>
            </div>
          </div>
 
          <div className="info-divider"></div>
 
          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="info-main">+0123 456 7891</p>
              <p className="info-sub">Số điện thoại</p>
            </div>
          </div>
        </div>
 
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 className="hot-deal-title" style={{ marginBottom: "10px" }}>📍 Món Ăn Gần Bạn Nhất</h2>
        </div>
 
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
            <p className="no-items">Không có món ăn nào gần đây.</p>
          )}
        </div>

        <div className="hot-deal-nav">
          <button
            className="nav-arrow-btn"
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="nav-arrow-btn"
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NearbyDishesList;
