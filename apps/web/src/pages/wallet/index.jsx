/**
 * File: apps/web/src/pages/wallet/index.jsx
 * Yegna AI - Wallet Page
 * 
 * Displays balance, deposit form, withdrawal form,
 * and transaction history.
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Upload, RefreshCw,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import { getBalance, getTransactions, createDeposit, createWithdrawal, getPaymentMethods } from '../../services/walletService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

/**
 * Wallet page component
 */
export default function WalletPage() {
  const { user } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('wallet');
  const { payment } = useConfig();
  const queryClient = useQueryClient();

  const [depositAmount, setDepositAmount] = useState('1600');
  const [depositMethod, setDepositMethod] = useState('telebirr');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const depositSectionRef = useRef(null);
  const withdrawSectionRef = useRef(null);

  /**
   * Fetch wallet balance
   */
  const { data: balanceData, isLoading: balanceLoading } = useQuery(
    'walletBalance',
    getBalance,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch payment methods
   */
  const { data: paymentData } = useQuery(
    'paymentMethods',
    getPaymentMethods,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Fetch transactions
   */
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery(
    'transactions',
    () => getTransactions(1, 5),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );

  /**
   * Deposit mutation
   */
  const depositMutation = useMutation(
    (depositData) => createDeposit(depositData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('deposit.success'));
        queryClient.invalidateQueries(['walletBalance']);
        setDepositAmount('');
      },
      onError: (error) => {
        showErrorToast(error.message || t('deposit.error'));
      }
    }
  );

  /**
   * Withdrawal mutation
   */
  const withdrawalMutation = useMutation(
    (withdrawalData) => createWithdrawal(withdrawalData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('withdraw.success'));
        queryClient.invalidateQueries(['walletBalance']);
        setWithdrawAmount('');
        setWithdrawAccount('');
      },
      onError: (error) => {
        showErrorToast(error.message || t('withdraw.error'));
      }
    }
  );

  /**
   * Scroll to deposit section
   */
  const scrollToDeposit = useCallback(() => {
    depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Scroll to withdraw section
   */
  const scrollToWithdraw = useCallback(() => {
    withdrawSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Handle deposit submission
   */
  const handleDepositSubmit = useCallback((e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      showErrorToast(t('deposit.validAmount'));
      return;
    }
    
    depositMutation.mutate({
      amount,
      paymentMethod: depositMethod,
      levelId: user?.levelId || 1
    });
  }, [depositAmount, depositMethod, user?.levelId, depositMutation, showErrorToast, t]);

  /**
   * Handle withdrawal submission
   */
  const handleWithdrawSubmit = useCallback((e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      showErrorToast(t('withdraw.validAmount'));
      return;
    }
    
    if (!withdrawAccount) {
      showErrorToast(t('withdraw.accountRequired'));
      return;
    }
    
    withdrawalMutation.mutate({
      amount,
      paymentMethod: 'telebirr',
      accountDetails: { phone: withdrawAccount }
    });
  }, [withdrawAmount, withdrawAccount, withdrawalMutation, showErrorToast, t]);

  /**
   * Calculate withdrawal fee
   */
  const withdrawalFee = useMemo(() => {
    const amount = parseFloat(withdrawAmount) || 0;
    return (amount * 0.02).toFixed(2);
  }, [withdrawAmount]);

  /**
   * Calculate net receive amount
   */
  const netAmount = useMemo(() => {
    const amount = parseFloat(withdrawAmount) || 0;
    return (amount * 0.98).toFixed(2);
  }, [withdrawAmount]);

  const balance = balanceData?.data?.balance || 0;
  const transactions = transactionsData?.data?.transactions || [];
  const paymentMethods = paymentData?.data?.payment_methods || payment.defaultPaymentMethods || [];

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Balance Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {t('wallet.balance')}
          </span>
          <div className="text-3xl md:text-4xl font-black mt-1">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-sm font-normal text-slate-300">ETB</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t('wallet.verifiedGateway')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={scrollToDeposit}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg transition text-xs flex items-center gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{t('wallet.deposit')}</span>
          </button>
          <button
            onClick={scrollToWithdraw}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-2xl transition text-xs flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('wallet.withdraw')}</span>
          </button>
        </div>
      </div>

      {/* Deposit and Withdraw Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <div
          ref={depositSectionRef}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="icon-container-md bg-emerald-100 text-emerald-800">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{t('deposit.title')}</h3>
              <p className="text-xs text-slate-500">{t('deposit.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="form-label">{t('deposit.amountLabel')}</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={t('deposit.amountPlaceholder')}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('deposit.paymentMethod')}</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setDepositMethod(method.id)}
                    className={`p-2-5 rounded-xl border text-xs font-bold transition ${
                      depositMethod === method.id
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t(method.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">{t('deposit.bankAccount')}:</p>
              <p className="font-mono text-emerald-800 font-bold">
                1000 9823 4819 2 (Yegna AI Institute)
              </p>
              <p className="text-11 text-slate-500">{t('deposit.uploadInstruction')}</p>
            </div>

            <div>
              <label className="form-label">{t('deposit.proofLabel')}</label>
              <div className="upload-area">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-medium">
                  {t('deposit.proofPlaceholder')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={depositMutation.isLoading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md transition text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {depositMutation.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('deposit.submitting')}</span>
                </>
              ) : (
                <span>{t('deposit.submit')}</span>
              )}
            </button>
          </form>
        </div>

        {/* Withdraw Form */}
        <div
          ref={withdrawSectionRef}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="icon-container-md bg-amber-100 text-amber-800">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{t('withdraw.title')}</h3>
              <p className="text-xs text-slate-500">{t('withdraw.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="form-label">{t('withdraw.amountLabel')}</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={t('withdraw.amountPlaceholder')}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('withdraw.accountLabel')}</label>
              <input
                type="text"
                value={withdrawAccount}
                onChange={(e) => setWithdrawAccount(e.target.value)}
                placeholder="+2519..."
                className="form-input"
              />
            </div>

            {/* Fee Summary */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex justify-between">
                <span>{t('withdraw.fee')}:</span>
                <span className="font-bold">{withdrawalFee} ETB</span>
              </div>
              <div className="flex justify-between font-bold border-t border-amber-200 pt-1">
                <span>{t('withdraw.netAmount')}:</span>
                <span className="text-emerald-700">{netAmount} ETB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={withdrawalMutation.isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md transition text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {withdrawalMutation.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('withdraw.processing')}</span>
                </>
              ) : (
                <span>{t('withdraw.submit')}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">{t('wallet.transactions')}</h3>
          <Badge variant="neutral">{transactions.length} {t('wallet.recent')}</Badge>
        </div>

        {transactionsLoading ? (
          <Spinner />
        ) : transactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            {t('wallet.noTransactions')}
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2-5 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {transaction.description}
                  </p>
                  <span className="text-10 text-slate-400">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className={`text-xs font-extrabold ${
                  transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} ETB
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}