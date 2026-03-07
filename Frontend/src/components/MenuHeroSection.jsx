import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MenuHeroSection.css';

const MenuHeroSection = () => {
    const navigate = useNavigate();
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
        if (now - lastSparkleTime.current > 25 && sparkleContainerRef.current) {
            lastSparkleTime.current = now;
            spawnSparkle(x, y);
        }
    };

    const spawnSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const size = Math.random() * 12 + 5;
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        const colors = ['#ffffff', '#ffd700', '#69a656', '#00e5ff'];
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
        sparkleContainerRef.current.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode === sparkleContainerRef.current) {
                sparkleContainerRef.current.removeChild(sparkle);
            }
        }, 1500);
    };

    const handleMouseEnter = () => { if (glowRef.current) glowRef.current.style.opacity = 1; };
    const handleMouseLeave = () => { if (glowRef.current) glowRef.current.style.opacity = 0; };

    return (
        <section
            className="menu-hero-section"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="cursor-glow" ref={glowRef}></div>
            <div className="sparkle-container" ref={sparkleContainerRef}></div>

            <div className="container menu-hero-container">
                {/* Left Side Content */}
                <motion.div
                    className="menu-hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className="menu-hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Your Menu,<br />
                        Made Simple
                    </motion.h1>
                    <motion.p
                        className="menu-hero-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.
                    </motion.p>

                    <motion.div
                        className="order-now-container"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <button className="btn-order-now" onClick={() => navigate('/main-menu')}>Order Now</button>

                        <div className="dashed-arrow">
                            <svg width="300" height="180" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M 30 165 C 0 145, -5 85, 40 65 C 85 45, 135 75, 125 125 C 115 165, 75 185, 45 165 C 18 148, 35 110, 70 92 C 110 72, 175 50, 255 18"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeDasharray="8,8"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                                <polygon
                                    points="243,5 275,22 250,50"
                                    fill="white"
                                    opacity="0.92"
                                />
                            </svg>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side Cards Grid */}
                <motion.div
                    className="menu-hero-cards-wrapper"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                >
                    <div className="cards-bg-lines"></div>

                    <div className="menu-hero-cards">
                        {[
                            { img: "Fast%20Food/ecd240ce7c550720ab20af0840548a832e0f9a28%20(1).png", title: "Fast Food", delay: 0.6 },
                            { img: "combo/385e2de92960bf175397022922e830ec3e1d9301.png", title: "Food Combo", delay: 0.8 },
                            { img: "cake/8a777b72ca2f7832b951d3dd04ad5fcbba7a1a18.png", title: "Cake", delay: 1.0 },
                            { img: "dry/046c4ac087f0b30ff11a791e5991d04d0b5fd557.png", title: "Dry food", delay: 1.2 }
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                className="menu-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card.delay, duration: 0.6 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="menu-card-img-wrapper">
                                    <img src={`https://69ab316afa9e210ee0efdb51.imgix.net/${card.img}`} alt={card.title} />
                                </div>
                                <h3>{card.title}</h3>
                                <a href="#" className="see-more">See more</a>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MenuHeroSection;
