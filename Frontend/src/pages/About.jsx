import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-subtitle">VỀ ALIBABA FOOD</span>
          <h1 className="about-title">
            Tiết Kiệm Thực Phẩm,<br />
            <span>Kiến Tạo Tương Lai Xanh</span>
          </h1>
          <p className="about-description">
            Alibaba Food là nền tảng tiên phong kết nối các nhà hàng, tiệm bánh và cửa hàng thực phẩm với người tiêu dùng để giải cứu các sản phẩm ngon lành cuối ngày. Cùng nhau, chúng ta giảm thiểu lãng phí và bảo vệ hành tinh xanh.
          </p>
          <div className="about-hero-actions">
            <button className="about-primary-btn" onClick={() => navigate("/main-menu")}>
              Khám Phá Món Ăn
            </button>
            <button className="about-secondary-btn" onClick={() => navigate("/partner-register")}>
              Trở Thành Đối Tác
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-section-header">
          <span className="section-badge">SỨ MỆNH CỦA CHÚNG TÔI</span>
          <h2>Vì Một Cộng Đồng Ăn Ngon, Sống Xanh</h2>
          <p className="section-intro">
            Chúng tôi tin rằng thực phẩm tốt xứng đáng được thưởng thức thay vì bị lãng phí.
          </p>
        </div>

        <div className="about-mission-grid">
          <div className="mission-card">
            <div className="mission-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>Giải Cứu Thực Phẩm</h3>
            <p>
              Giúp các đối tác cửa hàng giải phóng lượng thực phẩm tồn dư thơm ngon cuối ngày, chuyển đổi chi phí hao hụt thành doanh thu và lượt khách hàng mới.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3>Tiết Kiệm Chi Phí</h3>
            <p>
              Mang lại cơ hội cho người dùng trải nghiệm những món ăn chất lượng cao, tươi ngon từ thương hiệu lớn với giá ưu đãi cực sốc từ 50% đến 70%.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3>Tác Động Môi Trường</h3>
            <p>
              Hạn chế lượng thực phẩm thừa bị phân hủy tại bãi rác gây phát sinh khí metan - tác nhân gây hiệu ứng nhà kính mạnh gấp 25 lần khí CO2.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="about-how-section">
        <div className="about-section-header">
          <span className="section-badge light">CÁCH THỨC HOẠT ĐỘNG</span>
          <h2 className="text-white">Chỉ 3 Bước Đơn Giản Để Đồng Hành</h2>
        </div>

        <div className="about-steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Tìm Kiếm</h4>
            <p>Xem bản đồ hoặc danh sách để tìm các cửa hàng gần bạn có túi mù (Surprise Bag) hoặc món ăn cụ thể cuối ngày.</p>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Đặt Mua</h4>
            <p>Đặt trước túi mù với giá siêu hời và thanh toán online nhanh chóng thông qua cổng thanh toán bảo mật PayOS.</p>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Nhận Hàng</h4>
            <p>Ghé qua cửa hàng vào khung giờ nhận hàng quy định, xuất trình ứng dụng và mang túi đồ ăn ngon lành của bạn về!</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="about-section-header">
          <span className="section-badge">TÁC ĐỘNG TÍCH CỰC</span>
          <h2>Những Con Số Biết Nói</h2>
        </div>

        <div className="about-stats-grid">
          <div className="stat-card">
            <h3>12,500+</h3>
            <p>Bữa ăn được giải cứu</p>
          </div>
          <div className="stat-card">
            <h3>8,400 kg</h3>
            <p>Thực phẩm không lãng phí</p>
          </div>
          <div className="stat-card">
            <h3>16.8 tấn</h3>
            <p>Lượng CO2 giảm thiểu</p>
          </div>
          <div className="stat-card">
            <h3>320+</h3>
            <p>Cửa hàng đối tác đồng hành</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <h2>Hãy Hành Động Ngay Hôm Nay</h2>
          <p>Mỗi túi mù bạn giải cứu là một hành động nhỏ đóng góp lớn cho ngôi nhà chung Trái Đất. Hãy cùng Alibaba Food bắt đầu hành trình tiêu dùng thông thái.</p>
          <div className="about-cta-buttons">
            <button className="cta-primary" onClick={() => navigate("/main-menu")}>Giải Cứu Ngay</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
