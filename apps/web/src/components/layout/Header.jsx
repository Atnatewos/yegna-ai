/**
 * File: apps/web/src/components/layout/Header.jsx
 * Yegna AI - Header Component
 */

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Globe, Shield, Brain, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConfig } from '../../hooks/useConfig';
import { useTranslation } from '../../hooks/useTranslation';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const { appName } = useConfig();
  const { t, changeLanguage, getCurrentLanguage } = useTranslation('navigation');
  const router = useRouter();

  const handleLanguageToggle = useCallback(() => {
    const currentLang = getCurrentLanguage();
    changeLanguage(currentLang === 'en' ? 'am' : 'en');
  }, [changeLanguage, getCurrentLanguage]);

  const currentLang = getCurrentLanguage();

  return (
    <>
      {/* Ethiopian Flag Bar */}
      <div className="ethiopian-flag-bar" />

      <header className="header">
        <div className="header-container">
          {/* Left: Logo */}
          <div className="header-left">
            <button
              onClick={onMenuToggle}
              className="header-mobile-toggle"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/dashboard" className="header-logo-button">
              <div className="header-logo-icon">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1-5">
                  <span className="header-brand-name">{appName}</span>
                  <span className="header-version-badge">v2.4</span>
                </div>
                <p className="header-brand-subtitle hidden sm:block">
                  {t('common.tagline')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Partner Badge */}
          <div className="header-partner-badge hidden lg:flex">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{t('common.partnerTag')}</span>
          </div>

          {/* Right: Actions */}
          <div className="header-actions">
            <button
              onClick={handleLanguageToggle}
              className="header-lang-toggle"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{currentLang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <div className="header-user-info">
              <div className="hidden sm:block text-right">
                <div className="header-user-name">
                  {user?.full_name || user?.username || 'User'}
                </div>
                <span className="header-user-tier bg-emerald-100 text-emerald-800">
                  {user?.tierName || 'Intern'}
                </span>
              </div>
              <button
                onClick={() => router.push(user?.role === 'admin' ? '/admin' : '/dashboard')}
                className={`header-admin-toggle ${
                  user?.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}