import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './HeroSection.css';

const HeroSection = () => {
    const navigate = useNavigate();
    
    return (
        <section className="hero-section">
            <Navbar />

            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="light-text">Eat Smart</span><br />
                        <span className="bold-text">Save More</span>
                    </h1>
                    <p className="hero-subtitle">JUST COME TO ORDER & FOODIED</p>

                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate('/main-menu')}>ORDER NOW</button>
                        <button className="btn-secondary">EXPLORE MORE</button>
                    </div>

                    <div className="hero-cta">
                        <span className="cta-text">Join AlibabaFood as a Partner • </span>
                        <a href="#" className="cta-link">Click Here!</a>
                    </div>
                </div>

                <div className="hero-image-container">
                    <div className="hero-blob"></div>
                    <img
                        src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800"
                        alt="Delicious fresh salad bowl"
                        className="hero-main-img"
                    />
                    {/* Decorative floating elements */}
                    <div className="floating-lemon top-left"></div>
                    <div className="floating-lemon bottom-right"></div>
                    <div className="floating-leaf side-left"></div>
                    <div className="floating-leaf side-right"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
