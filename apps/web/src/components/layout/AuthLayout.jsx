/**
 * File: apps/web/src/components/layout/AuthLayout.jsx
 * Yegna AI - Auth Layout
 * 
 * Layout for authentication pages (login, register).
 */

import React from 'react';
import { Brain } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

/**
 * Auth layout component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Auth form content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 */
export default function AuthLayout({ children, title, subtitle }) {
  const { appName } = useConfig();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Ethiopian Flag Bar */}
      <div className="ethiopian-flag-bar" style={{ position: 'fixed', top: 0 }} />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 rounded-xl icon-gradient">
          <Brain className="w-7 h-7" />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight text-slate-900">
            {appName}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            የኛ AI • AI Training Platform
          </p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
        {title && (
          <h2 className="text-xl font-black text-slate-900 text-center mb-1">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-slate-500 text-center mb-6">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Partner Badge */}
      <div className="mt-6 partner-badge">
        <span className="text-emerald-700">🏛️</span>
        <span>In Strategic Partnership with Ethiopian AI Institute</span>
      </div>
    </div>
  );
}