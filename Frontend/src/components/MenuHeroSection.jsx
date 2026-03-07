import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './MenuHeroSection.css';

const MenuHeroSection = () => {
    const navigate = useNavigate();
    
    return (
        <section className="menu-hero-section">
            <Navbar />

            <div className="container menu-hero-container">
                {/* Left Side Content */}
                <div className="menu-hero-content">
                    <h1 className="menu-hero-title">
                        Your Menu,<br />
                        Made Simple
                    </h1>
                    <p className="menu-hero-desc">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.
                    </p>

                    <div className="order-now-container">
                        <button className="btn-order-now" onClick={() => navigate('/main-menu')}>Order Now</button>

                        {/* Decorative Dashed Arrow — loops then extends */}
                        <div className="dashed-arrow">
                            <svg width="300" height="180" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Dashed path: starts bottom-left, loops full circle, then extends upper-right */}
                                <path
                                    d="M 30 165 C 0 145, -5 85, 40 65 C 85 45, 135 75, 125 125 C 115 165, 75 185, 45 165 C 18 148, 35 110, 70 92 C 110 72, 175 50, 255 18"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeDasharray="8,8"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                                {/* Large solid triangle arrowhead */}
                                <polygon
                                    points="243,5 275,22 250,50"
                                    fill="white"
                                    opacity="0.92"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side Cards Grid */}
                <div className="menu-hero-cards-wrapper">
                    {/* Background decor lines */}
                    <div className="cards-bg-lines"></div>

                    <div className="menu-hero-cards">
                        {/* Card 1 */}
                        <div className="menu-card">
                            <div className="menu-card-img-wrapper">
                                {/* Use transparent burger as placeholder since proper transparent images will be provided later */}
                                <img src="https://69ab316afa9e210ee0efdb51.imgix.net/Fast%20Food/ecd240ce7c550720ab20af0840548a832e0f9a28%20(1).png" alt="Fast Food" />
                            </div>
                            <h3>Fast Food</h3>
                            <a href="#" className="see-more">See more</a>
                        </div>

                        {/* Card 2 */}
                        <div className="menu-card">
                            <div className="menu-card-img-wrapper">
                                <img src="https://69ab316afa9e210ee0efdb51.imgix.net/combo/385e2de92960bf175397022922e830ec3e1d9301.png" alt="Food Combo" />
                            </div>
                            <h3>Food Combo</h3>
                            <a href="#" className="see-more">See more</a>
                        </div>

                        {/* Card 3 */}
                        <div className="menu-card">
                            <div className="menu-card-img-wrapper">
                                <img src="https://69ab316afa9e210ee0efdb51.imgix.net/cake/8a777b72ca2f7832b951d3dd04ad5fcbba7a1a18.png" alt="Cake" />
                            </div>
                            <h3>Cake</h3>
                            <a href="#" className="see-more">See more</a>
                        </div>

                        {/* Card 4 */}
                        <div className="menu-card">
                            <div className="menu-card-img-wrapper">
                                <img src="https://69ab316afa9e210ee0efdb51.imgix.net/dry/046c4ac087f0b30ff11a791e5991d04d0b5fd557.png" alt="Dry food" />
                            </div>
                            <h3>Dry food</h3>
                            <a href="#" className="see-more">See more</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MenuHeroSection;
