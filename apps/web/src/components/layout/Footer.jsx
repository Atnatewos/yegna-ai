/**
 * File: apps/web/src/components/layout/Footer.jsx
 * Yegna AI - Footer Component
 */

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          © {currentYear} Yegna AI (የኛ AI) Platform. Ethiopian Artificial Intelligence Institute Partner.
        </p>
        <div className="footer-links">
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Service</Link>
          <Link href="/contact" className="footer-link">Telebirr Integration</Link>
        </div>
      </div>
    </footer>
  );
}