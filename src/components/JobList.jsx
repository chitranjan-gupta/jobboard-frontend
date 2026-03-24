"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import JobCard from './JobCard';
import PaginationControls from './PaginationControls';

const JobList = ({ jobs, totalCount, currentPage, onPageChange, sortBy, setSortBy, onJobClick, loading }) => {
    const { isTronMode } = useTheme();
    const { t } = useTranslation();

    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

    // Map frontend sort values to backend ordering parameters
    const getBackendSortValue = (val) => {
        if (val === 'recent') return '-postedAt';
        if (val === 'relevant') return 'title'; // Simple fallback for now
        return val;
    };

    const handleSortChange = (e) => {
        const newVal = e.target.value;
        setSortBy(newVal);
    };

    return (
        <section className="flex-1 min-w-0">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-4 border-b ${isTronMode ? 'border-ares-red/30' : 'border-slate-200'}`}>
                <div className="mb-4 sm:mb-0">
                    <h1 className={`text-2xl sm:text-3xl font-black mb-1 uppercase tracking-[0.2em] ${isTronMode ? 'text-white font-["Orbitron"]' : 'text-slate-900'}`}>{isTronMode ? 'AVAILABLE_NODES' : t('joblist.available_jobs')}</h1>
                    <p className={`text-[0.7rem] sm:text-sm font-bold uppercase tracking-[0.1em] ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-600'}`}>{isTronMode ? 'ACTIVE_SIGNALS:' : t('joblist.viewing')} <span className={`font-black tracking-widest ${isTronMode ? 'text-neon-cyan shadow-[0_0_5px_rgba(0,243,254,0.5)]' : 'text-primary'}`}>[{jobs.length}]</span> {isTronMode ? 'DETECTED' : t('joblist.listed_positions')}</p>
                </div>
                <div className="w-full sm:w-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full sm:w-auto px-4 py-2 border text-sm cursor-pointer outline-none transition-all duration-300 ${isTronMode
                            ? 'border-ares-red/40 text-ares-red bg-ares-black/80 focus:border-ares-red font-["Share_Tech_Mono"] tracking-widest uppercase font-bold shadow-inner focus:shadow-[0_0_10px_rgba(255,30,30,0.4)]'
                            : 'border-slate-200 text-slate-700 bg-white focus:border-primary shadow-sm rounded-lg'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' } : {}}
                    >
                        <option value="recent">{isTronMode ? 'SEQ: DESCENDING' : t('joblist.sort_newest')}</option>
                        <option value="relevant">{isTronMode ? 'SEQ: RELEVANT' : t('joblist.sort_relevant')}</option>
                    </select>
                </div>
            </div>

            <div className={`relative flex flex-col gap-4 ${loading && jobs.length > 0 ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                {loading && jobs.length === 0 ? (
                    <div className="flex items-center justify-center p-12">
                        <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'}`}></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className={`text-center py-20 px-6 border transition-all duration-300 animate-fade-in ${isTronMode ? 'glass-panel border-ares-red/30 shadow-[inset_0_0_20px_rgba(255,30,30,0.1)]' : 'bg-white border-dashed border-slate-200 text-slate-500 rounded-2xl'
                        }`}
                        style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 90%, 98% 100%, 0 100%, 0 10%)' } : {}}
                    >
                        <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 border ${isTronMode ? 'rounded-none border-ares-red/50 bg-ares-red/10 text-ares-red shadow-[0_0_15px_rgba(255,30,30,0.4)]' : 'rounded-full border-slate-100 bg-slate-50 text-slate-400'}`}
                            style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <h3 className={`text-xl font-black mb-2 tracking-[0.2em] uppercase ${isTronMode ? 'text-ares-red font-["Orbitron"]' : 'text-slate-600'}`}>
                            {isTronMode ? 'NO_DATA_STREAMS_DETECTED' : t('joblist.no_jobs_found')}
                        </h3>
                        <p className={`font-bold tracking-widest text-[0.7rem] uppercase ${isTronMode ? 'font-["Share_Tech_Mono"] text-slate-500' : 'text-sm'}`}>{isTronMode ? 'RECALIBRATE_SEARCH_PARAMETERS' : t('joblist.try_adjusting')}</p>
                    </div>
                ) : (
                    <>
                        {jobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} onClick={() => onJobClick(job)} />
                        ))}
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            totalItems={totalCount || 0}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemName={isTronMode ? 'DATA_STREAMS' : 'JOBS'}
                        />
                    </>
                )}
            </div>
        </section>
    );
};

export default JobList;
