"use client";
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ variant = 'header' }) => {
    const { toggleTheme, isTronMode } = useTheme();

    if (variant === 'sidebar') {
        return (
            <button
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded border transition-all mt-4 ${isTronMode
                    ? 'border-ares-red/30 text-ares-red bg-ares-red/5 hover:bg-ares-red/10 hover:border-ares-red font-["Share_Tech_Mono"] tracking-tighter'
                    : 'border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                {isTronMode ? (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-slow"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                        DE-REZZ THEME
                    </>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        INITIALIZE TRON
                    </>
                )}
            </button>
        );
    }

    if (variant === 'auth') {
        return (
            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 z-50 p-4 transition-all duration-300 group ${isTronMode
                    ? 'bg-ares-red/10 border-2 border-ares-red/50 text-ares-red shadow-[0_0_25px_rgba(255,30,30,0.3)] hover:shadow-[0_0_40px_rgba(255,30,30,0.6)] hover:bg-ares-red/20'
                    : 'bg-white border border-slate-200 text-slate-600 shadow-xl hover:shadow-2xl hover:border-primary hover:text-primary rounded-2xl'
                    }`}
                style={isTronMode ? { clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' } : {}}
                title={isTronMode ? "Switch to Normal Mode" : "Switch to Tron Mode"}
            >
                {isTronMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-slow">
                        <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                )}
                <span className={`absolute right-full mr-3 px-2 py-1 rounded bg-slate-800 text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isTronMode ? 'font-mono' : ''}`}>
                    {isTronMode ? 'DE-REZZ THEME' : 'Switch Theme'}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-14 items-center transition-all focus:outline-none ${isTronMode
                ? 'bg-ares-black border-2 border-ares-red/40 shadow-[inset_0_0_8px_rgba(255,30,30,0.3)]'
                : 'bg-slate-200 rounded-full'}`}
            style={isTronMode ? { clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' } : {}}
            aria-label="Toggle Theme"
        >
            <span
                className={`inline-block h-4 w-4 transform transition-all duration-300 ${isTronMode
                    ? 'translate-x-8 bg-ares-red shadow-[0_0_15px_rgba(255,30,30,0.8)]'
                    : 'translate-x-1 bg-white rounded-full'}`}
                style={isTronMode ? { clipPath: 'polygon(30% 0, 100% 0, 100% 70%, 70% 100%, 0 100%, 0 30%)' } : {}}
            />
            <span className={`absolute ${isTronMode ? 'left-2 text-ares-red/60' : 'right-2 text-slate-400'} text-[9px] pointer-events-none font-bold tracking-tighter uppercase font-["Share_Tech_Mono"]`}>
                {isTronMode ? 'GRID' : 'NORM'}
            </span>
        </button>
    );
};

export default ThemeToggle;
