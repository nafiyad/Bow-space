import api, { setAuthToken } from './api';

export const authService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            if (response.data.token && response.data.user) {
                // Set auth token in axios and localStorage
                setAuthToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                // Store user data
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            authService.clearAuthData();
            throw error.response?.data?.msg || 'Login failed';
        }
    },

    // Register student
    registerStudent: async (studentData) => {
        try {
            const response = await api.post('/auth/register/student', studentData);
            return response.data;
        } catch (error) {
            console.error('Student registration error:', error.response || error);
            throw error.response?.data?.msg || error.message || 'Registration failed';
        }
    },

    // Register admin
    registerAdmin: async (adminData) => {
        try {
            const response = await api.post('/auth/register/admin', {
                ...adminData,
                role: 'admin'
            });
            return response.data;
        } catch (error) {
            console.error('Admin registration error:', error.response || error);
            throw error.response?.data?.msg || error.message || 'Registration failed';
        }
    },

    // Clear authentication data
    clearAuthData: () => {
        setAuthToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (!token || !userStr) {
                return null;
            }

            // Verify token expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp < Date.now() / 1000) {
                authService.clearAuthData();
                return null;
            }

            // Set Authorization header if not set
            setAuthToken(token);

            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error getting current user:', error);
            authService.clearAuthData();
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const isValid = payload.exp > Date.now() / 1000;

            if (!isValid) {
                authService.clearAuthData();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },

    // Logout user
    logout: () => {
        authService.clearAuthData();
    }
};

export default authService; 