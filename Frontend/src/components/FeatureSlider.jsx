import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeatureSlider.css";

const FeatureSlider = () => {
  const navigate = useNavigate();

  const handleExploreClick = (e, id) => {
    e.preventDefault();
    if (id === 0) {
      navigate("/blind-bag");
    } else if (id === 1) {
      navigate("/ai-consultant");
    } else {
      navigate("/main-menu");
    }
  };

  // Array of feature objects
  const features = [
    {
      id: 0,
      title: "Hộp Quà Bí Ẩn",
      subtitle: "Thử Vận May Của Bạn",
      description:
        "Nhận một món ăn bất ngờ mỗi ngày với mức giá cực kỳ ưu đãi. Bạn sẽ không biết đó là món gì cho đến khi nhận hàng, nhưng chúng tôi đảm bảo nó cực kỳ ngon!",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800",
      icon: "🎁",
    },
    {
      id: 1,
      title: "Thực Đơn AI Thông Minh",
      subtitle: "Đặt Món Thông Minh",
      description:
        "Gợi ý món ăn hàng ngày được cá nhân hóa bởi trí tuệ nhân tạo, phân tích thói quen ăn uống và khẩu vị độc đáo của bạn.",
      image:
        "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800", // Tech/Robotic or highly smart looking food
      icon: "🤖",
    },
    {
      id: 2,
      title: "Giao Hàng Thần Tốc",
      subtitle: "Tốc Độ Ánh Sáng",
      description:
        "Đồ ăn nóng hổi được giao tận cửa nhà bạn chỉ dưới 30 phút, bất kể mọi khung giờ trong ngày hay mọi điều kiện thời tiết.",
      image:
        "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800", // Fast delivery or glowing box
      icon: "⚡",
    },
  ];

  // State to track the currently centered card index. Starts at middle (1).
  const [activeIndex, setActiveIndex] = useState(1);

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  // Helper to determine the CSS class based on the card's position relative to the active card
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
    return "slider-card hidden-card"; // Fallback for more than 3 cards, though we only have 3
  };

  return (
    <section className="feature-slider-section">
      <div className="slider-header">
        <h2>Trải Nghiệm Cao Cấp</h2>
        <p>Khám phá những tính năng vượt trội độc quyền tại AlibabaFood</p>
      </div>

      <div className="slider-container">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={getCardClass(index)}
            onClick={() => handleCardClick(index)}
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="card-bg-img"
            />

            <div className="card-top-icon">{feature.icon}</div>

            {/* The dark gradient overlay matching the design */}
            <div className="card-gradient-overlay"></div>

            <div className="card-content">
              <span className="card-subtitle">{feature.subtitle}</span>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
              <a
                href="#"
                className="explore-btn"
                onClick={(e) => handleExploreClick(e, feature.id)}
              >
                Khám phá
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
        ))}
      </div>
    </section>
  );
};

export default FeatureSlider;
