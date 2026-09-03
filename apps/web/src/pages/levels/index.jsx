/**
 * File: apps/web/src/pages/levels/index.jsx
 * Yegna AI - Membership Levels Page
 * 
 * Displays all membership tiers with upgrade functionality.
 */

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { Layers, Check, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

/**
 * Levels page component
 */
export default function LevelsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('levels');
  const { levels } = useConfig();

  /**
   * Get all membership levels from config
   */
  const allLevels = levels.levels || [];

  /**
   * Find current user's level
   */
  const currentLevel = useMemo(() => {
    if (!user?.levelNumber && user?.levelNumber !== 0) return null;
    return allLevels.find((lvl) => lvl.id === user.levelNumber) || null;
  }, [user?.levelNumber, allLevels]);

  /**
   * Handle upgrade to a tier
   */
  const handleUpgrade = useCallback((level) => {
    if (level.deposit === 0) return;
    
    router.push(`/wallet/deposit?level=${level.id}`);
  }, [router]);

  /**
   * Badge color mapping for each level
   */
  const badgeColors = [
    'bg-slate-100 text-slate-700',
    'bg-emerald-100 text-emerald-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800 border border-amber-300',
    'bg-orange-100 text-orange-800',
    'bg-rose-100 text-rose-800',
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-300 text-yellow-950 font-bold border border-yellow-500 shadow-sm'
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
          {t('levels.officialTiers')}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
          {t('levels.title')}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t('levels.subtitle')}
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allLevels.map((tier, index) => {
          const isCurrent = currentLevel?.id === tier.id;
          const isFree = tier.deposit === 0;

          return (
            <div
              key={tier.id}
              className={`tier-card ${isCurrent ? 'tier-card-active' : ''}`}
            >
              {isCurrent && (
                <div className="tier-active-badge">
                  {t('levels.activePlan')}
                </div>
              )}

              <div>
                {/* Tier Name Badge */}
                <div className="flex items-center justify-between">
                  <span className={`tier-badge ${badgeColors[index] || badgeColors[0]}`}>
                    {t(tier.nameKey)}
                  </span>
                </div>

                {/* Deposit Amount */}
                <div className="mt-4">
                  <span className="text-3xl font-black text-slate-900">
                    {tier.deposit === 0 
                      ? t('levels.free') 
                      : tier.deposit.toLocaleString()}
                  </span>
                  {tier.deposit > 0 && (
                    <span className="text-xs text-slate-500 font-semibold ml-1">
                      ETB {t('levels.deposit')}
                    </span>
                  )}
                </div>

                {/* Tier Details */}
                <div className="mt-6 space-y-2-5 text-xs">
                  <div className="flex justify-between py-1-5 border-b border-slate-100">
                    <span className="text-slate-500">{t('levels.dailyTaskLimit')}</span>
                    <span className="font-bold text-slate-800">
                      {tier.tasksPerDay} {t('levels.tasksPerDay')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1-5 border-b border-slate-100">
                    <span className="text-slate-500">{t('levels.incomePerTask')}</span>
                    <span className="font-bold text-emerald-600">
                      {tier.incomePerTask} ETB
                    </span>
                  </div>
                  <div className="flex justify-between py-1-5 border-b border-slate-100">
                    <span className="text-slate-500">{t('levels.dailyReturn')}</span>
                    <span className="font-bold text-slate-800">
                      {tier.dailyIncome.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between py-1-5">
                    <span className="text-slate-500">{t('levels.monthlyProjected')}</span>
                    <span className="font-extrabold text-emerald-700">
                      {tier.monthlyIncome.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                {tier.benefitsKeys && tier.benefitsKeys.length > 0 && (
                  <div className="mt-4 space-y-1-5">
                    {tier.benefitsKeys.slice(0, 3).map((benefitKey, idx) => (
                      <div key={idx} className="flex items-center gap-1-5 text-xs text-slate-600">
                        <Check className="w-3-5 h-3-5 text-emerald-600" />
                        <span>{t(benefitKey)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isCurrent ? (
                <button
                  disabled
                  className="mt-6 w-full py-3 rounded-xl bg-slate-100 text-slate-400 cursor-default font-bold text-xs flex items-center justify-center gap-2"
                >
                  {t('levels.currentTier')}
                </button>
              ) : isFree ? (
                <button
                  disabled
                  className="mt-6 w-full py-3 rounded-xl bg-slate-100 text-slate-400 cursor-default font-bold text-xs"
                >
                  {t('levels.freeTier')}
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier)}
                  className="mt-6 w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-emerald-700/20"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {t('levels.upgradeTo')} {t(tier.nameKey)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}