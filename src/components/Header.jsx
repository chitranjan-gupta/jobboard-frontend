"use client";
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const { isTronMode } = useTheme();
    const { currency, changeCurrency } = useCurrency();
    const { t, i18n } = useTranslation();
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const country = params.country || 'us';
    const lang = params.lang || 'en';

    const handleCountryChange = (newCountry) => {
        const pathSegments = pathname.split('/').filter(Boolean);
        // Assuming path is /[country]/[lang]/...
        const remainingPath = pathSegments.slice(2).join('/');
        const newPath = `/${newCountry}/${lang}/${remainingPath}`;
        router.push(`${newPath}${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
    };

    const handleLangChange = (newLang) => {
        const pathSegments = pathname.split('/').filter(Boolean);
        const remainingPath = pathSegments.slice(2).join('/');
        const newPath = `/${country}/${newLang}/${remainingPath}`;
        router.push(`${newPath}${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
    };

    return (
        <header className={`flex flex-col sm:flex-row items-center justify-between py-5 mb-8 border-b sm:py-4 sm:mb-6 transition-colors duration-300 ${isTronMode ? 'border-dark-border bg-ares-black/50 backdrop-blur-md sticky top-0 z-50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4 sm:mb-0 text-2xl font-bold tracking-tight">
                {isTronMode ? (
                    <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ares-red drop-shadow-[0_0_12px_rgba(255,30,30,0.9)] animate-pulse">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-white font-black tracking-widest uppercase font-['Orbitron'] text-xl">
                            Ares<strong className="text-ares-red drop-shadow-[0_0_8px_rgba(255,30,30,0.6)]">Jobs</strong>
                        </span>
                    </>
                ) : (
                    <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="text-slate-800">Job<span className="text-primary">Board</span></span>
                    </>
                )}
            </div>

            <div className={`flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm sm:text-base ${isTronMode ? 'font-["Orbitron"] tracking-widest uppercase' : ''}`}>
                <Link href={`/${country}/${lang}/`} className={`font-medium transition-all duration-300 ${isTronMode ? 'text-slate-400 hover:text-ares-red hover:drop-shadow-[0_0_8px_rgba(255,30,30,0.6)]' : 'text-slate-600 hover:text-primary'}`}>
                    {isTronMode ? 'Find Nodes' : t('header.jobs')}
                </Link>
                <Link href={`/${country}/${lang}/companies`} className={`font-medium transition-all duration-300 ${isTronMode ? 'text-slate-400 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,254,0.6)]' : 'text-slate-600 hover:text-primary'}`}>
                    {isTronMode ? 'Sectors' : t('header.companies')}
                </Link>
                <Link href={`/${country}/${lang}/salaries`} className={`font-medium transition-all duration-300 ${isTronMode ? 'text-slate-400 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,243,254,0.6)]' : 'text-slate-600 hover:text-primary'}`}>
                    {isTronMode ? 'Data Streams' : t('header.salaries')}
                </Link>

                {/* Theme Toggle Switch */}
                <div className="ml-2 flex flex-row items-center gap-2">
                    <ThemeToggle variant="header" />

                    {/* Currency Dropdown */}
                    <div className={`flex gap-1 px-2 py-1 items-center transition-all duration-300 ${isTronMode ? 'bg-ares-black/80 border border-ares-red/40 shadow-[inset_0_0_10px_rgba(255,30,30,0.2)] hover:border-ares-red hover:shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'bg-slate-100 rounded shadow-inner'}`} style={isTronMode ? { clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' } : {}}>
                        <svg className={`w-3 h-3 ${isTronMode ? 'text-ares-red' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <select
                            aria-label="Currency"
                            value={currency}
                            onChange={(e) => changeCurrency(e.target.value)}
                            className={`bg-transparent outline-none cursor-pointer tracking-widest uppercase ${isTronMode ? 'text-neon-cyan text-[0.65rem] font-bold font-["Share_Tech_Mono"] border-none' : 'text-slate-600 border-none text-xs font-semibold'}`}
                        >
                            <option value="USD" className={isTronMode ? 'bg-ares-black text-white' : ''}>USD</option>
                            <option value="EUR" className={isTronMode ? 'bg-ares-black text-white' : ''}>EUR</option>
                            <option value="GBP" className={isTronMode ? 'bg-ares-black text-white' : ''}>GBP</option>
                            <option value="INR" className={isTronMode ? 'bg-ares-black text-white' : ''}>INR</option>
                        </select>
                    </div>

                    {/* Location Dropdown */}
                    <div className={`flex gap-1 px-2 py-1 items-center transition-all duration-300 ${isTronMode ? 'bg-ares-black/80 border border-ares-red/40 shadow-[inset_0_0_10px_rgba(255,30,30,0.2)] hover:border-ares-red hover:shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'bg-slate-100 rounded shadow-inner'}`}
                        style={isTronMode ? { clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' } : {}}>
                        <svg className={`w-3 h-3 ${isTronMode ? 'text-ares-red' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <select
                            aria-label="Country"
                            value={country}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            className={`bg-transparent outline-none cursor-pointer tracking-widest uppercase ${isTronMode ? 'text-neon-cyan text-[0.65rem] font-bold font-["Share_Tech_Mono"] border-none' : 'text-slate-600 border-none text-xs font-semibold'}`}
                        >
                            <option value="us" className={isTronMode ? 'bg-ares-black text-white' : ''}>USA</option>
                            <option value="gb" className={isTronMode ? 'bg-ares-black text-white' : ''}>UK</option>
                            <option value="es" className={isTronMode ? 'bg-ares-black text-white' : ''}>Spain</option>
                            <option value="mx" className={isTronMode ? 'bg-ares-black text-white' : ''}>Mexico</option>
                        </select>
                    </div>

                    {/* Language Dropdown */}
                    <div className={`flex gap-1 px-2 py-1 items-center transition-all duration-300 ${isTronMode ? 'bg-ares-black/80 border border-ares-red/40 shadow-[inset_0_0_10px_rgba(255,30,30,0.2)] hover:border-ares-red hover:shadow-[0_0_10px_rgba(255,30,30,0.4)]' : 'bg-slate-100 rounded shadow-inner'}`} style={isTronMode ? { clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' } : {}}>
                        <svg className={`w-3 h-3 ${isTronMode ? 'text-ares-red' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <select
                            aria-label="Language"
                            value={lang}
                            onChange={(e) => handleLangChange(e.target.value)}
                            className={`bg-transparent outline-none cursor-pointer tracking-widest uppercase ${isTronMode ? 'text-neon-cyan text-[0.65rem] font-bold font-["Share_Tech_Mono"] border-none' : 'text-slate-600 border-none text-xs font-semibold'}`}
                        >
                            <option value="en" className={isTronMode ? 'bg-ares-black text-white' : ''}>EN</option>
                            <option value="es" className={isTronMode ? 'bg-ares-black text-white' : ''}>ES</option>
                        </select>
                    </div>
                </div>

            </div>

            <div className="flex gap-4 mt-5 sm:mt-0 w-full sm:w-auto">
                <Link href={`/${country}/${lang}/admin/signin`} className={`btn btn-outline flex-1 sm:flex-none text-center ${isTronMode ? 'px-8 py-2.5 font-["Orbitron"]' : ''}`}>
                    {isTronMode ? 'Terminal' : t('header.signin')}
                </Link>
                <Link href={`/${country}/${lang}/admin/signup`} className={`btn btn-primary flex-1 sm:flex-none text-center ${isTronMode ? 'px-8 py-2.5 font-["Orbitron"]' : ''}`}>
                    {isTronMode ? 'Initialize' : t('header.admin', { defaultValue: 'Admin' })}
                </Link>
            </div>
        </header>
    );
};

export default Header;
