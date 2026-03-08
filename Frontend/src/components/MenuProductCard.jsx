import React from "react";
import "./MenuProductCard.css";
import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";

const MenuProductCard = ({ product }) => {
  const { name, price, rating, discount, image, quantity } = product;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Convert price string (e.g. '5') to VND integer
  const priceVND = Math.round(parseFloat(price) * 10000);

  const buildItem = () => ({
    name,
    price: priceVND,
    quantity: 1,
    image,
  });

  const handleAddToCart = () => {
    addToCart(buildItem());
    toast.success(`Đã thêm "${name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(buildItem());
    navigate("/checkout");
  };

  return (
    <div className="menu-product-card">
      <div className="card-badge-container">
        <span className="quantity-badge">Quantity: {quantity}</span>
        <span className="discount-badge">Discount: {discount}</span>
      </div>

      <button className="cart-shortcut-btn" onClick={handleAddToCart}>
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
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuProductCard;
