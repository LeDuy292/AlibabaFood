import React, { useEffect, useState } from 'react';
import './MenuGrid.css';
import MenuProductCard from './MenuProductCard';
import { getAllProducts } from '../services/productService';

import { useLocationCtx } from '../contexts/LocationContext';

const slug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const MenuGrid = ({ selectedCategory = 'all' }) => {
  const { userLocation } = useLocationCtx();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const lat = userLocation?.lat;
        const lng = userLocation?.lng;
        const data = await getAllProducts(lat, lng);
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu');
        }
      } catch (err) {
        setError(err.message || 'Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userLocation]); // Refetch when location changes

  if (loading) return <div className="menu-grid-loading">Đang tải món ăn...</div>;
  if (error) return <div className="menu-grid-error">Lỗi: {error}</div>;

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => slug(product.categoryName) === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: scroll to top of grid
      window.scrollTo({ top: document.querySelector('.menu-grid-container')?.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="menu-grid-container">
      {filteredProducts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Không tìm thấy món ăn nào trong danh mục này.
        </div>
      )}
      
      <div className="menu-grid">
        {currentItems.map((product) => {
          // Map backend DTO to what MenuProductCard expects
          const cardProduct = {
            id: product.itemId,
            name: product.itemName,
            price: product.discountedPrice,
            rating: product.supplierRating || 5,
            discount: product.discountPercentage ? `${product.discountPercentage}%` : '0%',
            image: product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
            quantity: product.quantityAvailable,
            category: product.categoryName,
            supplierName: product.supplierName,
            supplierAddress: product.supplierAddress,
            distanceKm: product.distanceKm
          };

          return <MenuProductCard key={product.itemId} product={cardProduct} />;
        })}
      </div>

      {totalPages > 1 && (
        <div className="menu-pagination">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
