import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import MenuPage from '../pages/MenuPage';
import MainMenu from '../pages/MainMenu';
import FoodDetail from '../pages/FoodDetail';
import News from '../pages/News';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="main-menu" element={<MainMenu />} />
                <Route path="food-detail" element={<FoodDetail />} />
                <Route path="news" element={<News />} />
                {/* Add more routes here */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
