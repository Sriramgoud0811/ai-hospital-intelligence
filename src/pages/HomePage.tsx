/**
 * Landing Page: AI Hospital Intelligence
 * Features: High-impact hero, abstract data-network visual, 2 verified model cards,
 * verified platform stats, clinical disclaimer, problem overview, tech stack.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Clock,
  ShieldAlert,
  ArrowRight,
  Server,
  Layers,
  Database,
  CheckCircle2,
  Cpu,
  Sparkles,
  GitBranch,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { ApiStatusBadge } from '../components/common/ApiStatusBadge';
import { ClinicalTeamSection } from '../components/team/ClinicalTeamSection';
import { RealTimeCommandCenter } from '../components/realtime/RealTimeCommandCenter';
import { MeetNovaSection } from '../components/nova/MeetNovaSection';
import { openNovaChat, openNovaVoice } from '../services/novaService';
import hospital3dImg from '../assets/images/hospital_3d_hero_1789730014193.jpg';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section with Abstract Healthcare Data Visual */}
      <section
        id="hero-section"
        className="relative overflow-hidden pt-12 md:pt-20 lg:pt-28 pb-12 border-b border-slate-800/60"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 left-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Production Hospital Care Intelligence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.12]">
                From Hospital Data to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                  Actionable Care Intelligence
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                An interactive clinical care platform for estimating hospital length of stay and identifying 30-day patient readmission risk using a production-deployed clinical service.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  id="hero-explore-predictions-btn"
                  to="/dashboard"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(20,184,166,0.35)] transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Open Clinical Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  id="hero-view-ward-btn"
                  to="/realtime-ward"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Interactive 3D Ward Twin</span>
                </Link>
              </div>

              {/* Live Status Chip */}
              <div className="pt-2 flex justify-center lg:justify-start">
                <ApiStatusBadge />
              </div>
            </div>

            {/* Right: Abstract Healthcare Intelligence Visual with 3D Hospital asset */}
            <div className="lg:col-span-5 relative">
              <div
                id="hero-visual-card"
                className="p-5 sm:p-6 rounded-3xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl shadow-2xl space-y-4 transform hover:scale-[1.01] transition-transform duration-300"
              >
                {/* 3D Smart Hospital Digital Twin Preview with Ambient Border */}
                <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 group">
                  <img
                    src={hospital3dImg}
                    alt="3D Smart Hospital Ward Digital Twin"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 sm:h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-3.5">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-bold text-white">3D Smart Hospital Twin</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/50">
                        Live FastAPI ML
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-slate-400 ml-1.5">fastapi-pipeline.service</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    200 Healthy
                  </span>
                </div>

                {/* Simulated Visual Pipeline Data Nodes */}
                <div className="space-y-3 font-mono text-xs">
                  {/* Layer 1: Patient Encounter Ingestion */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">
                        1
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Raw Encounter Ingestion</p>
                        <p className="text-[10px] text-slate-400">Demographics • Prior Utilization • ICD-9</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-400 font-bold">13–22 raw fields</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-600 text-xs">
                    <span>↓ Feature Engineering & Encoding (2,359 features)</span>
                  </div>

                  {/* Layer 2: Model Inference Nodes */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40">
                      <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-semibold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>XGB Regressor</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Target: time_in_hospital</p>
                      <p className="text-xs text-white font-bold mt-1.5 font-mono">1 – 14 Days</p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>XGB Classifier</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Target: readmit_30d</p>
                      <p className="text-xs text-white font-bold mt-1.5 font-mono">Threshold Tuned</p>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-600 text-xs">
                    <span>↓ JSON Schema Output</span>
                  </div>

                  {/* Layer 3: Prediction Dashboard Output */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-white text-xs font-semibold">Real-Time Analytical Response</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    Direct live connection to Render FastAPI endpoint. No mocked predictions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Hero Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">2</span>
              <p className="text-xs font-semibold text-teal-400 mt-1">ML Tasks</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Regression & Classification</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">2</span>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Live Prediction Endpoints</p>
              <p className="text-[11px] text-slate-400 mt-0.5">/length-of-stay & /readmission</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">FastAPI</span>
              <p className="text-xs font-semibold text-teal-400 mt-1">Backend Architecture</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pydantic validation schemas</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Render</span>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Cloud Deployment</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Containerized Linux runtime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Nova — Interactive AI Assistant Section */}
      <MeetNovaSection onOpenChat={openNovaChat} onOpenVoice={openNovaVoice} />

      {/* Problem Section: Analytical Clinical Need */}
      <section id="problem-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Operational Healthcare Need
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Why Hospital Systems Need Machine Learning Decision Support
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hospital teams manage complex inpatient encounters under tight resource constraints. Analytical intelligence helps clinical administrators and operational leaders extract patterns from encounter histories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-semibold text-white">Expected Length of Stay</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anticipating bed occupancy days enables proactive discharge planning and ward coordination.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-semibold text-white">Resource Planning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assessing staffing ratios, medication reserves, and step-down unit allocations ahead of time.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-semibold text-white">Follow-Up Prioritization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flagging encounters with high statistical probability of 30-day readmission for care coordination.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-sm font-semibold text-white">Complexity Exploration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluating how multi-morbidity diagnoses and glycemic markers correlate with inpatient duration.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Strict Analytical Scope:</strong> This project is an educational and analytical prototype. It is not a medical diagnostic or treatment system. Model outputs are mathematical estimates generated by serialized XGBoost algorithms from retrospective diabetic encounter records (1999–2008) and must never substitute for licensed medical judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Real-Time Command Center & 3D Ward Interactive Showcase */}
      <section id="realtime-command-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              Live Inpatient Operations Feed
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Real-Time Hospital Telemetry & 3D Ward Twin
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect active bed pods, track streaming patient admissions, and evaluate readmission risk with 1-click live XGBoost inference.
            </p>
          </div>

          <Link
            to="/realtime-ward"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition self-start sm:self-auto"
          >
            <span>Full Ward Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <RealTimeCommandCenter />
      </section>

      {/* Clinical Doctor & Nurse Team Section */}
      <ClinicalTeamSection />

      {/* Two Clinical Tools Section */}
      <section id="two-models-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            Deployed Clinical Intelligence Tools
          </span>
          <h2 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Two Specialized Clinical Decision Support Tools
          </h2>
          <p className="text-sm text-slate-400">
            Targeting critical inpatient clinical operations: predicting length of stay and evaluating 30-day readmission risk based on 101,766 diabetic patient encounters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tool Card 1: Length-of-Stay */}
          <div
            id="model-card-regression"
            className="p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-950/20 to-slate-900/90 backdrop-blur-xl shadow-xl space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Tool 1 • Inpatient Stay Duration
                </span>
                <span className="text-xs font-mono text-slate-400">/predict/length-of-stay</span>
              </div>

              <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Hospital Length-of-Stay Estimation
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Estimates the inpatient stay duration in days based on admission route, clinical specialty, prior utilization, and primary diagnostic codes.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CLINICAL FOCUS</span>
                  <span className="font-mono font-semibold text-teal-300">Inpatient Bed Planning</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OUTPUT FORMAT</span>
                  <span className="font-mono font-semibold text-white">Estimated Days (1–14d)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                id="btn-try-regression-card"
                to="/predict/length-of-stay"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition"
              >
                <span>Calculate Length of Stay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool Card 2: Readmission Risk */}
          <div
            id="model-card-classification"
            className="p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/90 backdrop-blur-xl shadow-xl space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Tool 2 • Readmission Assessment
                </span>
                <span className="text-xs font-mono text-slate-400">/predict/readmission</span>
              </div>

              <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                30-Day Hospital Readmission Risk
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluates the statistical likelihood of hospital readmission within 30 days post-discharge using multi-medication and glycemic indicator features.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CLINICAL FOCUS</span>
                  <span className="font-mono font-semibold text-cyan-300">Care Continuity & Discharge</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OUTPUT FORMAT</span>
                  <span className="font-mono font-semibold text-white">Risk Priority & Probability</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                id="btn-try-classification-card"
                to="/predict/readmission"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition"
              >
                <span>Evaluate Readmission Risk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section id="tech-stack-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                End-to-End Engineering
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] mt-1">
                Hospital System Architecture & Clinical Backend
              </h2>
            </div>
            <Link
              to="/architecture"
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore System Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-white block">Clinical Frontend</span>
              <p className="text-slate-400">React 19, TypeScript, Vite, Tailwind CSS</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-white block">Backend Service</span>
              <p className="text-slate-400">FastAPI, Pydantic Schema Validation, Uvicorn</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-white block">Decision Engine</span>
              <p className="text-slate-400">High-Performance Clinical Pipeline</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-white block">Infrastructure</span>
              <p className="text-slate-400">Render Cloud, Docker Container, REST API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section id="bottom-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/80 border border-teal-500/30 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">
            Ready to test live patient encounter evaluations?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience our dynamic clinical dashboard with validated presets or enter custom patient encounter features directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              id="cta-launch-studio-bottom"
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg transition"
            >
              Open Clinical Dashboard
            </Link>
            <Link
              id="cta-explore-ward-bottom"
              to="/realtime-ward"
              className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              View 3D Ward Digital Twin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
