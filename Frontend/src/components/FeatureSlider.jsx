import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FeatureSlider.css";
import slide1 from "../assets/hero-slider-1.jpg";
import slide2 from "../assets/hero-slider-2.jpg";
import slide3 from "../assets/hero-slider-3.jpg";

const FeatureSlider = () => {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const features = [
    {
      id: 0,
      title: "Nhím Biển Sấy Khô",
      subtitle: "Exotic Dried Sea Urchin Roe",
      description:
        "Thưởng thức hương vị biển cả thượng hạng với sản phẩm nhím biển sấy khô 100% tự nhiên. Đậm đà vị tinh túy của đại dương, sẵn sàng thưởng thức.",
      image: slide1,
      icon: "🌊",
      route: "/main-menu",
    },
    {
      id: 1,
      title: "Cá Hồi Thượng Hạng",
      subtitle: "Premium Salmon Steaks Ready-to-Cook",
      description:
        "Những miếng cá hồi tươi ngon, được tinh tuyển từ những con cá hồi chất lượng nhất. Sẵn sàng nấu nướng, mang lại giá trị dinh dưỡng tuyệt vời cho gia đình.",
      image: slide2,
      icon: "🐟",
      route: "/main-menu",
    },
    {
      id: 2,
      title: "Cua Cà Chua Ớt Cay",
      subtitle: "Spicy Crab Claw Meat Delicacy",
      description:
        "Thưởng thức thịt cua càng cay ngon lạ miệng với hương vị ớt cay nồng. Sản phẩm cao cấp, được chế biến theo công thức truyền thống, giàu dinh dưỡng.",
      image: slide3,
      icon: "🔥",
      route: "/main-menu",
    },
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoRotate, features.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex(
          (prev) => (prev - 1 + features.length) % features.length,
        );
        setAutoRotate(false);
        setTimeout(() => setAutoRotate(true), 3000);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % features.length);
        setAutoRotate(false);
        setTimeout(() => setAutoRotate(true), 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [features.length]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % features.length);
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    }
    setAutoRotate(false);
    setTimeout(() => setAutoRotate(true), 3000);
  };

  const handleExploreClick = (e, route) => {
    e.preventDefault();
    navigate(route);
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
    setAutoRotate(false);
    setTimeout(() => setAutoRotate(true), 5000);
  };

  const getCardClass = (index) => {
    if (index === activeIndex) return "slider-card active-card";
    if (
      index === activeIndex - 1 ||
      (activeIndex === 0 && index === features.length - 1)
    )
      return "slider-card left-card";
    if (
      index === activeIndex + 1 ||
      (activeIndex === features.length - 1 && index === 0)
    )
      return "slider-card right-card";
    return "slider-card hidden-card";
  };

  return (
    <section className="feature-slider-section">
      <div className="slider-header">
        <h2>Sản Phẩm Khuyến Mãi</h2>
        <p>Những ưu đãi nóng hổi không thể bỏ lỡ tại AlibabaFood</p>
      </div>

      <div
        className="slider-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={getCardClass(index)}
            onClick={() => handleCardClick(index)}
            role="button"
            tabIndex={index === activeIndex ? 0 : -1}
          >
            <div className="slider-card-inner">
              <img
                src={feature.image}
                alt={feature.title}
                className="card-bg-img"
              />
              <div className="card-top-icon pulse-icon">{feature.icon}</div>
              <div className="card-gradient-overlay"></div>
              <div className="card-content">
                <span className="card-subtitle">{feature.subtitle}</span>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
                <a
                  href="#"
                  className="explore-btn"
                  onClick={(e) => handleExploreClick(e, feature.route)}
                >
                  Đặt Hàng Ngay
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation indicators */}
      <div className="slider-indicators">
        {features.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleCardClick(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <div className="slider-hints">
        <span className="hint-text">⌨️ Mũi tên | 👆 Chạm</span>
      </div>
    </section>
  );
};

export default FeatureSlider;
