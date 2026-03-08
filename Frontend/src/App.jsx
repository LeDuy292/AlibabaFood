<<<<<<< HEAD
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </BrowserRouter>
  );
=======
import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
>>>>>>> 560e066791183ce0a0526779341da1323af38d7d
}

export default App;
