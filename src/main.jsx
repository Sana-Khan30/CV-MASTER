import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Apply initial theme before React mounts to avoid flash and ensure
// `dark` class is present on documentElement according to saved preference only.
// Do NOT auto-apply based on system preference to keep auth page light by default.
try {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      // If user has explicit preference, respect it
      const useDark = stored === 'true';
      if (useDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      // No explicit preference: respect system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }
} catch (e) {
  // ignore in non-browser or restricted environments
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
