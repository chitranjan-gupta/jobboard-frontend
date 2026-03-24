"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    // Initialize currency based on localStorage if available (client-side only), fallback to INR
    const [currency, setCurrency] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('preferredCurrency') || 'INR';
        }
        return 'INR';
    });

    const changeCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('preferredCurrency', newCurrency);
    };

    const formatSalary = (amount, jobCurrency) => {
        // Simple formatter for now
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹'
        };
        return `${symbols[jobCurrency] || jobCurrency}${amount}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatSalary }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
