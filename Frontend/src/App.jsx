import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MainMenu from './pages/MainMenu';
import FoodDetail from './pages/FoodDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/main-menu" element={<MainMenu />} />
          <Route path="/food-detail" element={<FoodDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
