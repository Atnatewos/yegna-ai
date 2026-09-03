/**
 * File: apps/web/src/pages/admin/withdrawals.jsx
 * Yegna AI - Admin Withdrawals Page
 * 
 * Review and manage pending withdrawal requests.
 */

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getPendingWithdrawals, processWithdrawal, rejectWithdrawal } from '../../services/adminService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/navigation/Pagination';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Input from '../../components/ui/Input';
import { Check, X, Wallet } from 'lucide-react';

/**
 * Admin withdrawals page component
 */
export default function AdminWithdrawalsPage() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [transactionReference, setTransactionReference] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  
  /**
   * Fetch pending withdrawals
   */
  const { data, isLoading } = useQuery(
    ['pendingWithdrawals', page],
    () => getPendingWithdrawals(page, 20),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Process withdrawal mutation
   */
  const processMutation = useMutation(
    ({ withdrawalId, transactionReference }) => processWithdrawal(withdrawalId, transactionReference),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('admin.withdrawalProcessed'));
        queryClient.invalidateQueries(['pendingWithdrawals']);
        queryClient.invalidateQueries(['platformStats']);
        setShowProcessModal(false);
        setTransactionReference('');
        setConfirmAction(null);
      },
      onError: (error) => {
        showErrorToast(error.message || t('admin.withdrawalProcessError'));
      }
    }
  );
  
  /**
   * Reject withdrawal mutation
   */
  const rejectMutation = useMutation(
    (withdrawalId) => rejectWithdrawal(withdrawalId),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('admin.withdrawalRejected'));
        queryClient.invalidateQueries(['pendingWithdrawals']);
        queryClient.invalidateQueries(['platformStats']);
        setConfirmAction(null);
      },
      onError: (error) => {
        showErrorToast(error.message || t('admin.withdrawalRejectError'));
      }
    }
  );
  
  /**
   * Handle confirm action
   */
  const handleConfirmAction = useCallback(() => {
    if (!confirmAction) return;
    
    const { action, withdrawal } = confirmAction;
    
    if (action === 'reject') {
      rejectMutation.mutate(withdrawal.id);
    }
  }, [confirmAction, rejectMutation]);
  
  /**
   * Handle process withdrawal
   */
  const handleProcess = useCallback(() => {
    if (!selectedWithdrawal) return;
    
    processMutation.mutate({
      withdrawalId: selectedWithdrawal.id,
      transactionReference
    });
  }, [selectedWithdrawal, transactionReference, processMutation]);
  
  const withdrawals = data?.data?.withdrawals || [];
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
          <h1 className="admin-title">{t('admin.pendingWithdrawals')}</h1>
          <p className="admin-subtitle">{t('admin.pendingWithdrawalsSubtitle')}</p>
        </div>
        
        <Card className="admin-table-card">
          {withdrawals.length === 0 ? (
            <EmptyState
              icon={<Wallet size={48} />}
              title={t('admin.noPendingWithdrawals')}
              description={t('admin.noPendingWithdrawalsDescription')}
            />
          ) : (
            <div className="admin-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('admin.user')}</th>
                    <th>{t('admin.amount')}</th>
                    <th>{t('admin.fee')}</th>
                    <th>{t('admin.netAmount')}</th>
                    <th>{t('admin.paymentMethod')}</th>
                    <th>{t('admin.date')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td>
                        <div className="admin-user-info">
                          <p className="admin-user-name">{withdrawal.full_name}</p>
                          <p className="admin-user-username">@{withdrawal.username}</p>
                        </div>
                      </td>
                      <td className="admin-amount">{withdrawal.amount} ETB</td>
                      <td className="admin-fee">{withdrawal.fee} ETB</td>
                      <td className="admin-net-amount">{withdrawal.net_amount} ETB</td>
                      <td>{withdrawal.payment_method}</td>
                      <td>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowProcessModal(true);
                            }}
                          >
                            <Check size={16} />
                            {t('admin.process')}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setConfirmAction({ action: 'reject', withdrawal })}
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
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title={t('admin.processWithdrawal')}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowProcessModal(false)}>
              {t('admin.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleProcess}
              loading={processMutation.isLoading}
            >
              {t('admin.confirmProcess')}
            </Button>
          </>
        }
      >
        {selectedWithdrawal && (
          <div className="admin-process-form">
            <div className="admin-process-summary">
              <p className="admin-process-item">
                <span>{t('admin.amount')}:</span>
                <strong>{selectedWithdrawal.amount} ETB</strong>
              </p>
              <p className="admin-process-item">
                <span>{t('admin.netAmount')}:</span>
                <strong>{selectedWithdrawal.net_amount} ETB</strong>
              </p>
              <p className="admin-process-item">
                <span>{t('admin.paymentMethod')}:</span>
                <strong>{selectedWithdrawal.payment_method}</strong>
              </p>
            </div>
            
            <Input
              label={t('admin.transactionReference')}
              type="text"
              placeholder={t('admin.transactionReferencePlaceholder')}
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
            />
          </div>
        )}
      </Modal>
      
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={t('admin.rejectWithdrawalConfirm')}
        message={t('admin.rejectWithdrawalMessage')}
        confirmLabel={t('admin.reject')}
        cancelLabel={t('admin.cancel')}
        variant="danger"
        loading={rejectMutation.isLoading}
      />
    </div>
  );
}