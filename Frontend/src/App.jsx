import React from 'react';
import './App.css';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import PopularFoodSection from './components/PopularFoodSection';
import TestimonialSection from './components/TestimonialSection';
import TeamSection from './components/TeamSection';
import LatestFoodSection from './components/LatestFoodSection';
import PartnersSection from './components/PartnersSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <main>
        {/* New sections based on the full-page design */}
        <HeroSection />
        <CategorySection />
        <FeaturesSection />
        <AboutSection />
        <PopularFoodSection />
        <TestimonialSection />
        <TeamSection />

        {/* Existing sections from the bottom of the design */}
        <LatestFoodSection />
        <PartnersSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
