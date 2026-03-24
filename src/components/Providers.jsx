"use client";

import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { CompanyProvider } from "../context/CompanyContext";
import { JobProvider } from "../context/JobContext";
import { CurrencyProvider } from "../context/CurrencyContext";
import "../i18n";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CompanyProvider>
            <JobProvider>
              {children}
            </JobProvider>
          </CompanyProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
