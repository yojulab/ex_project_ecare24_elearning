import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MobileApp uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
          <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: 12, padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', margin: '0 0 8px 0', color: '#fee2e2' }}>
              🚨 모바일앱 렌더링 오류 (Runtime Error)
            </h2>
            <p style={{ fontSize: 14, color: '#fca5a5', margin: '0 0 12px 0' }}>
              화면 렌더링 중 예외가 발생했습니다:
            </p>
            <pre style={{ background: '#450a0a', padding: 12, borderRadius: 8, fontSize: 12, color: '#fecaca', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 16, background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
