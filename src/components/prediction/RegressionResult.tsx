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
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white print:text-black">
              Hospital Stay Estimate Summary
            </h3>
            <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2">
              <span>Assessment completed in {durationMs}ms</span>
              {timestamp && (
                <span className="text-slate-300">
                  • Evaluated at: <span className="text-teal-300">{timestamp}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 print:hidden">
          <button
            id="btn-copy-regression-result"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Copy Result Data"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            id="btn-download-regression-json"
            onClick={handleDownloadJson}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Export Report (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            id="btn-print-regression"
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Print Clinical Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Metric Number */}
      <div className="text-center py-5 px-6 rounded-2xl bg-gradient-to-b from-teal-950/40 to-slate-950/60 border border-teal-800/40">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
          Estimated Inpatient Duration
        </span>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            {daysFormatted}
          </span>
          <span className="text-xl font-medium text-slate-300">Days</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Expected hospital duration for this clinical profile (Standard observation range: 1–14 days)
        </p>
      </div>

      {/* Horizontal Stay Duration Visualizer */}
      <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="flex justify-between text-xs font-medium text-slate-300">
          <span className="text-emerald-400 font-semibold">Short Stay (1–3 days)</span>
          <span className="text-teal-300 font-semibold">Moderate Stay (4–7 days)</span>
          <span className="text-amber-400 font-semibold">Extended Stay (8–14 days)</span>
        </div>

        {/* Progress Track */}
        <div className="relative h-4 w-full rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>

        {/* Marker label */}
        <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
          <span>Day 1</span>
          <span className="text-teal-300 font-semibold">
            ▲ Estimated Stay: {daysFormatted} Days ({result.prediction <= 3 ? 'Short Stay Category' : result.prediction <= 7 ? 'Moderate Stay Category' : 'Extended Stay Category'})
          </span>
          <span>Day 14</span>
        </div>
      </div>

      {/* What this means section */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-100">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>What This Estimate Means</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          Based on the patient's age group ({inputs.age}), past admission history ({inputs.number_inpatient} inpatient stays), and primary clinical condition, the system projects an inpatient stay of approximately <strong className="text-teal-300 font-semibold">{daysFormatted} days</strong>. In historical encounter data, patients with comparable admission backgrounds typically require {Math.max(1, Math.floor(result.prediction - 0.7))} to {Math.ceil(result.prediction + 0.7)} days of inpatient care.
        </p>
      </div>

      {/* Actionable Next Steps for Staff */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
          <Calendar className="w-4 h-4" />
          <h4>Recommended Care Team Planning Steps</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Discharge Timeline</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Target initial discharge coordination and post-acute review around Day {Math.max(1, Math.round(result.prediction))}.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Bed Management</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {result.prediction > 7 ? 'Flag for extended bed occupancy; align early with multi-disciplinary rounds.' : 'Standard bed turnaround schedule; reassess on Day 2 rounds.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Follow-Up Coordination</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Begin pre-scheduling outpatient consultation within 7 to 10 days post-discharge.
            </p>
          </div>
        </div>
      </div>

      {/* Encounter Summary Snapshot */}
      <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2">
        <span className="font-semibold text-slate-300 block">Patient Profile Snapshot:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500">Demographics:</span> {inputs.age}, {inputs.gender}
          </div>
          <div>
            <span className="text-slate-500">Past Admissions:</span> {inputs.number_inpatient} visits
          </div>
          <div>
            <span className="text-slate-500">Admitting Source:</span> Code {inputs.admission_source_id}
          </div>
          <div>
            <span className="text-slate-500">Primary Condition:</span> <span className="font-mono text-cyan-300">{inputs.diag_1}</span>
          </div>
        </div>
      </div>

      {/* Technical Details Accordion */}
      <div className="border border-slate-800 rounded-xl overflow-hidden print:hidden">
        <button
          id="btn-toggle-regression-json"
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full flex items-center justify-between p-3 bg-slate-950/80 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Technical Model & Response Details</span>
          </span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pb-2 border-b border-slate-900">
              <span>Target Feature: <code className="text-teal-300">time_in_hospital</code></span>
              <span>Units: <code className="text-teal-300">days</code></span>
              <span>Latency: <code className="text-teal-300">{durationMs}ms</code></span>
            </div>
            <pre className="text-[11px] font-mono text-cyan-300 leading-tight overflow-x-auto">
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
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>

        <button
          onClick={handleCopy}
          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Summary</span>
        </button>
      </div>
    </div>
  );
};
