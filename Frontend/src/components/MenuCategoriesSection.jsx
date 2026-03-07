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
            {/* Info Bar */}
            <div className="info-bar">
                <div className="info-item">
                    <span className="info-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                            <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div>
                        <p className="info-main">Today 07:00am - 12:00pm</p>
                        <p className="info-sub">Working time</p>
                    </div>
                </div>

                <div className="info-divider"></div>

                <div className="info-item">
                    <span className="info-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2" />
                        </svg>
                    </span>
                    <div>
                        <p className="info-main">Da Nang City, VietNam</p>
                        <p className="info-sub">Our Location</p>
                    </div>
                </div>

                <div className="info-divider"></div>

                <div className="info-item">
                    <span className="info-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div>
                        <p className="info-main">+0123 456 7891</p>
                        <p className="info-sub">Phone Number</p>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <section className="menu-categories-section">
                <div className="container">
                    <h2 className="categories-title">Categories Food</h2>

                    {/* Cards Row */}
                    <div className="categories-carousel">
                        {visible.map(cat => (
                            <div className="category-card" key={cat.id}>
                                <div className="category-card-img">
                                    <img src={cat.img} alt={cat.name} />
                                </div>
                                <h3 className="category-card-name">{cat.name}</h3>
                                <a href="#" className="category-see-more">See more</a>
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
