import React from 'react';
import MenuHeroSection from '../components/MenuHeroSection';
import MenuCategoriesSection from '../components/MenuCategoriesSection';
import HotDealSection from '../components/HotDealSection';
import ComboDealSection from '../components/ComboDealSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ScrollReveal from '../components/ScrollReveal';
import './MenuPage.css';

const MenuPage = () => {
    return (
        <div className="menu-page">
            <main className="menu-main">
                <ScrollReveal><MenuHeroSection /></ScrollReveal>
                <ScrollReveal><MenuCategoriesSection /></ScrollReveal>
                <ScrollReveal><HotDealSection /></ScrollReveal>
                <ScrollReveal><ComboDealSection /></ScrollReveal>
                <ScrollReveal><HowItWorksSection /></ScrollReveal>
            </main>
        </div>
    );
};

export default MenuPage;
