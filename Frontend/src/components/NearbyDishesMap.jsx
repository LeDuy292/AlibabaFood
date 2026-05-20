import React, { useEffect, useRef, useState } from 'react';
import goongjs from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';

const GOONG_API_KEY = 'abqo51xlSgpEudtvkDK4tT5zQ5J3Njsu6M9VYE12';
const GOONG_MAPTILES_KEY = 'Qg66jtx7Ut0hutEyfjUlP3xZAMRhMKow2M8gcIGL';

const mockDishes = [
  { id: 1, name: 'Cơm gà xối mỡ (cận date 2h)', store: 'Quán Cơm A', price: '25.000đ', lat: 0, lng: 0 },
  { id: 2, name: 'Bánh mì thịt nướng (cận date 4h)', store: 'Bánh mì B', price: '15.000đ', lat: 0, lng: 0 },
  { id: 3, name: 'Trà sữa trân châu (cận date 1h)', store: 'Trà sữa C', price: '20.000đ', lat: 0, lng: 0 },
  { id: 4, name: 'Salad gà quay (cận date 3h)', store: 'Healthy Food D', price: '30.000đ', lat: 0, lng: 0 },
];

const NearbyDishesMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    // Read from localStorage that LocationPromptModal just saved
    const interval = setInterval(() => {
      const stored = localStorage.getItem('userLocation');
      if (stored) {
        const parsed = JSON.parse(stored);
        const { lat, lng } = parsed;
        setUserLocation([lng, lat]); // goongjs expects [lng, lat]
        
        // Generate mock dishes near user
        const generatedDishes = mockDishes.map((dish) => {
          const offsetLat = (Math.random() - 0.5) * 0.01;
          const offsetLng = (Math.random() - 0.5) * 0.01;
          return {
            ...dish,
            lat: lat + offsetLat,
            lng: lng + offsetLng,
          };
        });
        setDishes(generatedDishes);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userLocation && mapContainer.current && !map) {
      goongjs.accessToken = GOONG_API_KEY;
      const initializeMap = new goongjs.Map({
        container: mapContainer.current,
        style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`,
        center: userLocation,
        zoom: 14
      });

      new goongjs.Marker({ color: 'blue' })
        .setLngLat(userLocation)
        .setPopup(new goongjs.Popup().setHTML("<h4>Vị trí giao hàng</h4>"))
        .addTo(initializeMap);

      initializeMap.on('load', () => {
        initializeMap.resize();
      });

      setMap(initializeMap);
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (map && dishes.length > 0) {
      dishes.forEach(dish => {
        const marker = new goongjs.Marker({ color: 'red' })
          .setLngLat([dish.lng, dish.lat])
          .addTo(map);

        marker.getElement().addEventListener('click', () => {
          setSelectedDish(dish);
          map.flyTo({ center: [dish.lng, dish.lat], zoom: 16 });
        });
      });
    }
  }, [map, dishes]);

  if (!userLocation) return null; // Don't render anything until location is set

  return (
    <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '15px' }}>📍 Món ăn gần vị trí của bạn</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Các món ăn cận date đang được bán xung quanh bạn.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '500px', marginTop: '30px', flexDirection: window.innerWidth > 768 ? 'row' : 'column' }}>
        <div style={{ flex: '1', width: '100%', height: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ width: window.innerWidth > 768 ? '350px' : '100%', overflowY: 'auto', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '15px', color: '#14213d' }}>Món ăn tìm thấy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {dishes.map(dish => (
              <div 
                key={dish.id} 
                style={{ 
                  padding: '15px', 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: selectedDish?.id === dish.id ? '2px solid #fca311' : '1px solid #eee',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onClick={() => {
                  setSelectedDish(dish);
                  if (map) map.flyTo({ center: [dish.lng, dish.lat], zoom: 16 });
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', color: '#14213d' }}>{dish.name}</h4>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#555' }}>📍 {dish.store}</p>
                <p style={{ margin: '4px 0', fontSize: '1rem', color: '#e63946', fontWeight: 'bold' }}>{dish.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyDishesMap;
