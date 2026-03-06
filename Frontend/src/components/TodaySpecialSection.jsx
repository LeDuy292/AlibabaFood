import React from 'react';
import './TodaySpecialSection.css';

const specialItems = [
    {
        id: 1,
        title: 'Vegetarian salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        rating: 5,
        price: 5,
    },
    {
        id: 2,
        title: 'Vegetarian salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        rating: 5,
        price: 5,
    },
    {
        id: 3,
        title: 'Vegetarian salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        rating: 5,
        price: 5,
    }
];

const TodaySpecialSection = () => {
    return (
        <section className="today-special-section">
            <div className="container">
                <h2 className="section-title text-center">Today Spacial</h2>

                <div className="special-grid">
                    {specialItems.map((item) => (
                        <div key={item.id} className="special-card">

                            {/* Top-left: quantity & discount */}
                            <div className="card-header">
                                <div className="card-meta">
                                    <div className="card-qty">Quantity: 32</div>
                                    <div className="card-discount">Discount: 10%</div>
                                </div>
                            </div>

                            {/* Top-right: bell icon (absolutely positioned) */}
                            <div className="favorite-btn" title="Notify me">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>

                            {/* Circular food image */}
                            <div className="card-image">
                                <img src={item.image} alt={item.title} />
                            </div>

                            {/* Footer: two rows */}
                            <div className="card-footer">
                                {/* Row 1: Name + Add to Cart */}
                                <div className="card-name-row">
                                    <span className="card-title">{item.title}</span>
                                    <button className="add-to-cart-btn">Add to Cart</button>
                                </div>

                                {/* Row 2: Stars + Price + Buy Now */}
                                <div className="card-bottom-row">
                                    <div className="card-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < item.rating ? 'star-filled' : 'star-empty'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="card-price">${item.price}</span>
                                    <button className="buy-now-btn">Buy Now</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Navigation arrows */}
                <div className="special-nav-arrows">
                    <button className="nav-arrow" aria-label="Previous">
                        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button className="nav-arrow" aria-label="Next">
                        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TodaySpecialSection;
