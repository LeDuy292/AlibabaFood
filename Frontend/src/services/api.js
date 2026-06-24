import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5012/api',
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
        
        // Strip leading slash from url to prevent overriding baseURL path
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }
        
        // Ensure baseURL has a trailing slash to prevent concatenation issues
        if (config.baseURL && !config.baseURL.endsWith('/')) {
            config.baseURL += '/';
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
