/**
 * File: apps/web/src/pages/index.jsx
 * Yegna AI - Landing Page
 */

import React from 'react';
import Link from 'next/link';
import { Brain, Sparkles, ArrowRight, Shield, Users, TrendingUp, Building2, Award, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useConfig } from '../hooks/useConfig';

export default function LandingPage() {
  const { t } = useTranslation('common');
  const { levels, appName } = useConfig();
  
  const topLevels = levels.levels.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Ethiopian Flag Bar */}
      <div className="ethiopian-flag-bar" />

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo-icon">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="header-brand-name">{appName}</span>
              <p className="header-brand-subtitle">{t('common.tagline')}</p>
            </div>
          </div>
          <div className="header-actions">
            <Link href="/auth/login" className="button button-outline button-md">
              {t('landing.login')}
            </Link>
            <Link href="/auth/register" className="button button-primary button-md">
              {t('landing.startEarning')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Official AI Data Training Network</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {t('landing.heroTitle')}
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            {t('landing.heroSubtitle')}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/auth/register"
              className="button button-accent button-lg"
            >
              <Brain className="w-5 h-5" />
              <span>{t('landing.startEarning')}</span>
            </Link>
            <Link
              href="/auth/login"
              className="button button-outline button-lg"
            >
              <span>{t('landing.login')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Partner Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{t('common.partnerTag')}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
            {t('landing.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: t('landing.features.aiTraining.title'), desc: t('landing.features.aiTraining.description') },
              { icon: TrendingUp, title: t('landing.features.dailyIncome.title'), desc: t('landing.features.dailyIncome.description') },
              { icon: Users, title: t('landing.features.teamRewards.title'), desc: t('landing.features.teamRewards.description') },
              { icon: Shield, title: t('landing.features.governmentBacked.title'), desc: t('landing.features.governmentBacked.description') }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card card-padding card-hover text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Levels Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
            {t('landing.levelsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLevels.map((level) => (
              <div key={level.id} className="card card-padding text-center">
                <Award className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900">{t(level.nameKey)}</h3>
                <p className="text-xl font-black text-emerald-700 mt-2">
                  {level.deposit === 0 ? t('landing.free') : `${level.deposit.toLocaleString()} ETB`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {level.dailyIncome} ETB / {t('landing.day')}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/auth/register" className="button button-primary button-lg">
              {t('landing.viewAllLevels')}
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Building2 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-4">
            {t('landing.partnershipTitle')}
          </h2>
          <p className="text-slate-400 text-sm">
            {t('landing.partnershipDescription')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Yegna AI (የኛ AI) Platform. Ethiopian Artificial Intelligence Institute Partner.</p>
          <div className="footer-links">
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">Telebirr Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}