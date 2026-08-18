import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext';
// Initialize Sentry dynamically to avoid blocking main thread
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      ignoreErrors: [
        'WebSocket closed without opened',
        'failed to connect to websocket',
        'WebSocket connection to'
      ],
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }).catch(console.error);
}

// Safely suppress benign third-party browser extension errors (e.g. MetaMask, Web3 wallets, Chrome extensions)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    // Reload page if a new deployment removed old hashed chunk files
    window.location.reload();
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason?.toString() || '';
    if (
      reason.includes('MetaMask') ||
      reason.includes('ethereum') ||
      reason.includes('wallet') ||
      reason.includes('Extension context invalidated') ||
      reason.includes('chrome-extension://')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    const file = event.filename || '';
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      file.includes('chrome-extension://') ||
      file.includes('moz-extension://')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
