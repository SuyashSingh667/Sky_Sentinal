import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-gradient flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-8 max-w-lg w-full text-center border border-red-500 border-opacity-30">
            <div className="text-6xl mb-4">🛰️</div>
            <h1 className="text-2xl font-cyber text-red-400 mb-4">
              System Error Detected
            </h1>
            <p className="text-gray-300 mb-6">
              SkySentinal encountered an unexpected error. Our mission control team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-neon"
            >
              Restart Mission
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-neon-blue cursor-pointer mb-2">
                  Technical Details
                </summary>
                <pre className="text-xs text-gray-400 bg-black bg-opacity-50 p-4 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring function
function sendToAnalytics(metric) {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance metric:', metric);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'Exo 2, sans-serif'
            },
            success: {
              iconTheme: {
                primary: '#00ff00',
                secondary: '#ffffff',
              },
              style: {
                borderColor: 'rgba(0, 255, 0, 0.3)',
              }
            },
            error: {
              iconTheme: {
                primary: '#ff0000',
                secondary: '#ffffff',
              },
              style: {
                borderColor: 'rgba(255, 0, 0, 0.3)',
              }
            },
            loading: {
              iconTheme: {
                primary: '#00ffff',
                secondary: '#ffffff',
              },
              style: {
                borderColor: 'rgba(0, 255, 255, 0.3)',
              }
            }
          }}
        />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals(sendToAnalytics);