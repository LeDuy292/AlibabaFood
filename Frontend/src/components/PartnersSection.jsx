import React from 'react';
import './PartnersSection.css';

import winmartLogo from '../assets/winmart.png';
import bachHoaXanhLogo from '../assets/Logo-Bach-Hoa-Xanh-V.webp';
import miQuangLogo from '../assets/Logo-my-quang.webp';
import anhHungLogo from '../assets/logo-anh-hung.webp';
import anhQuanLogo from '../assets/logo-anh-quan.webp';

const partners = [
    { name: 'Winmart', logo: winmartLogo },
    { name: 'Bach Hoa Xanh', logo: bachHoaXanhLogo },
    { name: 'Mi Quang Ba Mua', logo: miQuangLogo },
    { name: 'Anh Hung Seafood', logo: anhHungLogo },
    { name: 'Anh Quan', logo: anhQuanLogo },
];

// Duplicate for seamless infinite scroll
const allPartners = [...partners, ...partners, ...partners];

const PartnersSection = () => {
    return (
        <section className="partners-section">
            {/* Badge */}
            <div className="partners-badge">
                <span>🌱</span> Partners & Clients
            </div>

            {/* Title */}
            <h2 className="partners-title">
                Our <span>Trusted</span> Partners
            </h2>
            <p className="partners-subtitle-text">
                We are proud to work alongside the leading food brands
            </p>

            {/* Decorative divider */}
            <div className="partners-divider">
                <div className="partners-divider-dot"></div>
                <div className="partners-divider-dot" style={{ width: '12px', height: '12px' }}></div>
                <div className="partners-divider-dot"></div>
            </div>

            {/* Marquee track */}
            <div className="partners-marquee-wrapper">
                <div className="partners-marquee-track">
                    {allPartners.map((partner, index) => (
                        <div className="logo-item" key={`${partner.name}-${index}`}>
                            <div className="logo-circle">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="partner-logo-img"
                                />
                            </div>
                            <span className="partner-name">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
