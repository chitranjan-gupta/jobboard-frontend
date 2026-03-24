"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }) {
    const { user, logout, loading: authLoading } = useAuth();
    const { isTronMode } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    useEffect(() => {
        if (!authLoading && !user && !pathname.includes('/admin/signin') && !pathname.includes('/admin/signup')) {
            router.push(`/${country}/${lang}/admin/signin`);
        }
    }, [user, authLoading, pathname, router, country, lang]);

    // Reset logout state when user is authenticated (fixes persistent progress indicator after login)
    const [prevUser, setPrevUser] = useState(user);
    if (user !== prevUser) {
        setPrevUser(user);
        if (user && isLoggingOut) {
            setIsLoggingOut(false);
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        router.push(`/${country}/${lang}/admin/signin`);
    };

    const isActive = (path) => {
        const fullPath = `/${country}/${lang}${path}`;
        return pathname === fullPath || (path !== '/admin' && pathname.startsWith(fullPath));
    };

    if (authLoading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${isTronMode ? 'bg-ares-black' : 'bg-slate-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isTronMode ? 'border-ares-red' : 'border-primary'}`} />
            </div>
        );
    }

    // Don't show layout for signin/signup
    if (pathname.includes('/admin/signin') || pathname.includes('/admin/signup')) {
        return <>{children}</>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className={`flex flex-col md:flex-row relative min-h-screen ${isTronMode ? 'tron-ares-theme bg-ares-black text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
            {/* Cyber Background Element */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-ares-red/5 to-transparent bg-[size:40px_40px] border-b border-ares-red/10 pointer-events-none opacity-20 hidden md:block"></div>

            {/* Sidebar */}
            <aside className={`w-full md:w-64 flex flex-col shrink-0 border-r relative z-20 transition-all duration-300 ${isTronMode
                ? 'bg-ares-black/90 text-slate-300 border-ares-red/30 shadow-[5px_0_30px_rgba(255,30,30,0.1)] glass-panel font-["Share_Tech_Mono"]'
                : 'bg-white text-slate-600 border-slate-200 shadow-slate-200/50 shadow-lg'
                }`}>
                <div className={`p-6 border-b relative ${isTronMode ? 'border-ares-red/30' : 'border-slate-100'}`}>
                    {isTronMode && <div className="absolute top-0 right-0 w-8 h-1 bg-ares-red shadow-[0_0_10px_rgba(255,30,30,0.8)]"></div>}
                    <Link href={`/${country}/${lang}/admin/dashboard`} className={`text-xl flex items-center gap-2 ${isTronMode ? 'font-black tracking-[0.2em] text-white font-["Orbitron"] uppercase' : 'font-bold text-slate-800'}`}>
                        {isTronMode ? (
                            <><span className="text-ares-red drop-shadow-[0_0_8px_rgba(255,30,30,0.8)]">SYS</span>_ADMIN</>
                        ) : (
                            <>Admin<span className="text-primary">Panel</span></>
                        )}
                    </Link>
                </div>

                <div className="p-4 flex-1 pt-6">
                    <p className={`text-[0.65rem] font-black uppercase tracking-[0.25em] mb-4 px-3 ${isTronMode ? 'text-slate-500 font-["Orbitron"]' : 'text-slate-400'}`}>
                        {isTronMode ? '// DIRECTIVES' : 'Main Navigation'}
                    </p>
                    <nav className="space-y-3">
                        <Link
                            href={`/${country}/${lang}/admin/dashboard`}
                            className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 uppercase tracking-widest text-[0.8rem] font-bold ${isActive('/admin/dashboard')
                                ? (isTronMode ? 'bg-ares-red/10 text-ares-red border-ares-red shadow-[inset_0_0_15px_rgba(255,30,30,0.2)]' : 'bg-primary/5 text-primary border-primary/20 rounded-lg')
                                : (isTronMode ? 'border-transparent text-slate-400 hover:bg-ares-black hover:text-white hover:border-ares-red/30 hover:pl-6' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg')
                                }`}
                            style={isTronMode ? { clipPath: isActive('/admin/dashboard') ? 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' : 'none' } : {}}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            {isTronMode ? 'CORE_DASH' : 'Dashboard'}
                        </Link>

                        {/* Users — admin only */}
                        {user.role === 'admin' && (
                            <Link
                                href={`/${country}/${lang}/admin/users`}
                                className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 uppercase tracking-widest text-[0.8rem] font-bold ${isActive('/admin/users')
                                    ? (isTronMode ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan shadow-[inset_0_0_15px_rgba(0,243,254,0.2)]' : 'bg-primary/5 text-primary border-primary/20 rounded-lg')
                                    : (isTronMode ? 'border-transparent text-slate-400 hover:bg-ares-black hover:text-white hover:border-neon-cyan/30 hover:pl-6' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg')
                                    }`}
                                style={isTronMode ? { clipPath: isActive('/admin/users') ? 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' : 'none' } : {}}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                {isTronMode ? 'IDENTITIES' : 'Users'}
                            </Link>
                        )}

                        <Link
                            href={`/${country}/${lang}/admin/companies`}
                            className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 uppercase tracking-widest text-[0.8rem] font-bold ${isActive('/admin/companies')
                                ? (isTronMode ? 'bg-ares-red/10 text-ares-red border-ares-red shadow-[inset_0_0_15px_rgba(255,30,30,0.2)]' : 'bg-primary/5 text-primary border-primary/20 rounded-lg')
                                : (isTronMode ? 'border-transparent text-slate-400 hover:bg-ares-black hover:text-white hover:border-ares-red/30 hover:pl-6' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg')
                                }`}
                            style={isTronMode ? { clipPath: isActive('/admin/companies') ? 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' : 'none' } : {}}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M14 22V12h-4v10M18 22V6h-4v16M6 22V10H2v12M22 22V2h-4v20"></path></svg>
                            {isTronMode ? 'SECTORS' : 'Companies'}
                        </Link>

                        <Link
                            href={`/${country}/${lang}`}
                            target="_blank"
                            className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 uppercase tracking-widest text-[0.8rem] font-bold ${isTronMode
                                ? 'border-transparent text-slate-400 hover:bg-ares-black hover:text-neon-cyan hover:border-neon-cyan/30 hover:pl-6'
                                : 'rounded-lg border-transparent text-slate-500 hover:bg-slate-50 hover:text-primary'}
                            `}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            {isTronMode ? 'ACCESS_GRID' : 'Open Site'}
                        </Link>

                        <Link
                            href={`/${country}/${lang}/admin/profile`}
                            className={`flex items-center gap-3 px-4 py-3 border transition-all duration-300 uppercase tracking-widest text-[0.8rem] font-bold ${isActive('/admin/profile')
                                ? (isTronMode ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan shadow-[inset_0_0_15px_rgba(0,243,254,0.2)]' : 'bg-primary/5 text-primary border-primary/20 rounded-lg')
                                : (isTronMode ? 'border-transparent text-slate-400 hover:bg-ares-black hover:text-white hover:border-neon-cyan/30 hover:pl-6' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg')
                                }`}
                            style={isTronMode ? { clipPath: isActive('/admin/profile') ? 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' : 'none' } : {}}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                            {isTronMode ? 'LOCAL_AUTH' : 'Profile Settings'}
                        </Link>

                        <ThemeToggle variant="sidebar" />
                    </nav>
                </div>

                <div className={`p-6 border-t relative ${isTronMode ? 'border-ares-red/30' : 'border-slate-100'}`}>
                    {isTronMode && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ares-red/50 to-transparent"></div>}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-10 h-10 flex flex-shrink-0 items-center justify-center text-lg font-black tracking-wider ${isTronMode
                            ? 'bg-ares-black border-2 border-ares-red text-white shadow-[0_0_10px_rgba(255,30,30,0.5)] font-["Orbitron"]'
                            : 'bg-primary text-white rounded-lg shadow-md'
                            }`}
                            style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}
                        >
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className={`text-sm font-black truncate uppercase tracking-[0.1em] ${isTronMode ? 'text-white' : 'text-slate-800'}`}>{user?.username}</p>
                            <p className={`text-[0.65rem] font-bold uppercase tracking-[0.25em] truncate ${isTronMode ? 'text-neon-cyan' : 'text-primary'}`}>{isTronMode ? `[${user?.role}]` : user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center gap-3 justify-center py-3 px-4 text-xs font-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] relative overflow-hidden group ${isTronMode
                            ? 'btn-outline border-ares-red text-ares-red hover:bg-ares-red/20 shadow-[0_0_15px_rgba(255,30,30,0.2)] hover:shadow-[0_0_20px_rgba(255,30,30,0.4)]'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl shadow-sm'
                            }`}
                    >
                        {isTronMode && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ares-red/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
                        {isLoggingOut ? (
                            <>
                                <div className={`w-4 h-4 border-2 rounded-full animate-spin ${isTronMode ? 'border-ares-red border-t-transparent' : 'border-red-600 border-t-transparent'}`}></div>
                                {isTronMode ? 'TERMINATING...' : 'Logging out...'}
                            </>
                        ) : (
                            <>
                                <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                <span className="relative z-10">{isTronMode ? 'SEVER_CONNECTION' : 'Logout'}</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col overflow-hidden h-screen overflow-y-auto relative z-10 transition-colors duration-300 ${isTronMode ? 'bg-transparent text-slate-200' : 'bg-white text-slate-900'}`}>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
