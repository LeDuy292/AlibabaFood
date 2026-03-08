import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
