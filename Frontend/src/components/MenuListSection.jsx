import React, { useState } from 'react';
import './MenuListSection.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { menuItems, categories } from '../constants/menuData';

const parseVND = (str) => parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;

const categoryLabels = {
  All: 'Tất cả',
  'Đồ Uống': 'Đồ Uống',
  'Snack & Bánh': 'Snack & Bánh',
  'Sữa & Trứng': 'Sữa & Trứng',
  'Trái Cây': 'Trái Cây',
  'Đồ Ăn Nhanh': 'Đồ Ăn Nhanh',
};

const tagLabels = {
  'Best Seller': 'Best Seller',
  Hot: 'Bán Chạy',
  New: 'Mới',
};

const MenuListSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart({
      name: item.name,
      price: parseVND(item.price),
      quantity: 1,
      image: item.img,
    });
    toast.success(`Đã thêm "${item.name}" vào giỏ!`);
  };

  const filtered =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="menu-list-section">
      <div className="container">
        <div className="menu-list-header">
          <h2 className="menu-list-title">
            Khám Phá Thực Đơn <span>Thơm Ngon</span> Của Chúng Tôi
          </h2>
          <p className="menu-list-subtitle">
            Được chuẩn bị tươi mới mỗi ngày với nguyên liệu chất lượng cao — hương vị phù hợp với tất cả mọi người.
          </p>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        <div className="menu-items-grid">
          {filtered.map((item) => (
            <div className="food-card" key={item.id}>
              {item.tag && <span className="food-tag">{tagLabels[item.tag] || item.tag}</span>}
              <div className="food-img-wrapper">
                <a href={item.link || '#'} target="_blank" rel="noreferrer">
                  <img
                    src={item.img}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                </a>
              </div>
              <div className="food-card-body">
                <div className="food-card-top">
                  <h3 className="food-name">{item.name}</h3>
                  <span className="food-category">{categoryLabels[item.category] || item.category}</span>
                </div>
                <div className="food-card-bottom">
                  <div className="food-rating">
                    <span>⭐</span>
                    <span>{item.rating}</span>
                  </div>
                  <div className="food-price-row">
                    <span className="food-price">{parseVND(item.price).toLocaleString('vi-VN')} ₫</span>
                    <button
                      className="add-to-cart-btn"
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 6H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <a className="food-link" href={item.link || '#'} target="_blank" rel="noreferrer">
                    Xem sản phẩm
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuListSection;
