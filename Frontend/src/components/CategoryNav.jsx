import React from 'react';
import './CategoryNav.css';
import { LayoutGrid, Utensils, UtensilsCrossed, Salad, Cake, Zap, Cookie, Boxes } from 'lucide-react';

const categories = [
  { id: 'all', name: 'ALL', icon: <LayoutGrid size={20} /> },
  { id: 'rice', name: 'RICE', icon: <Utensils size={20} /> },
  { id: 'noodle', name: 'NOODLE', icon: <UtensilsCrossed size={20} /> },
  { id: 'salad', name: 'SALAD', icon: <Salad size={20} /> },
  { id: 'sweets', name: 'SWEETS', icon: <Cake size={20} /> },
  { id: 'fast-food', name: 'FAST FOOD', icon: <Zap size={20} /> },
  { id: 'snacks', name: 'SNACKS', icon: <Cookie size={20} /> },
  { id: 'dry-food', name: 'DRY FOOD', icon: <Boxes size={20} /> },
];

const CategoryNav = ({ activeCategory = 'all', onCategoryChange }) => {
  return (
    <div className="category-nav-container">
      <div className="category-nav-scroll">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange && onCategoryChange(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
        <button className="view-all-btn">
          View All
          <span className="cart-icon">🛒</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryNav;
