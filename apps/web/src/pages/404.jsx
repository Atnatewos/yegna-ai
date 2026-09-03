/**
 * File: apps/web/src/pages/404.jsx
 * Yegna AI - 404 Not Found Page
 * 
 * Premium, Ethiopian-themed 404 page matching the platform design system.
 */

import React from 'react';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="ethiopian-flag-bar absolute top-0 left-0 w-full" />
      
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist, has been moved, or you do not have permission to view it.
          </p>
        </div>
        
        <div className="pt-4">
          <Link href="/">
            <button className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </Link>
        </div>
      </div>
      
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
}