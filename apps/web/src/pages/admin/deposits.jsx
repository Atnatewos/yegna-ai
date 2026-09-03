/**
 * File: apps/web/src/pages/admin/deposits.jsx
 * Yegna AI - Admin Deposits Page
 * 
 * Review and manage pending deposit requests.
 */

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getPendingDeposits, approveDeposit, rejectDeposit } from '../../services/adminService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/navigation/Pagination';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import { Check, X, Eye, CreditCard } from 'lucide-react';

/**
 * Admin deposits page component
 */
export default function AdminDepositsPage() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  /**
   * Fetch pending deposits
   */
  const { data, isLoading } = useQuery(
    ['pendingDeposits', page],
    () => getPendingDeposits(page, 20),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Approve deposit mutation
   */
  const approveMutation = useMutation(
    ({ depositId, notes }) => approveDeposit(depositId, notes),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('admin.depositApproved'));
        queryClient.invalidateQueries(['pendingDeposits']);
        queryClient.invalidateQueries(['platformStats']);
        setConfirmAction(null);
      },
      onError: (error) => {
        showErrorToast(error.message || t('admin.depositApproveError'));
      }
    }
  );
  
  /**
   * Reject deposit mutation
   */
  const rejectMutation = useMutation(
    ({ depositId, notes }) => rejectDeposit(depositId, notes),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('admin.depositRejected'));
        queryClient.invalidateQueries(['pendingDeposits']);
        queryClient.invalidateQueries(['platformStats']);
        setConfirmAction(null);
      },
      onError: (error) => {
        showErrorToast(error.message || t('admin.depositRejectError'));
      }
    }
  );
  
  /**
   * Handle view proof
   */
  const handleViewProof = useCallback((deposit) => {
    setSelectedDeposit(deposit);
    setShowProofModal(true);
  }, []);
  
  /**
   * Handle confirm action
   */
  const handleConfirmAction = useCallback(() => {
    if (!confirmAction) return;
    
    const { action, deposit } = confirmAction;
    
    if (action === 'approve') {
      approveMutation.mutate({ depositId: deposit.id, notes: '' });
    } else if (action === 'reject') {
      rejectMutation.mutate({ depositId: deposit.id, notes: '' });
    }
  }, [confirmAction, approveMutation, rejectMutation]);
  
  const deposits = data?.data?.deposits || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };
  
  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <Breadcrumbs />
        
        <div className="admin-header">
          <h1 className="admin-title">{t('admin.pendingDeposits')}</h1>
          <p className="admin-subtitle">{t('admin.pendingDepositsSubtitle')}</p>
        </div>
        
        <Card className="admin-table-card">
          {deposits.length === 0 ? (
            <EmptyState
              icon={<CreditCard size={48} />}
              title={t('admin.noPendingDeposits')}
              description={t('admin.noPendingDepositsDescription')}
            />
          ) : (
            <div className="admin-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('admin.user')}</th>
                    <th>{t('admin.level')}</th>
                    <th>{t('admin.amount')}</th>
                    <th>{t('admin.paymentMethod')}</th>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id}>
                      <td>
                        <div className="admin-user-info">
                          <p className="admin-user-name">{deposit.full_name}</p>
                          <p className="admin-user-username">@{deposit.username}</p>
                        </div>
                      </td>
                      <td>
                        <Badge variant="info">{deposit.level_name}</Badge>
                      </td>
                      <td className="admin-amount">{deposit.amount} ETB</td>
                      <td>{deposit.payment_method}</td>
                      <td>{new Date(deposit.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProof(deposit)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmAction({ action: 'approve', deposit })}
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setConfirmAction({ action: 'reject', deposit })}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </div>
      
      <Modal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        title={t('admin.paymentProof')}
        size="lg"
      >
        {selectedDeposit && (
          <div className="admin-proof-container">
            {selectedDeposit.payment_proof_url ? (
              <img
                src={selectedDeposit.payment_proof_url}
                alt={t('admin.paymentProof')}
                className="admin-proof-image"
              />
            ) : (
              <EmptyState
                title={t('admin.noProof')}
                description={t('admin.noProofDescription')}
              />
            )}
          </div>
        )}
      </Modal>
      
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction?.action === 'approve' ? t('admin.approveDepositConfirm') : t('admin.rejectDepositConfirm')}
        message={confirmAction?.action === 'approve' ? t('admin.approveDepositMessage') : t('admin.rejectDepositMessage')}
        confirmLabel={confirmAction?.action === 'approve' ? t('admin.approve') : t('admin.reject')}
        cancelLabel={t('admin.cancel')}
        variant={confirmAction?.action === 'approve' ? 'primary' : 'danger'}
        loading={approveMutation.isLoading || rejectMutation.isLoading}
      />
    </div>
  );
}