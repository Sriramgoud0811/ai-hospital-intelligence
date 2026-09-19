/**
 * API & OpenAPI Documentation Page
 * Details FastAPI schemas, endpoints, request formats, response bodies, and interactive code snippets
 */

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Server,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { getApiBaseUrl } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export const DocumentationPage: React.FC = () => {
  const apiUrl = getApiBaseUrl();
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (code: string, key: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedKey(key);
      toast({ type: 'success', title: 'Code Snippet Copied', message: 'Sample code copied to clipboard.' });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast({ type: 'error', title: 'Copy Failed', message: 'Unable to access clipboard.' });
    }
  };

  const curlRegression = `curl -X POST "${apiUrl}/predict/length-of-stay" \\
  -H "Content-Type: application/json" \\
  -d '{
    "age": "[50-60)",
    "gender": "Male",
    "race": "Caucasian",
    "admission_type_id": 1,
    "admission_source_id": 7,
    "medical_specialty": "Missing",
    "number_outpatient": 0,
    "number_emergency": 0,
    "number_inpatient": 1,
    "diag_1": "250.00",
    "diag_2": "401.9",
    "diag_3": "414.01",
    "payer_code": "Missing"
  }'`;

  const curlClassification = `curl -X POST "${apiUrl}/predict/readmission" \\
  -H "Content-Type: application/json" \\
  -d '{
    "age": "[50-60)",
    "gender": "Male",
    "race": "Caucasian",
    "admission_type_id": 1,
    "admission_source_id": 7,
    "time_in_hospital": 3,
    "medical_specialty": "Missing",
    "number_outpatient": 0,
    "number_emergency": 0,
    "number_inpatient": 1,
    "number_diagnoses": 5,
    "diag_1": "250.00",
    "diag_2": "401.9",
    "diag_3": "414.01",
    "max_glu_serum": "None",
    "A1Cresult": "None",
    "num_medications": 12,
    "num_lab_procedures": 35,
    "num_procedures": 1,
    "insulin": "Steady",
    "diabetesMed": "Yes",
    "change": "No"
  }'`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>REST API Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          FastAPI OpenAPI Documentation
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore technical schemas, request structures, response definitions, and executable cURL / Python code snippets for all deployed prediction microservices.
        </p>
      </div>

      {/* Live Swagger UI Link Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Server className="w-4 h-4 text-teal-400" />
            <span>Interactive Swagger UI & Raw OpenAPI Spec</span>
          </div>
          <p className="text-xs text-slate-400">
            Access the auto-generated interactive OpenAPI playground running directly on the FastAPI container.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            id="link-swagger-ui"
            href={`${apiUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Open Swagger UI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            id="link-openapi-json"
            href={`${apiUrl}/openapi.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <span>openapi.json</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Endpoint 1: GET /health */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono text-xs font-bold">
              GET
            </span>
            <code className="text-sm font-bold text-white font-mono">/health</code>
          </div>
          <span className="text-xs text-slate-400">Operational Health Check</span>
        </div>
        <p className="text-xs text-slate-300">
          Verifies whether the FastAPI server is running and both the regression and classification XGBoost artifacts are active in memory.
        </p>
        <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800">
          {`{
  "status": "healthy",
  "regression_loaded": true,
  "classification_loaded": true
}`}
        </div>
      </div>

      {/* Endpoint 2: POST /predict/length-of-stay */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-teal-950 text-teal-400 border border-teal-800/60 font-mono text-xs font-bold">
              POST
            </span>
            <code className="text-sm font-bold text-white font-mono">/predict/length-of-stay</code>
          </div>
          <span className="text-xs text-teal-300 font-semibold">Length-of-Stay Regressor</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Accepts patient demographics, admission routing, healthcare utilization history, and ICD-9 diagnosis codes. Returns predicted hospital stay clipped between 1 and 14 days.
        </p>

        {/* cURL snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">cURL Request Example:</span>
            <button
              onClick={() => handleCopy(curlRegression, 'curl-reg')}
              className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-xs font-semibold"
            >
              {copiedKey === 'curl-reg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'curl-reg' ? 'Copied' : 'Copy cURL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            {curlRegression}
          </pre>
        </div>
      </div>

      {/* Endpoint 3: POST /predict/readmission */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono text-xs font-bold">
              POST
            </span>
            <code className="text-sm font-bold text-white font-mono">/predict/readmission</code>
          </div>
          <span className="text-xs text-cyan-300 font-semibold">30-Day Readmission Risk Classifier</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Ingests patient stay duration, lab metrics, and diabetes medications (including <code className="text-cyan-300">A1Cresult</code> and <code className="text-cyan-300">diabetesMed</code>). Computes probabilistic readmission likelihood against the configured threshold.
        </p>

        {/* cURL snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">cURL Request Example:</span>
            <button
              onClick={() => handleCopy(curlClassification, 'curl-cls')}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
            >
              {copiedKey === 'curl-cls' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'curl-cls' ? 'Copied' : 'Copy cURL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            {curlClassification}
          </pre>
        </div>
      </div>
    </div>
  );
};
