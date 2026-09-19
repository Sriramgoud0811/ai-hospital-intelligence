/**
 * Compact & Full API Health Status Component
 * Monitors deployed FastAPI backend on Render:
 * - GET /health with 90s timeout
 * - 3x auto-retry with progressive backoff (5s, 10s, 20s)
 * - Exact states: Checking, Waking Up, Healthy, Unhealthy, Unavailable, Request Failed
 * - Clean user-friendly summary + expandable developer section
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldAlert,
  Server,
} from 'lucide-react';
import { getHealthStatus, latestApiDiagnostics } from '../../services/api';
import { HealthResponse, ApiStatusState } from '../../types/api';

interface ApiStatusBadgeProps {
  compact?: boolean;
}

export const ApiStatusBadge: React.FC<ApiStatusBadgeProps> = ({ compact = false }) => {
  const [status, setStatus] = useState<ApiStatusState>('Checking');
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const isCheckingRef = useRef(false);

  const performCheck = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setIsRefreshing(true);
    setRetryAttempt(0);

    try {
      const data = await getHealthStatus({
        onStatusChange: (newStatus, attempt) => {
          setStatus(newStatus);
          setRetryAttempt(attempt);
        },
      });

      setHealthData(data);
      if (data.status === 'healthy' && data.regression_loaded && data.classification_loaded) {
        setStatus('Healthy');
      } else {
        setStatus('Unhealthy');
      }
    } catch {
      // Final status is assigned by onStatusChange in api.ts
      setHealthData(latestApiDiagnostics.rawHealthData);
    } finally {
      setIsRefreshing(false);
      setLastChecked(new Date());
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    performCheck();
    // Re-verify periodically every 2 minutes
    const interval = setInterval(() => {
      performCheck();
    }, 120000);
    return () => clearInterval(interval);
  }, [performCheck]);

  // Color & indicator mappings
  const getStatusDotColor = () => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]';
      case 'Checking':
        return 'bg-cyan-400 animate-pulse';
      case 'Waking Up':
        return 'bg-amber-400 animate-pulse';
      case 'Unhealthy':
        return 'bg-orange-400';
      case 'Unavailable':
      case 'Request Failed':
      default:
        return 'bg-rose-400';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'Healthy':
        return 'Service Ready';
      case 'Checking':
        return 'Checking Service Status...';
      case 'Waking Up':
        return retryAttempt > 0 ? `Service Starting Up (${retryAttempt}/3)` : 'Service Starting Up';
      case 'Unhealthy':
        return 'Service Issue Detected';
      case 'Unavailable':
      case 'Request Failed':
      default:
        return 'Service Unavailable';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'Healthy':
        return 'text-emerald-400 font-semibold';
      case 'Checking':
        return 'text-cyan-300 font-medium';
      case 'Waking Up':
        return 'text-amber-300 font-medium';
      case 'Unhealthy':
        return 'text-orange-300 font-semibold';
      case 'Unavailable':
      case 'Request Failed':
      default:
        return 'text-rose-400 font-semibold';
    }
  };

  const formattedTime = lastChecked
    ? lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Not checked yet';

  const tooltipText = `System Status: ${getStatusLabel()}${
    lastChecked ? ` • Last checked: ${formattedTime}` : ''
  }${retryAttempt > 0 ? ` • Attempt ${retryAttempt}/3` : ''}`;

  if (compact) {
    return (
      <div
        id="api-health-badge-compact"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors bg-slate-900/80 backdrop-blur-md border-slate-700/80 shadow-sm"
        title={tooltipText}
        role="status"
        aria-live="polite"
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusDotColor()}`} />
        <span className="text-slate-300 text-xs hidden sm:inline">Service:</span>
        <span className={getStatusTextColor()}>{getStatusLabel()}</span>

        <button
          id="btn-retry-health"
          onClick={performCheck}
          disabled={isRefreshing}
          className="ml-1 p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
          aria-label="Retry Service Health Check"
          title="Retry Connection"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div
      id="api-health-status-card"
      className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-lg space-y-3.5 text-xs"
    >
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full shrink-0 ${getStatusDotColor()}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">Application Service:</span>
              <span className={`text-xs ${getStatusTextColor()}`}>{getStatusLabel()}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {status === 'Healthy' && 'Healthcare decision support tools are ready and operational.'}
              {status === 'Checking' && 'Checking connection to cloud services...'}
              {status === 'Waking Up' &&
                'Service starting up. Please allow a moment as the cloud service prepares.'}
              {status === 'Unhealthy' && 'The assessment service encountered an unexpected response. Please retry.'}
              {status === 'Unavailable' &&
                'The assessment service is temporarily unavailable. Please try again shortly.'}
              {status === 'Request Failed' &&
                'Unable to connect to the cloud service. Please check your connection and try again.'}
            </p>
          </div>
        </div>

        <button
          id="btn-recheck-health-full"
          onClick={performCheck}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition shadow-sm font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Check Connection</span>
        </button>
      </div>

      {/* Tool indicators and timestamp row */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthData?.regression_loaded ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
            <span>Hospital Stay Estimate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthData?.classification_loaded ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
            <span>30-Day Readmission Assessment</span>
          </span>
        </div>

        {lastChecked && (
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Checked: {formattedTime}</span>
          </span>
        )}
      </div>

      {/* Expandable Technical Details */}
      <div className="pt-2 border-t border-slate-800/60">
        <button
          id="btn-toggle-dev-health-details"
          onClick={() => setShowTechDetails(!showTechDetails)}
          className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 hover:text-slate-200 transition py-1"
        >
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connection & Cloud Service Details</span>
          </span>
          {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTechDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-[11px] font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400">
              <span>Target Endpoint:</span>
              <span className="text-cyan-300 break-all">{latestApiDiagnostics.lastCheckedUrl}</span>
            </div>

            <div className="flex items-center justify-between gap-2 text-slate-400">
              <span>HTTP Status:</span>
              <span
                className={
                  latestApiDiagnostics.lastResponseStatus === 200 ? 'text-emerald-400' : 'text-amber-400'
                }
              >
                {latestApiDiagnostics.lastResponseStatus ? `${latestApiDiagnostics.lastResponseStatus} OK` : 'None / In-Flight'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-slate-400">
              <span>Connection Route:</span>
              <span className="text-slate-300">
                {latestApiDiagnostics.isUsingProxy ? 'Same-Origin Proxy (Vite / Port 3000)' : 'Direct Request'}
              </span>
            </div>

            {latestApiDiagnostics.corsBlockedOnDirect && (
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-[10px] space-y-1">
                <span className="font-semibold text-cyan-300 block">CORS Diagnostic Note:</span>
                <p className="leading-relaxed">
                  Direct browser fetch was subject to cross-origin restriction because the backend lacks
                  <code className="text-white bg-slate-900 px-1 py-0.5 rounded ml-1">Access-Control-Allow-Origin</code>.
                  Requests are proxied via same-origin port 3000 to keep predictions fully functional.
                </p>
              </div>
            )}

            {healthData && (
              <div className="pt-1">
                <span className="text-slate-400 block mb-1">Raw GET /health Response:</span>
                <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-teal-300 overflow-x-auto">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
