import React from 'react';
import './MenuProductCard.css';
import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

const formatVND = (value) => {
  const amount = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  return amount > 0 ? amount.toLocaleString('vi-VN') : '0';
};

const MenuProductCard = ({ product }) => {
  const { name, price, rating, discount, img, image, quantity } = product;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const rawPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, ''), 10) || 0;
  const imageUrl = img || image;

  const buildItem = () => ({
    name,
    price: rawPrice,
    quantity: 1,
    image: imageUrl,
  });

  const handleAddToCart = () => {
    addToCart(buildItem());
    toast.success(`Đã thêm "${name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(buildItem());
    navigate('/checkout');
  };

  return (
    <div className="menu-product-card">
      <div className="card-badge-container">
        <span className="quantity-badge">Số lượng: {quantity ?? 0}</span>
        {discount && discount !== '0%' && <span className="discount-badge">Giảm giá: {discount}</span>}
      </div>

      <button className="cart-shortcut-btn" onClick={handleAddToCart}>
        <ShoppingCart size={20} color="white" />
      </button>

      <div className="product-image-container">
        <img src={imageUrl} alt={name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < rating ? '#FFD700' : 'none'}
              stroke={i < rating ? '#FFD700' : '#ccc'}
            />
          ))}
        </div>

        <div className="product-footer">
          <div className="price-tag">
            <span className="currency">₫</span>
            <span className="amount">{formatVND(rawPrice)}</span>
          </div>
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuProductCard;
