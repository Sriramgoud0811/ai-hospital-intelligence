/**
 * Regression Result Presentation Interface
 * Displays real FastAPI prediction for target: time_in_hospital
 */

import React, { useState } from 'react';
import {
  Clock,
  Check,
  Copy,
  Download,
  Printer,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { RegressionResponse, RegressionRequest } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';

interface RegressionResultProps {
  result: RegressionResponse;
  inputs: RegressionRequest;
  durationMs: number;
  timestamp?: string;
  onReset: () => void;
}

export const RegressionResult: React.FC<RegressionResultProps> = ({
  result,
  inputs,
  durationMs,
  timestamp,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const { toast } = useToast();

  const daysFormatted = result.prediction.toFixed(2);
  const clampedPercentage = Math.min(Math.max(((result.prediction - 1) / (14 - 1)) * 100, 4), 96);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      toast({ type: 'success', title: 'Copied to Clipboard', message: 'Raw API response JSON copied.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: 'error', title: 'Copy Failed', message: 'Unable to access clipboard.' });
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ model: 'Length-of-Stay Estimator Model', inputs, result, timestamp: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `length-of-stay-prediction-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ type: 'info', title: 'JSON Exported', message: 'Prediction encounter report downloaded.' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="regression-result-card"
      className="p-6 rounded-2xl border border-teal-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 print:bg-white print:text-black print:border-black"
    >
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 print:border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white print:text-black">
              Length-of-Stay Prediction Output
            </h3>
            <p className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-x-2">
              <span>Target: <span className="text-teal-400 font-semibold">{result.target}</span></span>
              <span>• Latency: {durationMs}ms</span>
              {timestamp && (
                <span className="text-slate-300">
                  • Predicted: <span className="text-teal-300">{timestamp}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 print:hidden">
          <button
            id="btn-copy-regression-result"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
            title="Copy JSON Response"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            id="btn-download-regression-json"
            onClick={handleDownloadJson}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
            title="Export as JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            id="btn-print-regression"
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
            title="Print Clinical Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Metric Number */}
      <div className="text-center py-4 px-6 rounded-xl bg-gradient-to-b from-teal-950/40 to-slate-950/60 border border-teal-800/40">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
          Estimated Hospital Stay
        </span>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            {daysFormatted}
          </span>
          <span className="text-lg font-medium text-slate-400">{result.unit}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Model target: <code className="text-teal-300 font-mono">time_in_hospital</code> (Clipped range: 1–14 days)
        </p>
      </div>

      {/* Horizontal Stay Duration Visualizer */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-300">
          <span>Short Stay (1–3d)</span>
          <span>Moderate (4–7d)</span>
          <span>Extended Stay (8–14d)</span>
        </div>

        {/* Progress Track */}
        <div className="relative h-4 w-full rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 transition-all duration-700 ease-out"
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>

        {/* Marker label */}
        <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
          <span>1 day</span>
          <span className="text-teal-400 font-semibold">▲ Encounter estimate: {daysFormatted} days</span>
          <span>14 days</span>
        </div>
      </div>

      {/* Cautious Interpretation Panel */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Analytical Interpretation</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          The model estimates the hospital stay based on the provided encounter information, prior utilization history, and clinical diagnosis codes. <strong className="text-slate-200">This estimate is not a guaranteed length of stay</strong> and should be considered an educational decision-support indicator for operational resource forecasting.
        </p>
      </div>

      {/* Encounter Summary Snapshot */}
      <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2">
        <span className="font-semibold text-slate-300 block">Encounter Input Snapshot:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500">Demographics:</span> {inputs.age}, {inputs.gender}
          </div>
          <div>
            <span className="text-slate-500">Prior Inpatient:</span> {inputs.number_inpatient} visits
          </div>
          <div>
            <span className="text-slate-500">Admission Type:</span> ID {inputs.admission_type_id}
          </div>
          <div>
            <span className="text-slate-500">Primary Diag:</span> <span className="font-mono text-cyan-300">{inputs.diag_1}</span>
          </div>
        </div>
      </div>

      {/* Technical API Response Accordion */}
      <div className="border border-slate-800 rounded-xl overflow-hidden print:hidden">
        <button
          id="btn-toggle-regression-json"
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full flex items-center justify-between p-3 bg-slate-950/80 text-xs font-mono text-slate-300 hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Raw FastAPI JSON Response
          </span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 overflow-x-auto">
            <pre className="text-[11px] font-mono text-cyan-300 leading-tight">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-2 print:hidden">
        <button
          id="btn-run-another-regression"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Run Another Prediction</span>
        </button>

        <button
          onClick={handleCopy}
          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Result</span>
        </button>
      </div>
    </div>
  );
};
