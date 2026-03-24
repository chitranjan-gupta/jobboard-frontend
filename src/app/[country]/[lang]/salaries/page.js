"use client";

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { parseSalary, formatCurrency } from '@/utils/salaryUtils';
import { useTheme } from '@/context/ThemeContext';
import PaginationControls from '@/components/PaginationControls';

import { fetchWithAuth } from '@/utils/api';

export default function SalariesPage() {
    const { isTronMode } = useTheme();
    const router = useRouter();
    const params = useParams();
    
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [localQuery, setLocalQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(localQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery]);

    // Fetch salary data whenever search or pagination changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                queryParams.set('page', currentPage);
                if (debouncedQuery) queryParams.set('search', debouncedQuery);
                
                const response = await fetchWithAuth(`/jobs/salaries-aggregate/?${queryParams.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch salary data');
                const data = await response.json();
                
                if (data && data.results !== undefined) {
                    setSalaryData(data.results);
                    setTotalCount(data.count);
                } else {
                    setSalaryData(data);
                    setTotalCount(data.length || 0);
                }
            } catch (err) {
                console.error("Error fetching salaries:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, debouncedQuery]);

    const handleRoleClick = (title) => {
        router.push(`/${country}/${lang}/?role=${encodeURIComponent(title)}`);
    };

    if (loading && salaryData.length === 0) return (
        <div className={`flex items-center justify-center min-h-screen ${isTronMode ? 'bg-ares-black' : 'bg-slate-50'}`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'
                }`} />
        </div>
    );

    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-6 flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 pb-12">
                <div className="text-center py-12">
                    <h1 className={`text-4xl font-bold mb-3 uppercase tracking-wider ${isTronMode ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-900'
                        }`}>
                        {isTronMode ? 'Data Streams' : 'Salaries'}
                    </h1>
                    <p className={`text-lg mb-8 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                        {isTronMode ? 'Compute resource tracking across ' : 'Average compensation for '}
                        <span className={isTronMode ? 'text-neon-cyan' : 'text-primary font-bold'}>{totalCount || 0}</span>
                        {isTronMode ? ' class functions.' : ' job roles.'}
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 ${isTronMode ? 'text-neon-cyan' : 'text-slate-400'}`} width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder={isTronMode ? "Query function class..." : "Search roles..."}
                            value={localQuery}
                            onChange={e => setLocalQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-1 transition-all ${isTronMode
                                ? 'border-dark-border bg-ares-black/50 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] focus:border-neon-cyan focus:ring-neon-cyan placeholder:text-slate-600 font-mono'
                                : 'border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400'
                                }`}
                        />
                    </div>
                </div>

                {salaryData.length === 0 ? (
                    <p className={`text-center py-16 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                        {isTronMode ? 'No data streams found for this function class.' : 'No salary data found for this role.'}
                    </p>
                ) : (
                    <div className={`max-w-4xl mx-auto space-y-4 ${loading ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                        {salaryData.map(item => (
                            <button
                                key={item.title}
                                onClick={() => handleRoleClick(item.title)}
                                className={`w-full text-left rounded-xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group border ${isTronMode
                                    ? 'glass-panel border-dark-border hover:border-neon-cyan/40 hover:shadow-[0_0_15px_rgba(0,243,254,0.15)] hover:-translate-y-[1px]'
                                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <h2 className={`font-semibold text-lg transition-colors truncate ${isTronMode ? 'text-white group-hover:text-neon-cyan drop-shadow-[0_0_2px_rgba(0,243,254,0.5)]' : 'text-slate-900 group-hover:text-primary font-bold'
                                        }`}>
                                        {item.title}
                                    </h2>
                                    <p className={`text-sm mt-1 flex items-center gap-2 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-50'}`}>
                                        <span className={isTronMode ? 'text-ares-red' : 'text-primary'}>{item.jobCount} {isTronMode ? 'node' : 'job'}{item.jobCount > 1 ? 's' : ''}</span>
                                        <span className={`w-1 h-1 rounded-full ${isTronMode ? 'bg-slate-600' : 'bg-slate-300'}`}></span>
                                        <span className="truncate">{isTronMode ? 'Active at' : 'Hiring at'} {item.topCompany} {item.companies_count > 1 ? `& ${item.companies_count - 1} others` : ''}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 sm:justify-end">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-bold mb-1">Range</p>
                                        <p className={`text-sm ${isTronMode ? 'font-mono text-slate-400' : 'text-slate-600'}`}>
                                            {formatCurrency(item.absoluteMin)} - {formatCurrency(item.absoluteMax)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-bold mb-1">{isTronMode ? 'Median Vector' : 'Average Salary'}</p>
                                        <p className={`text-2xl font-bold tracking-tight transition-all ${isTronMode ? 'text-neon-cyan font-mono drop-shadow-[0_0_5px_rgba(0,243,254,0.3)]' : 'text-slate-900'
                                            }`}>
                                            {formatCurrency(item.totalAvg)}
                                        </p>
                                    </div>
                                    <div className={`transition-all ${isTronMode ? 'text-dark-border group-hover:text-neon-cyan group-hover:translate-x-1' : 'text-slate-300 group-hover:text-primary group-hover:translate-x-1'
                                        }`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={totalCount || 0}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemName={isTronMode ? 'DATA STREAMS' : 'ROLES'}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
