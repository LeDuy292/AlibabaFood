import React from 'react';
import './FoodCard.css';

const FoodCard = ({ image, title, price, index }) => {
  return (
    <div className="food-card">
      <div className="food-card-image-container">
        {/* Decorative dots based on index or fixed */}
        <div className="decorative-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
          <span className="dot dot-4"></span>
          <span className="dot dot-5"></span>
        </div>
        <div className="food-card-circle"></div>
        <img src={image} alt={title} className="food-image" />
      </div>

      <div className="food-card-footer">
        <div className="food-card-title">{title}</div>
        <div className="food-card-price">${price}</div>
      </div>
    </div>
  );
};

export default FoodCard;
