import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
    return (
        <section className="features-section container">
            <h2 className="section-title text-center">Why Choose Us?</h2>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
                            <path d="M4 12V8h16v4" />
                            <path d="M12 2v6" />
                            <path d="M8 8v4" />
                            <path d="M16 8v4" />
                            <path d="M8 22h8" />
                        </svg>
                    </div>
                    <h3 className="feature-title">Serve Healthy Food</h3>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            <path d="M12 11l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="feature-title">Best Quality</h3>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                    </div>
                    <h3 className="feature-title">Fast Delivery</h3>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
