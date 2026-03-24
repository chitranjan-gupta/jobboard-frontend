"use client";
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWithAuth } from '../utils/api';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const JobProvider = ({ children }) => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const fetchJobs = useCallback(async (url = `/jobs/`) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            
            if (data && data.results !== undefined) {
                setJobs(data.results);
                setNextUrl(data.next);
                setPrevUrl(data.previous);
                setTotalCount(data.count);
            } else {
                setJobs(data);
                setNextUrl(null);
                setPrevUrl(null);
                setTotalCount(data.length || 0);
            }
            setError(null);
        } catch (err) {
            console.warn("[JobContext] Error fetching jobs:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const addJob = async (newJob) => {
        try {
            const response = await fetchWithAuth(`/jobs/`, {
                method: 'POST',
                body: JSON.stringify(newJob),
            });
            if (!response.ok) throw new Error('Failed to add job');
            const data = await response.json();
            setJobs(prev => [data, ...prev]);
            return data;
        } catch (err) {
            console.error("Error adding job:", err);
            throw err;
        }
    };

    const updateJob = async (id, updatedData) => {
        try {
            const response = await fetchWithAuth(`/jobs/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Failed to update job');
            const data = await response.json();
            setJobs(prev => prev.map(job => (job.id === id ? data : job)));
            return data;
        } catch (err) {
            console.error("Error updating job:", err);
            throw err;
        }
    };

    const deleteJob = async (id) => {
        try {
            const response = await fetchWithAuth(`/jobs/${id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete job');
            setJobs(prev => prev.filter(job => job.id !== id));
        } catch (err) {
            console.error("Error deleting job:", err);
            throw err;
        }
    };

    const approveJob = async (id) => {
        const response = await fetchWithAuth(`/jobs/${id}/approve/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to approve job');
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'approved' } : j));
    };

    const rejectJob = async (id) => {
        const response = await fetchWithAuth(`/jobs/${id}/reject/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to reject job');
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'rejected' } : j));
    };

    const requestJobDeletion = async (id) => {
        const response = await fetchWithAuth(`/jobs/${id}/request_delete/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to request job deletion');
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'pending_deletion' } : j));
    };

    const approveJobDeletion = async (id) => {
        const response = await fetchWithAuth(`/jobs/${id}/approve_deletion/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to approve job deletion');
        setJobs(prev => prev.filter(job => job.id !== id));
    };

    const rejectJobDeletion = async (id) => {
        const response = await fetchWithAuth(`/jobs/${id}/reject_deletion/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to reject job deletion');
        setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'approved' } : j));
    };

    const getJobById = useCallback((id) => {
        return jobs.find(job => job.id === parseInt(id, 10));
    }, [jobs]);

    return (
        <JobContext.Provider value={{
            jobs,
            setJobs,
            loading,
            error,
            nextUrl,
            prevUrl,
            totalCount,
            addJob,
            updateJob,
            deleteJob,
            requestJobDeletion,
            approveJobDeletion,
            rejectJobDeletion,
            approveJob,
            rejectJob,
            getJobById,
            refreshJobs: fetchJobs,
            uploadJobsCSV: async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetchWithAuth(`/jobs/bulk_upload/`, {
                    method: 'POST',
                    body: formData,
                    headers: {}, // fetchWithAuth handles auth, but we don't want JSON content-type
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to upload jobs');
                }
                const data = await response.json();
                await fetchJobs();
                return data;
            }
        }}>
            {children}
        </JobContext.Provider>
    );
};
