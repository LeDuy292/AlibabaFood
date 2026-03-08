import React, { useRef } from 'react';
import './NewsHeroSection.css';
import logoNewsImg from '../assets/logonews.png';

const NewsHeroSection = () => {
    const glowRef = useRef(null);
    const sparkleContainerRef = useRef(null);
    const lastSparkleTime = useRef(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (glowRef.current) {
            glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }

        const now = Date.now();
        if (now - lastSparkleTime.current > 20 && sparkleContainerRef.current) {
            lastSparkleTime.current = now;
            spawnSparkle(x, y);
        }
    };

    const spawnSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const size = Math.random() * 15 + 6;
        const offsetX = (Math.random() - 0.5) * 70;
        const offsetY = (Math.random() - 0.5) * 70;

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        const colors = ['#ffffff', '#ffd700', '#00ff88', '#00e5ff'];
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];

        sparkleContainerRef.current.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode === sparkleContainerRef.current) {
                sparkleContainerRef.current.removeChild(sparkle);
            }
        }, 1500);
    };

    const handleMouseEnter = () => {
        if (glowRef.current) glowRef.current.style.opacity = 1;
    };

    const handleMouseLeave = () => {
        if (glowRef.current) glowRef.current.style.opacity = 0;
    };

    return (
        <section
            className="news-hero-section"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Cursor glow */}
            <div className="cursor-glow" ref={glowRef}></div>
            {/* Sparkle container */}
            <div className="sparkle-container" ref={sparkleContainerRef}></div>

            <div className="container news-hero-container">
                {/* Left: Text content */}
                <div className="news-hero-content">
                    <h1 className="news-hero-title">
                        <div className="title-line-1">Your Food,</div>
                        <div className="title-line-2">Starts Here</div>
                    </h1>
                    <p className="news-hero-subtitle">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.
                    </p>
                    <div className="news-hero-buttons">
                        <button className="btn-order-now">Order Now</button>
                    </div>
                </div>

                {/* Right: Image + circle + floating elements */}
                <div className="news-hero-image-container">
                    {/* Dark green circle background */}
                    <div className="green-circle"></div>

                    {/* "Hot spicy Food" speech bubble badge */}
                    <div className="promo-badge">
                        Hot spicy Food <span className="chili-icon">🌶️</span>
                    </div>

                    {/* Main cutout person image (overflows above the circle) */}
                    <img
                        src={logoNewsImg}
                        alt="Food hero banner"
                        className="news-hero-main-img"
                    />

                    {/* Floating Product Cards – positioned at bottom */}
                    <div className="floating-cards-row">
                        <div className="floating-card">
                            <img
                                src="https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=200"
                                alt="Spicy Noodles"
                                className="card-food-img"
                            />
                            <div className="card-info">
                                <span className="card-title">Spicy noodles</span>
                                <div className="card-stars">
                                    <span className="star-filled">⭐</span>
                                    <span className="star-filled">⭐</span>
                                    <span className="star-filled">⭐</span>
                                    <span className="star-empty">☆</span>
                                    <span className="star-empty">☆</span>
                                </div>
                                <span className="card-price"><span className="currency">$</span>18.00</span>
                            </div>
                        </div>

                        <div className="floating-card">
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200"
                                alt="Vegetarian Salad"
                                className="card-food-img"
                            />
                            <div className="card-info">
                                <span className="card-title">Vegetarian salad</span>
                                <div className="card-stars">
                                    <span className="star-filled">⭐</span>
                                    <span className="star-filled">⭐</span>
                                    <span className="star-filled">⭐</span>
                                    <span className="star-filled">⭐</span>
                                    <span className="star-empty">☆</span>
                                </div>
                                <span className="card-price"><span className="currency">$</span>23.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsHeroSection;
