import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import Image from 'next/image';

const icons = {
    location: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    briefcase: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    ),
    clock: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    )
};

const JobCard = ({ job, index, onClick }) => {
    const { isTronMode } = useTheme();
    const { formatSalary } = useCurrency();
    const animationDelay = (index * 0.05).toFixed(2) + 's';

    return (
        <article
            className={`group relative p-5 sm:p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in ${isTronMode
                ? 'glass-panel hover:neon-border-red border-dark-border'
                : 'bg-white shadow-sm hover:shadow-md border border-slate-200 rounded-xl hover:-translate-y-1'
                }`}
            style={{ animationDelay }}
            onClick={onClick}
        >
            {/* Gradient accent bar on hover */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-transform duration-300 scale-y-0 origin-top group-hover:scale-y-100 ${isTronMode
                ? 'bg-gradient-to-b from-ares-red to-ares-black shadow-[0_0_10px_rgba(255,30,30,1)]'
                : 'bg-gradient-to-b from-primary to-accent'
                }`}></div>

            <Image unoptimized width={60} height={60}
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className={`w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] object-cover shrink-0 relative z-10 transition-all duration-300 ${isTronMode
                    ? 'border border-ares-red/40 bg-ares-black group-hover:border-ares-red group-hover:shadow-[0_0_10px_rgba(255,30,30,0.4)]'
                    : 'border border-slate-100 bg-slate-50 rounded-lg'
                    }`}
            />

            <div className="flex-1 flex flex-col relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-2 mb-2 sm:mb-2 text-left">
                    <div>
                        <div className={`text-[0.85rem] mb-1 ${isTronMode ? 'text-ares-red tracking-[0.2em] uppercase font-["Share_Tech_Mono"] font-bold' : 'text-primary font-bold'}`}>{job.company}</div>
                        <h2 className={`text-[1.15rem] sm:text-xl font-bold mb-1 transition-colors ${isTronMode ? 'text-white group-hover:text-neon-cyan font-["Orbitron"] tracking-wider' : 'text-slate-900 group-hover:text-primary'}`}>{job.title}</h2>
                    </div>
                    <div className={`self-start px-3 py-1 text-sm ${isTronMode
                        ? 'font-["Share_Tech_Mono"] font-black text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 shadow-[0_0_15px_rgba(0,243,254,0.1)]'
                        : 'font-semibold text-slate-700 bg-slate-100 rounded-full'
                        }`}>{formatSalary(job.salary, job.currency)}</div>
                </div>

                <div className={`flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-4 text-sm ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"]' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 ${isTronMode ? 'opacity-70 text-ares-red' : 'text-slate-400'}`}>{icons.location}</span>
                        <span className={isTronMode ? 'tracking-tight' : ''}>{job.location} <span className={isTronMode ? 'text-ares-red/60 font-black' : 'text-slate-600 font-medium'}>{isTronMode ? `[${job.locationType.toUpperCase()}]` : `(${job.locationType})`}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 ${isTronMode ? 'opacity-70 text-ares-red' : 'text-slate-400'}`}>{icons.briefcase}</span>
                        <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 ${isTronMode ? 'opacity-70 text-ares-red' : 'text-slate-400'}`}>{icons.clock}</span>
                        <span>
                            {new Date(job.postedAt).toLocaleDateString()}
                            {job.expiryDate && (
                                <span className={`ml-2 pl-2 border-l ${isTronMode ? 'border-ares-red/30' : 'border-slate-200'
                                    } ${new Date(job.expiryDate) < new Date() ? 'text-ares-red drop-shadow-[0_0_5px_rgba(255,30,30,0.5)]' : 'text-amber-500'} font-medium whitespace-nowrap`}>
                                    {isTronMode ? 'KILL_PROCESS: ' : 'Ends: '}{new Date(job.expiryDate).toLocaleDateString()}
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-auto gap-4 sm:gap-0">
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, i) => (
                            <span key={i} className={`px-2.5 py-1 text-[0.7rem] uppercase tracking-wider font-bold border transition-colors ${isTronMode
                                ? 'bg-ares-black/50 text-slate-400 border-dark-border group-hover:border-ares-red/40 group-hover:text-ares-red group-hover:bg-ares-red/5 font-["Share_Tech_Mono"]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/5 rounded'
                                }`}>{tag}</span>
                        ))}
                    </div>
                    <div className="w-full sm:w-auto overflow-hidden flex flex-wrap gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClick(); }}
                            className={`btn btn-outline w-full sm:w-auto sm:opacity-0 sm:translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${isTronMode ? '!text-xs border-ares-red/40 text-ares-red' : 'border-slate-200 text-slate-600'}`}>
                            {isTronMode ? 'ANALYZE_NODE' : 'View Details'}
                        </button>
                        {job.apply_url && (
                            <a 
                                href={job.apply_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`btn btn-primary w-full sm:w-auto sm:opacity-0 sm:translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 flex items-center justify-center ${isTronMode ? '!text-xs' : ''}`}
                            >
                                {isTronMode ? 'INITIATE_UPLINK' : 'Quick Apply'}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default JobCard;
