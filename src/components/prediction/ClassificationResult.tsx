/**
 * Classification Result Presentation Interface
 * Displays real FastAPI prediction for target: target_readmit_30d
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Copy,
  Download,
  Printer,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
  TrendingUp,
} from 'lucide-react';
import { ClassificationResponse, ClassificationRequest } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';

interface ClassificationResultProps {
  result: ClassificationResponse;
  inputs: ClassificationRequest;
  durationMs: number;
  timestamp?: string;
  onReset: () => void;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({
  result,
  inputs,
  durationMs,
  timestamp,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const { toast } = useToast();

  const isRiskIdentified = result.prediction === 1;
  const probabilityPercent = (result.probability * 100).toFixed(2);
  const thresholdPercent = (result.threshold * 100).toFixed(2);

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.probability * circumference);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      toast({ type: 'success', title: 'Copied to Clipboard', message: 'Classification response copied.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ type: 'error', title: 'Copy Failed', message: 'Clipboard access not available.' });
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ model: '30-Day Readmission Risk Evaluator', inputs, result, timestamp: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `readmission-prediction-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ type: 'info', title: 'JSON Exported', message: 'Classification record downloaded.' });
  };

  return (
    <div
      id="classification-result-card"
      className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 print:bg-white print:text-black print:border-black"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 print:border-gray-300">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isRiskIdentified
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isRiskIdentified ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white print:text-black">
              30-Day Readmission Risk Evaluation
            </h3>
            <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2">
              <span>Assessment completed in {durationMs}ms</span>
              {timestamp && (
                <span className="text-slate-300">
                  • Evaluated at: <span className="text-cyan-300">{timestamp}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 print:hidden">
          <button
            id="btn-copy-classification-result"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Copy Result Data"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            id="btn-download-classification-json"
            onClick={handleDownloadJson}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Export Report (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            id="btn-print-classification"
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Print Clinical Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Metric Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-xl bg-gradient-to-b from-slate-950/80 to-slate-950/40 border border-slate-800">
        {/* Left: Circular Probability Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`${
                  isRiskIdentified ? 'text-amber-400' : 'text-emerald-400'
                } stroke-current transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                {probabilityPercent}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Risk Probability</span>
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-slate-400">
            Readmission Likelihood: <span className="font-mono text-cyan-300">{probabilityPercent}%</span>
          </div>
        </div>

        {/* Right: Decision Status & Threshold Marker */}
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Readmission Risk Classification
            </span>
            <div className="mt-1.5">
              {isRiskIdentified ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>High Readmission Risk ({probabilityPercent}%)</span>
                </div>
              ) : result.probability >= 0.35 ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Moderate Readmission Risk ({probabilityPercent}%)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Low Readmission Risk ({probabilityPercent}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Threshold Comparison */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Hospital Risk Benchmark Cutoff:
              </span>
              <span className="font-mono font-semibold text-white">
                {thresholdPercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Patient estimated risk (<strong className="text-cyan-300">{probabilityPercent}%</strong>) is{' '}
              {result.probability >= result.threshold ? (
                <span className="text-amber-300 font-semibold">above the hospital attention threshold</span>
              ) : (
                <span className="text-emerald-300 font-semibold">below the hospital intervention threshold</span>
              )}{' '}
              ({thresholdPercent}%).
            </p>
          </div>
        </div>
      </div>

      {/* What this means section */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-100">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>What This Assessment Means</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          {isRiskIdentified ? (
            <>
              This patient has a <strong className="text-amber-300 font-semibold">higher likelihood of unplanned return within 30 days</strong>, influenced primarily by previous inpatient stays ({inputs.number_inpatient} visits), stay complexity ({inputs.time_in_hospital} days), and medication management during admission ({inputs.change === 'Ch' ? 'medication dosage was changed' : 'steady regimen'}). Proactive discharge coordination is advised.
            </>
          ) : (
            <>
              This patient exhibits a <strong className="text-emerald-300 font-semibold">standard or lower risk profile for 30-day readmission</strong>. Continuing standard post-discharge care and verifying follow-up appointments will help maintain positive outpatient recovery.
            </>
          )}
        </p>
      </div>

      {/* Actionable Care Recommendations */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-4 h-4" />
          <h4>Actionable Care Team Recommendations</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Follow-Up Phone Call</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Conduct structured clinical check-in call within 48 to 72 hours of discharge.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Medication Reconciliation</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Verify prescription changes, insulin instructions, and reconcile {inputs.num_medications} medications.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Primary Care Scheduling</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Confirm confirmed follow-up visit scheduled with doctor prior to hospital discharge.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-200 block text-[11px]">Patient Education</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Deliver clear, written instructions on red-flag symptoms and glycemic control warning signs.
            </p>
          </div>
        </div>
      </div>

      {/* Input Snapshot */}
      <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2">
        <span className="font-semibold text-slate-300 block">Patient Profile Snapshot:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500">Demographics:</span> {inputs.age}, {inputs.gender}
          </div>
          <div>
            <span className="text-slate-500">Stay Duration:</span> {inputs.time_in_hospital} days
          </div>
          <div>
            <span className="text-slate-500">Insulin Status:</span> {inputs.insulin}
          </div>
          <div>
            <span className="text-slate-500">Primary Condition:</span> <span className="font-mono text-cyan-300">{inputs.diag_1}</span>
          </div>
        </div>
      </div>

      {/* Raw Response JSON Accordion */}
      <div className="border border-slate-800 rounded-xl overflow-hidden print:hidden">
        <button
          id="btn-toggle-classification-json"
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full flex items-center justify-between p-3 bg-slate-950/80 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Model & Response Details</span>
          </span>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pb-2 border-b border-slate-900">
              <span>Target: <code className="text-cyan-300">target_readmit_30d</code></span>
              <span>Raw Probability: <code className="text-cyan-300">{result.probability.toFixed(6)}</code></span>
              <span>Threshold: <code className="text-cyan-300">{result.threshold}</code></span>
              <span>Classification Code: <code className="text-cyan-300">{result.prediction}</code></span>
            </div>
            <pre className="text-[11px] font-mono text-cyan-300 leading-tight overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 print:hidden">
        <button
          id="btn-run-another-classification"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>

        <button
          onClick={handleCopy}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Summary</span>
        </button>
      </div>
    </div>
  );
};
