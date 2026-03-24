"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialize theme based on localStorage if available (client-side only), fallback to normal
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('app-theme') || 'normal';
        }
        return 'normal'; // Default to normal for SSR
    });

    const isTronMode = theme === 'tron';

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'tron' ? 'normal' : 'tron');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isTronMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
