/**
 * File: apps/web/src/components/layout/RootLayout.jsx
 * Yegna AI - Root Layout
 * 
 * Main layout wrapper that decides between auth and dashboard layouts.
 */

import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from './DashboardLayout';
import AuthLayout from './AuthLayout';
import { ToastProvider } from '../../context/ToastContext';

/**
 * Root layout component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
export default function RootLayout({ children }) {
  const router = useRouter();

  // Check if current path is an auth page
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.some((path) => router.pathname.startsWith(path));

  return (
    <ToastProvider>
      {isAuthPage ? (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          {children}
        </div>
      ) : (
        <DashboardLayout>
          {children}
        </DashboardLayout>
      )}
    </ToastProvider>
  );
}