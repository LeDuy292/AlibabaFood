import React from 'react';
import './MenuProductCard.css';
import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuProductCard = ({ product }) => {
  const { name, price, rating, discount, image, quantity } = product;
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/food-detail');
  };

  return (
    <div className="menu-product-card">
      <div className="card-badge-container">
        <span className="quantity-badge">Quantity: {quantity}</span>
        <span className="discount-badge">Discount: {discount}</span>
      </div>
      
      <button className="cart-shortcut-btn">
        <ShoppingCart size={20} color="white" />
      </button>

      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < rating ? "#FFD700" : "none"}
              stroke={i < rating ? "#FFD700" : "#ccc"}
            />
          ))}
        </div>

        <div className="product-footer">
          <div className="price-tag">
            <span className="currency">$</span>
            <span className="amount">{price}</span>
          </div>
          <div className="action-buttons">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuProductCard;
