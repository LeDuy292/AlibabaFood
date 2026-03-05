import React, { useState } from 'react';
import './PopularFoodSection.css';

const PopularFoodSection = () => {
    const popularFoods = [
        { id: 1, title: 'Fresh Breakfast', price: 5, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop', featured: false },
        { id: 2, title: 'Egg & Avocado', price: 7, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&auto=format&fit=crop', featured: true },
        { id: 3, title: 'Pancakes Heaven', price: 6, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop', featured: false },
        { id: 4, title: 'Classic Toast', price: 4, rating: '⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1484723091791-c0e7e147c301?w=400&auto=format&fit=crop', featured: false },
        { id: 5, title: 'Vegan Salad', price: 8, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop', featured: true },
        { id: 6, title: 'Berry Waffles', price: 9, rating: '⭐⭐⭐⭐⭐', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop', featured: false }
    ];

    const itemsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(popularFoods.length / itemsPerPage);

    // Calculate the items to show based on currentPage
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = popularFoods.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    };

    return (
        <section className="popular-food-section container">
            <h2 className="testimonial-title">Most Popular Food</h2>

            <div className="popular-food-grid">
                {currentItems.map((food) => (
                    <div key={food.id} className={`popular-card ${food.featured ? 'featured' : ''}`}>
                        <img src={food.image} alt={food.title} className="popular-img" />
                        <div className="popular-info">
                            <h4 className="popular-title">{food.title}</h4>
                            <div className="popular-rating">{food.rating}</div>
                            <div className="popular-price-row">
                                <span className="popular-price">${food.price}</span>
                                <button className="btn-add-cart">Add to cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="food-pagination-wrapper">
                    <button className="food-control-btn" onClick={handlePrev}>&larr;</button>

                    <div className="food-pagination">
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                                <button
                                    key={pageNum}
                                    className={`page-dot ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                    aria-label={`Trang ${pageNum}`}
                                />
                            );
                        })}
                    </div>

                    <button className="food-control-btn" onClick={handleNext}>&rarr;</button>
                </div>
            )}
        </section>
    );
};

export default PopularFoodSection;
