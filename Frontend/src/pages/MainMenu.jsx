import React, { useState } from 'react';
import MainMenuHeroSection from '../components/MainMenuHeroSection';
import CategoryNav from '../components/CategoryNav';
import MenuGrid from '../components/MenuGrid';
import ScrollReveal from '../components/ScrollReveal';
import './MainMenu.css';

const MainMenu = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="main-menu-page">
            <ScrollReveal><MainMenuHeroSection /></ScrollReveal>
            <ScrollReveal>
                <CategoryNav
                    activeCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </ScrollReveal>
            <ScrollReveal><MenuGrid selectedCategory={selectedCategory} /></ScrollReveal>
        </div>
    );
};

export default MainMenu;