import React from 'react';
import Navbar from './Navbar';
import './MainMenuHeroSection.css';

const MainMenuHeroSection = () => {
    return (
        <section className="main-menu-hero-section">
            <Navbar />
            <div className="container main-menu-hero-container">
                <div className="main-menu-title-container">
                    <h1 className="main-menu-title">
                        From Our Menu
                        <img src="https://69ab316afa9e210ee0efdb51.imgix.net/leaf/706894ca65e5d90ff4fdb8eece18e01aa3beadf2.png" alt="Decorative Leaf" className="main-menu-leaf-image" />
                    </h1>
                </div>
                <div className="search-bar-container">
                    <input type="text" placeholder="Enter food you want to" className="main-menu-search-input" />
                    <button className="main-menu-search-button">Search</button>
                </div>
            </div>
        </section>
    );
};

export default MainMenuHeroSection;
