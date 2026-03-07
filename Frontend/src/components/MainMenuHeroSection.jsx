import React, { useRef } from 'react';
import './MainMenuHeroSection.css';

const MainMenuHeroSection = () => {
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
        if (now - lastSparkleTime.current > 30 && sparkleContainerRef.current) {
            lastSparkleTime.current = now;
            spawnSparkle(x, y);
        }
    };

    const spawnSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const size = Math.random() * 10 + 4;
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        const colors = ['#ffffff', '#ffd700', '#00ff88'];
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
            className="main-menu-hero-section"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="cursor-glow" ref={glowRef}></div>
            <div className="sparkle-container" ref={sparkleContainerRef}></div>

            <div className="container main-menu-hero-container">
                <div className="main-menu-title-container">
                    <h1 className="main-menu-title">
                        From Our Menu
                        <img src="https://69ab316afa9e210ee0efdb51.imgix.net/leaf/706894ca65e5d90ff4fdb8eece18e01aa3beadf2.png" alt="Decorative Leaf" className="main-menu-leaf-image" />
                    </h1>
                </div>
                <div className="search-bar-container">
                    <input type="text" placeholder="Enter food you want to" className="main-menu-search-input" />
                    <button className="main-menu-search-button">Search</button>
                </div>
            </div>
        </section>
    );
};

export default MainMenuHeroSection;
