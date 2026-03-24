"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { isTokenValid, fetchWithAuth } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
    // Initialize with null to match server render
    const [user, setUser] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Load session from storage after mount
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error("Failed to parse saved user", err);
            }
        }
        setIsMounted(true);
    }, []);

    // Once initialized, we are no longer fundamentally loading the initial session from storage
    const [loading, setLoading] = useState(false);

    // Listen to token refresh events from the API wrapper to keep React state in sync
    useEffect(() => {
        const handleTokenRefresh = (event) => {
            const updatedUser = event.detail;
            setUser(updatedUser);
        };

        window.addEventListener('token-refreshed', handleTokenRefresh);
        return () => window.removeEventListener('token-refreshed', handleTokenRefresh);
    }, []);

    const login = async (username, password) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    username,
                    role: username === 'admin' ? 'admin' : 'subadmin',
                    access: data.access,
                    refresh: data.refresh,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            }
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.detail || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        if (user?.refresh) {
            try {
                // Use fetchWithAuth so it handles base URLs automatically
                await fetchWithAuth('/logout/', {
                    method: 'POST',
                    body: JSON.stringify({ refresh: user.refresh }),
                });
            } catch (error) {
                console.error('Failed to logout on server:', error);
            }
        }
        setUser(null);
        localStorage.removeItem('user');
    };

    const signup = async (formData) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw { response: { data: { error: errorData.detail || errorData.error || 'Registration failed' } } };
            }
            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

