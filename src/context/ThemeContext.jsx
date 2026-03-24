"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('normal'); // Default to normal for SSR
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Run once on mount to get the stored theme
        const storedTheme = localStorage.getItem('app-theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('app-theme', theme);
        }
    }, [theme, isMounted]);

    // Force normal mode until mounted to prevent hydration errors!
    const isTronMode = isMounted ? theme === 'tron' : false;

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
