import React from 'react';
import './MenuGrid.css';
import MenuProductCard from './MenuProductCard';
import { menuItems, categories as menuCategories } from '../constants/menuData';

const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase();

const categoryMap = menuCategories.reduce((map, category) => {
  const id = category === 'All' ? 'all' : slug(category);
  map[id] = category;
  return map;
}, {});

const MenuGrid = ({ selectedCategory = 'all' }) => {
  const filteredProducts =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((product) => product.category === categoryMap[selectedCategory]);

  return (
    <div className="menu-grid-container">
      <div className="menu-grid">
        {filteredProducts.map((product) => (
          <MenuProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
