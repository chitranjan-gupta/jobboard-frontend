"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useJobs } from '@/context/JobContext';
import { useCompanies } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';

const JobForm = () => {
    const params = useParams();
    const router = useRouter();
    const { addJob, updateJob, getJobById } = useJobs();
    const { companies } = useCompanies();
    const { isTronMode } = useTheme();

    const country = params.country || 'us';
    const lang = params.lang || 'en';
    const id = params.id;
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        companyId: '',
        location: '',
        locationType: 'Remote',
        jobType: 'Full-time',
        salary: '',
        currency: 'INR',
        tags: '',
        description: '',
        requirements: '',
        expiryDate: '',
        apply_url: ''
    });

    const getJobByIdRef = useRef(getJobById);

    useEffect(() => {
        if (isEditing) {
            const existingJob = getJobByIdRef.current(id);
            if (existingJob) {
                setFormData({
                    ...existingJob,
                    tags: Array.isArray(existingJob.tags) ? existingJob.tags.join(', ') : existingJob.tags,
                    requirements: Array.isArray(existingJob.requirements) ? existingJob.requirements.join('\n') : existingJob.requirements,
                    expiryDate: existingJob.expiryDate ? new Date(existingJob.expiryDate).toISOString().slice(0, 10) : ''
                });
            } else {
                router.push(`/${country}/${lang}/admin/dashboard`);
            }
        }
    }, [id, isEditing, router, country, lang]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submittedData = {
            ...formData,
            companyId: parseInt(formData.companyId, 10),
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
            expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
        };

        try {
            if (isEditing) {
                await updateJob(parseInt(id, 10), submittedData);
            } else {
                await addJob(submittedData);
            }
            router.push(`/${country}/${lang}/admin/dashboard`);
        } catch (error) {
            alert('Failed to save job. Please check your inputs.');
            console.error(error);
        }
    };

    return (
        <div className={`max-w-3xl mx-auto pb-12 ${isTronMode ? 'font-mono' : ''}`}>
            <div className="flex items-center gap-4 mb-10 border-b pb-6 border-slate-200" style={isTronMode ? { borderColor: 'rgba(255,30,30,0.3)' } : {}}>
                <Link href={`/${country}/${lang}/admin/dashboard`} className={`p-2 rounded transition-all duration-300 border border-transparent ${isTronMode
                    ? 'hover:bg-ares-red/10 text-slate-400 hover:text-ares-red hover:shadow-[0_0_15px_rgba(255,30,30,0.3)] hover:border-ares-red/30'
                    : 'bg-white text-slate-500 hover:text-slate-900 shadow-sm border-slate-200'
                    }`} style={isTronMode ? { clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' } : {}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] relative ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                    {isEditing
                        ? (isTronMode ? 'RECONFIGURE_NODE' : 'Edit Job Posting')
                        : (isTronMode ? 'INITIALIZE_NEW_NODE' : 'Add New Job')}
                    {isTronMode && <div className="absolute -bottom-6 left-0 w-1/2 h-1 bg-ares-red shadow-[0_0_10px_rgba(255,30,30,1)]"></div>}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-8 p-6 sm:p-10 border relative transition-all duration-300 ${isTronMode
                ? 'glass-panel border-dark-border/50 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
                : 'bg-white rounded-2xl border-slate-200 shadow-xl'
                }`}
                style={isTronMode ? { clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)' } : {}}
            >
                {isTronMode && <div className="absolute top-0 right-0 w-1 h-32 bg-neon-cyan shadow-[0_0_15px_rgba(0,243,254,0.8)]"></div>}

                <div className="space-y-6">
                    <h2 className={`text-lg font-black uppercase tracking-[0.2em] border-b pb-3 ${isTronMode ? 'text-white font-["Orbitron"] border-dark-border drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-slate-800 border-slate-100 font-bold'}`}>
                        {isTronMode ? '// CORE_PARAMETERS' : 'Job Information'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// DESIGNATION_[TITLE] *' : 'Job Title *'}
                            </label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                placeholder={isTronMode ? "> ENTER_DESIGNATION" : "Software Engineer"} />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// SECTOR_[COMPANY] *' : 'Company *'}
                            </label>
                            <div className="relative">
                                <select name="companyId" required value={formData.companyId} onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded appearance-none transition-all ${isTronMode
                                        ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                        }`} style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}>
                                    <option value="" disabled className={isTronMode ? "bg-ares-black text-slate-500 font-mono" : ""}>
                                        {isTronMode ? '> SELECT_NETWORK_SECTOR' : 'Select a company'}
                                    </option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id} className={isTronMode ? "bg-ares-black text-neon-cyan font-mono" : ""}>
                                            {c.name} {c.status === 'pending' ? (isTronMode ? '[UNVERIFIED]' : '(Pending Approval)') : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                            {companies.length === 0 && (
                                <p className={`text-xs mt-2 font-bold tracking-widest uppercase ${isTronMode ? 'text-ares-red' : 'text-red-500'}`}>
                                    {isTronMode ? '⚠ NO SECTORS DETECTED. REGISTER SECTOR FIRST.' : '⚠ No companies found. Please add a company first.'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Coordinates (Location) *' : 'Location *'}
                            </label>
                            <input type="text" name="location" required value={formData.location} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                placeholder={isTronMode ? "e.g. Grid Sector 7G" : "e.g. New York, NY"} />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Access Type *' : 'Location Type *'}
                            </label>
                            <div className="relative">
                                <select name="locationType" required value={formData.locationType} onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded appearance-none transition-all ${isTronMode
                                        ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                        }`}>
                                    <option value="Remote" className={isTronMode ? "bg-ares-black text-white" : ""}>{isTronMode ? 'Remote (Netrunner)' : 'Remote'}</option>
                                    <option value="On-site" className={isTronMode ? "bg-ares-black text-white" : ""}>{isTronMode ? 'On-site (Physical)' : 'On-site'}</option>
                                    <option value="Hybrid" className={isTronMode ? "bg-ares-black text-white" : ""}>Hybrid</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Cycle Duration *' : 'Job Type *'}
                            </label>
                            <div className="relative">
                                <select name="jobType" required value={formData.jobType} onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded appearance-none transition-all ${isTronMode
                                        ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                        }`}>
                                    <option value="Full-time" className={isTronMode ? "bg-ares-black text-white" : ""}>Full-time</option>
                                    <option value="Part-time" className={isTronMode ? "bg-ares-black text-white" : ""}>Part-time</option>
                                    <option value="Contract" className={isTronMode ? "bg-ares-black text-white" : ""}>{isTronMode ? 'Contractor' : 'Contract'}</option>
                                    <option value="Freelance" className={isTronMode ? "bg-ares-black text-white" : ""}>{isTronMode ? 'Mercenary' : 'Freelance'}</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Currency *' : 'Currency *'}
                            </label>
                            <div className="relative">
                                <select name="currency" required value={formData.currency} onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded appearance-none transition-all ${isTronMode
                                        ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                        }`}>
                                    <option value="USD" className={isTronMode ? "bg-ares-black text-white" : ""}>USD ($)</option>
                                    <option value="EUR" className={isTronMode ? "bg-ares-black text-white" : ""}>EUR (€)</option>
                                    <option value="GBP" className={isTronMode ? "bg-ares-black text-white" : ""}>GBP (£)</option>
                                    <option value="INR" className={isTronMode ? "bg-ares-black text-white" : ""}>INR (₹)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Credit Allocation (Salary) *' : 'Salary Range *'}
                            </label>
                            <input type="text" name="salary" required value={formData.salary} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                placeholder={isTronMode ? "e.g. 120k - 150k" : "e.g. 120,000 - 150,000"} />
                        </div>

                        <div className="sm:col-span-1">
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Metadata Tags (CSV)' : 'Tags (comma separated)'}
                            </label>
                            <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                placeholder={isTronMode ? "e.g. REACT, NODE, CYBERNETICS" : "e.g. React, Node, SQL"} />
                        </div>

                        <div className="sm:col-span-1">
                            <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? 'Signal Expiration' : 'Expiry Date'}
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,254,0.3)] font-mono text-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// EXTERNAL_UPLINK (APPLY_URL)' : 'Application Link (URL)'}
                            </label>
                            <input type="url" name="apply_url" value={formData.apply_url} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                placeholder={isTronMode ? "> ENTER_UPLINK_PROTOCOL" : "https://company.com/apply"} />
                        </div>
                    </div>
                </div>

                <div className="space-y-5 pt-4">
                    <h2 className={`text-lg font-bold uppercase tracking-widest border-b pb-2 ${isTronMode ? 'text-white border-dark-border drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-slate-800 border-slate-100 font-bold'}`}>
                        {isTronMode ? 'Transmission Details' : 'Job Description & Requirements'}
                    </h2>

                    <div>
                        <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                            {isTronMode ? '// OPERATION_DESCRIPTION *' : 'Description *'}
                        </label>
                        <textarea name="description" required rows="4" value={formData.description} onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded transition-all resize-y ${isTronMode
                                ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                        ></textarea>
                    </div>

                    <div>
                        <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                            {isTronMode ? '// PREREQUISITES_[ONE_PER_LINE] *' : 'Requirements (One per line) *'}
                        </label>
                        <textarea name="requirements" required rows="5" value={formData.requirements} onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded transition-all resize-y ${isTronMode
                                ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                }`}
                            style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                            placeholder={isTronMode ? "> MUST_PASS_INTEGRITY_CHECK...\n> CLASS_3_SECURITY_CLEARANCE..." : "Strong Java skills...\nExperience with AWS..."}></textarea>
                    </div>
                </div>

                <div className={`pt-8 flex flex-col sm:flex-row items-center justify-end gap-5 border-t ${isTronMode ? 'border-dark-border' : 'border-slate-100'}`}>
                    <Link href={`/${country}/${lang}/admin/dashboard`} className={`w-full sm:w-auto uppercase tracking-[0.2em] px-8 py-4 text-xs font-black transition-all duration-300 text-center ${isTronMode
                        ? 'text-slate-400 hover:text-white hover:bg-ares-black border border-transparent hover:border-dark-border'
                        : 'rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        style={isTronMode ? { clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' } : {}}
                    >
                        {isTronMode ? 'ABORT' : 'Cancel'}
                    </Link>
                    <button type="submit" className={`w-full sm:w-auto uppercase tracking-[0.2em] px-10 py-4 text-xs font-black transition-all duration-300 relative group overflow-hidden ${isTronMode
                        ? 'btn-outline border-none bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,243,254,0.3)] hover:shadow-[0_0_30px_rgba(0,243,254,0.5)]'
                        : 'btn-primary rounded-xl shadow-md text-white'
                        }`}>
                        {isTronMode && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
                        <span className="relative z-10">{isEditing
                            ? (isTronMode ? '> COMMIT_CONFIG' : 'Update Job')
                            : (isTronMode ? '> EXECUTE_INIT' : 'Create Job')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobForm;
