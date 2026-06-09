import api from "./api";

export const paymentService = {
  /**
   * Create a PayOS payment link
   * @param {Object} orderData - { buyerName, buyerEmail, buyerPhone, buyerAddress, items: [{name, quantity, price}] }
   * @returns {Promise<{orderCode, checkoutUrl, orderId, amount}>}
   */
  createPaymentLink: async (orderData) => {
    const response = await api.post("/payment/create", orderData);
    return response.data.data;
  },

  /**
   * Get order details by order code
   * @param {number} orderCode
   */
  getOrder: async (orderCode) => {
    const response = await api.get(`/payment/${orderCode}`);
    return response.data.data;
  },

  /**
   * Cancel an order
   * @param {number} orderCode
   */
  cancelOrder: async (orderCode) => {
    const response = await api.post(`/payment/${orderCode}/cancel`);
    return response.data;
  },
};
