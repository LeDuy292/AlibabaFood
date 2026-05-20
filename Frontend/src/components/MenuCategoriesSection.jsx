import React, { useState } from 'react';
import './MenuCategoriesSection.css';

const categories = [
    {
        id: 1,
        name: 'Fast Food',
        img: 'https://69ab316afa9e210ee0efdb51.imgix.net/Fast%20Food/ecd240ce7c550720ab20af0840548a832e0f9a28%20(1).png',
    },
    {
        id: 2,
        name: 'Food Combo',
        img: 'https://69ab316afa9e210ee0efdb51.imgix.net/combo/385e2de92960bf175397022922e830ec3e1d9301.png',
    },
    {
        id: 3,
        name: 'Cake',
        img: 'https://69ab316afa9e210ee0efdb51.imgix.net/cake/8a777b72ca2f7832b951d3dd04ad5fcbba7a1a18.png',
    },
    {
        id: 4,
        name: 'Dry food',
        img: 'https://69ab316afa9e210ee0efdb51.imgix.net/dry/046c4ac087f0b30ff11a791e5991d04d0b5fd557.png',
    },
    {
        id: 5,
        name: 'Ready To Eat',
        img: 'https://69ab316afa9e210ee0efdb51.imgix.net/ready/75a82cb68ac4a721e8233d3516bacb9a698bcc2a.png',
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
