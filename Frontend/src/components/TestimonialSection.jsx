import React from 'react';
import './TestimonialSection.css';

const TestimonialSection = () => {
    return (
        <section className="testimonial-section container">
            <h2 className="section-title text-center">
                Customers <span className="highlight">Say</span>
            </h2>

            <div className="testimonial-grid">
                <div className="testimonial-card-container">
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop" alt="Customer" className="customer-avatar" />
                            <div>
                                <h4 className="customer-name">My Ly</h4>
                                <div className="customer-rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        <p className="testimonial-text">
                            "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate dolor eu mi pellentesque convallis faucibus."
                        </p>
                        <div className="customer-thumbnails">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop" alt="Thumb" />
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop" alt="Thumb" />
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=30&h=30&fit=crop" alt="Thumb" />
                        </div>
                    </div>
                </div>

                <div className="testimonial-image-collage">
                    <div className="collage-bg-shape"></div>
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop" alt="Food collage" className="collage-img-main" />
                    <img src="https://images.unsplash.com/photo-1514361892635-6b07e31e75f3?w=150&auto=format&fit=crop" alt="Coffee" className="collage-img-small" />
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
