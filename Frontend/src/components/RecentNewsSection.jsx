import React, { useState } from 'react';
import './RecentNewsSection.css';

const allNewsItems = [
    {
        id: 1,
        title: 'Dip. Bite. Repeat.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        badge: 'NEW FOOD',
    },
    {
        id: 2,
        title: 'Dip. Bite. Repeat.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=400',
        badge: 'NEW FOOD',
    },
    {
        id: 3,
        title: 'Dip. Bite. Repeat.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        badge: 'NEW FOOD',
    },
    {
        id: 4,
        title: 'Fresh & Healthy Bowl.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        badge: 'NEW FOOD',
    },
    {
        id: 5,
        title: 'Spicy Noodle Special.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400',
        badge: 'HOT',
    },
    {
        id: 6,
        title: 'Summer Salad Sensation.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, sed proin amet a vestibulum enim volutpat lacus. Volutpat arcu sit sed tortor etiam volutpat ipsum.',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400',
        badge: 'NEW FOOD',
    },
];

const ITEMS_PER_PAGE = 3;

const RecentNewsSection = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allNewsItems.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleItems = allNewsItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <section className="recent-news-section">
            <div className="container">
                {/* Cursive title */}
                <h2 className="rn-section-title text-center">Recent News &amp; Updates</h2>

                {/* Two-column layout */}
                <div className="rn-grid">
                    {/* Left: stacked news cards */}
                    <div className="rn-list-col">
                        {visibleItems.map((item) => (
                            <div key={item.id} className="rn-card">
                                <div className="rn-card-img-wrap">
                                    <img src={item.image} alt={item.title} className="rn-card-img" />
                                </div>
                                <div className="rn-card-body">
                                    <h3 className="rn-card-title">{item.title}</h3>
                                    <p className="rn-card-desc">{item.description}</p>
                                </div>
                                {item.badge && (
                                    <span className="rn-badge">{item.badge}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right: large featured image */}
                    <div className="rn-featured-col">
                        <img
                            src="https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=900"
                            alt="Featured dish"
                            className="rn-featured-img"
                        />
                    </div>
                </div>

                {/* Pagination — below the full grid */}
                <div className="rn-pagination">
                    <button
                        className="rn-page-btn"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={`rn-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="rn-page-btn"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RecentNewsSection;
