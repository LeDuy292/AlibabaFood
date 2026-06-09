import api from './api';

/**
 * Lấy danh sách sản phẩm gần vị trí người dùng
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude  
 * @param {number} radiusKm - Bán kính tìm kiếm (km), mặc định 5km
 */
export const getNearbyProducts = async (lat, lng, radiusKm = 5) => {
  const response = await api.get('/products/nearby', {
    params: { lat, lng, radiusKm }
  });
  return response.data;
};

/**
 * Lấy danh sách tất cả sản phẩm
 * @param {number} [lat] - Optional Latitude
 * @param {number} [lng] - Optional Longitude
 */
export const getAllProducts = async (lat, lng) => {
  const params = {};
  if (lat && lng) {
    params.lat = lat;
    params.lng = lng;
  }
  const response = await api.get('/products/all', { params });
  return response.data;
};
