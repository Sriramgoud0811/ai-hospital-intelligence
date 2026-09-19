/**
 * Session History Page
 * Displays encounter inferences computed during the active browser session
 * Supports raw payload inspection, export, and clean deletion
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Clock,
  ShieldAlert,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  FileCode2,
  Eye,
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'regression' | 'classification';
  inputs: any;
  result: any;
}

export const SessionHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { toast } = useToast();

  const loadHistory = () => {
    try {
      const stored = sessionStorage.getItem('clinical_predictions_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    sessionStorage.removeItem('clinical_predictions_history');
    setHistory([]);
    setSelectedItem(null);
    toast({ type: 'info', title: 'History Cleared', message: 'Session prediction cache wiped.' });
  };

  const handleExportAll = () => {
    if (history.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hospital-predictions-session-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ type: 'success', title: 'Export Generated', message: 'All session evaluations downloaded.' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Audit & Review Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Session Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review inferences computed during your current browser session. Stored purely in client memory.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All ({history.length})</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No Predictions Recorded Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run length-of-stay or readmission evaluations in the Prediction Studio to track encounter outputs here.
            </p>
          </div>
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-semibold shadow-lg shadow-teal-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Go to Prediction Studio</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* History List */}
          <div className="lg:col-span-7 space-y-3">
            {history.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-teal-500 bg-slate-900 shadow-md'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'regression'
                            ? 'bg-teal-500/20 text-teal-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {item.type === 'regression' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <ShieldAlert className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {item.type === 'regression'
                            ? 'Length-of-Stay Regressor'
                            : '30-Day Readmission Risk'}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.type === 'regression' ? (
                        <div>
                          <span className="text-sm font-bold text-teal-300 font-mono">
                            {item.result.prediction.toFixed(2)} days
                          </span>
                          <span className="block text-[10px] text-slate-500">Stay Duration</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-sm font-bold text-cyan-300 font-mono">
                            {(item.result.probability * 100).toFixed(1)}%
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {item.result.prediction === 1 ? 'Risk Class 1' : 'Class 0'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {selectedItem ? (
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-white">Encounter Payload Inspection</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(selectedItem.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Model Inference Output:</span>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                      {JSON.stringify(selectedItem.result, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Submitted Inputs:</span>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-60">
                      {JSON.stringify(selectedItem.inputs, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Select an encounter from the left to inspect detailed features and raw API output.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
