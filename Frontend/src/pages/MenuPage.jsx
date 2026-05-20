import React, { useState, useCallback } from 'react';
import MenuHeroSection from '../components/MenuHeroSection';
import MenuCategoriesSection from '../components/MenuCategoriesSection';
import HotDealSection from '../components/HotDealSection';
import ComboDealSection from '../components/ComboDealSection';
import HowItWorksSection from '../components/HowItWorksSection';
import NearbyDishesList from '../components/NearbyDishesList';
import LocationPromptModal from '../components/LocationPromptModal';
import ScrollReveal from '../components/ScrollReveal';
import './MenuPage.css';

const MenuPage = () => {
    const [userLocation, setUserLocation] = useState(null);

    const handleLocationSet = useCallback((locationData) => {
        setUserLocation(locationData);
    }, []);

    return (
        <div className="menu-page">
            <LocationPromptModal onLocationSet={handleLocationSet} />
            <main className="menu-main">
                <ScrollReveal><MenuHeroSection /></ScrollReveal>
                <ScrollReveal><NearbyDishesList userLocation={userLocation} /></ScrollReveal>
                <ScrollReveal><MenuCategoriesSection /></ScrollReveal>
                <ScrollReveal><HotDealSection userLocation={userLocation} /></ScrollReveal>
                <ScrollReveal><ComboDealSection userLocation={userLocation} /></ScrollReveal>
                <ScrollReveal><HowItWorksSection /></ScrollReveal>
            </main>
        </div>
    );
};

export default MenuPage;

