"use client";
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Image from 'next/image';

const CompanyDetailsModal = ({ company, onClose, onViewJobs }) => {
    const { isTronMode } = useTheme();
    if (!company) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className={`absolute inset-0 transition-opacity duration-300 ${isTronMode ? 'bg-ares-black/90 backdrop-blur-md' : 'bg-slate-900/60 backdrop-blur-sm'
                    }`}
                onClick={onClose}
            />

            <div className={`relative w-full max-w-2xl rounded-2xl overflow-hidden transition-all duration-500 animate-scale-in border ${isTronMode
                    ? 'glass-panel shadow-[0_0_30px_rgba(0,243,254,0.2)] border-neon-cyan/20'
                    : 'bg-white shadow-2xl border-slate-200'
                }`}>
                {/* Header Section */}
                <div className={`p-6 sm:p-8 relative ${isTronMode ? 'bg-ares-black/40 border-b border-neon-cyan/10' : 'bg-slate-50 border-b border-slate-100'
                    }`}>
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isTronMode
                                ? 'text-slate-500 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        {company.logoUrl ? (
                            <Image unoptimized width={96} height={96}
                                src={company.logoUrl}
                                alt={company.name}
                                className={`w-24 h-24 rounded-2xl object-cover border ${isTronMode ? 'border-neon-cyan/30 bg-ares-black shadow-neon-cyan/20' : 'border-slate-100 bg-white shadow-sm'
                                    }`}
                            />
                        ) : (
                            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0 border ${isTronMode
                                    ? 'bg-gradient-to-br from-ares-red to-ares-black border-dark-border shadow-[0_0_20px_rgba(255,30,30,0.3)]'
                                    : 'bg-primary border-primary'
                                }`}>
                                {company.name[0]}
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className={`text-3xl sm:text-4xl font-black mb-1 ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_10px_rgba(0,243,254,0.4)]' : 'text-slate-900'
                                }`}>
                                {company.name}
                            </h2>
                            <p className={`text-lg font-bold mb-4 ${isTronMode ? 'text-neon-cyan/80 font-mono tracking-widest' : 'text-primary'}`}>
                                {company.job_count} {isTronMode ? 'ACTIVE_NODES' : 'Active Jobs'}
                            </p>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium underline flex items-center justify-center sm:justify-start gap-2 ${isTronMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-primary'}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    {company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar ${isTronMode ? 'bg-ares-black/20' : 'bg-white'
                    }`}>
                    <div className="space-y-4">
                        <h3 className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isTronMode ? 'text-white font-mono' : 'text-slate-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isTronMode ? "bg-neon-cyan shadow-[0_0_5px_rgba(0,243,254,1)]" : "bg-primary"}`}></span>
                            {isTronMode ? 'ENTITY_MISSION' : 'About Company'}
                        </h3>
                        <p className={`text-sm sm:text-base leading-relaxed ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                            {company.description || (isTronMode ? 'No additional database metadata available.' : 'No description provided for this company.')}
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isTronMode ? 'text-white font-mono' : 'text-slate-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isTronMode ? "bg-ares-red shadow-[0_0_5px_rgba(255,30,30,1)]" : "bg-primary"}`}></span>
                            {isTronMode ? 'OPERATIONAL_LOCATIONS' : 'Active In'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(company.location_types || []).map((loc, i) => (
                                <span key={loc} className={`px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-widest ${isTronMode
                                        ? 'bg-ares-black/60 border-dark-border text-slate-400'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                    }`}>
                                    {loc}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className={`p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t transition-colors ${isTronMode ? 'bg-ares-black/60 border-neon-cyan/10' : 'bg-slate-50 border-slate-100'
                    }`}>
                    <button 
                        onClick={() => onViewJobs(company.name)}
                        className={`w-full px-10 py-4 font-black uppercase tracking-[0.25em] transition-all rounded-xl shadow-lg hover:-translate-y-1 block text-center ${isTronMode
                            ? 'bg-neon-cyan text-ares-black shadow-[0_0_20px_rgba(0,243,254,0.4)]'
                            : 'bg-primary text-white shadow-primary/20'
                        }`}
                    >
                        {isTronMode ? 'EXECUTE_TRACE_JOBS' : 'View All Jobs'}
                    </button>
                    <button 
                        onClick={onClose}
                        className={`w-full sm:w-auto px-6 py-4 font-black uppercase tracking-[0.2em] transition-all rounded-xl border ${isTronMode
                            ? 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-500'
                            : 'border-slate-300 text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {isTronMode ? 'DISCONNECT' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsModal;
