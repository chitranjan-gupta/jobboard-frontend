"use client";

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { useCompanies } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';
import PaginationControls from '@/components/PaginationControls';
import CompanyDetailsModal from '@/components/CompanyDetailsModal';
import Image from 'next/image';

export default function CompaniesPage() {
    const { companies, loading, totalCount, fetchCompanies } = useCompanies();
    const { isTronMode } = useTheme();
    const router = useRouter();
    const params = useParams();
    
    const [localQuery, setLocalQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const ITEMS_PER_PAGE = 12;

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

    // Fetch companies whenever search or pagination changes
    useEffect(() => {
        const queryParams = new URLSearchParams();
        queryParams.set('page', currentPage);
        if (debouncedQuery) queryParams.set('search', debouncedQuery);
        
        fetchCompanies(`/companies/?${queryParams.toString()}`);
    }, [currentPage, debouncedQuery, fetchCompanies]);

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    const handleViewJobs = (companyName) => {
        router.push(`/${country}/${lang}/?company=${encodeURIComponent(companyName)}`);
    };

    if (loading && companies.length === 0) return (
        <div className={`flex items-center justify-center min-h-screen ${isTronMode ? 'bg-ares-black' : 'bg-slate-50'}`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isTronMode ? 'border-ares-red drop-shadow-[0_0_8px_rgba(255,30,30,0.8)]' : 'border-primary'
                }`} />
        </div>
    );

    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

    return (
        <div className="max-w-7xl mx-auto px-6 flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 pb-12">
                <div className="text-center py-12">
                    <h1 className={`text-4xl font-bold mb-3 tracking-wider uppercase ${isTronMode ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-900'
                        }`}>
                        {isTronMode ? 'Browse Sectors' : 'Companies'}
                    </h1>
                    <p className={`text-lg mb-8 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                        <span className={isTronMode ? 'text-neon-cyan' : 'text-primary font-bold'}>{totalCount || 0}</span> {isTronMode ? 'corporations actively signaling' : 'companies hiring right now'}
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <svg className={`absolute left-4 top-1/2 -translate-y-1/2 ${isTronMode ? 'text-ares-red' : 'text-slate-400'}`} width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder={isTronMode ? "Query entity..." : "Search companies..."}
                            value={localQuery}
                            onChange={e => setLocalQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-1 transition-all ${isTronMode
                                    ? 'border-dark-border bg-ares-black/50 text-white focus:border-ares-red focus:ring-ares-red placeholder:text-slate-600 font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                                    : 'border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 font-sans'
                                }`}
                        />
                    </div>
                </div>

                {companies.length === 0 ? (
                    <p className={`text-center py-16 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>{isTronMode ? 'No matching entities found.' : 'No companies found matching your search.'}</p>
                ) : (
                    <>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${loading ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                            {companies.map(company => (
                                <div
                                    key={company.id}
                                    onClick={() => handleCompanyClick(company)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleCompanyClick(company);
                                        }
                                    }}
                                    className={`text-left rounded-xl p-5 transition-all duration-300 group overflow-hidden relative border cursor-pointer ${isTronMode
                                            ? 'glass-panel border-dark-border hover:border-neon-cyan/50 hover:shadow-neon-cyan'
                                            : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30'
                                        }`}
                                >
                                    {isTronMode && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-xl"></div>}
                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        {company.logoUrl ? (
                                            <Image unoptimized width={56} height={56} src={company.logoUrl} alt={company.name}
                                                className={`w-14 h-14 rounded-xl object-cover border shrink-0 ${isTronMode ? 'border-dark-border bg-ares-black shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'border-slate-100 bg-slate-50'
                                                    }`} />
                                        ) : (
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 border ${isTronMode
                                                    ? 'bg-gradient-to-br from-ares-red to-ares-black border-dark-border shadow-[0_0_10px_rgba(255,30,30,0.3)]'
                                                    : 'bg-primary border-primary'
                                                }`}>
                                                {company.name[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h2 className={`font-semibold text-base truncate transition-colors ${isTronMode ? 'text-white group-hover:text-neon-cyan drop-shadow-[0_0_2px_rgba(0,243,254,0.5)]' : 'text-slate-900 group-hover:text-primary'
                                                }`}>
                                                {company.name}
                                            </h2>
                                            <p className={`text-sm mt-0.5 ${isTronMode ? 'font-mono text-neon-cyan/80' : 'text-slate-500 font-medium'}`}>
                                                {company.job_count} {isTronMode ? 'Active Node' : 'Open Job'}{company.job_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {company.description && (
                                        <p className={`text-sm leading-relaxed line-clamp-2 mb-4 relative z-10 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                                            {company.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {(company.location_types || []).map(t => (
                                                <span key={t} className={`text-[0.65rem] px-2 py-0.5 border rounded uppercase tracking-wider font-semibold ${isTronMode ? 'bg-ares-black text-slate-400 border-dark-border' : 'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewJobs(company.name);
                                            }}
                                            className={`text-xs font-black transition-all whitespace-nowrap uppercase tracking-[0.2em] relative z-20 px-3 py-1.5 rounded-lg border transition-all ${isTronMode 
                                                ? 'text-ares-red border-ares-red/30 hover:bg-ares-red/10 hover:border-ares-red/60 font-mono' 
                                                : 'text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/50'
                                            }`}
                                        >
                                            {isTronMode ? 'Trace →' : 'View Jobs →'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={totalCount || 0}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemName={isTronMode ? 'SECTORS' : 'COMPANIES'}
                        />
                    </>
                )}
            </main>
            <CompanyDetailsModal 
                company={selectedCompany} 
                onClose={() => setSelectedCompany(null)} 
                onViewJobs={handleViewJobs}
            />
        </div>
    );
}
