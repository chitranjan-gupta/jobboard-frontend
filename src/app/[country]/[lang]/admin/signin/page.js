"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function SigninPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { isTronMode } = useTheme();

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (success) {
            router.push(`/${country}/${lang}/admin/dashboard`);
        } else {
            setError(isTronMode ? 'Invalid credentials. Access Denied.' : 'Invalid username or password. Please try again.');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative transition-colors duration-300 ${isTronMode ? 'tron-ares-theme bg-ares-black text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
            <div className="absolute top-8 left-8 flex items-center gap-4 z-50">
                <Link 
                    href={`/${country}/${lang}`} 
                    className={`flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all ${
                        isTronMode 
                        ? 'text-neon-cyan hover:text-white drop-shadow-[0_0_5px_rgba(0,243,254,0.4)]' 
                        : 'text-slate-500 hover:text-primary transition-colors'
                    }`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    {isTronMode ? 'RETURN_TO_GRID' : 'Back to Home'}
                </Link>
            </div>
            <ThemeToggle variant="auth" />

            {/* Background Elements */}
            {isTronMode && (
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-ares-red/5 to-transparent pointer-events-none opacity-20"></div>
            )}

            <div className={`max-w-md w-full p-10 relative z-10 transition-all duration-300 ${isTronMode
                ? 'glass-panel border-2 border-ares-red/30 shadow-[0_0_40px_rgba(255,30,30,0.15)]'
                : 'bg-white border border-slate-200 shadow-2xl rounded-3xl'
                }`}
                style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' } : {}}
            >
                <div className="text-center mb-8">
                    <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${isTronMode
                        ? 'bg-ares-red/10 border-ares-red/30 shadow-[0_0_15px_rgba(255,30,30,0.4)]'
                        : 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/5'
                        }`}>
                        <svg className={`w-6 h-6 ${isTronMode ? 'text-ares-red drop-shadow-[0_0_5px_rgba(255,30,30,0.5)]' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className={`text-3xl font-black mb-2 tracking-[0.2em] uppercase transition-colors ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                        {isTronMode ? 'GRID_ACCESS' : 'Admin Signin'}
                    </h1>
                    <p className={`text-[0.7rem] font-bold transition-colors uppercase tracking-[0.3em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-500'}`}>
                        {isTronMode ? 'IDENTITY_VERIFICATION_REQUIRED' : 'Access the administration dashboard'}
                    </p>
                </div>

                {error && (
                    <div className={`px-4 py-3 rounded mb-6 text-xs text-center border animate-shake transition-all ${isTronMode
                        ? 'bg-ares-red/10 text-ares-red border-ares-red shadow-[0_0_20px_rgba(255,30,30,0.3)] font-["Share_Tech_Mono"] font-bold'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {isTronMode && <span className="mr-2"> [CRITICAL_FAILURE]:</span>} {error.toUpperCase()}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] transition-colors ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700'}`}>
                            {isTronMode ? '// ENTITY_ALIAS' : 'Username'}
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 border transition-all shadow-inner ${isTronMode
                                ? 'border-ares-red/30 bg-ares-black/80 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-lg'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                            value={username}
                            placeholder={isTronMode ? "INPUT_USER_ID" : "Enter username"}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] transition-colors ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700'}`}>
                            {isTronMode ? '// ACCESS_CODE' : 'Password'}
                        </label>
                        <input
                            type="password"
                            className={`w-full px-4 py-3 border transition-all shadow-inner ${isTronMode
                                ? 'border-ares-red/30 bg-ares-black/80 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-lg'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                            value={password}
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={`w-full py-3.5 mt-4 uppercase tracking-[0.2em] font-bold rounded-xl transition-all duration-300 ${isTronMode
                        ? 'btn-tron bg-ares-red text-white shadow-[0_0_15px_rgba(255,30,30,0.5)]'
                        : 'btn-primary bg-primary text-white shadow-lg shadow-primary/20'
                        }`}>
                        {isTronMode ? 'Authenticate' : 'Sign In'}
                    </button>

                    <div className="pt-2 text-center">
                        <Link href={`/${country}/${lang}/admin/signup`} className={`text-[0.7rem] font-black uppercase tracking-[0.2em] transition-all ${isTronMode ? 'text-neon-cyan hover:text-white font-["Share_Tech_Mono"] drop-shadow-[0_0_5px_rgba(0,243,254,0.4)]' : 'text-primary hover:text-primary-dark underline underline-offset-4 decoration-primary/30'}`}>
                            {isTronMode ? '> REQUEST_IDENTITY_INITIALIZATION' : 'Need an account? Signup here'}
                        </Link>
                    </div>


                </form>
            </div>
        </div>
    );
}
