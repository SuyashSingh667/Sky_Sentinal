import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  BellIcon,
  ShieldExclamationIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  FireIcon,
  InformationCircleIcon,
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

import { isroSatellites } from '../data/isroSatellites';
import { getAlerts } from '../services/api';

// ── Priority order for sorting ──────────────────────────────────────────────
const STATUS_PRIORITY = { active: 0, investigating: 1, acknowledged: 2, resolved: 3 };
const SEVERITY_PRIORITY = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({ severity: [], status: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  // ── Map backend alert ──────────────────────────────────────────────────────
  const mapBackendAlert = (raw, index) => {
    const sev = raw.severity || 'low';
    const prob = (raw.collision_probability || 0) * 100;
    const missDist = raw.miss_distance || 0;
    const obj1Name = raw.object1?.name || 'Unknown Satellite';
    const obj2Name = raw.object2?.name || 'Unknown Debris';
    const recText = raw.recommendation || 'Continue routine monitoring';
    return {
      id: raw.id || `ISRO-CONJ-${String(index + 1).padStart(3, '0')}`,
      title: sev === 'critical' || sev === 'high' ? 'Potential Collision Detected' : 'Conjunction Warning',
      description: `${sev.charAt(0).toUpperCase() + sev.slice(1)} risk conjunction between ${obj1Name} and ${obj2Name}. ` +
        `Miss distance: ${missDist.toFixed(2)} km. Collision probability: ${prob.toFixed(4)}%. Altitude: ${raw.altitude || 0} km`,
      severity: sev,
      type: 'collision',
      status: raw.status === 'active' ? 'active' : raw.status === 'monitoring' ? 'investigating' : (raw.status || 'investigating'),
      source: 'SGP4/TLE',
      timestamp: raw.closest_approach_time ? new Date(raw.closest_approach_time) : new Date(),
      probability: prob,
      miss_distance: missDist,
      altitude: raw.altitude || 0,
      relative_velocity: raw.relative_velocity || 0,
      timeToEvent: raw.time_to_approach ? raw.time_to_approach / 60 : 0,
      affectedObjects: 2,
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedAt: null,
      object1: { name: obj1Name, type: raw.object1?.type === 'satellite' ? 'Satellite' : (raw.object1?.type || 'Satellite') },
      object2: { name: obj2Name, type: raw.object2?.type === 'debris' ? 'Debris' : (raw.object2?.type || 'Debris') },
      recommendations: sev === 'critical'
        ? [recText, 'Notify ISRO satellite operator', 'Alert ground control at ISTRAC']
        : sev === 'high'
          ? [recText, 'Prepare avoidance maneuver', 'Update orbital predictions via NORAD']
          : [recText, 'Update TLE tracking data', 'Log conjunction event'],
    };
  };

  // ── Fetch alerts ───────────────────────────────────────────────────────────
  const fetchLiveAlerts = async () => {
    try {
      const res = await getAlerts('all');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAlerts(res.data.map((a, i) => mapBackendAlert(a, i)));
      } else {
        throw new Error('Empty response');
      }
    } catch {
      const leoSats = isroSatellites.filter(s => s.orbit === 'LEO');
      const severities = ['critical', 'critical', 'high', 'high', 'medium', 'medium', 'low', 'low'];
      const debrisTypes = ['PSLV Stage-4 Body', 'GSLV Debris Fragment', 'Mission Payload Adapter',
        'Upper Stage Remnant', 'SRM Nozzle Fragment', 'Solar Panel Debris', 'CZ-3B Debris', 'Rokot Fragment'];
      setAlerts(leoSats.slice(0, 8).map((sat, i) => {
        const sev = severities[i % severities.length];
        const prob = sev === 'critical' ? 0.0012 + Math.random() * 0.002
          : sev === 'high' ? 0.0004 + Math.random() * 0.0008
          : sev === 'medium' ? 0.00005 + Math.random() * 0.0003
          : Math.random() * 0.00005;
        const missDist = sev === 'critical' ? 0.1 + Math.random() * 0.4
          : sev === 'high' ? 0.5 + Math.random() * 1.5
          : 2 + Math.random() * 8;
        const debris = debrisTypes[i % debrisTypes.length];
        const statuses = { critical: 'active', high: 'active', medium: 'investigating', low: 'acknowledged' };
        return {
          id: `ISRO-CONJ-${String(i + 1).padStart(3, '0')}`,
          title: sev === 'critical' || sev === 'high' ? 'Potential Collision Detected' : 'Conjunction Warning',
          description: `${sev.charAt(0).toUpperCase() + sev.slice(1)} risk conjunction between ${sat.name} ` +
            `and ${debris}. Miss distance: ${missDist.toFixed(2)} km. ` +
            `Collision probability: ${(prob * 100).toFixed(4)}%. Altitude: ${sat.altitude} km.`,
          severity: sev, type: 'collision',
          status: statuses[sev] || 'investigating',
          source: 'SGP4/TLE', timestamp: new Date(Date.now() - i * 3600000 * 2),
          probability: prob * 100, miss_distance: missDist, altitude: sat.altitude,
          relative_velocity: 7.2 + Math.random() * 1.8,
          timeToEvent: sev === 'critical' ? 30 + Math.random() * 90 : 120 + Math.random() * 1440,
          affectedObjects: 2, acknowledgedBy: null, acknowledgedAt: null, resolvedAt: null,
          object1: { name: sat.name, type: 'Satellite' },
          object2: { name: debris, type: 'Debris' },
          recommendations: sev === 'critical'
            ? ['Initiate collision avoidance maneuver immediately', 'Notify ISRO satellite operator', 'Alert ground control at ISTRAC']
            : sev === 'high'
              ? ['Monitor conjunction closely', 'Prepare avoidance maneuver', 'Update orbital predictions via NORAD']
              : ['Continue routine monitoring', 'Update TLE tracking data', 'Log conjunction event'],
        };
      }));
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => { fetchLiveAlerts(); }, []);
  useEffect(() => {
    if (!realTimeEnabled) return;
    const interval = setInterval(fetchLiveAlerts, 60000);
    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  // ── Filter + Sort: active first, then by severity ─────────────────────────
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.object1?.name?.toLowerCase().includes(q) ||
        a.object2?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.severity.length > 0)
      filtered = filtered.filter(a => filters.severity.includes(a.severity));
    if (filters.status.length > 0)
      filtered = filtered.filter(a => filters.status.includes(a.status));

    // Sort: status priority first (active first), then severity
    filtered.sort((a, b) => {
      const sp = (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9);
      if (sp !== 0) return sp;
      return (SEVERITY_PRIORITY[a.severity] ?? 9) - (SEVERITY_PRIORITY[b.severity] ?? 9);
    });

    return filtered;
  }, [alerts, searchQuery, filters]);

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedBy: 'Mission Controller', acknowledgedAt: new Date() } : a
    ));
    if (selectedAlert?.id === alertId)
      setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged' } : null);
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, status: 'resolved', resolvedAt: new Date() } : a
    ));
    if (selectedAlert?.id === alertId)
      setSelectedAlert(prev => prev ? { ...prev, status: 'resolved' } : null);
  };

  const exportData = (format) => {
    const rows = filteredAlerts.map(a => ({
      ID: a.id, Title: a.title, Severity: a.severity,
      Status: a.status, Source: a.source,
      Timestamp: a.timestamp.toISOString(),
      Probability: a.probability.toFixed(4) + '%',
      MissDistance: a.miss_distance?.toFixed(2) + ' km',
    }));
    const content = format === 'csv'
      ? [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n')
      : JSON.stringify(rows, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' }));
    a.download = `alerts.${format}`;
    a.click();
  };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const SEVERITY_STYLES = {
    critical: {
      border: 'border-l-red-500',
      badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      dot: 'bg-red-500',
      bar: 'bg-red-500',
      icon: <FireIcon className="w-4 h-4" />,
      label: 'CRITICAL',
    },
    high: {
      border: 'border-l-orange-500',
      badge: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
      glow: 'shadow-[0_0_14px_rgba(249,115,22,0.1)]',
      dot: 'bg-orange-500',
      bar: 'bg-orange-500',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
      label: 'HIGH',
    },
    medium: {
      border: 'border-l-yellow-500',
      badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
      glow: '',
      dot: 'bg-yellow-500',
      bar: 'bg-yellow-500',
      icon: <ShieldExclamationIcon className="w-4 h-4" />,
      label: 'MEDIUM',
    },
    low: {
      border: 'border-l-blue-500',
      badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      glow: '',
      dot: 'bg-blue-500',
      bar: 'bg-blue-500',
      icon: <InformationCircleIcon className="w-4 h-4" />,
      label: 'LOW',
    },
  };

  const STATUS_STYLES = {
    active: 'bg-red-500/20 text-red-300 border border-red-500/40',
    investigating: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    acknowledged: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
    resolved: 'bg-green-500/20 text-green-300 border border-green-500/40',
  };

  const STATUS_ICONS = {
    active: <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5" />,
    investigating: <EyeIcon className="w-3 h-3 mr-1" />,
    acknowledged: <ClockIcon className="w-3 h-3 mr-1" />,
    resolved: <CheckCircleIcon className="w-3 h-3 mr-1" />,
  };

  const sev = (s) => SEVERITY_STYLES[s] || SEVERITY_STYLES.low;

  // ── Dynamic filter toggle helper ───────────────────────────────────────────
  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      };
    });
  };

  const clearFilters = () => setFilters({ severity: [], status: [] });

  const activeFilterCount = filters.severity.length + filters.status.length;

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    total: alerts.length,
  }), [alerts]);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[#111]/80 border border-[#222] rounded-xl animate-pulse" />
          ))}
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#111]/80 border border-[#222] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 text-white">

      {/* ── Top Stats Bar ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active', value: stats.active, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', pulse: true },
          { label: 'Critical', value: stats.critical, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'High Risk', value: stats.high, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Investigating', value: stats.investigating, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Total Alerts', value: stats.total, color: 'text-gray-300', bg: 'bg-white/5 border-white/10' },
        ].map(({ label, value, color, bg, pulse }) => (
          <div key={label} className={`border rounded-xl px-4 py-3 flex flex-col gap-1 ${bg}`}>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
            <div className="flex items-center gap-1.5">
              {pulse && value > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search alerts, satellites, debris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-black/60 border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-gray-600 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}
        >
          <FunnelIcon className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Live toggle */}
        <button
          onClick={() => setRealTimeEnabled(r => !r)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all ${
            realTimeEnabled
              ? 'bg-green-500/15 border-green-500/40 text-green-300'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <SignalIcon className="w-4 h-4" />
          <span>{realTimeEnabled ? '● Live' : 'Paused'}</span>
        </button>

        {/* Refresh */}
        <button
          onClick={fetchLiveAlerts}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowTrendingUpIcon className="w-4 h-4" />
          <span>Refresh</span>
        </button>

        {/* Export */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-36 bg-[#111] border border-[#2a2a2a] rounded-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl">
            <button onClick={() => exportData('csv')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors">CSV</button>
            <button onClick={() => exportData('json')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors">JSON</button>
          </div>
        </div>

        {lastRefresh && (
          <span className="text-xs text-gray-600 ml-auto hidden sm:block">
            Updated {lastRefresh.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* ── Dynamic Filter Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 space-y-4"
          >
            {/* Severity filter row */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2.5">Severity</p>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map(s => {
                  const active = filters.severity.includes(s);
                  const st = sev(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleFilter('severity', s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active ? st.badge : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? st.dot : 'bg-gray-600'}`} />
                      {st.label}
                      <span className="text-[10px] opacity-60">
                        ({alerts.filter(a => a.severity === s).length})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status filter row */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2.5">Status</p>
              <div className="flex flex-wrap gap-2">
                {['active', 'investigating', 'acknowledged', 'resolved'].map(s => {
                  const active = filters.status.includes(s);
                  const style = STATUS_STYLES[s];
                  return (
                    <button
                      key={s}
                      onClick={() => toggleFilter('status', s)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active ? style : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {active && STATUS_ICONS[s]}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                      <span className="text-[10px] opacity-60 ml-1">
                        ({alerts.filter(a => a.status === s).length})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex justify-end pt-1 border-t border-[#1a1a1a]">
                <button onClick={clearFilters} className="text-xs text-gray-600 hover:text-white transition-colors">
                  ✕ Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active-first section label ──────────────────────────────────────── */}
      {filteredAlerts.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} — sorted by priority
          </span>
          {stats.active > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {stats.active} active
            </span>
          )}
        </div>
      )}

      {/* ── Alert Cards ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl">
            <CheckCircleIcon className="w-14 h-14 text-green-400/50" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-300 mb-1">No Alerts Found</h3>
              <p className="text-sm text-gray-600">
                {activeFilterCount > 0 || searchQuery ? 'Try adjusting your filters.' : 'All systems nominal.'}
              </p>
            </div>
            {(activeFilterCount > 0 || searchQuery) && (
              <button onClick={() => { clearFilters(); setSearchQuery(''); }}
                className="text-xs text-blue-400 hover:text-blue-300 underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => {
              const st = sev(alert.severity);
              const isActive = alert.status === 'active';
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                  onClick={() => setSelectedAlert(alert)}
                  className={`
                    relative bg-[#0d0d0d] border border-[#1e1e1e] border-l-4 ${st.border} rounded-xl p-4 cursor-pointer
                    hover:bg-[#111] hover:border-[#2a2a2a] transition-all duration-200 group
                    ${st.glow}
                    ${isActive ? 'ring-1 ring-red-500/20' : ''}
                  `}
                >
                  {/* Active pulse ring */}
                  {isActive && (
                    <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                  )}

                  <div className="flex items-start gap-4 pr-6">
                    {/* Severity icon bubble */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${st.badge}`}>
                      {st.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Row 1: Title + badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${st.badge}`}>
                          {st.label}
                        </span>
                        <span className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[alert.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                          {STATUS_ICONS[alert.status]}
                          {alert.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Row 2: Object pair */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs font-medium text-blue-400 truncate max-w-[140px]">{alert.object1?.name}</span>
                        <ChevronRightIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        <span className="text-xs text-orange-400 truncate max-w-[140px]">{alert.object2?.name}</span>
                      </div>

                      {/* Row 3: Key metrics */}
                      <div className="flex flex-wrap gap-4 text-xs mb-3">
                        <div>
                          <span className="text-gray-600">Prob.</span>
                          <span className={`ml-1 font-mono font-semibold ${alert.probability > 0.1 ? 'text-red-400' : alert.probability > 0.01 ? 'text-orange-400' : 'text-gray-300'}`}>
                            {alert.probability.toFixed(4)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Miss Dist.</span>
                          <span className={`ml-1 font-mono font-semibold ${alert.miss_distance < 0.5 ? 'text-red-400' : alert.miss_distance < 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                            {alert.miss_distance?.toFixed(2)} km
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Alt.</span>
                          <span className="ml-1 font-mono text-gray-300">{alert.altitude?.toFixed(0)} km</span>
                        </div>
                        {alert.timeToEvent > 0 && (
                          <div>
                            <span className="text-gray-600">TCA in</span>
                            <span className={`ml-1 font-mono font-semibold ${alert.timeToEvent < 60 ? 'text-red-400 animate-pulse' : alert.timeToEvent < 360 ? 'text-orange-400' : 'text-gray-300'}`}>
                              {alert.timeToEvent < 60
                                ? `${alert.timeToEvent.toFixed(0)}m`
                                : `${(alert.timeToEvent / 60).toFixed(1)}h`}
                            </span>
                          </div>
                        )}
                        <div className="ml-auto">
                          <span className="text-gray-700">{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Probability risk bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${st.bar}`}
                            style={{ width: `${Math.min(100, (alert.probability / 0.2) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-600 w-16 text-right">Risk level</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons — only for active */}
                  {isActive && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
                      <button
                        onClick={(e) => { e.stopPropagation(); acknowledgeAlert(alert.id); }}
                        className="flex-1 py-1.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); resolveAlert(alert.id); }}
                        className="flex-1 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}
                        className="flex-1 py-1.5 text-xs font-medium bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-colors"
                      >
                        Details →
                      </button>
                    </div>
                  )}

                  {/* Hover detail arrow */}
                  {!isActive && (
                    <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-[#0c0c0c] border border-[#1e1e1e] rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`flex items-start justify-between p-5 border-b border-[#1a1a1a] border-l-4 rounded-t-2xl ${sev(selectedAlert.severity).border}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${sev(selectedAlert.severity).badge}`}>
                    {sev(selectedAlert.severity).icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sev(selectedAlert.severity).badge}`}>
                        {sev(selectedAlert.severity).label}
                      </span>
                      <span className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLES[selectedAlert.status]}`}>
                        {STATUS_ICONS[selectedAlert.status]}
                        {selectedAlert.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{selectedAlert.title}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedAlert.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="text-gray-600 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Objects */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Primary Object', obj: selectedAlert.object1, color: 'text-blue-400', border: 'border-blue-500/20' },
                    { label: 'Secondary Object', obj: selectedAlert.object2, color: 'text-orange-400', border: 'border-orange-500/20' },
                  ].map(({ label, obj, color, border }) => (
                    <div key={label} className={`bg-[#111] border ${border} rounded-xl p-3`}>
                      <p className="text-xs text-gray-600 mb-1">{label}</p>
                      <p className={`text-sm font-semibold ${color}`}>{obj?.name}</p>
                      <p className="text-xs text-gray-500">{obj?.type}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Collision Prob.', value: `${selectedAlert.probability.toFixed(4)}%`, warn: selectedAlert.probability > 0.05 },
                    { label: 'Miss Distance', value: `${selectedAlert.miss_distance?.toFixed(2)} km`, warn: selectedAlert.miss_distance < 1 },
                    { label: 'Altitude', value: `${selectedAlert.altitude?.toFixed(0)} km` },
                    { label: 'Rel. Velocity', value: `${selectedAlert.relative_velocity?.toFixed(1)} km/s` },
                  ].map(({ label, value, warn }) => (
                    <div key={label} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{label}</p>
                      <p className={`text-base font-bold font-mono ${warn ? 'text-red-400' : 'text-white'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* TCA info */}
                {selectedAlert.timeToEvent > 0 && (
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 flex items-center gap-4">
                    <ClockIcon className="w-8 h-8 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Time to Closest Approach (TCA)</p>
                      <p className={`text-xl font-bold font-mono ${selectedAlert.timeToEvent < 60 ? 'text-red-400' : selectedAlert.timeToEvent < 360 ? 'text-orange-400' : 'text-white'}`}>
                        {selectedAlert.timeToEvent < 60
                          ? `${selectedAlert.timeToEvent.toFixed(0)} minutes`
                          : `${(selectedAlert.timeToEvent / 60).toFixed(1)} hours`}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-gray-600 mb-0.5">Event Time</p>
                      <p className="text-sm text-gray-300 font-mono">{selectedAlert.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    {selectedAlert.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-[#111] border border-[#1e1e1e] rounded-lg px-3 py-2.5">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]">
                  {selectedAlert.status === 'active' && (
                    <>
                      <button
                        onClick={() => acknowledgeAlert(selectedAlert.id)}
                        className="flex-1 min-w-[140px] py-2.5 text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => resolveAlert(selectedAlert.id)}
                        className="flex-1 min-w-[140px] py-2.5 text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {selectedAlert.status === 'acknowledged' && (
                    <button
                      onClick={() => resolveAlert(selectedAlert.id)}
                      className="flex-1 min-w-[140px] py-2.5 text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="flex-1 min-w-[140px] py-2.5 text-sm font-medium bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:text-white hover:border-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;