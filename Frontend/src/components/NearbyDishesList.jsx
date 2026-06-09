import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../components/HotDealSection.css'; // Re-use the styles
import './NearbyDishesList.css';
import { getNearbyProducts } from '../services/productService';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i <= Math.round(count) ? '#f59e0b' : '#d1d5db'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

const NearbyDishesList = ({ userLocation, onChangeLocation }) => {
  const [startIdx, setStartIdx] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getNearbyProducts(userLocation.lat, userLocation.lng, 5);
        setProducts(result?.data || []);
        setStartIdx(0);
      } catch (err) {
        console.error('Lỗi tải sản phẩm gần bạn:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userLocation]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.itemId,
      name: product.itemName,
      price: product.discountedPrice,
      quantity: 1,
      image: product.imageUrl,
    });
    toast.success(`Đã thêm "${product.itemName}" vào giỏ!`);
  };

  const handleBuyNow = (product) => {
    addToCart({
      id: product.itemId,
      name: product.itemName,
      price: product.discountedPrice,
      quantity: 1,
      image: product.imageUrl,
    });
    navigate('/checkout');
  };

  if (!userLocation) return null;

  const visible = products.slice(startIdx, startIdx + CARDS_PER_VIEW);
  const canPrev = startIdx > 0;
  const canNext = startIdx < products.length - CARDS_PER_VIEW;

  const handlePrev = () => setStartIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setStartIdx((i) => Math.min(products.length - CARDS_PER_VIEW, i + 1));

  return (
    <section className="hot-deal-section">
      <div className="container">

        {/* Info Bar */}
        <div className="info-bar">
          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="info-main">Hôm nay 07:00 - 12:00</p>
              <p className="info-sub">Giờ hoạt động</p>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2" />
              </svg>
            </span>
            <div>
              <p className="info-main">Da Nang City, VietNam</p>
              <p className="info-sub">Vị trí của chúng tôi</p>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="info-main">+0123 456 7891</p>
              <p className="info-sub">Số điện thoại</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 className="hot-deal-title" style={{ marginBottom: '10px' }}>📍 Món Ăn Gần Bạn Nhất</h2>
          {!loading && products.length > 0 && (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Tìm thấy <strong>{products.length}</strong> sản phẩm trong bán kính 5km
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #e5e7eb',
              borderTop: '3px solid #10b981', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 16px'
            }} />
            <p>Đang tìm sản phẩm gần bạn...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            textAlign: 'center', padding: '32px', color: '#ef4444',
            background: '#fef2f2', borderRadius: '12px', margin: '16px 0'
          }}>
            <p>⚠️ {error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                marginTop: '12px', padding: '8px 20px', background: '#10b981',
                color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="hot-deal-grid">
            {visible.length > 0 ? (
              visible.map((product) => (
                <div className="deal-card" key={product.itemId}>
                  <div className="deal-card-img" style={{ position: 'relative' }}>
                    <img
                      src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
                      alt={product.itemName}
                    />
                    {product.discountPercentage > 0 && (
                      <span style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: '#ef4444', color: 'white', fontSize: '12px',
                        fontWeight: 700, padding: '2px 8px', borderRadius: '20px'
                      }}>
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                    <span style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px',
                      padding: '2px 8px', borderRadius: '20px'
                    }}>
                      📍 {product.distanceKm}km
                    </span>
                  </div>
                  <div className="deal-card-body">
                    <div className="deal-card-top">
                      <span className="deal-name">{product.itemName}</span>
                      <button
                        className="add-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#374151', margin: '4px 0', lineHeight: 1.4, fontWeight: 600 }}>
                      🏪 {product.supplierName}
                    </p>
                    {product.supplierAddress && (
                      <p style={{
                        fontSize: '11px', color: '#6b7280', margin: '2px 0', lineHeight: 1.3,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }} title={product.supplierAddress}>
                        🗺️ {product.supplierAddress}
                      </p>
                    )}
                    <p style={{ fontSize: '12px', color: '#10b981', margin: '2px 0', fontWeight: 600 }}>
                      📍 Cách bạn {product.distanceKm} km
                    </p>
                    <div className="deal-card-bottom">
                      <StarRating count={product.supplierRating} />
                      <div className="deal-price-row">
                        <div>
                          {product.originalPrice > product.discountedPrice && (
                            <span style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through', display: 'block' }}>
                              {formatVND(product.originalPrice)}
                            </span>
                          )}
                          <span className="deal-price">{formatVND(product.discountedPrice)}</span>
                        </div>
                        <button
                          className="buy-now-btn"
                          onClick={() => handleBuyNow(product)}
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">
                Không tìm thấy sản phẩm nào  gần đây.{' '}
                <button
                  onClick={onChangeLocation}
                  style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Đổi vị trí?
                </button>
              </p>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {!loading && !error && products.length > CARDS_PER_VIEW && (
          <div className="hot-deal-nav">
            <button
              className="nav-arrow-btn"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="nav-arrow-btn"
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyDishesList;
