import React, { useState } from "react";
import "./App.css";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import FeaturesSection from "./components/FeaturesSection";
import AboutSection from "./components/AboutSection";
import PopularFoodSection from "./components/PopularFoodSection";
import TestimonialSection from "./components/TestimonialSection";
import TeamSection from "./components/TeamSection";
import LatestFoodSection from "./components/LatestFoodSection";
import PartnersSection from "./components/PartnersSection";
import Footer from "./components/Footer";
import SupplierHome from "./components/SupplierPages/SupplierHome";
import SupplierDashboard from "./components/SupplierDashboard/SupplierDashboard";
import SupplierPost from "./components/SupplierPages/SupplierPost";
import SupplierOrders from "./components/SupplierPages/SupplierOrders";
import SupplierInventory from "./components/SupplierPages/SupplierInventory";
import SupplierNotifications from "./components/SupplierPages/SupplierNotifications";

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

function App() {
  const [view, setView] = useState("customer");
  // 'customer' | 'supplier' | 'dashboard' | 'post' | 'orders' | 'inventory' | 'notifications'

  const [inventoryItems, setInventoryItems] = useState(INVENTORY_DEFAULT);
  const addInventoryItem = (item) =>
    setInventoryItems((prev) => [item, ...prev]);

  const handleSupplierNav = (page) => {
    if (page === "home") setView("supplier");
    else setView(page);
  };

  const sharedProps = {
    onNavigate: handleSupplierNav,
    onSwitchToCustomer: () => setView("customer"),
  };

  if (view === "dashboard") return <SupplierDashboard {...sharedProps} />;
  if (view === "post")
    return <SupplierPost {...sharedProps} onAddItem={addInventoryItem} />;
  if (view === "orders") return <SupplierOrders {...sharedProps} />;
  if (view === "inventory")
    return (
      <SupplierInventory
        {...sharedProps}
        items={inventoryItems}
        setItems={setInventoryItems}
      />
    );
  if (view === "notifications")
    return <SupplierNotifications {...sharedProps} />;

  if (view === "supplier") {
    return (
      <SupplierHome
        onSwitchToCustomer={() => setView("customer")}
        onGoToDashboard={() => setView("dashboard")}
        onNavigate={handleSupplierNav}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Floating toggle pill */}
      <button className="view-switch-pill" onClick={() => setView("supplier")}>
        🏪 Dành cho Nhà Cung Cấp →
      </button>

      <main>
        <HeroSection />
        <CategorySection />
        <FeaturesSection />
        <AboutSection />
        <PopularFoodSection />
        <TestimonialSection />
        <TeamSection />
        <LatestFoodSection />
        <PartnersSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
