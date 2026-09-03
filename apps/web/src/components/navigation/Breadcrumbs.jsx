/**
 * File: apps/web/src/components/navigation/Breadcrumbs.jsx
 * Yegna AI - Breadcrumbs Component
 * 
 * Breadcrumb navigation component.
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

/**
 * Breadcrumbs component
 */
export default function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();
  
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="breadcrumbs-item">
            {item.path ? (
              <Link href={item.path} className="breadcrumbs-link">
                {index === 0 && <Home size={14} />}
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumbs-current">
                {item.label}
              </span>
            )}
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={14} className="breadcrumbs-separator" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}