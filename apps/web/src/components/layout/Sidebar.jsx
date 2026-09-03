/**
 * File: apps/web/src/components/layout/Sidebar.jsx
 * Yegna AI - Sidebar Component
 * 
 * Navigation sidebar with menu items and wallet summary.
 */

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Activity, Brain, Layers, Wallet, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConfig } from '../../hooks/useConfig';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * Sidebar component
 * Displays navigation menu and wallet summary card.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.mobileMenuOpen - Mobile menu open state
 * @param {Function} props.onClose - Close mobile menu handler
 */
export default function Sidebar({ mobileMenuOpen, onClose }) {
  const { user } = useAuth();
  const { navigation } = useConfig();
  const { t } = useTranslation('navigation');
  const router = useRouter();

  /**
   * Handle navigation click
   * Closes mobile menu if open.
   */
  const handleNavClick = useCallback((path) => {
    router.push(path);
    if (onClose) {
      onClose();
    }
  }, [router, onClose]);

  const mainNav = navigation.mainNavigation || [];
  
  /**
   * Icon mapping for navigation items
   */
  const navIcons = {
    dashboard: Activity,
    tasks: Brain,
    levels: Layers,
    wallet: Wallet,
    team: Users
  };

  const isActive = (path) => router.pathname === path;

  return (
    <aside
      className={`sidebar ${mobileMenuOpen ? 'sidebar-mobile-open' : ''}`}
    >
      <div className="space-y-1">
        <p className="text-11 font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          {t('navigation.mainMenu')}
        </p>

        {mainNav.map((item) => {
          const Icon = navIcons[item.id] || Activity;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2-5 rounded-xl text-sm font-semibold transition ${
                active
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{t(item.labelKey)}</span>
              </div>
              {item.id === 'tasks' && (
                <span className={`text-xs px-2 py-0-5 rounded-full ${
                  active ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  3
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-11 font-bold text-purple-600 uppercase tracking-wider px-3 mb-2">
              {t('navigation.management')}
            </p>
            <button
              onClick={() => handleNavClick('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2-5 rounded-xl text-sm font-semibold transition ${
                isActive('/admin')
                  ? 'bg-purple-700 text-white shadow-purple-700/20'
                  : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>{t('navigation.admin')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Wallet Summary Card */}
      <div className="sidebar-wallet-card">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Zap className="w-20 h-20 text-yellow-400" />
        </div>
        <span className="text-xs text-slate-400 font-medium block">
          {t('wallet.balance')}
        </span>
        <div className="text-xl font-extrabold text-amber-400 mt-1">
          {user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}{' '}
          <span className="text-xs text-white font-normal">ETB</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
          <span className="text-slate-300">{t('wallet.todayEarned')}:</span>
          <span className="font-bold text-emerald-400">
            +{user?.todayEarned || '0.00'} ETB
          </span>
        </div>
      </div>
    </aside>
  );
}