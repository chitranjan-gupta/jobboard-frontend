"use client";

import { useTheme } from "../context/ThemeContext";

export default function MainLayout({ children }) {
  const { isTronMode } = useTheme();

  return (
    <div className={`${isTronMode ? 'tron-ares-theme bg-ares-black text-slate-200' : 'bg-slate-50 text-slate-900'} min-h-screen selection:bg-ares-red/30 transition-colors duration-300`}>
      {children}
    </div>
  );
}
