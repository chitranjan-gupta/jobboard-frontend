"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { isTronMode } = useTheme();

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${isTronMode ? 'bg-ares-black/95 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
                <div className={`max-w-md w-full p-10 relative z-10 transition-all duration-300 ${isTronMode
                    ? 'glass-panel border-2 border-ares-red/30 shadow-[0_0_40px_rgba(255,30,30,0.15)]'
                    : 'bg-white border-slate-200 shadow-2xl rounded-3xl'
                    }`}
                    style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' } : {}}
                >
                    <div className={`text-5xl mb-5 animate-pulse ${isTronMode ? 'text-neon-cyan' : 'text-primary'}`}>
                        {isTronMode ? '💠' : '✅'}
                    </div>
                    <h1 className={`text-2xl font-black mb-3 tracking-[0.2em] uppercase transition-colors ${isTronMode ? 'text-white font-["Orbitron"]' : 'text-slate-900 font-bold'}`}>
                        {isTronMode ? 'ACCESS_REQUESTED' : 'Account Created'}
                    </h1>
                    <p className={`mb-6 leading-relaxed text-xs transition-colors ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] tracking-widest' : 'text-slate-600'}`}>
                        {isTronMode
                            ? 'Your authorization request has been transmitted. Connection will be established once an Admin Node approves your key.'
                            : 'Your account has been created successfully. Please wait for an administrator to approve your access.'
                        }
                    </p>
                    <Link href={`/${country}/${lang}`} className={`w-full block py-4 text-center font-bold uppercase tracking-widest transition-all ${isTronMode ? 'btn-outline border-none text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,254,0.3)] font-["Orbitron"]' : 'btn-primary bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark rounded-xl'}`}>
                        {isTronMode ? '> Return to Grid' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isTronMode ? 'bg-ares-black/95 text-slate-200' : 'bg-slate-50 text-slate-900'
            }`}>
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
            <div className={`max-w-md w-full space-y-8 p-10 relative z-10 transition-all duration-300 ${isTronMode
                ? 'glass-panel border-2 border-ares-red/30 shadow-[0_0_50px_rgba(255,30,30,0.1)]'
                : 'bg-white border-slate-200 shadow-2xl rounded-3xl'
                }`}
                style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' } : {}}
            >
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center border transition-all ${isTronMode
                            ? 'bg-gradient-to-br from-ares-red to-ares-black border-ares-red/30 shadow-[0_0_20px_rgba(255,30,30,0.4)]'
                            : 'bg-primary border-primary/20 shadow-lg shadow-primary/20'
                            }`}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </div>
                    </div>
                    <h2 className={`text-3xl font-black tracking-[0.15em] transition-colors uppercase ${isTronMode ? 'text-white font-["Orbitron"]' : 'text-slate-900'}`}>
                        {isTronMode ? 'INITIALIZE_ID' : 'Create account'}
                    </h2>
                    <p className={`mt-2 text-[0.7rem] font-bold transition-colors uppercase tracking-[0.25em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-600'}`}>
                        {isTronMode ? 'IDENTITY_SEQUENCING_IN_PROGRESS' : 'Join our professional network'}
                    </p>
                </div>

                {error && (
                    <div className={`p-3 rounded text-[0.65rem] border flex items-center gap-3 animate-shake transition-all ${isTronMode ? 'bg-ares-red/10 border-ares-red/30 text-ares-red font-["Share_Tech_Mono"] font-bold' : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        {isTronMode && <span className="mr-1">[FAILURE]:</span>} {error.toUpperCase()}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={`block text-[0.65rem] font-black uppercase transition-colors mb-2 tracking-[0.2em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700 font-semibold'}`}>
                                {isTronMode ? '// GIVEN_NAME' : 'First name'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className={`block w-full px-4 py-3 border transition-all ${isTronMode
                                    ? 'bg-ares-black/80 border-ares-red/30 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-xl shadow-sm'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                                placeholder={isTronMode ? "CORE_01" : "First name"}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={`block text-[0.65rem] font-black uppercase transition-colors mb-2 tracking-[0.2em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700 font-semibold'}`}>
                                {isTronMode ? '// SURNAME' : 'Last name'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className={`block w-full px-4 py-3 border transition-all ${isTronMode
                                    ? 'bg-ares-black/80 border-ares-red/30 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-xl shadow-sm'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                                placeholder={isTronMode ? "MOD_77" : "Last name"}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className={`block text-[0.65rem] font-black uppercase transition-colors mb-2 tracking-[0.2em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700 font-semibold'}`}>
                            {isTronMode ? '// ENTITY_ALIAS' : 'Username'}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className={`block w-full px-4 py-3 border transition-all ${isTronMode
                                ? 'bg-ares-black/80 border-ares-red/30 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-xl shadow-sm'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                            placeholder={isTronMode ? "user_node_99" : "Enter username"}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className={`block text-xs font-semibold uppercase transition-colors ${isTronMode ? 'text-slate-400 font-mono tracking-widest' : 'text-slate-700'}`}>
                            {isTronMode ? 'Comm Link' : 'Email'}
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-1 transition-all ${isTronMode
                                ? 'bg-ares-black/50 border-dark-border text-white focus:border-ares-red focus:ring-ares-red placeholder:text-slate-600 font-mono'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400'
                                }`}
                            placeholder={isTronMode ? "user@grid.com" : "email@example.com"}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className={`block text-[0.65rem] font-black uppercase transition-colors mb-2 tracking-[0.2em] ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-700 font-semibold'}`}>
                            {isTronMode ? '// ACCESS_CODE' : 'Password'}
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`block w-full px-4 py-3 border transition-all ${isTronMode
                                ? 'bg-ares-black/80 border-ares-red/30 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"]'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-xl shadow-sm'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 85%, 98% 100%, 0 100%, 0 15%)' } : {}}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 ${isTronMode
                            ? 'bg-ares-red text-white shadow-[0_0_15px_rgba(255,30,30,0.5)]'
                            : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark font-bold'
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            isTronMode ? 'Confirm Access' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className={`text-[0.7rem] font-bold transition-colors uppercase tracking-[0.1em] ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-600'}`}>
                        {isTronMode ? 'IDENTITY_STORED_IN_MEMORY?' : 'Already have an account?'} {' '}
                        <Link href={`/${country}/${lang}/admin/signin`} className={`font-black tracking-widest transition-all ${isTronMode ? 'text-neon-cyan hover:text-white underline decoration-neon-cyan/30 underline-offset-4' : 'text-primary hover:text-primary-dark underline underline-offset-4 decoration-primary/30'}`}>
                            {isTronMode ? 'TERMINAL_SIGNIN' : 'Signin here'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
