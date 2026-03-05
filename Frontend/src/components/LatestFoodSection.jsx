import React from 'react';
import './LatestFoodSection.css';

const latestFoods = [
    {
        id: 1,
        name: 'Mì Quảng',
        price: '$2',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop',
    },
    {
        id: 2,
        name: 'Gà BBQ',
        price: '$10',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop',
    },
    {
        id: 3,
        name: 'Bún Thịt Nướng',
        price: '$2',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    {
        id: 4,
        name: 'Bún Chả',
        price: '$2',
        image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop',
    },
];

const LatestFoodSection = () => {
    return (
        <section className="lnf-section">
            <div className="lnf-container">
                <h2 className="lnf-title">Latest New Food</h2>
                <div className="lnf-grid">
                    {latestFoods.map((food) => (
                        <div className="lnf-item" key={food.id}>
                            <div className="lnf-circle-wrap">
                                {/* Decorative dots */}
                                <span className="lnf-dot dot-1"></span>
                                <span className="lnf-dot dot-2"></span>
                                <span className="lnf-dot dot-3"></span>
                                <span className="lnf-dot dot-4"></span>
                                <span className="lnf-dot dot-5"></span>
                                <span className="lnf-dot dot-6"></span>
                                <span className="lnf-dot dot-7"></span>

                                {/* Background Peach Circle */}
                                <div className="lnf-bg-circle"></div>

                                {/* Food Image Container */}
                                <div className="lnf-img-container">
                                    <img src={food.image} alt={food.name} className="lnf-img" />
                                </div>
                            </div>

                            {/* Label Row */}
                            <div className="lnf-label-row">
                                <span className="lnf-name">{food.name}</span>
                                <span className="lnf-price">{food.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestFoodSection;
