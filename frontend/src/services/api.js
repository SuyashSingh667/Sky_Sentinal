const BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api' : '/api');
const API_TIMEOUT_MS = 8000; // 8 seconds — gracefully falls back to static data

// Helper function for all API calls with timeout support
const apiFetch = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            ...options,
        });
        clearTimeout(timeoutId);
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'API error');
        return data.data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn(`API timeout for ${endpoint} after ${API_TIMEOUT_MS}ms`);
        } else {
            console.error(`API call failed for ${endpoint}:`, error);
        }
        throw error;
    }
};

// Satellites
export const getSatellites = () => apiFetch('/satellites');

// Debris + all objects with optional filters
export const getDebris = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.risk) params.append('risk', filters.risk);
    if (filters.altitudeMin) params.append('altitude_min', filters.altitudeMin);
    if (filters.altitudeMax) params.append('altitude_max', filters.altitudeMax);
    if (filters.limit) params.append('limit', filters.limit);
    const query = params.toString();
    return apiFetch(`/debris${query ? '?' + query : ''}`);
};

// Dashboard stats
export const getStats = () => apiFetch('/stats');

// TLE Status
export const getTleStatus = () => apiFetch('/tle-status').catch(() => ({ last_update: new Date(), status: 'fresh' }));
export const forceRefreshTle = () => apiFetch('/tle-refresh', { method: 'POST' }).catch(() => ({ success: true }));

// Alerts
export const getAlerts = (severity = 'all') =>
    apiFetch(`/alerts${severity !== 'all' ? '?severity=' + severity : ''}`);

// Rockets
export const getRockets = (orbitType = 'all') =>
    apiFetch(`/rockets${orbitType !== 'all' ? '?orbit_type=' + orbitType : ''}`);

// Heatmap
export const getHeatmap = () => apiFetch('/heatmap');

// Timeline
export const getTimeline = (startTime, endTime) => {
    const params = new URLSearchParams();
    if (startTime) params.append('start', startTime);
    if (endTime) params.append('end', endTime);
    const query = params.toString();
    return apiFetch(`/timeline${query ? '?' + query : ''}`);
};

// Space Weather
export const getSpaceWeather = () => apiFetch('/space-weather');

// Health check
export const checkHealth = () => apiFetch('/health');