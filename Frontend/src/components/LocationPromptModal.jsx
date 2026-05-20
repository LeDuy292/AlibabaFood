import React, { useState, useEffect } from 'react';
import './LocationPromptModal.css';
import toast from 'react-hot-toast';

const GOONG_API_KEY = 'abqo51xlSgpEudtvkDK4tT5zQ5J3Njsu6M9VYE12';

const LocationPromptModal = ({ onLocationSet }) => {
  const [addressInput, setAddressInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if location already exists
    const storedLocation = localStorage.getItem('userLocation');
    if (!storedLocation) {
      setIsVisible(true);
    } else {
      // Pass the existing location back up
      if (onLocationSet) {
        onLocationSet(JSON.parse(storedLocation));
      }
    }
  }, []); // Run only on mount to prevent infinite loop

  const handleSaveLocation = (lat, lng, address) => {
    const locationData = { lat, lng, address };
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    toast.success('Đã cập nhật vị trí giao hàng!');
    setIsVisible(false);
    if (onLocationSet) {
      onLocationSet(locationData);
    }
  };

  const handleGPSLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse Geocoding with Goong
            const response = await fetch(`https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=${GOONG_API_KEY}`);
            const data = await response.json();
            
            let addressName = 'Vị trí hiện tại của bạn';
            if (data && data.results && data.results.length > 0) {
              addressName = data.results[0].formatted_address;
            }
            
            handleSaveLocation(latitude, longitude, addressName);
          } catch (error) {
            console.error("Geocoding error", error);
            handleSaveLocation(latitude, longitude, "Vị trí không xác định");
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("GPS error: ", error);
          toast.error("Không thể lấy vị trí GPS. Vui lòng cho phép truy cập vị trí hoặc tự nhập địa chỉ.");
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Trình duyệt không hỗ trợ định vị GPS.");
      setIsLocating(false);
    }
  };

  const handleManualAddress = async (e) => {
    e.preventDefault();
    if (!addressInput.trim()) {
      toast.error("Vui lòng nhập địa chỉ!");
      return;
    }

    setIsLocating(true);
    try {
      // Forward Geocoding with Goong
      const response = await fetch(`https://rsapi.goong.io/geocode?address=${encodeURIComponent(addressInput)}&api_key=${GOONG_API_KEY}`);
      const data = await response.json();
      
      if (data && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const formattedAddress = data.results[0].formatted_address;
        handleSaveLocation(lat, lng, formattedAddress);
      } else {
        toast.error("Không tìm thấy địa chỉ này, vui lòng nhập chi tiết hơn.");
      }
    } catch (error) {
      console.error("Geocoding error", error);
      toast.error("Lỗi khi tìm địa chỉ.");
    } finally {
      setIsLocating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal-content">
        <div className="location-modal-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca311" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h2>Vị trí giao hàng</h2>
          <p>Để hiển thị menu và các món cận date gần nhất, vui lòng cung cấp vị trí giao hàng của bạn.</p>
        </div>

        <div className="location-modal-body">
          <button 
            className="gps-btn" 
            onClick={handleGPSLocation} 
            disabled={isLocating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            {isLocating ? 'Đang định vị...' : 'Định vị tự động qua GPS'}
          </button>

          <div className="divider">
            <span>hoặc</span>
          </div>

          <form onSubmit={handleManualAddress} className="address-form">
            <input 
              type="text" 
              placeholder="Nhập địa chỉ của bạn (VD: 123 Lê Lợi, Quận 1)" 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              disabled={isLocating}
            />
            <button type="submit" className="submit-address-btn" disabled={isLocating}>
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationPromptModal;
