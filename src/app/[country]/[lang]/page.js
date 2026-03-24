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
    
    const { jobs, loading, error, totalCount, refreshJobs } = useJobs();
    const { isTronMode } = useTheme();

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    // State for filters and search
    const [localQuery, setLocalQuery] = useState(searchParams.get('search') || searchParams.get('q') || '');
    const [debouncedQuery, setDebouncedQuery] = useState(localQuery);
    const [types, setTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sortBy, setSortBy] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(localQuery);
            setCurrentPage(1); // Reset to page 1 on search change
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [types, locations, sortBy]);

    // Fetch jobs whenever filters or pagination changes
    useEffect(() => {
        const queryParams = new URLSearchParams();
        queryParams.set('page', currentPage);
        if (debouncedQuery) queryParams.set('search', debouncedQuery);
        if (types.length > 0) queryParams.set('jobType', types.join(','));
        if (locations.length > 0) queryParams.set('locationType', locations.join(','));
        
        // Sorting
        if (sortBy === 'recent') queryParams.set('ordering', '-postedAt');
        else if (sortBy === 'relevant') queryParams.set('ordering', 'title');

        refreshJobs(`/jobs/?${queryParams.toString()}`);
    }, [currentPage, debouncedQuery, types, locations, sortBy, refreshJobs]);

    if (loading && jobs.length === 0) {
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
                    query={localQuery} setQuery={setLocalQuery}
                    types={types} setTypes={setTypes}
                    locations={locations} setLocations={setLocations}
                />
                <JobList 
                    jobs={jobs} 
                    totalCount={totalCount}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    sortBy={sortBy} 
                    setSortBy={setSortBy} 
                    onJobClick={(job) => setSelectedJob(job)} 
                    loading={loading}
                />
            </main>
            <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        </div>
    );
}
