import React from 'react';
import Navbar from '../components/Navbar';
import NewsHeroSection from '../components/NewsHeroSection';
import TodaySpecialSection from '../components/TodaySpecialSection';
import PromoSection from '../components/PromoSection';
import RecentNewsSection from '../components/RecentNewsSection';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

const News = () => {
    return (
        <div className="news-page">
            <Navbar /> {/* We need Navbar here or in a Layout */}

            <ScrollReveal>
                <NewsHeroSection />
            </ScrollReveal>

            <ScrollReveal>
                <TodaySpecialSection />
            </ScrollReveal>

            <ScrollReveal>
                <PromoSection />
            </ScrollReveal>

            <ScrollReveal>
                <RecentNewsSection />
            </ScrollReveal>
        </div>
    );
};

export default News;
