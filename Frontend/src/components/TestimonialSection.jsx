import React, { useState } from 'react';
import './TestimonialSection.css';

const TestimonialSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "Mỹ Ly",
            rating: "⭐⭐⭐⭐⭐",
            text: `"Ứng dụng đặt đồ ăn và theo dõi tốt nhất mà tôi từng sử dụng. Giao diện sạch sẽ, các gợi ý món ăn luôn hoàn hảo cho chế độ ăn của tôi!"`,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
        },
        {
            id: 2,
            name: "Dũng Trần",
            rating: "⭐⭐⭐⭐⭐",
            text: `"Tính năng Hộp Quà Bí Ẩn mới thật tuyệt vời! Nó giúp việc đặt bữa trưa trở nên thú vị hơn và giúp tôi không phải đau đầu suy nghĩ nên ăn gì."`,
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop"
        },
        {
            id: 3,
            name: "Khánh Linh",
            rating: "⭐⭐⭐⭐",
            text: `"Giao hàng cực kỳ nhanh chóng đúng như cam kết. Đồ ăn luôn nóng hổi. Thực đơn thông minh thực sự học được sở thích của bạn theo thời gian."`,
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="testimonial-section container">
            <h2 className="testimonial-title">
                Khách Hàng <span className="highlight">Nói Gì</span>
            </h2>

            <div className="testimonial-grid">
                <div className="testimonial-card-container">
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img src={currentTestimonial.avatar} alt={currentTestimonial.name} className="customer-avatar" />
                            <div>
                                <h4 className="customer-name">{currentTestimonial.name}</h4>
                                <div className="customer-rating">{currentTestimonial.rating}</div>
                            </div>
                        </div>
                        <p className="testimonial-text">
                            {currentTestimonial.text}
                        </p>

                        {/* Pagination Arrows */}
                        <div className="testimonial-controls">
                            <button className="control-btn" onClick={handlePrev}>&larr;</button>
                            <div className="customer-thumbnails">
                                {testimonials.map((t, idx) => (
                                    <img
                                        key={t.id}
                                        src={t.avatar}
                                        alt="Thumb"
                                        className={idx === currentIndex ? 'active-thumb' : ''}
                                        onClick={() => setCurrentIndex(idx)}
                                    />
                                ))}
                            </div>
                            <button className="control-btn" onClick={handleNext}>&rarr;</button>
                        </div>
                    </div>
                </div>

                <div className="testimonial-image-collage">
                    <div className="collage-bg-shape"></div>
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop" alt="Food collage" className="collage-img-main" />
                    <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=150&auto=format&fit=crop" alt="Coffee" className="collage-img-small" />
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
