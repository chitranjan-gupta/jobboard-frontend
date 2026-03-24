"use client";

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useJobs } from '@/context/JobContext';
import { parseSalary, formatCurrency } from '@/utils/salaryUtils';
import { useTheme } from '@/context/ThemeContext';

export default function SalariesPage() {
    const { jobs, loading } = useJobs();
    const { isTronMode } = useTheme();
    const router = useRouter();
    const params = useParams();
    const [query, setQuery] = useState('');

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    // Group and calculate salary averages by Job Title
    const salaryData = useMemo(() => {
        const titleMap = {};

        jobs.forEach(job => {
            const parsed = parseSalary(job.salary);
            if (!parsed) return; // Skip if salary isn't parsable

            // Group by broad title (e.g. "Senior React Developer" -> "Frontend Developer")
            const title = job.title.trim();

            if (!titleMap[title]) {
                titleMap[title] = {
                    title: title,
                    jobCount: 0,
                    minSalaries: [],
                    maxSalaries: [],
                    avgSalaries: [],
                    companies: new Set(),
                };
            }

            titleMap[title].jobCount += 1;
            titleMap[title].minSalaries.push(parsed.min);
            if (parsed.max) titleMap[title].maxSalaries.push(parsed.max);
            titleMap[title].avgSalaries.push(parsed.avg);
            titleMap[title].companies.add(job.company);
        });

        // Compute aggregates
        return Object.values(titleMap)
            .map(item => {
                const totalAvg = item.avgSalaries.reduce((sum, val) => sum + val, 0) / item.avgSalaries.length;
                const absoluteMin = Math.min(...item.minSalaries);
                const absoluteMax = Math.max(...item.maxSalaries);

                return {
                    ...item,
                    topCompany: [...item.companies][0], // Sample company hiring this role
                    totalAvg,
                    absoluteMin,
                    absoluteMax
                };
            })
            .sort((a, b) => b.totalAvg - a.totalAvg); // Sort by highest average salary
    }, [jobs]);

    const filtered = salaryData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleRoleClick = (title) => {
        // Navigate to homepage with exact role filter
        router.push(`/${country}/${lang}/?role=${encodeURIComponent(title)}`);
    };

    if (loading) return (
        <div className={`flex items-center justify-center min-h-screen ${isTronMode ? 'bg-ares-black' : 'bg-slate-50'}`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'
                }`} />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 pb-12">
                {/* Hero section */}
                <div className="text-center py-12">
                    <h1 className={`text-4xl font-bold mb-3 uppercase tracking-wider ${isTronMode ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-900'
                        }`}>
                        {isTronMode ? 'Data Streams' : 'Salaries'}
                    </h1>
                    <p className={`text-lg mb-8 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                        {isTronMode ? 'Compute resource tracking across ' : 'Average compensation for '}
                        <span className={isTronMode ? 'text-neon-cyan' : 'text-primary font-bold'}>{salaryData.length}</span>
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
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-1 transition-all ${isTronMode
                                ? 'border-dark-border bg-ares-black/50 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] focus:border-neon-cyan focus:ring-neon-cyan placeholder:text-slate-600 font-mono'
                                : 'border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400'
                                }`}
                        />
                    </div>
                </div>

                {/* Salary list */}
                {filtered.length === 0 ? (
                    <p className={`text-center py-16 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-600'}`}>
                        {isTronMode ? 'No data streams found for this function class.' : 'No salary data found for this role.'}
                    </p>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filtered.map(item => (
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
                                    <p className={`text-sm mt-1 flex items-center gap-2 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-500'}`}>
                                        <span className={isTronMode ? 'text-ares-red' : 'text-primary'}>{item.jobCount} {isTronMode ? 'node' : 'job'}{item.jobCount > 1 ? 's' : ''}</span>
                                        <span className={`w-1 h-1 rounded-full ${isTronMode ? 'bg-slate-600' : 'bg-slate-300'}`}></span>
                                        <span className="truncate">{isTronMode ? 'Active at' : 'Hiring at'} {item.topCompany} {item.companies.size > 1 ? `& ${item.companies.size - 1} others` : ''}</span>
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
                    </div>
                )}
            </main>
        </div>
    );
}
