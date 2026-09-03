/**
 * File: apps/web/src/pages/_document.jsx
 * Yegna AI - Document Component
 * 
 * Custom HTML document wrapper with comprehensive SEO, 
 * Open Graph, and security meta tags.
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yegna-ai.com';

  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Yegna AI - Ethiopia's Premier AI Training Platform. Earn daily income by training AI models and build your team." />
        <meta name="keywords" content="Yegna AI, Ethiopia AI, AI Training, Earn ETB, Artificial Intelligence, Amharic NLP, Crowdsourced AI" />
        <meta name="author" content="Yegna AI Platform" />
        <meta name="theme-color" content="#047857" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={appUrl} />
        <meta property="og:title" content="Yegna AI - Ethiopia's Premier AI Training Platform" />
        <meta property="og:description" content="Earn daily income by training AI models and build your team with Yegna AI." />
        <meta property="og:image" content={`${appUrl}/images/logo/og-image.png`} />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={appUrl} />
        <meta property="twitter:title" content="Yegna AI - Ethiopia's Premier AI Training Platform" />
        <meta property="twitter:description" content="Earn daily income by training AI models and build your team with Yegna AI." />
        <meta property="twitter:image" content={`${appUrl}/images/logo/og-image.png`} />
        
        {/* Favicons */}
        <link rel="icon" href="/images/logo/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}