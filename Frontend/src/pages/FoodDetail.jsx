import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainMenuHeroSection from "../components/MainMenuHeroSection";
import CategoryNav from "../components/CategoryNav";
import { Star, Minus, Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import "./FoodDetail.css";

const FoodDetail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [notes, setNotes] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddOnChange = (addonName) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addonName]: !prev[addonName],
    }));
  };

  const buildCartItem = () => ({
    name: "Com Tam",
    price: 55000, // VND
    quantity,
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=120&q=80",
    addOns: Object.keys(selectedAddOns).filter((key) => selectedAddOns[key]),
    notes,
  });

  const handleAddToCart = () => {
    addToCart(buildCartItem());
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleOrderNow = () => {
    addToCart(buildCartItem());
    navigate("/checkout");
  };

  return (
    <div className="food-detail-page">
      <MainMenuHeroSection />
      <CategoryNav />

      <div className="food-detail-main-container">
        <div className="container">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} /> Back
          </button>

          <div className="food-detail-card">
            <div className="food-detail-image-section">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80"
                alt="Com Tam"
                className="main-food-image"
              />
            </div>

            <div className="food-detail-info-section">
              <h1 className="food-name">Com Tam</h1>

              <div className="rating-row">
                <Star size={18} fill="#FFD700" stroke="#FFD700" />
                <span className="rating-score">4.5 - 20 Reviewers</span>
              </div>

              <p className="food-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Commodo, sed proin amet a vestibulum enim volutpat lacus.
                Volutpat arcu sit sed tortor etiam volutpat ipsum.
              </p>
              <p className="food-highlight">
                Broken Rice with Pork Chop, Shredded Pork & Egg Meatloaf
              </p>

              <div className="price-quantity-row">
                <div className="price-col">
                  <span className="price-label">Price</span>
                  <h2 className="price-value">$2</h2>
                </div>
                <div className="quantity-col">
                  <span className="quantity-label">Quantity</span>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="options-row">
                <div className="add-ons-col">
                  <h3 className="section-title">Add Ons</h3>
                  <div className="add-on-list">
                    {[
                      "Extra Grilled Pork Chop",
                      "Shredded Pork Skin",
                      "Steamed Egg Meatloaf",
                      "Fried Egg",
                    ].map((addon, idx) => (
                      <div key={idx} className="add-on-item">
                        <div className="add-on-img-placeholder"></div>
                        <span className="add-on-name">{addon}</span>
                        <input
                          type="checkbox"
                          className="add-on-checkbox"
                          checked={selectedAddOns[addon] || false}
                          onChange={() => handleAddOnChange(addon)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="notes-col">
                  <h3 className="section-title">Notes</h3>
                  <textarea
                    className="notes-textarea"
                    placeholder="Enter your note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                  <div className="action-buttons-group">
                    <button
                      className="add-to-cart-outline-btn"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="order-now-solid-btn"
                      onClick={handleOrderNow}
                    >
                      ORDER NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
