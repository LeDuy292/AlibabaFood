import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import MenuPage from '../pages/MenuPage';
import MainMenu from '../pages/MainMenu';
import FoodDetail from '../pages/FoodDetail';
import News from '../pages/News';
import BlindBag from '../pages/BlindBag';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PartnerRegistration from '../pages/PartnerRegistration';
import AIConsultant from '../pages/AIConsultant';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="main-menu" element={<MainMenu />} />
                <Route path="food-detail" element={<FoodDetail />} />
                <Route path="news" element={<News />} />
                <Route path="ai-consultant" element={<AIConsultant />} />
                {/* Redirect old support to ai consultant */}
                <Route path="support" element={<Navigate to="/ai-consultant" replace />} />
            </Route>
            <Route path="/blind-bag" element={<BlindBag />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/partner-register" element={<PartnerRegistration />} />
        </Routes>
    );
};

export default AppRoutes;
