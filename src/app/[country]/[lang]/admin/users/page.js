"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import PaginationControls from '@/components/PaginationControls';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function UserManagementPage() {
    const { user } = useAuth();
    const { isTronMode } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState('');
    
    // Server-side state
    const [activeTab, setActiveTab] = useState('pending');
    const [localQuery, setLocalQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(localQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery]);

    const fetchUsers = useCallback(async () => {
        if (!user?.access) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.set('page', currentPage);
            queryParams.set('status', activeTab);
            if (debouncedQuery) queryParams.set('search', debouncedQuery);

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.access}`,
            };
            const res = await fetch(`${API_BASE_URL}/auth/users/?${queryParams.toString()}`, { headers });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            
            if (data && data.results !== undefined) {
                setUsers(data.results);
                setTotalCount(data.count);
            } else {
                setUsers(Array.isArray(data) ? data : []);
                setTotalCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [user?.access, currentPage, activeTab, debouncedQuery]);

    useEffect(() => { 
        if (user?.access) fetchUsers(); 
    }, [user?.access, fetchUsers]);

    const doAction = async (url, method, key, msg) => {
        setActionLoading(key);
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.access}`,
            };
            const res = await fetch(url, { method, headers });
            if (res.ok) { showToast(msg); fetchUsers(); }
            else {
                const errData = await res.json();
                showToast(`❌ Error: ${errData.detail || 'Action failed'}`);
            }
        } catch (err) {
            showToast(`❌ System error: ${err.message}`);
        } finally { setActionLoading(null); }
    };

    const approve = (id, n) => doAction(`${API_BASE_URL}/auth/approve-user/${id}/`, 'POST', `${id}-approve`, `✅ ${n} approved!`);
    const reject = (id, n) => doAction(`${API_BASE_URL}/auth/reject-user/${id}/`, 'DELETE', `${id}-reject`, `❌ ${n} rejected.`);
    const revoke = (id, n) => doAction(`${API_BASE_URL}/auth/revoke-user/${id}/`, 'POST', `${id}-revoke`, `🔒 ${n}'s access revoked.`);
    const restore = (id, n) => doAction(`${API_BASE_URL}/auth/reapprove-user/${id}/`, 'POST', `${id}-restore`, `🔓 ${n}'s access restored.`);
    const permanentlyDelete = (id, n) => {
        if (window.confirm(`${isTronMode ? 'CRITICAL_WARNING: PURGE_DATA_VECTOR [' : 'Warning: Are you sure you want to PERMANENTLY delete '}${n}${isTronMode ? ']? AUTH_RECORDS_ONLY_CONTENT_PRESERVED' : '? This will only remove their login account, their jobs/companies will remain.'}`)) {
            doAction(`${API_BASE_URL}/auth/delete-user/${id}/`, 'DELETE', `${id}-delete`, `🗑️ ${n} deleted.`);
        }
    };

    const Btn = ({ id, act, label, name, style, tronStyle }) => (
        <button onClick={() => act(id, name)} disabled={actionLoading?.startsWith(`${id}-`)}
            className={`px-3 py-1.5 text-xs font-bold rounded uppercase transition-all shadow-sm disabled:opacity-50 ${isTronMode ? `tracking-widest shadow-inner ${tronStyle}` : style}`}>
            {actionLoading === `${id}-${label.toLowerCase()}` ? '...' : label}
        </button>
    );

    const Row = ({ u, children }) => (
        <div className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group border relative ${isTronMode
            ? 'glass-panel border-2 border-ares-red/30 shadow-[0_0_15px_rgba(255,30,30,0.1)] hover:bg-neon-cyan/5 hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,243,254,0.2)]'
            : 'bg-white border-slate-200 rounded-xl shadow-sm hover:border-primary/30'
            }`}
            style={isTronMode ? { clipPath: 'polygon(1% 0, 100% 0, 100% 90%, 99% 100%, 0 100%, 0 10%)' } : {}}
        >
            {isTronMode && <div className="absolute top-0 right-5 w-16 h-0.5 bg-neon-cyan/50 shadow-[0_0_8px_rgba(0,243,254,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"></div>}
            <div>
                <p className={`font-black uppercase tracking-[0.2em] mb-1 ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>{u.username}</p>
                <p className={`text-sm font-bold tracking-widest ${isTronMode ? 'text-neon-cyan/90 font-mono' : 'text-primary'}`}>{u.email}</p>
                <p className={`text-[0.65rem] font-black tracking-[0.15em] mt-2 uppercase ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-400 font-bold'}`}>
                    {isTronMode ? 'TIMESTAMP:' : 'Requested:'} <span className={isTronMode ? 'text-slate-400' : ''}>[{new Date(u.requestedAt).toLocaleString()}]</span>
                </p>
            </div>
            <div className="flex gap-2 flex-wrap opacity-80 group-hover:opacity-100 transition-opacity">{children}</div>
        </div>
    );

    const tabs = [
        { id: 'pending', label: 'Pending', icon: '⏳', tron: 'CLEARANCE_REQUESTS' },
        { id: 'approved', label: 'Active', icon: '✅', tron: 'ACTIVE_NODES' },
        { id: 'revoked', label: 'Revoked', icon: '🔒', tron: 'SEVERED_CONNECTIONS' },
        { id: 'rejected', label: 'Rejected', icon: '❌', tron: 'DENIED_VECTORS' },
    ];

    return (
        <div>
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
                    {isTronMode ? 'ACCESS_CONTROL_PROTOCOL' : 'User Management'}
                    {isTronMode && <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,254,1)]"></div>}
                </h1>
                <p className={`mt-4 text-[0.7rem] sm:text-sm font-bold tracking-[0.15em] uppercase ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-500'}`}>
                    {isTronMode ? '// REVIEW_CLEARANCE_REQUESTS_AUTHORIZE_SUB_ROUTINES_AND_REVOKE_VECTORS' : 'Approve or reject sub-admin registration requests and manage active users.'}
                </p>
            </div>

            {/* Search and Tabs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex gap-2 p-1 rounded-lg bg-slate-100/50 dark:bg-ares-black/30 border border-slate-200 dark:border-ares-red/20 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? (isTronMode ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,243,254,0.2)]' : 'bg-primary text-white')
                                    : (isTronMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-600 hover:bg-slate-200')
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {isTronMode ? tab.tron : tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder={isTronMode ? "ID_SCAN..." : "Search user..."}
                        value={localQuery}
                        onChange={e => setLocalQuery(e.target.value)}
                        className={`w-full px-4 py-2 pl-10 border text-xs font-bold transition-all ${isTronMode
                                ? 'bg-ares-black/50 border-ares-red/30 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-mono tracking-wider'
                                : 'bg-white border-slate-200 rounded-lg focus:ring-primary focus:border-primary'
                            }`}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>

            {loading && users.length === 0 ? (
                <div className="flex items-center justify-center h-60">
                    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,254,0.8)]' : 'border-primary'}`} />
                </div>
            ) : (
                <div className={`space-y-4 mb-8 ${loading ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    {users.length === 0 ? (
                        <div className={`p-16 text-center text-xs font-black uppercase tracking-[0.2em] border ${isTronMode ? 'glass-panel border-ares-red/20 text-slate-500 shadow-[inset_0_0_20px_rgba(255,30,30,0.05)]' : 'bg-slate-50 border-slate-100 rounded-xl text-slate-400'}`} style={isTronMode ? { clipPath: 'polygon(1% 0, 100% 0, 100% 80%, 99% 100%, 0 100%, 0 20%)' } : {}}>
                            {isTronMode ? 'NO_DATA_VECTORS_FOUND_IN_THIS_SECTOR' : `No ${activeTab} users found.`}
                        </div>
                    ) : (
                        <>
                            {users.map(u => (
                                <Row key={u.id} u={u}>
                                    {activeTab === 'pending' && (
                                        <>
                                            <Btn id={u.id} act={approve} label={isTronMode ? "Authorize" : "Approve"} name={u.username}
                                                style="bg-emerald-600 text-white hover:bg-emerald-700"
                                                tronStyle="bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                                            <Btn id={u.id} act={reject} label={isTronMode ? "Deny" : "Reject"} name={u.username}
                                                style="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                                tronStyle="bg-ares-red/10 text-ares-red border border-ares-red/50 hover:bg-ares-red/30 hover:shadow-[0_0_15px_rgba(255,30,30,0.4)]" />
                                        </>
                                    )}
                                    {activeTab === 'approved' && (
                                        <>
                                            <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center shadow-inner mr-2 ${isTronMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 font-mono' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                                }`}>{isTronMode ? 'ONLINE' : 'ACTIVE'}</span>
                                            <Btn id={u.id} act={revoke} label={isTronMode ? "Terminate" : "Revoke"} name={u.username}
                                                style="bg-white text-red-600 border border-red-200 hover:bg-red-50"
                                                tronStyle="bg-ares-black text-slate-400 border border-dark-border hover:bg-ares-red/10 hover:text-ares-red hover:border-ares-red/50 hover:shadow-[0_0_15px_rgba(255,30,30,0.3)]" />
                                            <Btn id={u.id} act={permanentlyDelete} label={isTronMode ? "Purge" : "Delete"} name={u.username}
                                                style="bg-red-600 text-white hover:bg-red-700"
                                                tronStyle="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                                        </>
                                    )}
                                    {activeTab === 'revoked' && (
                                        <>
                                            <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center mr-2 ${isTronMode ? 'text-slate-500 bg-slate-800/50 border-slate-700 font-mono' : 'text-slate-600 bg-slate-100 border-slate-300'
                                                }`}>{isTronMode ? 'OFFLINE' : 'REVOKED'}</span>
                                            <Btn id={u.id} act={restore} label={isTronMode ? "Restore" : "Re-approve"} name={u.username}
                                                style="bg-primary text-white hover:bg-primary-hover"
                                                tronStyle="bg-neon-cyan/5 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,254,0.3)]" />
                                            <Btn id={u.id} act={permanentlyDelete} label={isTronMode ? "Purge" : "Delete"} name={u.username}
                                                style="bg-red-600 text-white hover:bg-red-700 ml-2"
                                                tronStyle="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                                        </>
                                    )}
                                    {activeTab === 'rejected' && (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center ${isTronMode ? 'text-ares-red bg-ares-red/10 border-ares-red/30 font-mono' : 'text-red-700 bg-red-50 border-red-200'
                                                }`}>{isTronMode ? 'DENIED' : 'REJECTED'}</span>
                                            <Btn id={u.id} act={permanentlyDelete} label={isTronMode ? "Purge" : "Delete"} name={u.username}
                                                style="bg-red-600 text-white hover:bg-red-700"
                                                tronStyle="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                                        </div>
                                    )}
                                </Row>
                            ))}
                            <div className="mt-8">
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
                                    onPageChange={setCurrentPage}
                                    totalItems={totalCount}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    itemName={isTronMode ? 'VECTORS' : 'USERS'}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
