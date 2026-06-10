import api from "./api";

// Get supplier profile
export const getSupplierProfile = async () => {
  const response = await api.get("/supplier/profile");
  return response.data;
};

// Get supplier statistics
export const getSupplierStats = async () => {
  const response = await api.get("/supplier/stats");
  return response.data;
};

// Get supplier food items
export const getSupplierFoodItems = async () => {
  const response = await api.get("/supplier/food-items");
  return response.data;
};

// Get supplier orders
export const getSupplierOrders = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get("/supplier/orders", { params });
  return response.data;
};

// Get supplier notifications
export const getSupplierNotifications = async () => {
  const response = await api.get("/supplier/notifications");
  return response.data;
};

// Create food item
export const createFoodItem = async (itemData) => {
  const response = await api.post("/supplier/food-items", itemData);
  return response.data;
};

// Update food item
export const updateFoodItem = async (itemId, itemData) => {
  const response = await api.put(`/supplier/food-items/${itemId}`, itemData);
  return response.data;
};

// Delete food item
export const deleteFoodItem = async (itemId) => {
  const response = await api.delete(`/supplier/food-items/${itemId}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/supplier/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

// Get popular products across platform
export const getPopularProducts = async () => {
  try {
    const response = await api.get("/products/popular");
    return response.data;
  } catch (error) {
    console.warn(
      "Popular products endpoint unavailable, using fallback content.",
      error,
    );
    return [];
  }
};

// Get supplier reviews
export const getSupplierReviews = async () => {
  const response = await api.get("/supplier/reviews");
  return response.data;
};
