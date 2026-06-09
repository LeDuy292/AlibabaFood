import React, { useState, useCallback } from 'react';
import MenuHeroSection from '../components/MenuHeroSection';
import MenuCategoriesSection from '../components/MenuCategoriesSection';
import HotDealSection from '../components/HotDealSection';
import ComboDealSection from '../components/ComboDealSection';
import HowItWorksSection from '../components/HowItWorksSection';
import NearbyDishesList from '../components/NearbyDishesList';
import LocationPromptModal from '../components/LocationPromptModal';
import ScrollReveal from '../components/ScrollReveal';
import { useLocationCtx } from '../contexts/LocationContext';
import './MenuPage.css';

const MenuPage = () => {
    const { userLocation } = useLocationCtx();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    return (
        <div className="menu-page">
            <LocationPromptModal 
                isOpen={isLocationModalOpen || undefined}
                onClose={() => setIsLocationModalOpen(false)}
            />
            <main className="menu-main">
                <ScrollReveal><MenuHeroSection /></ScrollReveal>
                
                {userLocation && (
                    <div className="menu-address-bar-wrapper container">
                        <div className="menu-address-bar">
                            <div className="menu-address-info">
                                <span className="address-pin-icon">📍</span>
                                <span className="address-label">Giao đến:</span>
                                <span className="address-value" title={userLocation.address}>{userLocation.address}</span>
                            </div>
                            <button className="change-address-btn" onClick={() => setIsLocationModalOpen(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Thay đổi địa chỉ
                            </button>
                        </div>
                    </div>
                )}

                <ScrollReveal>
                    <NearbyDishesList 
                        userLocation={userLocation} 
                        onChangeLocation={() => setIsLocationModalOpen(true)}
                    />
                </ScrollReveal>
                <ScrollReveal><MenuCategoriesSection /></ScrollReveal>
                <ScrollReveal>
                    <HotDealSection 
                        userLocation={userLocation} 
                        onChangeLocation={() => setIsLocationModalOpen(true)}
                    />
                </ScrollReveal>
                <ScrollReveal>
                    <ComboDealSection 
                        userLocation={userLocation} 
                        onChangeLocation={() => setIsLocationModalOpen(true)}
                    />
                </ScrollReveal>
                <ScrollReveal><HowItWorksSection /></ScrollReveal>
            </main>
        </div>
    );
};

export default MenuPage;

