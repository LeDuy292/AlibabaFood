import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./HeroSection.css";
import camImg from "../assets/cam.png";
import laImg from "../assets/la.png";

const HeroSection = () => {
  const glowRef = useRef(null);
  const sparkleContainerRef = useRef(null);
  const lastSparkleTime = useRef(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (glowRef.current) {
      // translate(-50%, -50%) centers the glow exactly on the cursor
      glowRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    // Throttle sparkle creation (denser trail)
    const now = Date.now();
    if (now - lastSparkleTime.current > 20 && sparkleContainerRef.current) {
      lastSparkleTime.current = now;
      spawnSparkle(x, y);
    }
  };

  const spawnSparkle = (x, y) => {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    // Randomize size and exact emission point around the cursor
    const size = Math.random() * 15 + 6; // 6px to 21px (Bigger, clearer stars)
    const offsetX = (Math.random() - 0.5) * 70;
    const offsetY = (Math.random() - 0.5) * 70;

    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;

    // Randomize magical colors (pure white, gold, neon green, bright cyan)
    const colors = ["#ffffff", "#ffd700", "#00ff88", "#00e5ff"];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];

    sparkleContainerRef.current.appendChild(sparkle);

    // Remove after animation completes (1.5 seconds)
    setTimeout(() => {
      if (sparkle.parentNode === sparkleContainerRef.current) {
        sparkleContainerRef.current.removeChild(sparkle);
      }
    }, 1500);
  };

  const handleMouseEnter = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = 1;
    }
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = 0;
    }
  };

  return (
    <section
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The cursor following glow element */}
      <div className="cursor-glow" ref={glowRef}></div>
      {/* The glitter particle container */}
      <div className="sparkle-container" ref={sparkleContainerRef}></div>

      <Navbar />

      {/* Floating decoration layer */}
      <div className="hero-decorations" aria-hidden="true">
        {/* LEFT LEAVES */}
        <img src={laImg} className="deco leaf-1" alt="" />
        <img src={laImg} className="deco leaf-2" alt="" />
        {/* SMALL CENTER LEAF */}
        <img src={laImg} className="deco leaf-3" alt="" />
        {/* BOTTOM-RIGHT LEAVES */}
        <img src={laImg} className="deco leaf-4" alt="" />
        <img src={laImg} className="deco leaf-5" alt="" />
        {/* CAM — 1 ảnh duy nhất, nửa sau vòng tròn */}
        <img src={camImg} className="deco lemon-1" alt="" />
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="title-line-1">Eat Smart</div>
            <div className="title-line-2">Save More</div>
          </h1>
          <p className="hero-subtitle">JUST COME TO ORDER & FOODIED</p>

          <div className="hero-buttons">
            <button className="btn-primary">ORDER NOW</button>
            <button className="btn-secondary">EXPLORE MORE</button>
          </div>

          <div className="hero-cta">
            <span className="cta-text">Join AlibabaFood as a Partner • </span>
            <Link to="/partner-register" className="cta-link">
              Click Here!
            </Link>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-blob"></div>
          <img
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800"
            alt="Delicious fresh salad bowl"
            className="hero-main-img"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
