"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { isTokenValid, fetchWithAuth } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
    // Check localStorage for an existing session lazily to avoid setState in effect
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    return JSON.parse(savedUser);
                } catch (err) {
                    console.error("Failed to parse saved user", err);
                }
            }
        }
        return null;
    });
    
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
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
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
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
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

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

