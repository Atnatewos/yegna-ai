/**
 * File: apps/web/src/pages/levels/upgrade.jsx
 * Yegna AI - Level Upgrade Page
 * 
 * Allows users to upgrade their membership level.
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/useTranslation';
import { useConfig } from '../../hooks/useConfig';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import { Award, Check, ArrowRight } from 'lucide-react';

/**
 * Level upgrade page component
 */
export default function UpgradeLevelPage() {
  const router = useRouter();
  const { level: levelId } = router.query;
  const { t } = useTranslation('levels');
  const { levels } = useConfig();
  
  const selectedLevelId = levelId ? parseInt(levelId) : null;
  const selectedLevel = levels.levels.find((level) => level.id === selectedLevelId);
  
  /**
   * Handle proceed to deposit
   */
  const handleProceedToDeposit = useCallback(() => {
    router.push(`/wallet/deposit?level=${selectedLevelId}`);
  }, [router, selectedLevelId]);
  
  if (!selectedLevel) {
    return (
      <div className="upgrade-page">
        <div className="upgrade-container">
          <Breadcrumbs />
          <Alert
            type="error"
            title={t('levels.levelNotFound')}
            message={t('levels.levelNotFoundDescription')}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="upgrade-page">
      <div className="upgrade-container">
        <Breadcrumbs />
        
        <div className="upgrade-header">
          <h1 className="upgrade-title">
            {t('levels.upgradeTitle', { level: t(selectedLevel.nameKey) })}
          </h1>
        </div>
        
        <Card className="upgrade-card">
          <div className="upgrade-level-overview">
            <div className="upgrade-level-icon" style={{ backgroundColor: selectedLevel.color }}>
              <Award size={48} />
            </div>
            <h2 className="upgrade-level-name">{t(selectedLevel.nameKey)}</h2>
            <Badge variant="warning">{t('levels.popular')}</Badge>
          </div>
          
          <div className="upgrade-deposit-amount">
            <p className="upgrade-deposit-label">{t('levels.depositAmount')}</p>
            <p className="upgrade-deposit-value">
              {selectedLevel.deposit.toLocaleString()} ETB
            </p>
          </div>
          
          <div className="upgrade-benefits">
            <h3 className="upgrade-benefits-title">{t('levels.benefits')}</h3>
            <div className="upgrade-benefits-list">
              <div className="upgrade-benefit-item">
                <Check size={18} className="upgrade-check" />
                <span>
                  {selectedLevel.tasksPerDay} {t('levels.tasksPerDay')}
                </span>
              </div>
              <div className="upgrade-benefit-item">
                <Check size={18} className="upgrade-check" />
                <span>
                  {selectedLevel.incomePerTask} ETB {t('levels.perTask')}
                </span>
              </div>
              <div className="upgrade-benefit-item">
                <Check size={18} className="upgrade-check" />
                <span>
                  {selectedLevel.dailyIncome.toLocaleString()} ETB {t('levels.dailyIncome')}
                </span>
              </div>
              <div className="upgrade-benefit-item">
                <Check size={18} className="upgrade-check" />
                <span>
                  {selectedLevel.monthlyIncome.toLocaleString()} ETB {t('levels.monthlyIncome')}
                </span>
              </div>
              {selectedLevel.benefitsKeys?.map((benefitKey, index) => (
                <div key={index} className="upgrade-benefit-item">
                  <Check size={18} className="upgrade-check" />
                  <span>{t(benefitKey)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="upgrade-actions">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
            >
              {t('levels.cancel')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleProceedToDeposit}
            >
              {t('levels.proceedToDeposit')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}