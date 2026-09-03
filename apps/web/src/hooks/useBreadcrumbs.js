/**
 * File: apps/web/src/hooks/useBreadcrumbs.js
 * Yegna AI - Breadcrumbs Hook
 * 
 * Custom hook for generating breadcrumb navigation.
 */

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import breadcrumbsConfig from '@yegna/config/src/breadcrumbs.config.json';

/**
 * Breadcrumbs hook
 * Generates breadcrumb items based on current route.
 * 
 * @returns {Array} Array of breadcrumb items
 */
export function useBreadcrumbs() {
  const router = useRouter();
  const { t } = useTranslation('navigation');
  
  const breadcrumbs = useMemo(() => {
    const pathname = router.pathname;
    
    // Default breadcrumb with home
    const items = [
      {
        label: t(breadcrumbsConfig.homeLabelKey || 'breadcrumbs.home'),
        path: '/',
        isCurrent: pathname === '/'
      }
    ];
    
    // Get route config
    const routeConfig = breadcrumbsConfig.routes[pathname];
    
    if (routeConfig) {
      for (const item of routeConfig) {
        items.push({
          label: t(item.labelKey),
          path: item.path,
          isCurrent: item.path === null
        });
      }
    }
    
    return items;
  }, [router.pathname, t]);
  
  return breadcrumbs;
}