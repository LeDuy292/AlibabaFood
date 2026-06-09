import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./contexts/CartContext";
import { LocationProvider } from "./contexts/LocationContext";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LocationProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </CartProvider>
      </LocationProvider>
    </BrowserRouter>
  );
}

export default App;
