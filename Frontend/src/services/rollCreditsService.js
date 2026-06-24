import api from './api';

/**
 * Lấy số lượt quay của người dùng
 */
export const getRollCredits = async () => {
  return await api.get('/RollCredits');
};

/**
 * Sử dụng 1 lượt quay
 */
export const useRollCredit = async () => {
  return await api.post('/RollCredits/use');
};

/**
 * Thêm lượt quay
 * @param {number} credits - Số lượt quay cần thêm
 */
export const addRollCredits = async (credits) => {
  return await api.post('/RollCredits/add', { credits });
};
