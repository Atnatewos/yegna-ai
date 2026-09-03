/**
 * File: apps/web/src/context/ConfigContext.jsx
 * Yegna AI - Configuration Context
 * 
 * Provides platform configuration throughout the app.
 */

import React, { createContext, useMemo } from 'react';
import levelsConfig from '@yegna/config/src/levels.config.json';
import commissionConfig from '@yegna/config/src/commission.config.json';
import tasksConfig from '@yegna/config/src/tasks.config.json';
import paymentConfig from '@yegna/config/src/payment.config.json';
import navigationConfig from '@yegna/config/src/navigation.config.json';
import iconsConfig from '@yegna/config/src/icons.config.json';

/**
 * Create configuration context
 */
export const ConfigContext = createContext(null);

/**
 * Configuration provider component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ConfigProvider({ children }) {
  const config = useMemo(() => ({
    levels: levelsConfig,
    commission: commissionConfig,
    tasks: tasksConfig,
    payment: paymentConfig,
    navigation: navigationConfig,
    icons: iconsConfig,
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Yegna AI',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }), []);
  
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}