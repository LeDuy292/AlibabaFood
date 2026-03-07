import React from 'react';
import './MenuGrid.css';
import MenuProductCard from './MenuProductCard';

const mockProducts = [
  {
    name: 'Vegetarian salad',
    price: '5',
    rating: 5,
    discount: '10%',
    quantity: 32,
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Com Tam',
    price: '2',
    rating: 5,
    discount: '15%',
    quantity: 24,
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pho Bo',
    price: '3',
    rating: 4,
    discount: '5%',
    quantity: 50,
    category: 'noodle',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Fruit Salad',
    price: '6',
    rating: 5,
    discount: '12%',
    quantity: 15,
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Banh Mi',
    price: '2',
    rating: 5,
    discount: '10%',
    quantity: 32,
    category: 'fast-food',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Spring Rolls',
    price: '4',
    rating: 5,
    discount: '20%',
    quantity: 10,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Bun Cha',
    price: '3',
    rating: 4,
    discount: '10%',
    quantity: 28,
    category: 'noodle',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Che Ba Mau',
    price: '2',
    rating: 5,
    discount: '15%',
    quantity: 20,
    category: 'sweets',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Goi Cuon',
    price: '3',
    rating: 5,
    discount: '10%',
    quantity: 35,
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Banh Xeo',
    price: '4',
    rating: 4,
    discount: '5%',
    quantity: 42,
    category: 'fast-food',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Hu Tiu',
    price: '3',
    rating: 5,
    discount: '10%',
    quantity: 18,
    category: 'noodle',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dried Beef',
    price: '5',
    rating: 5,
    discount: '10%',
    quantity: 25,
    category: 'dry-food',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  }
];

const MenuGrid = ({ selectedCategory = 'all' }) => {
  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="menu-grid-container">
      <div className="menu-grid">
        {filteredProducts.map((product, index) => (
          <MenuProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
