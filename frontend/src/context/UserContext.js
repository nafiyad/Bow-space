import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize user state from stored auth data
        const initializeUser = () => {
            const user = authService.getCurrentUser();
            setCurrentUser(user);
            setIsLoading(false);
        };

        initializeUser();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authService.login({ username, password });
            setCurrentUser(response.user);
            return { success: true, user: response.user };
        } catch (error) {
            console.error('Login error:', error);
            setCurrentUser(null);
            return { 
                success: false, 
                message: error.response?.data?.msg || 'Login failed' 
            };
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        login,
        logout,
        isLoading,
        isAuthenticated: () => authService.isAuthenticated()
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}
