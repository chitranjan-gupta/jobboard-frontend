"use client";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const FilterSidebar = ({ query, setQuery, types, setTypes, locations, setLocations }) => {
    const { isTronMode } = useTheme();
    const { t } = useTranslation();

    const handleTypeChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) setTypes([...types, value]);
        else setTypes(types.filter(t => t !== value));
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) setLocations([...locations, value]);
        else setLocations(locations.filter(l => l !== value));
    };

    return (
        <aside className={`w-full lg:w-[280px] shrink-0 p-6 lg:sticky lg:top-24 self-start flex flex-col gap-6 sm:flex-row sm:flex-wrap lg:flex-col group transition-all duration-300 ${isTronMode
            ? 'glass-panel border-2 border-ares-red/30 shadow-[inset_0_0_15px_rgba(255,30,30,0.1)]'
            : 'bg-white shadow-sm border border-slate-200 rounded-xl'
            }`}
            style={isTronMode ? { clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' } : {}}
        >
            <div className={`absolute top-0 right-4 w-12 h-1 bg-ares-red/50 shadow-[0_0_8px_rgba(255,30,30,0.8)] ${isTronMode ? 'block' : 'hidden'}`}></div>
            <div className={`absolute bottom-0 left-4 w-8 h-1 bg-ares-red/50 shadow-[0_0_8px_rgba(255,30,30,0.8)] ${isTronMode ? 'block' : 'hidden'}`}></div>

            <div className="flex-1 min-w-[200px] lg:w-full lg:flex-none relative z-10">
                <h3 className={`text-[0.7rem] font-black tracking-[0.2em] mb-4 uppercase ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-900 font-bold'}`}>
                    {isTronMode ? '// IDENTITY_QUERY' : t('sidebar.search')}
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={isTronMode ? "INPUT_PARAMETERS..." : t('sidebar.search_placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                        className={`w-full px-4 py-3 border text-sm transition-all duration-300 shadow-inner ${isTronMode
                            ? 'border-ares-red/40 bg-ares-black/80 text-white focus:border-ares-red focus:ring-1 focus:ring-ares-red/50 placeholder:text-slate-700 font-["Share_Tech_Mono"] tracking-wider'
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 rounded-lg'
                            }`}
                        style={isTronMode ? { clipPath: 'polygon(3% 0, 100% 0, 100% 85%, 97% 100%, 0 100%, 0 15%)' } : {}}
                    />
                </div>
            </div>

            <div className="flex-1 min-w-[200px] lg:w-full lg:flex-none">
                <h3 className={`text-[0.7rem] font-black tracking-[0.2em] mb-4 uppercase ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-800'}`}>
                    {isTronMode ? '// CLASS_OVERRIDE' : t('sidebar.job_type')}
                </h3>
                {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                    <label key={type} className={`flex items-center gap-3 mb-3 cursor-pointer text-sm transition-colors select-none group/checkbox ${isTronMode ? 'text-slate-400 hover:text-white font-["Share_Tech_Mono"] tracking-widest uppercase text-[0.75rem]' : 'text-slate-700 hover:text-primary font-medium'
                        }`}>
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                value={type}
                                checked={types.includes(type)}
                                onChange={handleTypeChange}
                                className={`peer appearance-none w-4 h-4 border transition-all cursor-pointer ${isTronMode
                                    ? 'border-ares-red/40 bg-ares-black/50 checked:bg-ares-red/20 checked:border-ares-red checked:shadow-[0_0_10px_rgba(255,30,30,0.8)]'
                                    : 'border-slate-300 bg-white checked:bg-primary checked:border-primary shadow-sm group-hover/checkbox:border-primary rounded-sm'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}
                            />
                            <svg className={`absolute w-3 h-3 pointer-events-none hidden peer-checked:block left-0.5 top-0.5 ${isTronMode ? 'text-ares-red drop-shadow-[0_0_4px_rgba(255,30,30,1)]' : 'text-white'
                                }`} viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" stroke="currentColor"></path>
                            </svg>
                        </div>
                        {type}
                    </label>
                ))}
            </div>

            <div className="flex-1 min-w-[200px] lg:w-full lg:flex-none">
                <h3 className={`text-[0.7rem] font-black tracking-[0.2em] mb-4 uppercase ${isTronMode ? 'text-ares-red/80 font-["Share_Tech_Mono"]' : 'text-slate-900 font-bold'}`}>
                    {isTronMode ? '// SEC_COORDINATES' : t('sidebar.location')}
                </h3>
                {['Remote', 'On-site', 'Hybrid'].map(loc => (
                    <label key={loc} className={`flex items-center gap-3 mb-3 cursor-pointer text-sm transition-colors select-none group/checkbox ${isTronMode ? 'text-slate-400 hover:text-white font-["Share_Tech_Mono"] tracking-widest uppercase text-[0.75rem]' : 'text-slate-700 hover:text-primary font-medium'
                        }`}>
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                value={loc}
                                checked={locations.includes(loc)}
                                onChange={handleLocationChange}
                                className={`peer appearance-none w-4 h-4 border transition-all cursor-pointer ${isTronMode
                                    ? 'border-ares-red/40 bg-ares-black/50 checked:bg-ares-red/20 checked:border-ares-red checked:shadow-[0_0_10px_rgba(255,30,30,0.8)]'
                                    : 'border-slate-300 bg-white checked:bg-primary checked:border-primary shadow-sm group-hover/checkbox:border-primary rounded-sm'
                                    }`}
                                style={isTronMode ? { clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' } : {}}
                            />
                            <svg className={`absolute w-3 h-3 pointer-events-none hidden peer-checked:block left-0.5 top-0.5 ${isTronMode ? 'text-ares-red drop-shadow-[0_0_4px_rgba(255,30,30,1)]' : 'text-white'
                                }`} viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" stroke="currentColor"></path>
                            </svg>
                        </div>
                        {loc}
                    </label>
                ))}
            </div>
        </aside>
    );
};

export default FilterSidebar;
