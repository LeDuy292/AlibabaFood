import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureSlider.css';

const FeatureSlider = () => {
    const navigate = useNavigate();

    // ...

    const handleExploreClick = (e, title) => {
        e.preventDefault();
        if (title === "Mystery Blind Box") {
            navigate('/blind-bag');
        } else {
            // handle other clicks if necessary
        }
    };


const FeatureSlider = () => {
    // Array of feature objects
    const features = [
        {
            id: 0,
            title: "Mystery Blind Box",
            subtitle: "Test Your Luck",
            description: "Get a surprise meal every day at a super bargain price. You won't know what it is until it arrives, but it's guaranteed to be delicious!",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800",
            icon: "🎁"
        },
        {
            id: 1,
            title: "Smart AI Menu",
            subtitle: "Intelligent Ordering",
            description: "Personalized daily meal recommendations powered by AI, analyzing your unique eating habits and taste preferences.",
            image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800", // Tech/Robotic or highly smart looking food
            icon: "🤖"
        },
        {
            id: 2,
            title: "Lightning Delivery",
            subtitle: "Flash Speed",
            description: "Hot food delivered right to your door in under 30 minutes, no matter the time of day or weather conditions.",
            image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800", // Fast delivery or glowing box
            icon: "⚡"
        }
    ];

    // State to track the currently centered card index. Starts at middle (1).
    const [activeIndex, setActiveIndex] = useState(1);

    const handleCardClick = (index) => {
        setActiveIndex(index);
    };

    // Helper to determine the CSS class based on the card's position relative to the active card
    const getCardClass = (index) => {
        if (index === activeIndex) return "slider-card active-card";
        if (index === activeIndex - 1 || (activeIndex === 0 && index === features.length - 1)) return "slider-card left-card";
        if (index === activeIndex + 1 || (activeIndex === features.length - 1 && index === 0)) return "slider-card right-card";
        return "slider-card hidden-card"; // Fallback for more than 3 cards, though we only have 3
    };

    return (
        <section className="feature-slider-section">
            <div className="slider-header">
                <h2>Premium Experience</h2>
                <p>Discover the outstanding features exclusive to AlibabaFood</p>
            </div>

            <div className="slider-container">
                {features.map((feature, index) => (
                    <div
                        key={feature.id}
                        className={getCardClass(index)}
                        onClick={() => handleCardClick(index)}
                    >
                        <img src={feature.image} alt={feature.title} className="card-bg-img" />

                        <div className="card-top-icon">
                            {feature.icon}
                        </div>

                        {/* The dark gradient overlay matching the design */}
                        <div className="card-gradient-overlay"></div>

                        <div className="card-content">
                            <span className="card-subtitle">{feature.subtitle}</span>
                            <h3 className="card-title">{feature.title}</h3>
                            <p className="card-description">{feature.description}</p>
                            <a href="#" className="explore-btn" onClick={(e) => handleExploreClick(e, feature.title)}>
                                Explore
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureSlider;
