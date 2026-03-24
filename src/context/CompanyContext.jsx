"use client";
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWithAuth } from '../utils/api';

const CompanyContext = createContext();

export const useCompanies = () => useContext(CompanyContext);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const CompanyProvider = ({ children }) => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/companies/`);
            if (!response.ok) throw new Error('Failed to fetch companies');
            const data = await response.json();
            setCompanies(data);
            setError(null);
        } catch (err) {
            console.warn("[CompanyContext] Error fetching companies:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const addCompany = async (newCompany) => {
        try {
            const response = await fetchWithAuth(`/companies/`, {
                method: 'POST',
                body: JSON.stringify(newCompany),
            });
            if (!response.ok) throw new Error('Failed to add company');
            const data = await response.json();
            setCompanies(prev => [data, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
            return data;
        } catch (err) {
            console.error("Error adding company:", err);
            throw err;
        }
    };

    const updateCompany = async (id, updatedData) => {
        try {
            const response = await fetchWithAuth(`/companies/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Failed to update company');
            const data = await response.json();
            setCompanies(prev => prev.map(c => (c.id === id ? data : c)).sort((a, b) => a.name.localeCompare(b.name)));
            return data;
        } catch (err) {
            console.error("Error updating company:", err);
            throw err;
        }
    };

    const deleteCompany = async (id) => {
        try {
            const response = await fetchWithAuth(`/companies/${id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete company');
            setCompanies(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("Error deleting company:", err);
            throw err;
        }
    };

    const approveCompany = async (id) => {
        const response = await fetchWithAuth(`/companies/${id}/approve/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to approve company');
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    };

    const rejectCompany = async (id) => {
        const response = await fetchWithAuth(`/companies/${id}/reject/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to reject company');
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    };

    const getCompanyById = useCallback((id) => {
        return companies.find(c => c.id === parseInt(id, 10));
    }, [companies]);

    const uploadCompaniesCSV = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetchWithAuth(`/companies/bulk_upload/`, {
                method: 'POST',
                // fetchWithAuth will NOT set Content-Type to application/json because body is FormData
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to upload CSV');
            }

            const data = await response.json();

            // Refresh the companies list after successful upload
            await fetchCompanies();

            return data; // Return the { added, skipped, errors } summary
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <CompanyContext.Provider value={{
            companies,
            loading,
            error,
            fetchCompanies,
            addCompany,
            updateCompany,
            deleteCompany,
            approveCompany,
            rejectCompany,
            getCompanyById,
            uploadCompaniesCSV
        }}>
            {children}
        </CompanyContext.Provider>
    );
};
