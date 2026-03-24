"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCompanies } from '@/context/CompanyContext';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

const CompanyForm = () => {
    const params = useParams();
    const router = useRouter();
    const { addCompany, updateCompany, getCompanyById } = useCompanies();
    const { isTronMode } = useTheme();

    const country = params.country || 'us';
    const lang = params.lang || 'en';
    const id = params.id;
    const isEditing = Boolean(id);

    // Derive initial state synchronously if editing
    const [formData, setFormData] = useState(() => {
        if (isEditing) {
            const existingCompany = getCompanyById(id);
            if (existingCompany) {
                return {
                    name: existingCompany.name || '',
                    logoUrl: existingCompany.logoUrl || '',
                    website: existingCompany.website || '',
                    description: existingCompany.description || ''
                };
            }
        }
        return {
            name: '',
            logoUrl: '',
            website: '',
            description: ''
        };
    });

    useEffect(() => {
        if (isEditing) {
            const existingCompany = getCompanyById(id);
            if (!existingCompany) {
                router.push(`/${country}/${lang}/admin/companies`);
            }
        }
    }, [id, isEditing, router, country, lang, getCompanyById]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateLogo = () => {
        if (!formData.name) {
            alert("Please enter a company name first.");
            return;
        }
        const encodedName = encodeURIComponent(formData.name);
        setFormData(prev => ({
            ...prev,
            logoUrl: `https://ui-avatars.com/api/?name=${encodedName}&background=random`
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateCompany(parseInt(id, 10), formData);
            } else {
                await addCompany(formData);
            }
            router.push(`/${country}/${lang}/admin/companies`);
        } catch (err) {
            alert('Failed to save company profile.');
        }
    };

    return (
        <div className={`max-w-3xl mx-auto pb-12 ${isTronMode ? 'font-mono' : ''}`}>
            <div className="flex items-center gap-4 mb-10 border-b pb-6 border-slate-200" style={isTronMode ? { borderColor: 'rgba(255,30,30,0.3)' } : {}}>
                <Link href={`/${country}/${lang}/admin/companies`} className={`p-2 rounded transition-all duration-300 border border-transparent ${isTronMode
                    ? 'hover:bg-ares-red/10 text-slate-400 hover:text-ares-red hover:shadow-[0_0_15px_rgba(255,30,30,0.3)] hover:border-ares-red/30'
                    : 'bg-white text-slate-500 hover:text-slate-900 shadow-sm border-slate-200'
                    }`} style={isTronMode ? { clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' } : {}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] relative ${isTronMode ? 'text-white font-["Orbitron"] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-slate-900 font-bold'}`}>
                    {isEditing
                        ? (isTronMode ? 'RECONFIGURE_SECTOR' : 'Edit Company')
                        : (isTronMode ? 'REGISTER_SECTOR' : 'Add New Company')}
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
                        {isTronMode ? '// SECTOR_TELEMETRY' : 'Company Details'}
                    </h2>
                    <div className="grid grid-cols-1 gap-6">

                        <div>
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// SECTOR_DESIGNATION_[NAME] *' : 'Company Name *'}
                            </label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                placeholder={isTronMode ? "> ENTER_DESIGNATION" : "Acme Corp"} />
                        </div>

                        <div>
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// HOLOGRAM_UPLINK_[LOGO_URL]' : 'Logo URL'}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange}
                                    className={`flex-1 px-4 py-3 border rounded transition-all ${isTronMode
                                        ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                        }`}
                                    style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                    placeholder="https://..." />
                                <button type="button" onClick={handleGenerateLogo}
                                    className={`whitespace-nowrap px-4 py-3 uppercase tracking-[0.15em] font-black transition-all ${isTronMode
                                        ? 'btn-outline border-slate-700 text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-xs'
                                        : 'px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm'
                                        }`}>
                                    {isTronMode ? '> GEN_SYNTH_LOGO' : 'Generate Placeholder'}
                                </button>
                            </div>
                            {formData.logoUrl && (
                                <div className={`mt-4 flex items-center gap-4 p-4 rounded border w-fit shadow-inner ${isTronMode
                                    ? 'bg-neon-cyan/5 border-neon-cyan/30'
                                    : 'bg-slate-50 border-slate-100'
                                    }`}>
                                    <span className={`text-[0.65rem] uppercase tracking-[0.2em] font-black ${isTronMode ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,254,0.4)]' : 'text-slate-500 font-bold'}`}>{isTronMode ? '// PREVIEW:' : 'PREVIEW:'}</span>
                                    <Image unoptimized width={48} height={48} src={formData.logoUrl} alt="Logo Preview" className={`w-12 h-12 rounded border object-cover ${isTronMode ? 'border-neon-cyan shadow-[0_0_10px_rgba(0,243,254,0.4)] bg-ares-black' : 'border-slate-200 bg-white'}`} style={isTronMode ? { clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' } : {}} />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// GLOBAL_NETWORK_[WEBSITE_URL]' : 'Website URL'}
                            </label>
                            <input type="url" name="website" value={formData.website} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                placeholder="https://..." />
                        </div>

                        <div>
                            <label className={`block text-[0.65rem] font-black mb-2 uppercase tracking-[0.2em] ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"] drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]' : 'text-slate-600 font-bold'}`}>
                                {isTronMode ? '// ENTITY_CHARTER_[DESCRIPTION]' : 'Company Description'}
                            </label>
                            <textarea name="description" rows="5" value={formData.description} onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded transition-all resize-y ${isTronMode
                                    ? 'bg-ares-black/50 border-dark-border text-white focus:outline-none focus:border-neon-cyan focus:shadow-[inset_0_0_15px_rgba(0,243,254,0.2)] focus:bg-neon-cyan/5 font-["Share_Tech_Mono"] tracking-widest'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-base'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                placeholder={isTronMode ? "> PROVIDE_CORPORATE_DIRECTIVES..." : "Describe the company..."}></textarea>
                        </div>
                    </div>
                </div>

                <div className={`pt-8 flex flex-col sm:flex-row items-center justify-end gap-5 border-t ${isTronMode ? 'border-dark-border' : 'border-slate-100'}`}>
                    <Link href={`/${country}/${lang}/admin/companies`} className={`w-full sm:w-auto uppercase tracking-[0.2em] px-8 py-4 text-xs font-black transition-all duration-300 text-center ${isTronMode
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
                            ? (isTronMode ? '> COMMIT_CONFIG' : 'Update Company')
                            : (isTronMode ? '> EXECUTE_INIT' : 'Create Company')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;
