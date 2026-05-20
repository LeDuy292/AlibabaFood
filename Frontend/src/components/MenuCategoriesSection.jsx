import React, { useState } from 'react';
import './MenuCategoriesSection.css';
import fastFoodImg from '../assets/FastFood.png';
import foodComboImg from '../assets/FoodCombo.png';
import cakeImg from '../assets/Cake.png';
import dryFoodImg from '../assets/DryFood.png';
import readyToEatImg from '../assets/ReadytoEat.png';

const categories = [
    {
        id: 1,
        name: 'Fast Food',
        img: fastFoodImg,
    },
    {
        id: 2,
        name: 'Food Combo',
        img: foodComboImg,
    },
    {
        id: 3,
        name: 'Cake',
        img: cakeImg,
    },
    {
        id: 4,
        name: 'Dry food',
        img: dryFoodImg,
    },
    {
        id: 5,
        name: 'Ready To Eat',
        img: readyToEatImg,
    },
];

const CARDS_PER_VIEW = 4;

const MenuCategoriesSection = () => {
    const [startIdx, setStartIdx] = useState(0);

    const handlePrev = () => setStartIdx(i => Math.max(0, i - 1));
    const handleNext = () => setStartIdx(i => Math.min(categories.length - CARDS_PER_VIEW, i + 1));

    const visible = categories.slice(startIdx, startIdx + CARDS_PER_VIEW);

    return (
        <div className="menu-categories-wrapper">
            {/* Categories Section */}
            <section className="menu-categories-section">
                <div className="container">
                    <h2 className="categories-title">Danh Mục Món Ăn</h2>

                    {/* Cards Row */}
                    <div className="categories-carousel">
                        {visible.map(cat => (
                            <div className="category-card" key={cat.id}>
                                <div className="category-card-img">
                                    <img src={cat.img} alt={cat.name} />
                                </div>
                                <h3 className="category-card-name">{cat.name}</h3>
                                <a href="#" className="category-see-more">Xem thêm</a>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="carousel-nav">
                        <button
                            className="carousel-btn"
                            onClick={handlePrev}
                            disabled={startIdx === 0}
                            aria-label="Previous"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            className="carousel-btn"
                            onClick={handleNext}
                            disabled={startIdx >= categories.length - CARDS_PER_VIEW}
                            aria-label="Next"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MenuCategoriesSection;
