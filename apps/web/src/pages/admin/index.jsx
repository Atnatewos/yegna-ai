/**
 * File: apps/web/src/pages/admin/index.jsx
 * Yegna AI - Admin Dashboard Page
 * 
 * Platform control center with statistics,
 * pending deposits queue, and settings.
 */

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Users, CreditCard, Wallet, FileText, TrendingUp,
  RefreshCw, Check, X, Shield, Activity
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import {
  getPlatformStats,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit,
  getPendingWithdrawals,
  processWithdrawal,
  rejectWithdrawal
} from '../../services/adminService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/feedback/EmptyState';

/**
 * Admin dashboard page component
 */
export default function AdminDashboardPage() {
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();

  /**
   * Fetch platform statistics
   */
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'platformStats',
    getPlatformStats,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch pending deposits
   */
  const { data: depositsData, isLoading: depositsLoading } = useQuery(
    'pendingDeposits',
    () => getPendingDeposits(1, 20),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch pending withdrawals
   */
  const { data: withdrawalsData, isLoading: withdrawalsLoading } = useQuery(
    'pendingWithdrawals',
    () => getPendingWithdrawals(1, 20),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Approve deposit mutation
   */
  const approveMutation = useMutation(
    (depositId) => approveDeposit(depositId),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || 'Deposit approved');
        queryClient.invalidateQueries(['pendingDeposits']);
        queryClient.invalidateQueries(['platformStats']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Reject deposit mutation
   */
  const rejectMutation = useMutation(
    (depositId) => rejectDeposit(depositId),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || 'Deposit rejected');
        queryClient.invalidateQueries(['pendingDeposits']);
        queryClient.invalidateQueries(['platformStats']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Process withdrawal mutation
   */
  const processWithdrawalMutation = useMutation(
    (withdrawalId) => processWithdrawal(withdrawalId),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || 'Withdrawal processed');
        queryClient.invalidateQueries(['pendingWithdrawals']);
        queryClient.invalidateQueries(['platformStats']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Reject withdrawal mutation
   */
  const rejectWithdrawalMutation = useMutation(
    (withdrawalId) => rejectWithdrawal(withdrawalId),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || 'Withdrawal rejected');
        queryClient.invalidateQueries(['pendingWithdrawals']);
        queryClient.invalidateQueries(['platformStats']);
      },
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Handle approve deposit
   */
  const handleApproveDeposit = useCallback((depositId) => {
    approveMutation.mutate(depositId);
  }, [approveMutation]);

  /**
   * Handle reject deposit
   */
  const handleRejectDeposit = useCallback((depositId) => {
    rejectMutation.mutate(depositId);
  }, [rejectMutation]);

  /**
   * Handle process withdrawal
   */
  const handleProcessWithdrawal = useCallback((withdrawalId) => {
    processWithdrawalMutation.mutate(withdrawalId);
  }, [processWithdrawalMutation]);

  /**
   * Handle reject withdrawal
   */
  const handleRejectWithdrawal = useCallback((withdrawalId) => {
    rejectWithdrawalMutation.mutate(withdrawalId);
  }, [rejectWithdrawalMutation]);

  const stats = statsData?.data || {};
  const pendingDeposits = depositsData?.data?.deposits || [];
  const pendingWithdrawals = withdrawalsData?.data?.withdrawals || [];

  if (statsLoading || depositsLoading || withdrawalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  /**
   * Stat cards data
   */
  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.total_users || 0,
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      icon: FileText,
      label: 'Active Tasks',
      value: stats.active_tasks || 0,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      icon: CreditCard,
      label: 'Pending Deposits',
      value: stats.pending_deposits || 0,
      color: 'bg-amber-50 text-amber-700'
    },
    {
      icon: Wallet,
      label: 'Pending Withdrawals',
      value: stats.pending_withdrawals || 0,
      color: 'bg-purple-50 text-purple-700'
    }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-purple-950">Platform Control Center</h2>
          <p className="text-xs text-slate-500">
            Platform operations & manual deposit verification portal
          </p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold rounded-full text-xs">
          Admin System Active
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`icon-container-sm ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Deposits Queue */}
      <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">
            Pending Deposit Verification ({pendingDeposits.length})
          </h3>
          <button
            onClick={() => queryClient.invalidateQueries(['pendingDeposits'])}
            className="text-xs text-purple-700 font-bold flex items-center gap-1 hover:underline"
          >
            <RefreshCw className="w-3-5 h-3-5" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {pendingDeposits.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No pending deposit approvals in queue.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingDeposits.map((deposit) => (
              <div
                key={deposit.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {deposit.full_name || deposit.username}
                    </span>
                    <span className="text-xs text-slate-500">({deposit.email})</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600 font-mono">
                    Method: {deposit.payment_method} • Level: {deposit.level_name}
                  </div>
                  <span className="text-10 text-slate-400">
                    {new Date(deposit.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">
                    {deposit.amount.toLocaleString()} ETB
                  </span>
                  <button
                    onClick={() => handleApproveDeposit(deposit.id)}
                    disabled={approveMutation.isLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check className="w-3-5 h-3-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectDeposit(deposit.id)}
                    disabled={rejectMutation.isLoading}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Withdrawals */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">
            Pending Withdrawals ({pendingWithdrawals.length})
          </h3>
        </div>

        {pendingWithdrawals.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No pending withdrawal requests.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {withdrawal.full_name || withdrawal.username}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Net: {withdrawal.net_amount} ETB • Method: {withdrawal.payment_method}
                  </div>
                  <span className="text-10 text-slate-400">
                    {new Date(withdrawal.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">
                    {withdrawal.amount.toLocaleString()} ETB
                  </span>
                  <button
                    onClick={() => handleProcessWithdrawal(withdrawal.id)}
                    disabled={processWithdrawalMutation.isLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check className="w-3-5 h-3-5" />
                    Process
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(withdrawal.id)}
                    disabled={rejectWithdrawalMutation.isLoading}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}