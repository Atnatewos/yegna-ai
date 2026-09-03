/**
 * File: apps/web/src/pages/wallet/withdraw.jsx
 * Yegna AI - Withdrawal Page
 * 
 * Allows users to request withdrawals.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { createWithdrawal, getWithdrawalSettings, getBalance } from '../../services/walletService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import { Phone, Landmark, Building2, Wallet } from 'lucide-react';

/**
 * Withdrawal method icon mapping
 */
const withdrawalIcons = {
  phone: Phone,
  bank: Landmark,
  building: Building2
};

/**
 * Withdrawal page component
 */
export default function WithdrawPage() {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('wallet');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountDetails, setAccountDetails] = useState({});
  
  /**
   * Fetch withdrawal settings
   */
  const { data: settingsData, isLoading: settingsLoading } = useQuery(
    'withdrawalSettings',
    getWithdrawalSettings,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Fetch wallet balance
   */
  const { data: balanceData } = useQuery(
    'walletBalance',
    getBalance,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Create withdrawal mutation
   */
  const withdrawalMutation = useMutation(
    (withdrawalData) => createWithdrawal(withdrawalData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('withdraw.success'));
        router.push('/wallet');
      },
      onError: (error) => {
        showErrorToast(error.message || t('withdraw.error'));
      }
    }
  );
  
  const withdrawalConfig = settingsData?.data?.withdrawal_config || {
    minimum: 100,
    maximum: 10000,
    feePercentage: 2
  };
  
  const methods = withdrawalConfig.methods || [];
  const balance = balanceData?.data?.balance || 0;
  
  /**
   * Calculate fee and net amount
   */
  const fee = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    return (amountNum * withdrawalConfig.feePercentage) / 100;
  }, [amount, withdrawalConfig.feePercentage]);
  
  const netAmount = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    return amountNum - fee;
  }, [amount, fee]);
  
  /**
   * Handle withdrawal submission
   */
  const handleWithdraw = useCallback(() => {
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum < withdrawalConfig.minimum) {
      showErrorToast(t('withdraw.minAmount', { amount: withdrawalConfig.minimum }));
      return;
    }
    
    if (amountNum > withdrawalConfig.maximum) {
      showErrorToast(t('withdraw.maxAmount', { amount: withdrawalConfig.maximum }));
      return;
    }
    
    if (amountNum > balance) {
      showErrorToast(t('withdraw.insufficientBalance'));
      return;
    }
    
    if (!selectedMethod) {
      showErrorToast(t('withdraw.selectMethod'));
      return;
    }
    
    if (!accountDetails || Object.keys(accountDetails).length === 0) {
      showErrorToast(t('withdraw.accountDetailsRequired'));
      return;
    }
    
    withdrawalMutation.mutate({
      amount: amountNum,
      paymentMethod: selectedMethod,
      accountDetails
    });
  }, [amount, balance, selectedMethod, accountDetails, withdrawalConfig, withdrawalMutation, showErrorToast, t]);
  
  if (settingsLoading) {
    return (
      <div className="withdraw-page">
        <div className="withdraw-loading">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <Breadcrumbs />
        
        <div className="withdraw-header">
          <h1 className="withdraw-title">{t('withdraw.title')}</h1>
          <p className="withdraw-subtitle">{t('withdraw.subtitle')}</p>
        </div>
        
        <div className="withdraw-balance">
          <Card className="withdraw-balance-card">
            <div className="withdraw-balance-icon">
              <Wallet size={24} />
            </div>
            <div>
              <p className="withdraw-balance-label">{t('withdraw.availableBalance')}</p>
              <p className="withdraw-balance-value">{balance} ETB</p>
            </div>
          </Card>
        </div>
        
        <Card className="withdraw-section">
          <h3 className="withdraw-section-title">{t('withdraw.amount')}</h3>
          
          <Input
            label={t('withdraw.amountLabel')}
            type="number"
            placeholder={t('withdraw.amountPlaceholder')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint={t('withdraw.amountHint', {
              min: withdrawalConfig.minimum,
              max: withdrawalConfig.maximum
            })}
          />
          
          <div className="withdraw-amount-summary">
            <div className="withdraw-summary-item">
              <span className="withdraw-summary-label">{t('withdraw.fee')}</span>
              <span className="withdraw-summary-value">{fee} ETB</span>
            </div>
            <div className="withdraw-summary-item">
              <span className="withdraw-summary-label">{t('withdraw.netAmount')}</span>
              <span className="withdraw-summary-value withdraw-summary-total">
                {netAmount} ETB
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="withdraw-section">
          <h3 className="withdraw-section-title">{t('withdraw.selectMethod')}</h3>
          
          <div className="withdraw-methods-grid">
            {methods.map((method) => {
              const Icon = withdrawalIcons[method.icon] || Building2;
              
              return (
                <button
                  key={method.id}
                  type="button"
                  className={`withdraw-method-card ${selectedMethod === method.id ? 'withdraw-method-card-selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <Icon size={24} />
                  <span>{t(method.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </Card>
        
        {selectedMethod && (
          <Card className="withdraw-section">
            <h3 className="withdraw-section-title">{t('withdraw.accountDetails')}</h3>
            
            {selectedMethod === 'telebirr' && (
              <>
                <Input
                  label={t('withdraw.phoneNumber')}
                  type="tel"
                  placeholder="09XXXXXXXX"
                  onChange={(e) => setAccountDetails({ phone: e.target.value })}
                />
                <Input
                  label={t('withdraw.accountName')}
                  type="text"
                  placeholder={t('withdraw.accountNamePlaceholder')}
                  onChange={(e) => setAccountDetails((prev) => ({ ...prev, name: e.target.value }))}
                />
              </>
            )}
            
            {selectedMethod === 'cbe_birr' && (
              <>
                <Input
                  label={t('withdraw.accountNumber')}
                  type="text"
                  placeholder={t('withdraw.accountNumberPlaceholder')}
                  onChange={(e) => setAccountDetails({ accountNumber: e.target.value })}
                />
                <Input
                  label={t('withdraw.accountName')}
                  type="text"
                  placeholder={t('withdraw.accountNamePlaceholder')}
                  onChange={(e) => setAccountDetails((prev) => ({ ...prev, name: e.target.value }))}
                />
              </>
            )}
            
            {selectedMethod === 'bank_account' && (
              <>
                <Input
                  label={t('withdraw.bankName')}
                  type="text"
                  placeholder={t('withdraw.bankNamePlaceholder')}
                  onChange={(e) => setAccountDetails((prev) => ({ ...prev, bank: e.target.value }))}
                />
                <Input
                  label={t('withdraw.accountNumber')}
                  type="text"
                  placeholder={t('withdraw.accountNumberPlaceholder')}
                  onChange={(e) => setAccountDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
                />
                <Input
                  label={t('withdraw.accountName')}
                  type="text"
                  placeholder={t('withdraw.accountNamePlaceholder')}
                  onChange={(e) => setAccountDetails((prev) => ({ ...prev, name: e.target.value }))}
                />
              </>
            )}
          </Card>
        )}
        
        <Alert
          type="info"
          message={t('withdraw.processingTime', { hours: withdrawalConfig.processingHours })}
        />
        
        <div className="withdraw-actions">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            {t('withdraw.cancel')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleWithdraw}
            loading={withdrawalMutation.isLoading}
          >
            {t('withdraw.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}