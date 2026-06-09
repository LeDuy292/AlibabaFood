import React, { useState, useEffect, useRef } from 'react';
import './LocationPromptModal.css';
import toast from 'react-hot-toast';
import { useLocationCtx } from '../contexts/LocationContext';

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

const LocationPromptModal = ({ onLocationSet, isOpen, onClose }) => {
  const { userLocation, setLocation } = useLocationCtx();
  const [addressInput, setAddressInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const ignoreNextAutocompleteRef = useRef(false);

  useEffect(() => {
    if (ignoreNextAutocompleteRef.current) {
      ignoreNextAutocompleteRef.current = false;
      return;
    }

    if (!addressInput.trim() || addressInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://rsapi.goong.io/Place/Autocomplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(addressInput)}`
        );
        const data = await response.json();
        if (data && data.predictions) {
          setSuggestions(data.predictions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Goong Autocomplete error", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [addressInput]);

  useEffect(() => {
    // We rely on LocationContext to provide userLocation
    // However, userLocation might be null initially before it loads from localStorage
    // Or it might be truly null. 
    // To prevent flashing, LocationContext initializes from localStorage synchronously on mount.
    if (!userLocation && !localStorage.getItem('userLocation')) {
      setIsVisible(true);
    } else if (userLocation) {
      // Pass the existing location back up if needed
      if (onLocationSet) {
        onLocationSet(userLocation);
      }
    }
  }, [userLocation]); // Re-run when userLocation changes

  // Synchronize internal visibility state with isOpen prop if passed
  useEffect(() => {
    if (isOpen !== undefined) {
      setIsVisible(isOpen);
    }
  }, [isOpen]);

  const handleSaveLocation = (lat, lng, address) => {
    const locationData = { lat, lng, address };
    setLocation(locationData);
    toast.success('Đã cập nhật vị trí giao hàng!');
    setIsVisible(false);
    if (onLocationSet) {
      onLocationSet(locationData);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleGPSLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            if (!GOONG_API_KEY || GOONG_API_KEY === 'undefined') {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              const addressName = data.display_name || "Vị trí của bạn (GPS)";
              handleSaveLocation(latitude, longitude, addressName);
              return;
            }

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
      if (!GOONG_API_KEY || GOONG_API_KEY === 'undefined') {
        // Fallback to OpenStreetMap (Nominatim API - Free, no API key required)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const formattedAddress = data[0].display_name;
          handleSaveLocation(lat, lng, formattedAddress);
        } else {
          toast.error("Không tìm thấy địa chỉ này, vui lòng nhập chi tiết hơn.");
        }
        setIsLocating(false);
        return;
      }

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

  const handleSelectSuggestion = async (suggestion) => {
    setIsLocating(true);
    setSuggestions([]);
    ignoreNextAutocompleteRef.current = true;
    setAddressInput(suggestion.description);
    
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Place/Detail?api_key=${GOONG_API_KEY}&place_id=${suggestion.place_id}`
      );
      const data = await response.json();
      
      if (data && data.result) {
        const { lat, lng } = data.result.geometry.location;
        const formattedAddress = data.result.formatted_address || suggestion.description;
        handleSaveLocation(lat, lng, formattedAddress);
      } else {
        toast.error("Không thể lấy chi tiết vị trí. Vui lòng thử chọn địa chỉ khác hoặc nhập thủ công.");
      }
    } catch (error) {
      console.error("Place Detail error", error);
      toast.error("Lỗi khi tìm thông tin chi tiết địa chỉ.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleOverlayClick = () => {
    if (localStorage.getItem('userLocation')) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="location-modal-overlay" onClick={handleOverlayClick}>
      <div className="location-modal-content" onClick={(e) => e.stopPropagation()}>
        {localStorage.getItem('userLocation') && (
          <button className="location-modal-close-btn" onClick={handleClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
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
            <div className="autocomplete-wrapper">
              <input 
                type="text" 
                placeholder="Nhập địa chỉ của bạn (VD: 123 Lê Lợi, Quận 1)" 
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onBlur={() => setTimeout(() => setSuggestions([]), 250)}
                disabled={isLocating}
                className="address-input"
              />
              {isSearching && (
                <div className="autocomplete-loader">
                  <div className="spinner"></div>
                </div>
              )}
              {suggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {suggestions.map((item) => (
                    <li 
                      key={item.place_id} 
                      onClick={() => handleSelectSuggestion(item)}
                      className="suggestion-item"
                    >
                      <svg className="suggestion-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="suggestion-text">{item.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
