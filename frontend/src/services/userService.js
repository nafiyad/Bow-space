import api from './api';

export const userService = {
    // Get all users (admin only)
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to fetch users';
        }
    },

    // Get user profile
    getUserProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to fetch user profile';
        }
    },

    // Get student details
    getStudentDetails: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}/student-details`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to fetch student details';
        }
    },

    // Get admin user
    getAdminUser: async () => {
        try {
            const response = await api.get('/users/admin');
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to fetch admin user';
        }
    },

    // Update user profile
    updateProfile: async (userId, profileData) => {
        try {
            const response = await api.put(`/users/${userId}/profile`, profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to update profile';
        }
    },

    // Update student details
    updateStudentDetails: async (userId, studentData) => {
        try {
            const response = await api.put(`/users/${userId}/student-details`, studentData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Failed to update student details';
        }
    }
};

export default userService; 