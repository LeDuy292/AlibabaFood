import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userLocation");
      if (stored) {
        setUserLocation(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error parsing userLocation", e);
    }
  }, []);

  const setLocation = (locationData) => {
    setUserLocation(locationData);
    localStorage.setItem("userLocation", JSON.stringify(locationData));
  };

  return (
    <LocationContext.Provider value={{ userLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationCtx = () => useContext(LocationContext);
