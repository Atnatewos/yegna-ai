/**
 * File: apps/web/src/pages/team/index.jsx
 * Yegna AI - Team Page
 * 
 * Displays referral link, commission breakdown,
 * and direct referral list.
 */

import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Copy, Users, TrendingUp, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import { getTeamStatistics, getDirectReferrals, getCommissionSummary } from '../../services/teamService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/feedback/EmptyState';

/**
 * Team page component
 */
export default function TeamPage() {
  const { user } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('team');
  const { appUrl, commission } = useConfig();

  /**
   * Fetch team statistics
   */
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'teamStatistics',
    getTeamStatistics,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch direct referrals
   */
  const { data: referralsData, isLoading: referralsLoading } = useQuery(
    'directReferrals',
    () => getDirectReferrals(1, 10),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch commission summary
   */
  const { data: commissionData, isLoading: commissionLoading } = useQuery(
    'commissionSummary',
    () => getCommissionSummary('all'),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Build referral link
   */
  const referralLink = `${appUrl}/register?ref=${user?.referralCode || ''}`;

  /**
   * Copy referral link to clipboard
   */
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        showSuccessToast(t('team.linkCopied'));
      })
      .catch(() => {
        showErrorToast(t('team.copyFailed'));
      });
  }, [referralLink, showSuccessToast, showErrorToast, t]);

  const stats = statsData?.data || {};
  const referrals = referralsData?.data?.referrals || [];
  const commissionSummary = commissionData?.data || {};
  const teamLevels = commission.teamLevels || [];

  if (statsLoading || referralsLoading || commissionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Referral Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            {t('team.programBadge')}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {t('team.teamTree')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('team.programDescription')}
          </p>
        </div>

        <div className="w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 shrink-0">
          <span className="text-xs font-bold text-slate-600 block">
            {t('team.referralLink')}
          </span>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1-5 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-emerald-800 flex-1 overflow-x-auto whitespace-nowrap">
              {referralLink}
            </code>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <Copy className="w-3-5 h-3-5" />
              <span>{t('team.copy')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {teamLevels.map((level, index) => (
          <div
            key={level.level}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm"
          >
            <span className="text-10 font-bold text-slate-400 uppercase block">
              {t(`team.level${level.level}`)}
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {level.percentage}%
            </div>
            <div className="mt-2 text-xs text-slate-600 font-semibold">
              {t('team.activeUsers', { count: index === 0 ? 12 : index === 1 ? 28 : 0 })}
            </div>
          </div>
        ))}
      </div>

      {/* Direct Referrals */}
      <Card className="space-y-4">
        <h3 className="font-extrabold text-slate-900">
          {t('team.directReferrals')}
        </h3>

        {referrals.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title={t('team.noReferrals')}
            description={t('team.noReferralsDescription')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('team.memberName')}</th>
                  <th>{t('team.tierLevel')}</th>
                  <th>{t('team.joinedDate')}</th>
                  <th className="text-right">{t('team.commissionGenerated')}</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="font-bold text-slate-800">
                      {referral.full_name || referral.username}
                    </td>
                    <td>
                      <Badge variant="success">
                        {referral.level_name || 'Intern'}
                      </Badge>
                    </td>
                    <td>{new Date(referral.created_at).toLocaleDateString()}</td>
                    <td className="text-right font-bold text-emerald-600">
                      +{referral.total_commission_earned || 0} ETB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}