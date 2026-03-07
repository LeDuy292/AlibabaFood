import React from 'react';
import Footer from '../components/Footer';
import MenuHeroSection from '../components/MenuHeroSection';
import MenuCategoriesSection from '../components/MenuCategoriesSection';
import HotDealSection from '../components/HotDealSection';
import ComboDealSection from '../components/ComboDealSection';
import HowItWorksSection from '../components/HowItWorksSection';
import './MenuPage.css';

const MenuPage = () => {
    return (
        <div className="menu-page">
            <main className="menu-main">
                <MenuHeroSection />
                <MenuCategoriesSection />
                <HotDealSection />
                <ComboDealSection />
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
};

export default MenuPage;
