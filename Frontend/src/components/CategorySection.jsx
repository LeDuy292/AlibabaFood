import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
    return (
        <section className="category-section container">
            <div className="category-grid">
                {/* Repeating 4 blank cards that match the design */}
                {[1, 2, 3, 4].map(item => (
                    <div key={item} className="category-card">
                        <div className="category-circle"></div>
                        <div className="category-footer">
                            <div className="category-pill-short"></div>
                            <div className="category-pill-green"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
