"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import FilterSidebar from '@/components/FilterSidebar';
import JobList from '@/components/JobList';
import JobDetailsModal from '@/components/JobDetailsModal';
import { useJobs } from '@/context/JobContext';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const { jobs, loading, error } = useJobs();
    const { isTronMode } = useTheme();

    const initialCompany = searchParams.get('company') || '';
    const initialRole = searchParams.get('role') || '';
    const initialQuery = searchParams.get('q') || initialCompany || initialRole || '';

    // Instead of syncing via useEffect, derive state directly from URL if possible, 
    // or use state that is initialized from URL but can diverge.
    // For simplicity, we initialize state from URL once per navigation, 
    // and rely on key-remounting or pure derived state if strictly driven by URL.
    // Since the user can type in the search box, we keep local state.
    // To handle URL changes (e.g. going back), we derive the 'current' effective values.
    
    // Determine the "active" constraint from URL
    const urlCompany = searchParams.get('company') || '';
    const urlRole = searchParams.get('role') || '';
    const urlQ = searchParams.get('q') || '';
    
    // Local state for the search input box
    const [localQuery, setLocalQuery] = useState(urlQ || urlCompany || urlRole || '');

    // If the URL changes (detected by render check), we want to reset local state.
    // A robust way without useEffect is to check if URL derived values changed.
    const [prevSearchStr, setPrevSearchStr] = useState(searchParams.toString());
    if (searchParams.toString() !== prevSearchStr) {
        setPrevSearchStr(searchParams.toString());
        setLocalQuery(urlQ || urlCompany || urlRole || '');
    }

    const [types, setTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sortBy, setSortBy] = useState('recent');
    const [selectedJob, setSelectedJob] = useState(null);

    // Provide derived active filters. If user types, we break strict exact matches.
    const isStrictCompany = localQuery === urlCompany && urlCompany !== '';
    const isStrictRole = localQuery === urlRole && urlRole !== '';

    const handleSetQuery = (val) => {
        setLocalQuery(val);
    };

    const filteredJobs = jobs.filter(job => {
        // Strict public visibility rules: only approved, unexpired jobs
        if (job.status !== 'approved') return false;
        if (job.expiryDate && new Date(job.expiryDate) < new Date()) return false;

        // Apply strict match if the filter is active and hasn't been modified by user
        if (isStrictCompany) {
            if (job.company !== urlCompany) return false;
        } else if (isStrictRole) {
            if (job.title !== urlRole) return false;
        } else {
            // Generic fallback search
            const qLower = localQuery.toLowerCase();
            const matchesSearch = !qLower || job.title.toLowerCase().includes(qLower) ||
                job.company.toLowerCase().includes(qLower) ||
                job.tags.some(tag => tag.toLowerCase().includes(qLower));
            if (!matchesSearch) return false;
        }

        const matchesType = types.length === 0 || types.includes(job.jobType);
        const matchesLocation = locations.length === 0 || locations.includes(job.locationType);

        return matchesType && matchesLocation;
    });

    if (sortBy === 'recent') {
        filteredJobs.sort((a, b) => b.id - a.id); // Sort by newest ID
    } else if (sortBy === 'relevant') {
        filteredJobs.sort((a, b) => a.title.length - b.title.length);
    }

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen ${isTronMode ? 'bg-ares-black/95' : 'bg-slate-50'}`}>
                <div className="relative flex items-center justify-center">
                    <div className={`absolute w-16 h-16 border-t-2 border-b-2 rounded-full animate-spin ${isTronMode ? 'border-ares-red drop-shadow-[0_0_15px_rgba(255,30,30,0.8)]' : 'border-primary'}`}></div>
                    <div className={`absolute w-8 h-8 border-l-2 border-r-2 rounded-full animate-spin direction-reverse ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,254,0.8)]' : 'border-accent'}`}></div>
                    {isTronMode && <div className="text-ares-red font-['Orbitron'] text-xs font-black tracking-widest animate-pulse mt-24 absolute">ESTABLISHING_LINK...</div>}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen text-center p-6 ${isTronMode ? 'bg-ares-black/95 relative overflow-hidden' : 'bg-slate-50'}`}>
                {isTronMode && <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 z-0"></div>}

                <div className={`relative z-10 max-w-md w-full p-10 transition-all ${isTronMode ? 'glass-panel border-2 border-ares-red/40 shadow-[0_0_40px_rgba(255,30,30,0.2)]' : 'bg-white rounded-2xl shadow-xl border border-slate-200'}`}
                    style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' } : {}}>
                    <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 border ${isTronMode ? 'rounded-none border-ares-red text-ares-red bg-ares-red/10 animate-pulse shadow-[0_0_20px_rgba(255,30,30,0.5)]' : 'rounded-full border-red-100 bg-red-50 text-red-500'}`}
                        style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>

                    <h2 className={`text-2xl font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-white font-["Orbitron"]' : 'text-slate-800'}`}>
                        {isTronMode ? 'CONNECTION_SEVERED' : 'Connection Error'}
                    </h2>

                    <p className={`mb-8 text-xs font-bold uppercase tracking-[0.1em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-600'}`}>
                        {isTronMode ? `> ERROR_LOG: ${error}` : error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className={`w-full py-4 text-[0.7rem] font-black tracking-[0.25em] uppercase transition-all duration-300 ${isTronMode ? 'btn-outline border-ares-red text-ares-red hover:bg-ares-red/20 shadow-[0_0_15px_rgba(255,30,30,0.2)]' : 'btn-primary rounded-xl'}`}
                    >
                        {isTronMode ? 'INITIATE_RECONNECTION' : 'Retry Connection'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-7xl mx-auto px-6 flex flex-col min-h-screen ${isTronMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Header />
            <main className="flex flex-col lg:flex-row gap-8 flex-1">
                <FilterSidebar
                    query={localQuery} setQuery={handleSetQuery}
                    types={types} setTypes={setTypes}
                    locations={locations} setLocations={setLocations}
                />
                <JobList jobs={filteredJobs} sortBy={sortBy} setSortBy={setSortBy} onJobClick={(job) => setSelectedJob(job)} />
            </main>
            <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        </div>
    );
}
