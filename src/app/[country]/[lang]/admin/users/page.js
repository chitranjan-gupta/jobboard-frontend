"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function UserManagementPage() {
    const { user } = useAuth();
    const { isTronMode } = useTheme();
    const params = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchUsers = useCallback(async () => {
        if (!user?.access) return;
        setLoading(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.access}`,
            };
            const res = await fetch(`${API_BASE_URL}/auth/pending-users/`, { headers });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch { setUsers([]); }
        finally { setLoading(false); }
    }, [user?.access]);

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
        } finally { setActionLoading(null); }
    };

    const approve = (id, n) => doAction(`${API_BASE_URL}/auth/approve-user/${id}/`, 'POST', `${id}-approve`, `✅ ${n} approved!`);
    const reject = (id, n) => doAction(`${API_BASE_URL}/auth/reject-user/${id}/`, 'DELETE', `${id}-reject`, `❌ ${n} rejected.`);
    const revoke = (id, n) => doAction(`${API_BASE_URL}/auth/revoke-user/${id}/`, 'POST', `${id}-revoke`, `🔒 ${n}'s access revoked.`);
    const restore = (id, n) => doAction(`${API_BASE_URL}/auth/reapprove-user/${id}/`, 'POST', `${id}-restore`, `🔓 ${n}'s access restored.`);

    const pending = users.filter(u => u.status === 'pending');
    const active = users.filter(u => u.status === 'approved');
    const revoked = users.filter(u => u.status === 'revoked');
    const rejected = users.filter(u => u.status === 'rejected');

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

    const Sec = ({ icon, title, tronTitle, count, items, empty, children }) => (
        <section className={`mb-10 ${isTronMode ? 'font-mono' : ''}`}>
            <h2 className={`text-lg sm:text-xl font-black mb-5 flex items-center gap-3 uppercase tracking-[0.2em] relative pl-4 ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-800 font-bold'}`}>
                {isTronMode && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,254,0.6)]"></div>}
                <span className={isTronMode ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,254,0.8)]' : 'text-primary'}>{icon}</span>
                {isTronMode ? tronTitle : title}
                {count > 0 && (
                    <span className={`text-[0.7rem] font-black px-2.5 py-1 rounded shadow-inner border tracking-[0.1em] ${isTronMode
                        ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 shadow-[inset_0_0_10px_rgba(0,243,254,0.2)]'
                        : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                        {count}
                    </span>
                )}
            </h2>
            {items.length === 0
                ? <div className={`p-8 text-center text-xs font-black uppercase tracking-[0.2em] border ${isTronMode ? 'glass-panel border-ares-red/20 text-slate-500 shadow-[inset_0_0_20px_rgba(255,30,30,0.05)]' : 'bg-slate-50 border-slate-100 rounded-xl text-slate-400'}`} style={isTronMode ? { clipPath: 'polygon(1% 0, 100% 0, 100% 80%, 99% 100%, 0 100%, 0 20%)' } : {}}>{empty}</div>
                : <div className="space-y-4">{children}</div>}
        </section>
    );

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

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'}`} />
                </div>
            ) : (
                <>
                    {/* Pending */}
                    <Sec icon="⏳" title="Registration Requests" tronTitle="Clearance Requests" count={pending.length} items={pending} empty={isTronMode ? "No incoming access vectors detected." : "No pending registration requests."}>
                        {pending.map(u => (
                            <Row key={u.id} u={u}>
                                <Btn id={u.id} act={approve} label={isTronMode ? "Authorize" : "Approve"} name={u.username}
                                    style="bg-emerald-600 text-white hover:bg-emerald-700"
                                    tronStyle="bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                                <Btn id={u.id} act={reject} label={isTronMode ? "Deny" : "Reject"} name={u.username}
                                    style="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    tronStyle="bg-ares-red/10 text-ares-red border border-ares-red/50 hover:bg-ares-red/30 hover:shadow-[0_0_15px_rgba(255,30,30,0.4)]" />
                            </Row>
                        ))}
                    </Sec>

                    {/* Active */}
                    <Sec icon="✅" title="Active Users" tronTitle="Active Nodes" count={active.length} items={active} empty={isTronMode ? "No authorized sub-routines active." : "No active users found."}>
                        {active.map(u => (
                            <Row key={u.id} u={u}>
                                <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center shadow-inner mr-2 ${isTronMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 font-mono' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                    }`}>{isTronMode ? 'ONLINE' : 'ACTIVE'}</span>
                                <Btn id={u.id} act={revoke} label={isTronMode ? "Terminate" : "Revoke"} name={u.username}
                                    style="bg-white text-red-600 border border-red-200 hover:bg-red-50"
                                    tronStyle="bg-ares-black text-slate-400 border border-dark-border hover:bg-ares-red/10 hover:text-ares-red hover:border-ares-red/50 hover:shadow-[0_0_15px_rgba(255,30,30,0.3)]" />
                            </Row>
                        ))}
                    </Sec>

                    {/* Revoked */}
                    {revoked.length > 0 && (
                        <Sec icon="🔒" title="Revoked Users" tronTitle="Severed Connections" count={revoked.length} items={revoked} empty="">
                            {revoked.map(u => (
                                <Row key={u.id} u={u}>
                                    <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center mr-2 ${isTronMode ? 'text-slate-500 bg-slate-800/50 border-slate-700 font-mono' : 'text-slate-600 bg-slate-100 border-slate-300'
                                        }`}>{isTronMode ? 'OFFLINE' : 'REVOKED'}</span>
                                    <Btn id={u.id} act={restore} label={isTronMode ? "Restore" : "Re-approve"} name={u.username}
                                        style="bg-primary text-white hover:bg-primary-hover"
                                        tronStyle="bg-neon-cyan/5 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,254,0.3)]" />
                                </Row>
                            ))}
                        </Sec>
                    )}

                    {/* Rejected */}
                    {rejected.length > 0 && (
                        <Sec icon="❌" title="Rejected Users" tronTitle="Denied Vectors" count={rejected.length} items={rejected} empty="">
                            {rejected.map(u => (
                                <Row key={u.id} u={u}>
                                    <span className={`text-[10px] tracking-widest font-bold px-2 py-1 rounded border flex items-center ${isTronMode ? 'text-ares-red bg-ares-red/10 border-ares-red/30 font-mono' : 'text-red-700 bg-red-50 border-red-200'
                                        }`}>{isTronMode ? 'DENIED' : 'REJECTED'}</span>
                                </Row>
                            ))}
                        </Sec>
                    )}
                </>
            )}
        </div>
    );
}
