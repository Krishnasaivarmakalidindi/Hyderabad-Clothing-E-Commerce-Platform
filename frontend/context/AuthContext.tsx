import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    fullName: string;
    userType: 'customer' | 'seller' | 'admin';
    phoneNumber?: string;
    // Add other fields as needed
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        rehydrateAuth();
    }, []);

    const rehydrateAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // First, immediately restore from localStorage for instant UI
        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }

        // Then verify with backend (optional refresh)
        if (token) {
            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    const freshUser = response.data.data;
                    setUser(freshUser);
                    setIsLoggedIn(true);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (error: any) {
                // Only logout if it's a 401 (unauthorized)
                if (error?.response?.status === 401) {
                    clearAuthData();
                }
                // For other errors (network, etc.), keep the stored session
                console.error('Auth verification failed:', error);
            }
        }

        setLoading(false);
    };

    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    };

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        clearAuthData();
        router.push('/auth/login');
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

