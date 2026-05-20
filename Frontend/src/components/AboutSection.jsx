import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
    return (
        <section className="about-section container">
            <div className="about-grid">
                <div className="about-image-wrapper">
                    <div className="about-circle-bg"></div>
                    <img
                        src="https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop"
                        alt="Healthy fresh ingredients"
                        className="about-main-img"
                    />
                </div>

                <div className="about-content">
                    <h2 className="section-title">Về Chúng Tôi</h2>
                    <p className="about-description">
                        Chào mừng bạn đến với nền tảng của chúng tôi, điểm đến hàng đầu cho những món ăn tươi ngon, bổ dưỡng và tròn vị. Chúng tôi cam kết mang lại những nguyên liệu chất lượng cao nhất, được chuẩn bị tỉ mỉ để tiếp thêm năng lượng cho lối sống lành mạnh của bạn. Hãy tận hưởng trải nghiệm ẩm thực tuyệt vời được phục vụ nhanh chóng!
                    </p>
                    <button className="btn-view-more">Xem Thêm</button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
