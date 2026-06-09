import React from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import "./Cart.css";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>
          <div className="cart-empty">
            <ShoppingBag size={72} />
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa thêm món nào vào giỏ hàng.</p>
            <Link to="/main-menu" className="btn-shop">
              Khám phá thực đơn
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h1>
            <ShoppingCart
              size={24}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            Giỏ hàng ({totalItems} món)
          </h1>
        </div>

        <div className="cart-content">
          {/* Cart items */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=120&q=80"
                  }
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    {formatVND(item.price)} / phần
                  </div>
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-subtotal">
                  {formatVND(item.price * item.quantity)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h2>Tóm tắt đơn hàng</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="summary-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatVND(item.price * item.quantity)}</span>
              </div>
            ))}
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
            <button
              className="btn-checkout"
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  toast.error("Đăng nhập để tiến hành thanh toán!");
                  navigate("/login");
                  return;
                }
                navigate("/checkout");
              }}
            >
              Tiến hành thanh toán
            </button>
            <button className="btn-clear-cart" onClick={clearCart}>
              Xóa giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
