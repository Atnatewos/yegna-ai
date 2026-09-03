/**
 * File: apps/web/src/pages/404.jsx
 * Yegna AI - 404 Not Found Page
 */

import React from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { Home, Search } from 'lucide-react';

/**
 * 404 page component
 */
export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link href="/">
            <Button variant="primary">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}