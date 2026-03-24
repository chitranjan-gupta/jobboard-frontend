"use client";
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import Image from 'next/image';

const JobDetailsModal = ({ job, onClose }) => {
    const { isTronMode } = useTheme();
    const { formatSalary } = useCurrency();
    if (!job) return null;

    // Use job.requirements or job.tags as fallback for requirements list
    const requirements = job.requirements || job.tags || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className={`absolute inset-0 transition-opacity duration-300 ${isTronMode ? 'bg-ares-black/90 backdrop-blur-md' : 'bg-slate-900/60 backdrop-blur-sm'
                    }`}
                onClick={onClose}
            />

            <div className={`relative w-full max-w-2xl rounded-2xl overflow-hidden transition-all duration-500 animate-scale-in border ${isTronMode
                    ? 'glass-panel shadow-[0_0_30px_rgba(255,30,30,0.2)] border-ares-red/20'
                    : 'bg-white shadow-2xl border-slate-200'
                }`}>
                {/* Header/Hero section of modal */}
                <div className={`p-6 sm:p-8 relative ${isTronMode ? 'bg-ares-black/40 border-b border-ares-red/10' : 'bg-slate-50 border-b border-slate-100'
                    }`}>
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isTronMode
                                ? 'text-slate-500 hover:text-ares-red hover:bg-ares-red/10'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Image unoptimized width={80} height={80}
                            src={job.companyLogo}
                            alt={job.company}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border ${isTronMode ? 'border-dark-border bg-ares-black shadow-neon-red' : 'border-slate-100 bg-white shadow-sm'
                                }`}
                        />
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded text-[0.7rem] font-bold uppercase tracking-widest border transition-all ${isTronMode
                                        ? 'bg-ares-red/10 border-ares-red/30 text-ares-red shadow-[0_0_10px_rgba(255,30,30,0.2)]'
                                        : 'bg-primary/10 border-primary/20 text-primary'
                                    }`}>
                                    {job.jobType}
                                </span>
                                {isTronMode && (
                                    <span className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded text-[0.7rem] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,243,254,0.2)]">
                                        SECURE_LINK
                                    </span>
                                )}
                            </div>
                            <h2 className={`text-2xl sm:text-3xl font-bold mb-1 ${isTronMode ? 'text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]' : 'text-slate-900'
                                }`}>
                                {job.title}
                            </h2>
                            <p className={`text-lg font-medium ${isTronMode ? 'text-neon-cyan font-mono' : 'text-primary'}`}>
                                {job.company}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content section */}
                <div className={`p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar ${isTronMode ? 'bg-ares-black/20' : 'bg-white'
                    }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-xl border ${isTronMode ? 'bg-ares-black/40 border-dark-border' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Location Vector</p>
                            <div className={`flex items-center gap-2 font-medium ${isTronMode ? 'text-slate-200 font-mono text-sm' : 'text-slate-800'}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isTronMode ? "text-ares-red" : "text-primary"}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                {job.location} ({job.locationType})
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl border ${isTronMode ? 'bg-ares-black/40 border-dark-border' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <p className="text-[0.65rem] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Compensation Tier</p>
                            <div className={`flex items-center gap-2 font-bold ${isTronMode ? 'text-neon-cyan font-mono text-lg' : 'text-emerald-600 text-lg'}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isTronMode ? "text-neon-cyan" : "text-emerald-500"}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                {formatSalary(job.salary, job.currency)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className={`text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isTronMode ? 'text-white font-mono' : 'text-slate-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isTronMode ? "bg-ares-red" : "bg-primary"}`}></span>
                            {isTronMode ? 'Node Specifications' : 'Job Description'}
                        </h3>
                        <p className={`text-sm sm:text-base leading-relaxed ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                            {job.description}
                        </p>
                    </div>

                    {requirements.length > 0 && (
                        <div className="space-y-4">
                            <h3 className={`text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isTronMode ? 'text-white font-mono' : 'text-slate-800'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isTronMode ? "bg-ares-red" : "bg-primary"}`}></span>
                                {isTronMode ? 'Required Modules' : 'Requirements'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {requirements.map((req, i) => (
                                    <span key={i} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${isTronMode
                                            ? 'bg-ares-black/60 border-dark-border text-slate-400'
                                            : 'bg-white border-slate-200 text-slate-600'
                                        }`}>
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer section */}
                <div className={`p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t transition-colors ${isTronMode ? 'bg-ares-black/60 border-ares-red/10' : 'bg-slate-50 border-slate-100'
                    }`}>
                    <div className="text-center sm:text-left">
                        <p className={`text-[0.65rem] uppercase tracking-widest font-bold mb-1 ${isTronMode ? 'text-slate-500 font-mono' : 'text-slate-400'}`}>Posting Timestamp</p>
                        <p className={`text-sm font-medium ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                            {new Date(job.postedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                    </div>
                    {job.apply_url ? (
                        <a 
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full sm:w-auto px-10 py-4 font-bold uppercase tracking-[0.2em] transition-all rounded-xl shadow-lg hover:-translate-y-1 block text-center ${isTronMode
                                ? 'bg-ares-red text-white shadow-neon-red px-12'
                                : 'bg-primary text-white shadow-primary/20 px-12'
                            }`}
                        >
                            {isTronMode ? 'INITIATE CONNECTION' : 'Apply Now'}
                        </a>
                    ) : (
                        <button disabled className="w-full sm:w-auto px-10 py-4 font-bold uppercase tracking-[0.2em] opacity-50 cursor-not-allowed rounded-xl border border-dashed border-slate-300">
                            {isTronMode ? 'LINK_UNAVAILABLE' : 'Apply Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
