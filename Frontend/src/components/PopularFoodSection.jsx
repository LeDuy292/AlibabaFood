import React from 'react';
import './PopularFoodSection.css';

const PopularFoodSection = () => {
    return (
        <section className="popular-food-section container">
            <h2 className="section-title text-center">Most Popular Food</h2>

            <div className="popular-food-grid">
                {/* Card 1 */}
                <div className="popular-card">
                    <img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop" alt="Breakfast food" className="popular-img" />
                    <div className="popular-info">
                        <h4 className="popular-title">Breakfast food</h4>
                        <div className="popular-rating">⭐⭐⭐⭐⭐</div>
                        <div className="popular-price-row">
                            <span className="popular-price">$5</span>
                            <button className="btn-add-cart">Add to cart</button>
                        </div>
                    </div>
                </div>

                {/* Card 2 (Center, slightly larger/highlighted in design) */}
                <div className="popular-card featured">
                    <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&auto=format&fit=crop" alt="Breakfast food" className="popular-img" />
                    <div className="popular-info">
                        <h4 className="popular-title">Breakfast food</h4>
                        <div className="popular-rating">⭐⭐⭐⭐⭐</div>
                        <div className="popular-price-row">
                            <span className="popular-price">$5</span>
                            <button className="btn-add-cart">Add to cart</button>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="popular-card">
                    <img src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop" alt="Breakfast food" className="popular-img" />
                    <div className="popular-info">
                        <h4 className="popular-title">Breakfast food</h4>
                        <div className="popular-rating">⭐⭐⭐⭐⭐</div>
                        <div className="popular-price-row">
                            <span className="popular-price">$5</span>
                            <button className="btn-add-cart">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularFoodSection;
