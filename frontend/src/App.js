import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Pages
import CombinedDashboard from './pages/CombinedDashboard';
import Dashboard from './pages/Dashboard';
import Visualization3D from './pages/Visualization3D';
import Rockets from './pages/Rockets';
import Satellites from './pages/Satellites';
import Alerts from './pages/Alerts';
import Simulation from './pages/Simulation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SpaceWeather from './pages/SpaceWeather';
import Architecture from './pages/Architecture';

// Main App Layout Component
const AppLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full bg-black"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<CombinedDashboard />} />
                <Route path="/3d-visualization" element={<Visualization3D />} />
                <Route path="/rockets" element={<Rockets />} />
                <Route path="/satellites" element={<Satellites />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/space-weather" element={<SpaceWeather />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <Routes>
            {/* Main Application Routes */}
            <Route path="/*" element={<AppLayout />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#ffffff',
                border: '1px solid #00ffff',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#00ffff',
                  secondary: '#1a1a2e',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff6b6b',
                  secondary: '#1a1a2e',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;