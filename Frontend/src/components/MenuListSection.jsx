import React, { useState } from 'react';
import './MenuListSection.css';

const categories = ['All', 'Fast Food', 'Food Combo', 'Cake', 'Dry Food'];

const menuItems = [
    {
        id: 1,
        name: 'Classic Burger',
        category: 'Fast Food',
        price: '55,000đ',
        rating: 4.8,
        img: 'https://png.pngtree.com/png-vector/20230321/ourmid/pngtree-beef-burger-food-png-image_6655517.png',
        tag: 'Best Seller',
    },
    {
        id: 2,
        name: 'Crispy Chicken',
        category: 'Fast Food',
        price: '45,000đ',
        rating: 4.6,
        img: 'https://png.pngtree.com/png-clipart/20220924/ourmid/pngtree-crispy-fried-chicken-food-png-image_6222027.png',
        tag: 'Hot',
    },
    {
        id: 3,
        name: 'Burger Combo',
        category: 'Food Combo',
        price: '99,000đ',
        rating: 4.9,
        img: 'https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png',
        tag: 'Best Seller',
    },
    {
        id: 4,
        name: 'Family Combo',
        category: 'Food Combo',
        price: '179,000đ',
        rating: 4.7,
        img: 'https://png.pngtree.com/png-clipart/20221006/ourmid/pngtree-food-combo-fast-food-png-image_6270777.png',
        tag: '',
    },
    {
        id: 5,
        name: 'Black Forest Cake',
        category: 'Cake',
        price: '65,000đ',
        rating: 4.9,
        img: 'https://png.pngtree.com/png-clipart/20240406/ourmid/pngtree-detailed-black-forest-cake-png-image_12235948.png',
        tag: 'New',
    },
    {
        id: 6,
        name: 'Strawberry Cake',
        category: 'Cake',
        price: '70,000đ',
        rating: 4.8,
        img: 'https://png.pngtree.com/png-vector/20221103/ourmid/pngtree-birthday-strawberry-birthday-cake-png-image_6404248.png',
        tag: '',
    },
    {
        id: 7,
        name: 'Beef Jerky',
        category: 'Dry Food',
        price: '35,000đ',
        rating: 4.5,
        img: 'https://png.pngtree.com/png-clipart/20230922/ourmid/pngtree-premium-fresh-beef-jerky-with-spices-snack-png-image_10143891.png',
        tag: '',
    },
    {
        id: 8,
        name: 'Mixed Nuts',
        category: 'Dry Food',
        price: '49,000đ',
        rating: 4.6,
        img: 'https://png.pngtree.com/png-vector/20231030/ourmid/pngtree-mixed-nuts-png-image_10291097.png',
        tag: 'New',
    },
];

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
);

const CartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MenuListSection = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <section className="menu-list-section">
            <div className="container">
                <div className="menu-list-header">
                    <h2 className="menu-list-title">Explore Our <span>Delicious</span> Menu</h2>
                    <p className="menu-list-subtitle">Freshly prepared with quality ingredients — something for everyone.</p>
                </div>

                {/* Category Filter Tabs */}
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Food Grid */}
                <div className="menu-items-grid">
                    {filtered.map(item => (
                        <div className="food-card" key={item.id}>
                            {item.tag && <span className="food-tag">{item.tag}</span>}
                            <div className="food-img-wrapper">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="food-card-body">
                                <div className="food-card-top">
                                    <h3 className="food-name">{item.name}</h3>
                                    <span className="food-category">{item.category}</span>
                                </div>
                                <div className="food-card-bottom">
                                    <div className="food-rating">
                                        <StarIcon />
                                        <span>{item.rating}</span>
                                    </div>
                                    <div className="food-price-row">
                                        <span className="food-price">{item.price}</span>
                                        <button className="add-to-cart-btn" aria-label="Add to cart">
                                            <CartIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenuListSection;
