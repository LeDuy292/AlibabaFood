import React from 'react';
import './PartnersSection.css';

// Using placeholder text logos to mimic the image
const PartnersSection = () => {
    return (
        <section className="partners-section">
            <div className="partners-subtitle">
                <span className="partners-icon">🌱</span>
                <i>Partners & Clients</i>
            </div>
            <h2 className="partners-title">We work with the best pepole</h2>

            <div className="partners-logos">
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#E21A22', fontSize: '1.2rem', fontWeight: 'bold' }}>Winmart</span>
                </div>
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#008445', fontSize: '1.2rem', fontWeight: 'bold' }}>BÁCH HÓA XANH</span>
                </div>
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#d91e18', fontSize: '1.2rem', fontWeight: 'bold' }}>MÌ QUẢNG BÀ MUA</span>
                </div>
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#1e3a8a', fontSize: '1.2rem', fontWeight: 'bold' }}>HẢI SẢN NĂM ĐẢNH</span>
                </div>
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#b91c1c', fontSize: '1.2rem', fontWeight: 'bold' }}>ĐẶC SẢN TRẦN</span>
                </div>
                <div className="logo-placeholder" style={{ backgroundColor: '#f3f4f6', padding: '15px 30px', borderRadius: '8px' }}>
                    <span className="logo-text" style={{ color: '#047857', fontSize: '1.2rem', fontWeight: 'bold' }}>BẾP CUỐN ĐÀ NẴNG</span>
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
