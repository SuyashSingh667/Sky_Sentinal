import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  Cog6ToothIcon, 
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Mock system status and notifications for now
  const systemStatus = { status: 'operational', lastUpdate: new Date() };
  const notifications = [];
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'online':
        return <CheckCircleIcon className="w-4 h-4 text-neon-green" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <XMarkIcon className="w-4 h-4 text-red-400" />;
      default:
        return <SignalIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'offline':
        return 'System Offline';
      default:
        return 'Checking Status...';
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online':
        return 'text-neon-green';
      case 'degraded':
        return 'text-yellow-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 text-white">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <img
            src="/assets/skysentinal-logo.png"
            alt="SkySentinal Logo"
            className="h-10 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 8px rgba(204,183,174,0.3))' }}
          />
        </div>

        {/* Center Section - System Status */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-dark-lighter/50">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <div className={`w-2 h-2 rounded-full ${
            systemStatus === 'online' ? 'bg-neon-green animate-pulse' :
            systemStatus === 'degraded' ? 'bg-yellow-400 animate-pulse' :
            'bg-red-400 animate-pulse'
          }`} />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <Link
            to="/architecture"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-sand-vanilla/25 text-sand-vanilla hover:bg-sand-vanilla/10 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <span>See How It Works</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;