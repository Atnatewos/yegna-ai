/**
 * File: apps/web/src/pages/_document.jsx
 * Yegna AI - Document Component
 * 
 * Custom HTML document wrapper.
 */

import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Document component
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/logo/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="description" content="Yegna AI - Ethiopia's AI Training Platform" />
        <meta name="theme-color" content="#4F46E5" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}