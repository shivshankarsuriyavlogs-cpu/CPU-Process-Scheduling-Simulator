import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CPU Scheduling Simulator runtime error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <section style={{
            width: 'min(720px, 100%)',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(15,23,42,.08)'
          }}>
            <h1 style={{ margin: '0 0 10px', color: '#b91c1c', fontSize: '24px' }}>
              CPU Simulator failed to start
            </h1>
            <p style={{ margin: '0 0 16px', color: '#475569' }}>
              The page loaded, but a JavaScript error stopped the React app.
            </p>
            <pre style={{
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              background: '#f1f5f9',
              padding: '14px',
              borderRadius: '10px',
              color: '#0f172a'
            }}>{this.state.error.message}</pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                border: 0,
                borderRadius: '10px',
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reload
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<main style="padding:40px;font-family:system-ui">CPU Simulator: root element not found.</main>';
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
