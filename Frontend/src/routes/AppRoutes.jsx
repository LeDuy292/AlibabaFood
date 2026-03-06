import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import News from '../pages/News';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="news" element={<News />} />
                {/* Add more routes here */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
