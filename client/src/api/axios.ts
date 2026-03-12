import axios from 'axios';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';
const API_URL = 'https://api.nerybyservice.com/api';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors here (e.g., logging, redirecting on 401)
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
