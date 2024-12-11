import api from './api';

export const courseService = {
    // Get all courses
    getAllCourses: async () => {
        try {
            const response = await api.get('/courses');
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error.response?.data?.msg || 'Failed to fetch courses';
        }
    },

    // Get all programs
    getAllPrograms: async () => {
        try {
            const response = await api.get('/programs');
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error.response?.data?.msg || 'Failed to fetch programs';
        }
    },

    // Add a new course
    addCourse: async (courseData) => {
        try {
            const response = await api.post('/courses', {
                ...courseData,
                id: courseData.code // Use course code as ID
            });
            return response.data;
        } catch (error) {
            console.error('Error adding course:', error);
            throw error.response?.data?.msg || 'Failed to add course';
        }
    },

    // Update a course
    updateCourse: async (courseId, courseData) => {
        try {
            const response = await api.put(`/courses/${courseId}`, {
                ...courseData,
                id: courseData.code // Use course code as ID
            });
            return response.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error.response?.data?.msg || 'Failed to update course';
        }
    },

    // Delete a course
    deleteCourse: async (courseId) => {
        const response = await api.delete(`/courses/${courseId}`);
        return response.data;
    },

    // Register for a course
    registerForCourse: async (studentId, courseId) => {
        try {
            // Ensure studentId is a valid number
            const studentIdInt = parseInt(studentId, 10);
            if (isNaN(studentIdInt) || studentIdInt <= 0) {
                throw new Error('Invalid student ID format');
            }

            // courseId should be a non-empty string
            if (!courseId || typeof courseId !== 'string') {
                throw new Error('Invalid course ID format');
            }

            const response = await api.post('/registrations', { 
                studentId: studentIdInt, 
                courseId: courseId.trim() 
            });
            return response.data;
        } catch (error) {
            console.error('Error registering for course:', error);
            throw error.response?.data?.msg || error.message || 'Failed to register for course';
        }
    },

    // Unregister from a course
    unregisterFromCourse: async (studentId, courseId) => {
        try {
            // Ensure studentId is a valid number
            const studentIdInt = parseInt(studentId, 10);
            if (isNaN(studentIdInt) || studentIdInt <= 0) {
                throw new Error('Invalid student ID format');
            }

            // courseId should be a non-empty string
            if (!courseId || typeof courseId !== 'string') {
                throw new Error('Invalid course ID format');
            }

            const response = await api.delete(`/registrations/${studentIdInt}/${encodeURIComponent(courseId.trim())}`);
            return response.data;
        } catch (error) {
            console.error('Error unregistering from course:', error);
            throw error.response?.data?.msg || error.message || 'Failed to unregister from course';
        }
    },

    // Get student's registered courses
    getStudentCourses: async (studentId) => {
        try {
            // Ensure ID is a valid number
            const studentIdInt = Number(studentId);

            if (!Number.isInteger(studentIdInt) || studentIdInt <= 0) {
                throw new Error('Invalid student ID format');
            }

            const response = await api.get(`/registrations/student/${studentIdInt}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching student courses:', error);
            throw error.response?.data?.msg || error.message || 'Failed to fetch registered courses';
        }
    }
}; 