import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
