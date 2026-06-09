import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5012/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token if it exists
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (err) {
            // Silently ignore storage access errors
            console.warn('API interceptor: LocalStorage access blocked');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
