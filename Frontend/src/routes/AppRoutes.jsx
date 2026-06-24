import React, { useState, useContext, createContext } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import { INITIAL_ITEMS as SUPPLIER_INVENTORY_INITIAL_ITEMS } from "../components/SupplierPages/supplierInventoryData";
import SupplierNotifications from "../components/SupplierPages/SupplierNotifications";
import PartnerRegistration from "../pages/PartnerRegistration";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BlindBag from "../pages/BlindBag";
import MysteryBagPage from "../pages/MysteryBagPage";
import AIConsultant from "../pages/AIConsultant";
import Community from "../pages/Community";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import Profile from "../pages/Profile";
import About from "../pages/About";

const SupplierCtx = createContext(null);

const SupplierLayout = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState(
    SUPPLIER_INVENTORY_INITIAL_ITEMS,
  );

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

// Guard: chưa đăng nhập thì redirect về /login
const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Đăng nhập để tiến hành thanh toán!");
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
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
        <Route path="ai-consultant" element={<AIConsultant />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
        <Route path="mystery-bag" element={<MysteryBagPage />} />
      </Route>
      <Route path="/partner-register" element={<PartnerRegistration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blind-bag" element={<BlindBag />} />
      <Route path="/cart" element={<Cart />} />
      <Route element={<PrivateRoute />}>
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
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
