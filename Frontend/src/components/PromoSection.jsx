import React from "react";
import { useNavigate } from "react-router-dom";
import "./PromoSection.css";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";

const promoItems = [
  {
    name: "Mì sợi",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Burger",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Pizza giảm giá 35%",
    price: 50000,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
  },
];

const PromoSection = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart({
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ!`);
  };

  return (
    <>
      <section className="promo-section">
        <div className="container promo-container">
          <div className="promo-header">
            <h2>
              Nhận ngay <span className="highlight-text">Voucher</span> và
              <br />
              thưởng thức món ăn yêu thích!
            </h2>
          </div>

          <div className="promo-grid">
            {/* Left Promo - Testy Burger */}
            <div className="promo-card testy-burger">
              <div className="promo-content">
                <span className="promo-subtitle">ĐẶC BIỆT THỨ SÁU</span>
                <h3 className="promo-title">BURGER THƠM NGON</h3>
                <div className="discount-badge">
                  <span className="discount-value">60%</span>
                  <span className="discount-lbl">GIẢM</span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400"
                alt="Testy Burger"
                className="promo-img"
              />
            </div>

            {/* Top Right Promos */}
            <div className="promo-cards-right-top">
              {/* Nodels Promo */}
              <div className="promo-card nodels-promo">
                <div className="promo-content">
                  <span className="promo-subtitle">ĐẶC BIỆT HÔM NAY</span>
                  <h3 className="promo-title">Mì sợi</h3>
                  <p className="promo-discount">Giảm 60%</p>
                  <button
                    className="add-to-cart-btn-small"
                    onClick={() => handleAddToCart(promoItems[0])}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400"
                  alt="Nodels"
                  className="promo-img"
                />
              </div>

              {/* Burger Promo Right */}
              <div className="promo-card burger-promo">
                <div className="promo-content">
                  <span className="promo-subtitle">MÓN NGON MỖI NGÀY</span>
                  <h3 className="promo-title">BURGER</h3>
                  <button
                    className="add-to-cart-btn-small"
                    onClick={() => handleAddToCart(promoItems[1])}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400"
                  alt="Burger"
                  className="promo-img"
                />
              </div>
            </div>

            {/* Bottom Promo - 35% Offer */}
            <div className="promo-card limited-offer">
              <div className="promo-content">
                <span className="promo-subtitle">CHỈ TRONG THỜI GIAN CÓ HẠN</span>
                <h3 className="promo-title">Ưu đãi 35%</h3>
              </div>
              <button
                className="add-to-cart-btn-small"
                onClick={() => handleAddToCart(promoItems[2])}
              >
                Thêm vào giỏ
              </button>
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400"
                alt="Pizza"
                className="promo-img pizza-img"
              />
            </div>
          </div>

          <div className="promo-features">
            <div className="feature-item">
              <div className="feature-icon discount-icon">
                {/* Discount Icon SVG placeholder */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Phiếu Giảm Giá</h4>
                <p>Trải nghiệm ẩm thực tiện lợi và tiết kiệm nhất.</p>
              </div>
            </div>

            <div className="feature-divider"></div>

            <div className="feature-item">
              <div className="feature-icon healthy-icon">
                {/* Healthy Food Icon SVG placeholder */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Thực Phẩm Tươi Sạch</h4>
                <p>Nguồn nguyên liệu tươi xanh và an toàn cho sức khỏe.</p>
              </div>
            </div>

            <div className="feature-divider"></div>

            <div className="feature-item">
              <div className="feature-icon table-icon">
                {/* Table Service Icon SVG placeholder */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Phục Vụ Nhanh Tại Bàn</h4>
                <p>Đội ngũ nhân viên phục vụ tận tình, chu đáo và nhanh chóng.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === NEW BLIND BAG SECTION === */}
      <section className="blind-bag-section">
        <div className="container blind-bag-container">
          {/* Left: text */}
          <div className="blind-bag-text">
            <p className="blind-bag-tag">🎁 Quà Surprise Giới Hạn</p>
            <h2 className="blind-bag-title">
              Nhận ngay <span className="blind-bag-highlight">Blind Bag</span> và
              <br />
              khám phá phần quà bất ngờ!
            </h2>
            <p className="blind-bag-desc">
              Mỗi đơn hàng đi kèm một món quà bí ẩn - có thể là món tráng miệng miễn phí, voucher giảm giá hoặc một món độc quyền. Hãy thêm vào giỏ và khám phá ngay!
            </p>
            <button
              className="blind-bag-btn"
              onClick={() => navigate("/blind-bag")}
            >
              🎲 Thử Vận May
            </button>
          </div>

          {/* Right: mystery bag graphic */}
          <div className="blind-bag-visual">
            <div className="blind-bag-circle">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"
                alt="Surprise blind bag"
                className="blind-bag-img"
              />
              <div className="blind-bag-badge">?</div>
              {/* Small circle top-right */}
              <div className="blind-bag-small-circle">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=300"
                  alt="Food surprise"
                  className="blind-bag-small-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PromoSection;
