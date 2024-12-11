import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // If token exists, add it to headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else if (!config.url.includes('/auth/')) {
            // If no token and not an auth route, reject the request
            return Promise.reject({ 
                response: { 
                    status: 401,
                    data: { msg: 'No token, authorization denied' }
                }
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error);
            return Promise.reject({ 
                response: { 
                    status: 500,
                    data: { msg: 'Network error occurred. Please check your connection.' } 
                } 
            });
        }

        // Don't automatically logout on errors
        // Just return the error response with a proper message
        return Promise.reject({
            response: {
                status: error.response.status,
                data: {
                    msg: error.response.data?.msg || 'An error occurred. Please try again.'
                }
            }
        });
    }
);

// Function to set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Function to check if token exists and is valid
export const hasValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch (error) {
        return false;
    }
};

export default api; 