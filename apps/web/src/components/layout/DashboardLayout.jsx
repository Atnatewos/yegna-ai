/**
 * File: apps/web/src/components/layout/DashboardLayout.jsx
 * Yegna AI - Dashboard Layout
 * 
 * Main layout for authenticated pages with sidebar.
 */

import React, { useState, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Dashboard layout component
 * Wraps authenticated pages with header, sidebar, and footer.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu
   */
  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Close mobile menu
   */
  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        onMenuToggle={handleMenuToggle}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          onClose={handleMenuClose}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}