"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useJobs } from '@/context/JobContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import JobDetailsModal from '@/components/JobDetailsModal';
import PaginationControls from '@/components/PaginationControls';
import Image from 'next/image';

export default function JobsDashboardPage() {
    const { jobs, loading, deleteJob, requestJobDeletion, approveJobDeletion, rejectJobDeletion, approveJob, rejectJob, totalCount, refreshJobs, uploadJobsCSV } = useJobs();
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
            pending_deletion: isTronMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200',
        };
        return styles[status] || styles.pending;
    };

    const getStatusLabel = (status) => {
        if (!isTronMode) {
            const labels = {
                approved: 'APPROVED',
                pending: 'PENDING',
                deleted: 'TERMINATED',
                pending_deletion: 'DELETION REQUEST',
            };
            return labels[status] || status.toUpperCase();
        }
        const labels = {
            approved: '✅ ONLINE',
            pending: '⏳ PENDING REVIEW',
            rejected: '❌ TERMINATED',
            pending_deletion: '🗑️ MARKED FOR DELETION',
        };
        return labels[status] || status.toUpperCase();
    };

    const [previewJob, setPreviewJob] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ isOpen: false, title: '', message: '', onConfirm: null, danger: false });

    const openConfirm = (title, message, onConfirm, danger = false) => {
        setConfirmAction({ isOpen: true, title, message, onConfirm, danger });
    };

    const closeConfirm = () => {
        setConfirmAction({ isOpen: false, title: '', message: '', onConfirm: null, danger: false });
    };

    const handleDelete = (id, e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openConfirm(
            'Delete Job Posting',
            'Are you sure you want to permanently delete this job? This action cannot be undone.',
            async () => {
                try { await deleteJob(id); }
                catch (err) { alert('Failed to delete job.'); }
            },
            true
        );
    };

    const handleRequestDelete = (id, e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openConfirm(
            'Request Deletion',
            'Are you sure you want to request deletion of this job? An admin must review and approve this request before it is permanently removed.',
            async () => {
                try { await requestJobDeletion(id); }
                catch (err) { alert('Failed to request deletion.'); }
            },
            true
        );
    };

    const handleApproveDelete = (id, e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openConfirm(
            'Approve Deletion',
            'Are you sure you want to approve this request? The job will be permanently removed from the database.',
            async () => {
                try { await approveJobDeletion(id); }
                catch (err) { alert('Failed to approve deletion.'); }
            },
            true
        );
    };

    const handleRejectDelete = async (id, e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        try { await rejectJobDeletion(id); }
        catch (err) { alert('Failed to reject deletion request.'); }
    };

    const handleApprove = async (id) => {
        try { await approveJob(id); }
        catch { alert('Failed to approve job.'); }
    };

    const handleReject = (id) => {
        openConfirm(
            'Reject Job Posting',
            'Are you sure you want to reject this job posting? It will remain in the database but will not be visible to the public.',
            async () => {
                try { await rejectJob(id); }
                catch { alert('Failed to reject job.'); }
            },
            true
        );
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadJobsCSV(file);
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
            alert(error.message || 'Failed to bulk upload jobs.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const pendingCount = jobs.filter(j => j.status === 'pending').length;

    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

    useEffect(() => {
        refreshJobs(`/jobs/?page=${currentPage}`);
    }, [currentPage, refreshJobs]);

    if (loading && jobs.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isTronMode ? 'border-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,254,0.8)]' : 'border-primary'}`}></div>
            </div>
        );
    }

    return (
        <div>
            {/* Preview Modal */}
            {previewJob && (
                <div className="fixed inset-0 z-50">
                    {/* Banner above the modal */}
                    <div className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 text-white text-sm font-semibold py-2 px-4 shadow-lg uppercase tracking-wider ${isTronMode ? 'bg-ares-red shadow-[0_0_15px_rgba(255,30,30,0.6)] font-mono' : 'bg-primary'}`}>
                        <span>{isTronMode ? '👁 Hologram Preview — Projected Core View' : 'Preview Mode — High Fidelity View'}</span>
                        {isAdmin && previewJob.status === 'pending' && (
                            <button
                                onClick={async () => { await handleApprove(previewJob.id); setPreviewJob({ ...previewJob, status: 'approved' }); }}
                                className={`px-3 py-0.5 rounded text-xs font-bold transition-colors uppercase border ${isTronMode ? 'bg-ares-black text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/20 font-mono' : 'bg-white text-primary border-white hover:bg-white/90'}`}
                            >
                                {isTronMode ? 'Authorize' : 'Approve Now'}
                            </button>
                        )}
                    </div>
                    <JobDetailsModal job={previewJob} onClose={() => setPreviewJob(null)} />
                </div>
            )}

            {/* Global Confirmation Modal */}
            {confirmAction.isOpen && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md ${isTronMode ? 'bg-ares-black/80' : 'bg-slate-900/40'}`}>
                    <div className={`rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-full max-w-md ${isTronMode ? 'glass-panel border-dark-border shadow-[0_0_30px_rgba(255,30,30,0.2)]' : 'bg-white shadow-2xl border border-slate-200'}`}>
                        <div className={`p-5 border-b flex items-start gap-3 ${confirmAction.danger
                            ? (isTronMode ? 'border-ares-red/30 bg-ares-red/5' : 'border-red-100 bg-red-50/50')
                            : (isTronMode ? 'border-dark-border' : 'border-slate-100')
                            }`}>
                            {confirmAction.danger ? (
                                <div className={`p-2 rounded shrink-0 ${isTronMode ? 'bg-ares-red/20 text-ares-red shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'bg-red-100 text-red-600'}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                            ) : (
                                <div className={`p-2 rounded shrink-0 ${isTronMode ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,243,254,0.4)]' : 'bg-primary/10 text-primary'}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                            )}
                            <div>
                                <h3 className={`text-lg font-bold uppercase tracking-wider ${isTronMode ? 'text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-slate-900'}`}>{confirmAction.title}</h3>
                                <p className={`text-sm mt-1 ${isTronMode ? 'text-slate-400 font-mono' : 'text-slate-500'}`}>{confirmAction.message}</p>
                            </div>
                        </div>
                        <div className={`p-4 flex justify-end gap-3 ${isTronMode ? 'bg-ares-black/50 font-mono' : 'bg-slate-50'}`}>
                            <button
                                onClick={closeConfirm}
                                className={`px-4 py-2 text-sm font-bold rounded transition-all uppercase tracking-wider border ${isTronMode
                                    ? 'text-slate-400 bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white'
                                    : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                                    }`}
                            >
                                {isTronMode ? 'ABORT' : 'Cancel'}
                            </button>
                            <button
                                onClick={async () => {
                                    await confirmAction.onConfirm();
                                    closeConfirm();
                                }}
                                className={`px-4 py-2 text-sm font-bold text-white rounded transition-all shadow-md uppercase tracking-wider ${confirmAction.danger
                                    ? (isTronMode ? 'bg-ares-red/80 hover:bg-ares-red shadow-[0_0_15px_rgba(255,30,30,0.6)]' : 'bg-red-600 hover:bg-red-700')
                                    : (isTronMode ? 'bg-neon-cyan/80 hover:bg-neon-cyan shadow-[0_0_15px_rgba(0,243,254,0.6)]' : 'bg-primary hover:bg-primary-hover')
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTronMode ? 'focus:ring-offset-ares-black focus:ring-white' : 'focus:ring-primary'}`}
                            >
                                {isTronMode ? 'EXECUTE' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b pb-4 ${isTronMode ? 'font-mono border-ares-red/30' : 'border-slate-200'}`}>
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-black mb-1 flex items-center gap-3 tracking-[0.2em] uppercase ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                        {isTronMode ? 'GRID_NODES' : 'Job Postings'}
                        {pendingCount > 0 && (
                            <span className={`text-[0.6rem] font-black px-2 py-1 flex items-center gap-1 rounded tracking-[0.2em] border shadow-inner ${isTronMode ? 'bg-amber-500/10 text-amber-400 font-["Share_Tech_Mono"] border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                {isTronMode && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>}
                                [{pendingCount}] {isTronMode ? 'PENDING_REVIEW' : 'PENDING'}
                            </span>
                        )}
                    </h1>
                    <p className={`text-[0.7rem] sm:text-sm font-bold tracking-[0.1em] uppercase ${isTronMode ? 'text-slate-500 font-["Share_Tech_Mono"]' : 'text-slate-500'}`}>
                        {isTronMode ? '// MANAGE_OPEN_CONNECTION_POINTS' : 'Overview of all job listings submitted to the platform.'}
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

                    <Link href={`/${country}/${lang}/admin/jobs/new`} className={`shrink-0 uppercase font-black text-[0.8rem] transition-all duration-300 ${isTronMode ? 'btn-outline border-none text-neon-cyan tracking-[0.2em] bg-neon-cyan/10 hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,254,0.3)] px-6 py-2.5' : 'btn-primary px-6 py-2.5 shadow-md rounded-xl text-white'}`}>
                        {isTronMode ? '> INIT_NEW_NODE' : '+ Post New Job'}
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
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// DESIGNATION' : 'Job Title'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// SECTOR' : 'Company'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// SEC_COORDINATES' : 'Location'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// INIT_STATE' : 'Status'}</th>
                                <th className={`py-4 px-6 text-[0.65rem] font-black uppercase tracking-[0.2em] text-right ${isTronMode ? 'text-ares-red/80' : ''}`}>{isTronMode ? '// OVERRIDES' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isTronMode ? 'divide-ares-red/10 bg-ares-black/50' : 'divide-slate-100'}`}>
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className={`py-12 text-center uppercase tracking-wider ${isTronMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {isTronMode ? 'No active nodes mapping detected. Initialize new node to begin.' : 'No job postings found. Click the button above to create one.'}
                                    </td>
                                </tr>
                            ) : jobs.map((job) => (
                                <tr key={job.id} className={`transition-colors ${isTronMode
                                    ? `hover:bg-neon-cyan/5 ${job.status === 'pending' ? 'bg-amber-500/5' : job.status === 'rejected' ? 'bg-red-500/5 opacity-60' : job.status === 'pending_deletion' ? 'bg-orange-500/10' : ''}`
                                    : `hover:bg-slate-50 ${job.status === 'pending' ? 'bg-amber-50/30' : job.status === 'rejected' ? 'bg-red-50/30 opacity-70' : job.status === 'pending_deletion' ? 'bg-orange-50/30' : ''}`
                                    }`}>
                                    <td className="py-4 px-6 align-middle">
                                        <div className={`font-black mb-1 text-[0.95rem] tracking-[0.1em] uppercase ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>{job.title}</div>
                                        {job.submittedBy && (
                                            <div className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] ${isTronMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {isTronMode ? 'ORIGIN:' : 'By:'} <span className={isTronMode ? 'text-neon-cyan/70' : 'text-primary font-bold'}>[{job.submittedBy}]</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center gap-3">
                                            {job.companyLogo ? (
                                                <Image unoptimized width={32} height={32} src={job.companyLogo} alt="" className={`w-8 h-8 rounded object-cover border ${isTronMode ? 'border-ares-red/30 shadow-[0_0_10px_rgba(255,30,30,0.2)]' : 'border-slate-200'}`} style={isTronMode ? { clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' } : {}} />
                                            ) : (
                                                <div className={`w-8 h-8 rounded border flex items-center justify-center font-black text-xs uppercase ${isTronMode ? 'bg-ares-black border-ares-red/30 text-neon-cyan shadow-[0_0_10px_rgba(0,243,254,0.2)]' : 'bg-slate-100 border-slate-200 text-slate-500'}`} style={isTronMode ? { clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' } : {}}>
                                                    {job.company?.charAt(0) || '?'}
                                                </div>
                                            )}
                                            <span className={`font-black text-[0.85rem] uppercase tracking-[0.1em] ${isTronMode ? 'text-slate-200 font-["Orbitron"]' : 'text-slate-700 font-semibold'}`}>{job.company}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <div className={`text-[0.75rem] font-bold uppercase tracking-[0.15em] ${isTronMode ? 'text-slate-300' : 'text-slate-700'}`}>{job.location}</div>
                                        <div className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] ${isTronMode ? 'text-slate-500' : 'text-slate-500 mt-0.5'}`}>
                                            {isTronMode ? `[${job.jobType} :: ${job.locationType}]` : `${job.jobType} • ${job.locationType}`}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 align-middle">
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className={`text-[10px] font-bold px-2 py-1 flex items-center rounded border tracking-widest shadow-inner ${getStatusStyles(job.status)}`}>
                                                {getStatusLabel(job.status)}
                                            </span>
                                            {job.expiryDate && new Date(job.expiryDate) < new Date() && (
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-widest shadow-inner ${isTronMode ? 'bg-ares-red/10 text-ares-red border-ares-red/40' : 'bg-red-50 text-red-600 border-red-200'}`} title={`Expired on ${new Date(job.expiryDate).toLocaleDateString()}`}>
                                                    {isTronMode ? '⚠ SIGNAL LOST (EXPIRED)' : '⚠ EXPIRED'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 align-middle text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {isAdmin && job.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(job.id)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                                            : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                                                            }`}>
                                                        {isTronMode ? 'Grant' : 'Approve'}
                                                    </button>
                                                    <button onClick={() => handleReject(job.id)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-ares-red/10 text-ares-red border-ares-red/50 hover:bg-ares-red/30 shadow-[0_0_10px_rgba(255,30,30,0.2)]'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                            }`}>
                                                        {isTronMode ? 'Deny' : 'Reject'}
                                                    </button>
                                                </>
                                            )}

                                            {/* Preview */}
                                            <button onClick={() => setPreviewJob(job)}
                                                className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                    ? 'text-slate-500 border-transparent hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_10px_rgba(0,243,254,0.3)]'
                                                    : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                                                    }`}
                                                title={isTronMode ? "Preview Data Stream" : "View Preview"}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>

                                            {/* Approve / Reject Deletion (admin only) */}
                                            {isAdmin && job.status === 'pending_deletion' && (
                                                <>
                                                    <button onClick={(e) => handleApproveDelete(job.id, e)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-ares-red/10 text-ares-red border-ares-red/50 hover:bg-ares-red/30 shadow-[0_0_10px_rgba(255,30,30,0.2)]'
                                                            : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
                                                            }`}
                                                        title="Approve Deletion">
                                                        {isTronMode ? 'DEL' : 'DELETE'}
                                                    </button>
                                                    <button onClick={(e) => handleRejectDelete(job.id, e)}
                                                        className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors uppercase tracking-widest shadow-sm ${isTronMode
                                                            ? 'bg-slate-800 text-slate-300 border-dark-border hover:bg-slate-700'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                        title="Reject Deletion">
                                                        {isTronMode ? 'KEEP' : 'REJECT'}
                                                    </button>
                                                </>
                                            )}

                                            {/* Edit */}
                                            <Link href={`/${country}/${lang}/admin/jobs/${job.id}/edit`}
                                                className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                    ? 'text-slate-500 border-transparent hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_10px_rgba(0,243,254,0.3)]'
                                                    : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                                                    }`}
                                                title={isTronMode ? "Reconfigure" : "Edit Job"}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </Link>

                                            {/* Normal Delete for Admin */}
                                            {isAdmin && job.status !== 'pending_deletion' && (
                                                <button onClick={(e) => handleDelete(job.id, e)}
                                                    className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                        ? 'text-slate-500 border-transparent hover:border-ares-red/50 hover:text-ares-red hover:bg-ares-red/10 hover:shadow-[0_0_10px_rgba(255,30,30,0.3)]'
                                                        : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={isTronMode ? "Terminate (Immediate)" : "Delete Posting"}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            )}

                                            {/* Request Delete for Subadmin */}
                                            {!isAdmin && user && user.username === job.submittedBy && job.status !== 'pending_deletion' && (
                                                <button onClick={(e) => handleRequestDelete(job.id, e)}
                                                    className={`p-1.5 border rounded transition-all shadow-sm ${isTronMode
                                                        ? 'text-slate-500 border-transparent hover:border-orange-500/50 hover:text-orange-500 hover:bg-orange-500/10 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                                                        : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-orange-600 hover:bg-orange-50'
                                                        }`}
                                                    title={isTronMode ? "Request Termination" : "Request Deletion"}>
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
                itemName={isTronMode ? 'GRID_NODES' : 'JOBS'}
            />
        </div>
    );
}
