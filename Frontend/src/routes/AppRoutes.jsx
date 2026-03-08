
import React, { useState, useContext, createContext } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import MenuPage from "../pages/MenuPage";
import MainMenu from "../pages/MainMenu";
import FoodDetail from "../pages/FoodDetail";
import News from "../pages/News";
import SupplierHome from "../components/SupplierPages/SupplierHome";
import SupplierDashboard from "../components/SupplierDashboard/SupplierDashboard";
import SupplierPost from "../components/SupplierPages/SupplierPost";
import SupplierOrders from "../components/SupplierPages/SupplierOrders";
import SupplierInventory from "../components/SupplierPages/SupplierInventory";
import SupplierNotifications from "../components/SupplierPages/SupplierNotifications";

const INVENTORY_DEFAULT = [
  {
    id: 1,
    emoji: "🍗",
    name: "Crispy Chicken Rice",
    category: "Rice",
    qty: 12,
    price: "55,000₫",
    expireH: 3,
    status: "active",
  },
  {
    id: 2,
    emoji: "🥗",
    name: "Caesar Salad Bowl",
    category: "Salad",
    qty: 4,
    price: "55,000₫",
    expireH: 5,
    status: "active",
  },
  {
    id: 3,
    emoji: "🧃",
    name: "Bubble Milk Tea",
    category: "Drinks",
    qty: 20,
    price: "30,000₫",
    expireH: 8,
    status: "active",
  },
  {
    id: 4,
    emoji: "🍜",
    name: "Signature Pho",
    category: "Noodles",
    qty: 2,
    price: "65,000₫",
    expireH: 1.5,
    status: "active",
  },
  {
    id: 5,
    emoji: "🥐",
    name: "BBQ Banh Mi",
    category: "Sandwich",
    qty: 9,
    price: "27,000₫",
    expireH: 4,
    status: "active",
  },
  {
    id: 6,
    emoji: "🍣",
    name: "Salmon Sushi Box",
    category: "Sushi",
    qty: 0,
    price: "85,000₫",
    expireH: 2,
    status: "out",
  },
  {
    id: 7,
    emoji: "☕",
    name: "Hanoi Egg Coffee",
    category: "Drinks",
    qty: 7,
    price: "38,000₫",
    expireH: 6,
    status: "active",
  },
  {
    id: 8,
    emoji: "🍩",
    name: "Matcha Cream Donut",
    category: "Dessert",
    qty: 3,
    price: "22,000₫",
    expireH: 9,
    status: "active",
  },
  {
    id: 9,
    emoji: "🍱",
    name: "Seafood Bento Box",
    category: "Bento",
    qty: 6,
    price: "72,000₫",
    expireH: 3.5,
    status: "active",
  },
  {
    id: 10,
    emoji: "🥩",
    name: "Broken Rice with Pork",
    category: "Rice",
    qty: 1,
    price: "48,000₫",
    expireH: 1,
    status: "active",
  },
];

const SupplierCtx = createContext(null);

const SupplierLayout = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState(INVENTORY_DEFAULT);

  const onNavigate = (page) =>
    navigate(page === "home" ? "/supplier" : `/supplier/${page}`);
  const onSwitchToCustomer = () => navigate("/");
  const onGoToDashboard = () => navigate("/supplier/dashboard");
  const onAddItem = (item) => setInventoryItems((prev) => [item, ...prev]);

  return (
    <SupplierCtx.Provider
      value={{
        onNavigate,
        onSwitchToCustomer,
        onGoToDashboard,
        onAddItem,
        inventoryItems,
        setInventoryItems,
      }}
    >
      <Outlet />
    </SupplierCtx.Provider>
  );
};

const useSupplier = () => useContext(SupplierCtx);

const SupplierHomePage = () => {
  const { onNavigate, onSwitchToCustomer, onGoToDashboard } = useSupplier();
  return (
    <SupplierHome
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
      onGoToDashboard={onGoToDashboard}
    />
  );
};

const SupplierDashboardPage = () => {
  const { onNavigate, onSwitchToCustomer } = useSupplier();
  return (
    <SupplierDashboard
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
    />
  );
};

const SupplierPostPage = () => {
  const { onNavigate, onSwitchToCustomer, onAddItem } = useSupplier();
  return (
    <SupplierPost
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
      onAddItem={onAddItem}
    />
  );
};

const SupplierOrdersPage = () => {
  const { onNavigate, onSwitchToCustomer } = useSupplier();
  return (
    <SupplierOrders
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
    />
  );
};

const SupplierInventoryPage = () => {
  const { onNavigate, onSwitchToCustomer, inventoryItems, setInventoryItems } =
    useSupplier();
  return (
    <SupplierInventory
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
      items={inventoryItems}
      setItems={setInventoryItems}
    />
  );
};

const SupplierNotificationsPage = () => {
  const { onNavigate, onSwitchToCustomer } = useSupplier();
  return (
    <SupplierNotifications
      onNavigate={onNavigate}
      onSwitchToCustomer={onSwitchToCustomer}
    />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="main-menu" element={<MainMenu />} />
        <Route path="food-detail" element={<FoodDetail />} />
        <Route path="news" element={<News />} />
      </Route>
      <Route path="/supplier" element={<SupplierLayout />}>
        <Route index element={<SupplierHomePage />} />
        <Route path="dashboard" element={<SupplierDashboardPage />} />
        <Route path="post" element={<SupplierPostPage />} />
        <Route path="orders" element={<SupplierOrdersPage />} />
        <Route path="inventory" element={<SupplierInventoryPage />} />
        <Route path="notifications" element={<SupplierNotificationsPage />} />
      </Route>
    </Routes>
  );

};

export default AppRoutes;
