"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ProfileSettingsPage() {
    const { user } = useAuth();
    const { isTronMode } = useTheme();
    const [form, setForm] = useState({ displayName: '', bio: '', profileUrl: '', avatarUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    useEffect(() => {
        if (!user?.access) return;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access}`,
        };
        fetch(`${API_BASE_URL}/auth/profile/`, { headers })
            .then(r => r.json())
            .then(d => setForm({ 
                displayName: d.displayName || '', 
                bio: d.bio || '', 
                profileUrl: d.profileUrl || '', 
                avatarUrl: d.avatarUrl || '' 
            }))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user?.access]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.access}`,
            };
            const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(form),
            });
            if (res.ok) showToast('✅ Profile saved!');
            else showToast('❌ Failed to save profile.');
        } finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'}`} />
        </div>
    );

    return (
        <div className={`max-w-xl ${isTronMode ? 'font-mono' : ''}`}>
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] px-5 py-3 shadow-lg text-sm font-bold uppercase tracking-widest border border-transparent rounded-lg animate-in slide-in-from-top duration-300 ${isTronMode
                    ? 'glass-panel border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_rgba(0,243,254,0.4)] font-mono'
                    : 'bg-slate-900 text-white shadow-xl'
                    }`}>
                    {toast}
                </div>
            )}

            <div className={`mb-10 border-b pb-6 ${isTronMode ? 'font-mono border-ares-red/30' : 'border-slate-200'}`}>
                <h1 className={`text-3xl font-black uppercase tracking-[0.2em] relative inline-block ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                    {isTronMode ? 'LOCAL_IDENTITY_PROTOCOL' : 'Profile Settings'}
                    {isTronMode && <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,254,1)]"></div>}
                </h1>
                <p className={`mt-4 text-[0.7rem] sm:text-sm font-bold tracking-[0.15em] uppercase ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-500 font-bold'}`}>
                    {isTronMode ? '// METADATA_ATTACHED_TO_INITIALIZED_NODES' : 'Manage your public profile information and settings.'}
                </p>
            </div>

            {/* Avatar preview */}
            <div className={`flex items-center gap-6 mb-10 p-6 border relative transition-all duration-300 ${isTronMode
                ? 'glass-panel border-ares-red/30 shadow-[0_0_20px_rgba(255,30,30,0.1)] hover:border-ares-red/50 hover:shadow-[0_0_30px_rgba(255,30,30,0.2)]'
                : 'bg-white rounded-xl border-slate-200 shadow-sm'
                }`}
                style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 80%, 98% 100%, 0 100%, 0 20%)' } : {}}
            >
                {isTronMode && <div className="absolute top-0 right-10 w-24 h-1 bg-ares-red/50 shadow-[0_0_10px_rgba(255,30,30,0.8)]"></div>}
                {form.avatarUrl ? (
                    <Image src={form.avatarUrl} alt="avatar" width={80} height={80} unoptimized className={`w-20 h-20 rounded object-cover border ${isTronMode ? 'border-neon-cyan/80 shadow-[0_0_15px_rgba(0,243,254,0.4)]' : 'border-slate-200 shadow-sm'}`} style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}} />
                ) : (
                    <div className={`w-20 h-20 rounded border flex items-center justify-center text-3xl font-black ${isTronMode
                        ? 'bg-ares-black border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_rgba(0,243,254,0.3)] font-["Orbitron"]'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                        style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}
                    >
                        {user?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                )}
                <div>
                    <p className={`font-black tracking-[0.2em] text-xl uppercase mb-1 ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>{form.displayName || user?.username}</p>
                    {form.profileUrl && (
                        <a href={form.profileUrl} target="_blank" rel="noreferrer"
                            className={`text-[0.7rem] font-bold tracking-[0.1em] transition-colors truncate block max-w-[250px] ${isTronMode ? 'text-neon-cyan hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,243,254,0.8)] font-["Share_Tech_Mono"]' : 'text-primary hover:underline'}`}>
                            {form.profileUrl}
                        </a>
                    )}
                </div>
            </div>

            <form onSubmit={handleSave} className={`space-y-6 p-8 border relative ${isTronMode
                ? 'glass-panel border-dark-border/50 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
                : 'bg-white rounded-xl border-slate-200 shadow-sm'
                }`}
                style={isTronMode ? { clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)' } : {}}
            >
                {isTronMode && <div className="absolute top-0 left-0 w-1 h-32 bg-neon-cyan shadow-[0_0_15px_rgba(0,243,254,0.8)]"></div>}

                <div>
                    <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                        {isTronMode ? '// IDENTITY_ALIAS' : 'Display Name'}
                    </label>
                    <input type="text" name="displayName" value={form.displayName} onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                            ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                        placeholder={isTronMode ? "> ENTER_ALIAS" : "Your name"} />
                </div>
                <div>
                    <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                        {isTronMode ? '// OPERATOR_MANIFEST_[BIO]' : 'Bio'}
                    </label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
                        className={`w-full px-4 py-3 border rounded transition-all resize-none ${isTronMode
                            ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                        placeholder={isTronMode ? "> DEFINE_OPERATIONAL_PARAMETERS..." : "Tell us about yourself..."} />
                </div>
                <div>
                    <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                        {isTronMode ? '// EXTERNAL_UPLINK_[URL]' : 'Website URL'}
                    </label>
                    <input type="url" name="profileUrl" value={form.profileUrl} onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                            ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                        placeholder={isTronMode ? "> HTTPS://..." : "https://..."} />
                </div>
                <div>
                    <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                        {isTronMode ? '// HOLOGRAM_SOURCE_[AVATAR_URL]' : 'Avatar URL'}
                    </label>
                    <input type="url" name="avatarUrl" value={form.avatarUrl} onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                            ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                        placeholder={isTronMode ? "> HTTPS://..." : "https://..."} />
                </div>

                <button type="submit" disabled={saving}
                    className={`w-full py-4 mt-6 uppercase tracking-[0.2em] font-black text-sm transition-all duration-300 disabled:opacity-60 relative group overflow-hidden ${isTronMode
                        ? 'btn-outline border-none bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,243,254,0.3)] hover:shadow-[0_0_30px_rgba(0,243,254,0.5)]'
                        : 'btn-primary rounded-xl shadow-md text-white'
                        }`}>
                    {isTronMode && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
                    <span className="relative z-10">{saving ? (isTronMode ? 'SYNCING_METADATA...' : 'SAVING...') : (isTronMode ? '> COMMIT_CHANGES' : 'Save Profile')}</span>
                </button>
            </form>
        </div>
    );
}
