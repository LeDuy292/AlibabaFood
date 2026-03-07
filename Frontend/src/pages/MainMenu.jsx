import React, { useState } from 'react';
import MainMenuHeroSection from '../components/MainMenuHeroSection';
import CategoryNav from '../components/CategoryNav';
import MenuGrid from '../components/MenuGrid';
import Footer from '../components/Footer';
import './MainMenu.css';

const MainMenu = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="main-menu-page">
            <MainMenuHeroSection />
            <CategoryNav 
                activeCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
            />
            <MenuGrid selectedCategory={selectedCategory} />
            <Footer />
        </div>
    );
};

export default MainMenu;