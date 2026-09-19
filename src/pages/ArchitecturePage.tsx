/**
 * Technical Architecture Page
 * Interactive full-stack system diagram: React SPA -> FastAPI Gateway -> XGBoost ML Pipeline
 */

import React from 'react';
import { Layers, Server, Cpu, Database, Cloud, ShieldCheck, Code2, ArrowRight } from 'lucide-react';
import { getApiBaseUrl } from '../services/api';

export const ArchitecturePage: React.FC = () => {
  const apiUrl = getApiBaseUrl();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Full-Stack System Topology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          System Architecture & Deployment
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore the decoupled architecture connecting our modern React frontend to the high-performance FastAPI service running containerized on Render.
        </p>
      </div>

      {/* Visual Architectural Stack Flow */}
      <div className="space-y-4">
        {/* Tier 1: Client Application */}
        <div className="p-6 rounded-2xl border border-teal-500/30 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tier 1: Presentation & Client State</h3>
                <p className="text-xs text-slate-400">React 19 • TypeScript • Tailwind CSS • Vite</p>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800/40">
              Browser Runtime
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">Strict Type Safety</span>
              <p className="text-slate-400">
                Exact TypeScript interfaces for both request payloads and response bodies mirror backend Pydantic models.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">Client-Side Validation</span>
              <p className="text-slate-400">
                Immediate feedback prevents invalid payloads (e.g. negative visits, out-of-range hospital stay).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">Cold-Start Resilience</span>
              <p className="text-slate-400">
                Configured with 45-second timeout and friendly status indicators for Render spinning containers.
              </p>
            </div>
          </div>
        </div>

        {/* Network Connector */}
        <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-mono py-1">
          <span>↓ HTTPS / REST JSON over TLS</span>
        </div>

        {/* Tier 2: Backend API Service */}
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tier 2: High-Performance API Gateway</h3>
                <p className="text-xs text-slate-400">FastAPI • Python 3.11+ • Uvicorn ASGI • Pydantic V2</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/40">
              FastAPI @ Render
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">Automated Validation</span>
              <p className="text-slate-400">
                Pydantic parses and validates incoming JSON requests, raising normalized HTTP 422 errors on invalid data.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">RESTful Endpoints</span>
              <p className="text-slate-400">
                Exposes <code className="text-cyan-300">/health</code>, <code className="text-cyan-300">/predict/length-of-stay</code>, and <code className="text-cyan-300">/predict/readmission</code>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">OpenAPI Documentation</span>
              <p className="text-slate-400">
                Auto-generates interactive Swagger UI and schema spec conforming to OpenAPI 3.1 standards.
              </p>
            </div>
          </div>
        </div>

        {/* Network Connector */}
        <div className="flex justify-center items-center gap-2 text-slate-600 text-xs font-mono py-1">
          <span>↓ In-Memory Model Serialization Execution</span>
        </div>

        {/* Tier 3: Machine Learning Engine */}
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tier 3: Machine Learning Inference Pipelines</h3>
                <p className="text-xs text-slate-400">XGBoost • Scikit-Learn • Joblib Pipeline Objects</p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/40">
              Serialized ML Artifacts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-teal-300 block">XGBoost Regressor (Length-of-Stay)</span>
              <p className="text-slate-400">
                Loaded into memory on server boot via Joblib. Ingests encoded tabular features, computes tree ensemble prediction, and clips output to 1–14 days.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-cyan-300 block">XGBoost Classifier (Readmission Risk)</span>
              <p className="text-slate-400">
                Calculates risk probability score via <code className="text-cyan-300">predict_proba()</code>, compares probability to tuned cutoff threshold (0.12), and outputs binary classification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Infrastructure Info */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span>Production Cloud Deployment Details</span>
        </div>
        <p className="leading-relaxed">
          The FastAPI backend is deployed on a containerized Linux instance hosted at{' '}
          <a
            href={apiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-mono"
          >
            {apiUrl}
          </a>
          . In accordance with cloud resource management, container idle spin-down is handled gracefully by our frontend with dynamic polling and status notifications.
        </p>
      </div>
    </div>
  );
};
