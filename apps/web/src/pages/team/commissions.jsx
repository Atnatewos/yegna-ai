/**
 * File: apps/web/src/pages/team/commissions.jsx
 * Yegna AI - Commission Report Page
 * 
 * Displays commission history and summary.
 */

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getCommissionHistory, getCommissionSummary } from '../../services/teamService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/navigation/Pagination';
import EmptyState from '../../components/feedback/EmptyState';
import { TrendingUp, Users, Award, Gift } from 'lucide-react';

/**
 * Commission report page component
 */
export default function CommissionsPage() {
  const { showErrorToast } = useToast();
  const { t } = useTranslation('team');
  const [page, setPage] = useState(1);
  
  /**
   * Fetch commission summary
   */
  const { data: summaryData, isLoading: summaryLoading } = useQuery(
    'commissionSummary',
    () => getCommissionSummary('all'),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Fetch commission history
   */
  const { data: historyData, isLoading: historyLoading } = useQuery(
    ['commissionHistory', page],
    () => getCommissionHistory(page, 10),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  const summary = summaryData?.data || {};
  const commissions = historyData?.data?.commissions || [];
  const pagination = historyData?.data?.pagination || { page: 1, totalPages: 1 };
  
  const summaryCards = [
    {
      icon: Gift,
      label: t('team.directReferralBonus'),
      value: `${summary.direct_referral_total || 0} ETB`,
      color: 'var(--color-success)'
    },
    {
      icon: Users,
      label: t('team.teamTaskCommission'),
      value: `${summary.team_task_total || 0} ETB`,
      color: 'var(--color-info)'
    },
    {
      icon: Award,
      label: t('team.levelBonus'),
      value: `${summary.level_bonus_total || 0} ETB`,
      color: 'var(--color-warning)'
    },
    {
      icon: TrendingUp,
      label: t('team.totalCommission'),
      value: `${summary.total_commission || 0} ETB`,
      color: 'var(--color-primary)'
    }
  ];
  
  return (
    <div className="commissions-page">
      <div className="commissions-container">
        <Breadcrumbs />
        
        <div className="commissions-header">
          <h1 className="commissions-title">{t('team.commissionReport')}</h1>
          <p className="commissions-subtitle">{t('team.commissionReportSubtitle')}</p>
        </div>
        
        <div className="commissions-summary-grid">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="commissions-summary-card">
                <div className="commissions-summary-icon" style={{ backgroundColor: card.color }}>
                  <Icon size={20} />
                </div>
                <div className="commissions-summary-content">
                  <p className="commissions-summary-label">{card.label}</p>
                  <p className="commissions-summary-value">{card.value}</p>
                </div>
              </Card>
            );
          })}
        </div>
        
        <Card
          title={t('team.commissionHistory')}
          className="commissions-history-card"
        >
          {historyLoading ? (
            <Spinner />
          ) : commissions.length === 0 ? (
            <EmptyState
              title={t('team.noCommissions')}
              description={t('team.noCommissionsDescription')}
            />
          ) : (
            <div className="commissions-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('team.from')}</th>
                    <th>{t('team.type')}</th>
                    <th>{t('team.amount')}</th>
                    <th>{t('team.level')}</th>
                    <th>{t('team.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id}>
                      <td>
                        <div className="team-member-info">
                          <p className="team-member-name">
                            {commission.from_full_name || commission.from_username}
                          </p>
                          <p className="team-member-username">
                            @{commission.from_username}
                          </p>
                        </div>
                      </td>
                      <td>
                        <Badge variant={
                          commission.commission_type === 'direct_referral' ? 'success' :
                          commission.commission_type === 'team_task' ? 'info' : 'warning'
                        }>
                          {t(`team.commissionTypes.${commission.commission_type}`)}
                        </Badge>
                      </td>
                      <td className="commissions-amount">
                        +{commission.amount} ETB
                      </td>
                      <td>L{commission.level || 1}</td>
                      <td>{new Date(commission.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {pagination.totalPages > 1 && (
            <div className="commissions-pagination">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}