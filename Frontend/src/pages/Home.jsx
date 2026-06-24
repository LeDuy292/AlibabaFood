import React from 'react';
import HeroSection from '../components/HeroSection';

import FeatureSlider from '../components/FeatureSlider';
import AboutSection from '../components/AboutSection';
import PopularFoodSection from '../components/PopularFoodSection';
import TestimonialSection from '../components/TestimonialSection';
import LatestFoodSection from '../components/LatestFoodSection';
import PartnersSection from '../components/PartnersSection';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
    return (
        <>
            {/* New sections based on the full-page design */}
            <ScrollReveal><HeroSection /></ScrollReveal>
            <ScrollReveal><FeatureSlider /></ScrollReveal>
            <ScrollReveal><AboutSection /></ScrollReveal>
            <ScrollReveal><PopularFoodSection /></ScrollReveal>
            <ScrollReveal><TestimonialSection /></ScrollReveal>
            {/* Existing sections from the bottom of the design */}
            <ScrollReveal><LatestFoodSection /></ScrollReveal>
            <ScrollReveal><PartnersSection /></ScrollReveal>
        </>
    );
};

export default Home;
