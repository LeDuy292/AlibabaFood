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
                    <h2 className="section-title">About Us</h2>
                    <button className="btn-view-more">View More</button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
