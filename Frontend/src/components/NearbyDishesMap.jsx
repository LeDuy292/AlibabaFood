import React, { useEffect, useRef, useState } from 'react';
import goongjs from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import { getNearbyProducts } from '../services/productService';
import { useLocationCtx } from '../contexts/LocationContext';

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;
const GOONG_MAPTILES_KEY = import.meta.env.VITE_GOONG_MAPTILES_KEY;

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

const NearbyDishesMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const { userLocation } = useLocationCtx();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 2: Fetch real products from API when location is available
  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getNearbyProducts(userLocation.lat, userLocation.lng, 5);
        setProducts(result?.data || []);
      } catch (err) {
        console.error('Lỗi tải sản phẩm cho bản đồ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userLocation]);

  // Step 3: Init map once location is known
  useEffect(() => {
    if (!userLocation || mapRef.current || !mapContainer.current) return;

    goongjs.accessToken = GOONG_API_KEY;
    const newMap = new goongjs.Map({
      container: mapContainer.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`,
      center: [userLocation.lng, userLocation.lat],
      zoom: 14,
    });

    // User location marker (blue)
    new goongjs.Marker({ color: '#3b82f6' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new goongjs.Popup().setHTML('<h4>📍 Vị trí của bạn</h4>'))
      .addTo(newMap);

    newMap.on('load', () => newMap.resize());
    mapRef.current = newMap;
  }, [userLocation]);

  // Step 4: Add product markers when map + products are ready
  useEffect(() => {
    if (!mapRef.current || products.length === 0) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    products.forEach((product) => {
      const lat = Number(product.supplierLatitude);
      const lng = Number(product.supplierLongitude);
      if (!lat || !lng) return;

      const el = document.createElement('div');
      el.style.cssText = `
        width: 32px; height: 32px; border-radius: 50%;
        background: #ef4444; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
      `;
      el.textContent = '🍜';

      const marker = new goongjs.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(
          new goongjs.Popup({ offset: 25 }).setHTML(`
            <div style="min-width:200px; font-family: sans-serif; line-height: 1.6;">
              <strong style="font-size:14px;">${product.itemName}</strong><br/>
              🏪 ${product.supplierName}<br/>
              🗺️ ${product.supplierAddress || 'Không có địa chỉ'}<br/>
              💰 ${formatVND(product.discountedPrice)}<br/>
              📍 Cách bạn ${product.distanceKm}km
            </div>
          `)
        )
        .addTo(mapRef.current);

      el.addEventListener('click', () => {
        setSelectedProduct(product);
        mapRef.current.flyTo({ center: [lng, lat], zoom: 16 });
      });

      markersRef.current.push(marker);
    });
  }, [products]);

  if (!userLocation) return null;

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '15px' }}>
          📍 Món ăn gần vị trí của bạn
        </h2>
        <p style={{ color: '#666' }}>
          {loading
            ? 'Đang tải...'
            : `Tìm thấy ${products.length} sản phẩm  nào gần đây`}
        </p>
      </div>

      <div style={{
        display: 'flex', gap: '20px', height: '500px', marginTop: '30px',
        flexDirection: 'row', flexWrap: 'wrap'
      }}>
        {/* Map */}
        <div style={{
          flex: '1', minWidth: '300px', position: 'relative',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Product List Sidebar */}
        <div style={{
          width: '320px', overflowY: 'auto', padding: '12px',
          backgroundColor: '#f8f9fa', borderRadius: '12px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#14213d' }}>
            🍜 Sản phẩm tìm thấy
          </h3>

          {loading && (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Đang tải...</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map((product) => (
              <div
                key={product.itemId}
                style={{
                  padding: '12px', backgroundColor: 'white', borderRadius: '10px',
                  cursor: 'pointer',
                  border: selectedProduct?.itemId === product.itemId
                    ? '2px solid #10b981' : '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.2s'
                }}
                onClick={() => {
                  setSelectedProduct(product);
                  const lat = Number(product.supplierLatitude);
                  const lng = Number(product.supplierLongitude);
                  if (mapRef.current && lat && lng) {
                    mapRef.current.flyTo({ center: [lng, lat], zoom: 16 });
                  }
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <img
                    src={product.imageUrl || 'https://placehold.co/60x60?text=🍜'}
                    alt={product.itemName}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      margin: '0 0 4px 0', color: '#14213d', fontSize: '14px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {product.itemName}
                    </h4>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#6b7280' }}>
                      🏪 {product.supplierName}
                    </p>
                    {product.supplierAddress && (
                      <p style={{
                        margin: '2px 0', fontSize: '11px', color: '#9ca3af',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        🗺️ {product.supplierAddress}
                      </p>
                    )}
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#6b7280' }}>
                      📍 Cách bạn {product.distanceKm}km
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#10b981', fontWeight: 700 }}>
                      {formatVND(product.discountedPrice)}
                      {product.discountPercentage > 0 && (
                        <span style={{ marginLeft: '6px', fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyDishesMap;
