"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useCompanies } from '@/context/CompanyContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import PaginationControls from '@/components/PaginationControls';
import Image from 'next/image';

export default function CompaniesDashboardPage() {
    const { companies, loading, deleteCompany, approveCompany, rejectCompany, uploadCompaniesCSV, totalCount, fetchCompanies } = useCompanies();
    const { user } = useAuth();
    const { isTronMode } = useTheme();
    const router = useRouter();
    const params = useParams();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const country = params.country || 'us';
    const lang = params.lang || 'en';
    const isAdmin = user?.role === 'admin';

    const getStatusStyles = (status) => {
        const styles = {
            approved: isTronMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
            pending: isTronMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200',
            rejected: isTronMode ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
        };
        return styles[status] || styles.pending;
    };

    const getStatusLabel = (status) => {
        if (!isTronMode) {
            const labels = {
                approved: 'APPROVED',
                pending: 'PENDING',
                rejected: 'REJECTED',
            };
            return labels[status] || status.toUpperCase();
        }
        const labels = {
            approved: '✅ ONLINE',
            pending: '⏳ PENDING TRACE',
            rejected: '❌ DENIED',
        };
        return labels[status] || status.toUpperCase();
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this company? This will also remove associated jobs. This cannot be undone.')) deleteCompany(id);
    };

    const handleApprove = async (id) => {
        try { await approveCompany(id); }
        catch { alert('Failed to approve company.'); }
    };

    const handleReject = async (id) => {
        if (window.confirm('Reject this company listing?')) {
            try { await rejectCompany(id); }
            catch { alert('Failed to reject company.'); }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadCompaniesCSV(file);
            let msg = `Bulk Upload Complete!\n\nAdded: ${result.added}\nSkipped: ${result.skipped}`;
            
            if (result.skipped_details && result.skipped_details.length > 0) {
                console.log('Skipped Items:', result.skipped_details);
                msg += `\n\nCheck console for skipped item details/reasons.`;
            }
            
            if (result.errors && result.errors.length > 0) {
                msg += `\nErrors: ${result.errors.length} failed.`;
                console.error('Bulk Upload Errors:', result.errors);
            }
            alert(msg);
        } catch (error) {
            alert(error.message || 'Failed to bulk upload companies.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const pendingCount = companies.filter(c => c.status === 'pending').length;

    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

    useEffect(() => {
        fetchCompanies(`/companies/?page=${currentPage}`);
    }, [currentPage, fetchCompanies]);

    if (loading && companies.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'}`}></div>
            </div>
        );
    }

    return (
        <div>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b pb-4 ${isTronMode ? 'font-mono border-ares-red/30' : 'border-slate-200'}`}>
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-black mb-1 flex items-center gap-3 tracking-[0.2em] uppercase ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                        {isTronMode ? 'SECTOR_DB' : 'Companies'}
                        {pendingCount > 0 && (
                            <span className={`text-[0.6rem] font-black px-2 py-1 flex items-center gap-1 rounded tracking-[0.2em] border shadow-inner ${isTronMode ? 'bg-amber-500/10 text-amber-400 font-["Share_Tech_Mono"] border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                {isTronMode && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>}
                                [{pendingCount}] {isTronMode ? 'PENDING_TRACE' : 'PENDING'}
                            </span>
                        )}
                    </h1>
                    <p className={`text-[0.7rem] sm:text-sm font-bold tracking-[0.1em] uppercase ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-500'}`}>
                        {isTronMode ? '// CORPORATE_INDEXES_AND_AFFILIATIONS' : 'Manage all companies and corporate entities in the system.'}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className={`flex items-center gap-2 uppercase tracking-[0.2em] text-[0.7rem] font-black disabled:opacity-50 transition-all duration-300 ${isTronMode ? 'btn-outline border-slate-700 text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 px-4 py-2.5' : 'px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                    >
                        {uploading ? (
                            <div className={`w-4 h-4 border-2 rounded-full animate-spin ${isTronMode ? 'border-neon-cyan border-t-transparent' : 'border-primary border-t-transparent'}`}></div>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        )}
                        {isTronMode ? 'LOAD_BATCH_[CSV]' : 'Bulk Upload'}
                    </button>

                    <Link href={`/${country}/${lang}/admin/companies/new`} className={`shrink-0 uppercase font-black text-[0.8rem] transition-all duration-300 ${isTronMode ? 'btn-outline border-none text-neon-cyan tracking-[0.2em] bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,254,0.3)] px-6 py-2.5' : 'btn-primary px-6 py-2.5 shadow-md rounded-xl text-white'}`}>
                        {isTronMode ? '> REGISTER_SECTOR' : '+ Add Company'}
                    </Link>
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${isTronMode ? 'glass-panel border-2 border-ares-red/30 shadow-[0_0_30px_rgba(255,30,30,0.15)] relative' : 'bg-white rounded-2xl border border-slate-200 shadow-xl'}`}
                style={isTronMode ? { clipPath: 'polygon(2% 0, 100% 0, 100% 98%, 98% 100%, 0 100%, 0 2%)' } : {}}
            >
                {isTronMode && <div className="absolute top-0 right-10 w-32 h-1 bg-ares-red/50 shadow-[0_0_10px_rgba(255,30,30,0.8)] animate-pulse"></div>}
                <div className="overflow-x-auto">
                    <table className={`w-full text-left border-collapse ${isTronMode ? 'font-["Share_Tech_Mono"]' : ''}`}>
                        <thead>
                            <tr className={`border-b ${isTronMode ? 'bg-ares-black/90 border-ares-red/30 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// SECTOR_SIGNATURE' : 'Company Name'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// UPLINK' : 'Website'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// STATE' : 'Status'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] text-right ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// OVERRIDES' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isTronMode ? 'divide-ares-red/10 bg-ares-black/50' : 'divide-slate-100'}`}>
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className={`py-12 text-center uppercase tracking-wider ${isTronMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {isTronMode ? 'No registered sectors. Initialize via Register or Batch Load.' : 'No companies found. Add one manually or upload a CSV.'}
                                    </td>
                                </tr>
                            ) : companies.map((company) => (
                                <tr key={company.id} className={`transition-colors ${isTronMode
                                    ? `hover:bg-neon-cyan/5 ${company.status === 'pending' ? 'bg-amber-500/5' : company.status === 'rejected' ? 'bg-red-500/5 opacity-60' : ''}`
                                    : `hover:bg-slate-50 ${company.status === 'pending' ? 'bg-amber-50/30' : company.status === 'rejected' ? 'bg-red-50/30 opacity-70' : ''}`
                                    }`}>
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center gap-4">
                                            {company.logoUrl ? (
                                                <Image unoptimized width={40} height={40} src={company.logoUrl} alt="" className={`w-10 h-10 rounded object-cover border ${isTronMode ? 'border-ares-red/30 shadow-[0_0_10px_rgba(255,30,30,0.2)]' : 'border-slate-200'}`} style={isTronMode ? { clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' } : {}} />
                                            ) : (
                                                <div className={`w-10 h-10 rounded border flex items-center justify-center font-black text-lg uppercase ${isTronMode ? 'bg-ares-black border-ares-red/30 text-neon-cyan shadow-[0_0_10px_rgba(0,243,254,0.2)]' : 'bg-slate-100 border-slate-200 text-slate-500'}`} style={isTronMode ? { clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' } : {}}>
                                                    {company.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`font-black uppercase tracking-[0.1em] text-[0.95rem] ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>{company.name}</div>
                                                {company.submittedBy && (
                                                    <div className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] mt-1 ${isTronMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {isTronMode ? 'ORIGIN:' : 'By:'} <span className={isTronMode ? 'text-neon-cyan/70' : 'text-primary font-bold'}>[{company.submittedBy}]</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold tracking-widest transition-colors truncate max-w-[200px] block ${isTronMode ? 'text-neon-cyan hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'text-primary hover:underline'}`}>
                                                {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : (
                                            <span className={`text-[0.7rem] font-black tracking-widest ${isTronMode ? 'text-slate-600' : 'text-slate-400'}`}>{isTronMode ? 'NULL' : 'None'}</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-5 align-middle">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded flex w-fit items-center border shadow-inner tracking-widest ${getStatusStyles(company.status)}`}>
                                            {getStatusLabel(company.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 align-middle text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {/* Approve / Reject (admin only, pending) */}
                                            {isAdmin && company.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(company.id)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                                            : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                                                            }`}>
                                                        {isTronMode ? 'Accept' : 'Approve'}
                                                    </button>
                                                    <button onClick={() => handleReject(company.id)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-ares-red/10 text-ares-red border-ares-red/50 hover:bg-ares-red/30 shadow-[0_0_10px_rgba(255,30,30,0.2)]'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                            }`}>
                                                        {isTronMode ? 'Reject' : 'Deny'}
                                                    </button>
                                                </>
                                            )}

                                            {/* Edit */}
                                            <Link href={`/${country}/${lang}/admin/companies/${company.id}/edit`}
                                                className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                    ? 'text-slate-500 border-transparent hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_10px_rgba(0,243,254,0.3)]'
                                                    : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                                                    }`}
                                                title={isTronMode ? "Reconfigure" : "Edit Company"}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </Link>

                                            {/* Delete (admin only) */}
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(company.id)}
                                                    className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                        ? 'text-slate-500 border-transparent hover:border-ares-red/50 hover:text-ares-red hover:bg-ares-red/10 hover:shadow-[0_0_10px_rgba(255,30,30,0.3)]'
                                                        : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={isTronMode ? "Terminate" : "Delete Company"}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalCount || 0}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName={isTronMode ? 'SECTORS' : 'COMPANIES'}
            />
        </div >
    );
}
