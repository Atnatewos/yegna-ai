/**
 * File: apps/web/src/pages/_app.jsx
 * Yegna AI - App Component
 * 
 * Main application wrapper component.
 * Imports all global styles and providers.
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';
import { ConfigProvider } from '../context/ConfigContext';
import { LanguageProvider } from '../context/LanguageContext';
import { i18n } from '@yegna/i18n';
import RootLayout from '../components/layout/RootLayout';

/* Design System Styles */
import '../styles/variables.css';
import '../styles/globals.css';

/* Component Styles */
import '../styles/components/layout.css';
import '../styles/components/card.css';
import '../styles/components/button.css';
import '../styles/components/form.css';
import '../styles/components/table.css';
import '../styles/components/responsive.css';
import '../styles/components/animations.css';

/**
 * Create QueryClient instance with default options
 * - retry: 1 (retry failed queries once)
 * - refetchOnWindowFocus: false (don't refetch when window regains focus)
 * - staleTime: 30000 (data is fresh for 30 seconds)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000
    }
  }
});

/**
 * Main App component
 * Wraps all pages with necessary providers for:
 * - React Query (data fetching)
 * - i18n (internationalization)
 * - Config (platform settings)
 * - Auth (authentication)
 * - Language (language preference)
 * 
 * @param {object} props - Component props
 * @param {React.ComponentType} props.Component - Page component
 * @param {object} props.pageProps - Page props
 */
export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ConfigProvider>
          <AuthProvider>
            <LanguageProvider>
              <RootLayout>
                <Component {...pageProps} />
              </RootLayout>
            </LanguageProvider>
          </AuthProvider>
        </ConfigProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}