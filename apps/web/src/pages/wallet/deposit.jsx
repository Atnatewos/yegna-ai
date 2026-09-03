/**
 * File: apps/web/src/pages/wallet/deposit.jsx
 * Yegna AI - Deposit Page
 * 
 * Allows users to submit deposit requests for level upgrades.
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import { createDeposit, getPaymentMethods } from '../../services/walletService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import { Phone, Landmark, Building2, Upload, CheckCircle } from 'lucide-react';

/**
 * Payment method icon mapping
 */
const paymentIcons = {
  phone: Phone,
  bank: Landmark,
  building: Building2
};

/**
 * Deposit page component
 */
export default function DepositPage() {
  const router = useRouter();
  const { level: levelId } = router.query;
  const { showSuccessToast, showErrorToast } = useToast();
  const { t } = useTranslation('wallet');
  const { levels } = useConfig();
  const [selectedLevel, setSelectedLevel] = useState(levelId ? parseInt(levelId) : null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  
  /**
   * Fetch payment methods
   */
  const { data: paymentData, isLoading: paymentLoading } = useQuery(
    'paymentMethods',
    getPaymentMethods,
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  /**
   * Create deposit mutation
   */
  const depositMutation = useMutation(
    (depositData) => createDeposit(depositData),
    {
      onSuccess: (response) => {
        showSuccessToast(response.message || t('deposit.success'));
        router.push('/wallet');
      },
      onError: (error) => {
        showErrorToast(error.message || t('deposit.error'));
      }
    }
  );
  
  /**
   * Handle deposit submission
   */
  const handleDeposit = useCallback(() => {
    if (!selectedLevel) {
      showErrorToast(t('deposit.selectLevel'));
      return;
    }
    
    if (!selectedPayment) {
      showErrorToast(t('deposit.selectPayment'));
      return;
    }
    
    if (!paymentProofUrl) {
      showErrorToast(t('deposit.uploadProof'));
      return;
    }
    
    const level = levels.levels.find((l) => l.id === selectedLevel);
    
    depositMutation.mutate({
      levelId: selectedLevel,
      amount: level?.deposit || 0,
      paymentMethod: selectedPayment,
      paymentProofUrl
    });
  }, [selectedLevel, selectedPayment, paymentProofUrl, levels, depositMutation, showErrorToast, t]);
  
  const paymentMethods = paymentData?.data?.payment_methods || [];
  const availableLevels = levels.levels.filter((level) => level.id > 0);
  
  if (paymentLoading) {
    return (
      <div className="deposit-page">
        <div className="deposit-loading">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="deposit-page">
      <div className="deposit-container">
        <Breadcrumbs />
        
        <div className="deposit-header">
          <h1 className="deposit-title">{t('deposit.title')}</h1>
          <p className="deposit-subtitle">{t('deposit.subtitle')}</p>
        </div>
        
        <Card className="deposit-section">
          <h3 className="deposit-section-title">{t('deposit.selectLevel')}</h3>
          <div className="deposit-levels-grid">
            {availableLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                className={`deposit-level-card ${selectedLevel === level.id ? 'deposit-level-card-selected' : ''}`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="deposit-level-header">
                  <h4 className="deposit-level-name">{t(level.nameKey)}</h4>
                  {selectedLevel === level.id && (
                    <CheckCircle size={20} className="deposit-level-check" />
                  )}
                </div>
                <p className="deposit-level-amount">{level.deposit.toLocaleString()} ETB</p>
                <p className="deposit-level-detail">
                  {level.tasksPerDay} {t('deposit.tasksPerDay')} / {level.dailyIncome} ETB {t('deposit.daily')}
                </p>
              </button>
            ))}
          </div>
        </Card>
        
        <Card className="deposit-section">
          <h3 className="deposit-section-title">{t('deposit.paymentMethod')}</h3>
          <div className="deposit-payment-grid">
            {paymentMethods.map((method) => {
              const Icon = paymentIcons[method.icon] || Building2;
              
              return (
                <button
                  key={method.id}
                  type="button"
                  className={`deposit-payment-card ${selectedPayment === method.id ? 'deposit-payment-card-selected' : ''}`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="deposit-payment-icon">
                    <Icon size={24} />
                  </div>
                  <div className="deposit-payment-info">
                    <p className="deposit-payment-name">{t(method.labelKey)}</p>
                    <p className="deposit-payment-detail">
                      {method.number || method.account || method.bank}
                    </p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle size={20} className="deposit-payment-check" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
        
        <Card className="deposit-section">
          <h3 className="deposit-section-title">{t('deposit.uploadProof')}</h3>
          
          <Alert
            type="info"
            message={t('deposit.proofInfo')}
          />
          
          <div className="deposit-upload-area">
            <Input
              label={t('deposit.proofUrl')}
              type="text"
              placeholder={t('deposit.proofUrlPlaceholder')}
              icon={<Upload size={18} />}
              value={paymentProofUrl}
              onChange={(e) => setPaymentProofUrl(e.target.value)}
            />
          </div>
        </Card>
        
        <div className="deposit-actions">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            {t('deposit.cancel')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleDeposit}
            loading={depositMutation.isLoading}
          >
            {t('deposit.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}