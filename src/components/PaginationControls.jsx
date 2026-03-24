"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function PaginationControls({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, itemName }) {
    const { isTronMode } = useTheme();

    if (totalPages <= 1) return null;

    return (
        <div className={`mt-6 flex items-center justify-between ${isTronMode ? 'border-t border-ares-red/30 pt-4' : 'border-t border-slate-200 pt-4'}`}>
            <div className={`text-xs font-medium uppercase tracking-widest ${isTronMode ? 'text-slate-400 font-["Share_Tech_Mono"]' : 'text-slate-500'}`}>
                {totalItems ? `Total: ${totalItems} ${itemName}` : ''} | PAGE {currentPage} OF {totalPages}
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                        isTronMode
                            ? 'bg-ares-black border-2 border-ares-red/40 text-ares-red hover:bg-ares-red hover:text-white font-["Orbitron"]'
                            : 'bg-white border-2 text-slate-700 hover:bg-slate-50 border-slate-300 rounded-md shadow-sm hover:border-primary/50'
                    }`}
                >
                    {isTronMode ? '< PREV_HACK' : 'Previous'}
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                        isTronMode
                            ? 'bg-ares-black border-2 border-ares-red/40 text-ares-red hover:bg-ares-red hover:text-white font-["Orbitron"]'
                            : 'bg-white border-2 text-slate-700 hover:bg-slate-50 border-slate-300 rounded-md shadow-sm hover:border-primary/50'
                    }`}
                >
                    {isTronMode ? 'NEXT_LINK >' : 'Next'}
                </button>
            </div>
        </div>
    );
}
