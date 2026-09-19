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
                <span>Modern Healthcare Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.12]">
                Smarter Healthcare Insights for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                  Better Patient Care
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Support clinical decisions, estimate hospital stays, and assess 30-day readmission risk through a modern healthcare intelligence platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  id="hero-explore-predictions-btn"
                  to="/predict"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(20,184,166,0.35)] transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Explore Healthcare Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  id="hero-meet-nova-btn"
                  onClick={() => openNovaChat()}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-teal-500/40 hover:border-teal-400/60 bg-teal-950/40 hover:bg-teal-900/60 text-teal-200 text-sm font-semibold transition cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Meet Nova AI Assistant</span>
                </button>
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
                        <span className="text-xs font-bold text-white">Hospital Care Environment</span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/50">
                        Active Monitoring
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-slate-300 ml-1.5">Healthcare Assessment Flow</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-400">
                    Service Connected
                  </span>
                </div>

                {/* Simulated Visual Care Intelligence Flow */}
                <div className="space-y-3 text-xs">
                  {/* Step 1: Patient Information */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Patient Visit Information</p>
                        <p className="text-[10px] text-slate-400">Demographics • Visit History • Medical Details</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-400 font-medium">Standard Clinical Profile</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-500 text-[11px]">
                    <span>↓ Real-Time Assessment Processing</span>
                  </div>

                  {/* Step 2: Assessment Tools */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-800/40">
                      <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-semibold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Stay Estimate</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Expected hospital stay</p>
                      <p className="text-xs text-white font-bold mt-1.5 font-sans">1 – 14 Days Forecast</p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Readmission Risk</span>
                      </div>
                      <p className="text-[10px] text-slate-400">30-day return risk</p>
                      <p className="text-xs text-white font-bold mt-1.5 font-sans">Priority Care Assessment</p>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center text-slate-500 text-[11px]">
                    <span>↓ Decision Support Summary</span>
                  </div>

                  {/* Step 3: Decision Support Output */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-white text-xs font-semibold">Actionable Care Coordination</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Ready</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    Direct live connection to cloud healthcare services for instant clinical estimations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Healthcare Platform Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">2</span>
              <p className="text-xs font-semibold text-teal-400 mt-1">Clinical Tools</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Stay duration & readmission risk</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">100K+</span>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Patient Encounters</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Validated clinical training data</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Real-Time</span>
              <p className="text-xs font-semibold text-teal-400 mt-1">Decision Support</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Rapid estimations for care teams</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Cloud</span>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Secure Service</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Reliable modern cloud platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Nova — Interactive AI Assistant Section */}
      <MeetNovaSection onOpenChat={openNovaChat} onOpenVoice={openNovaVoice} />

      {/* What This Application Does Section */}
      <section id="what-we-do-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Healthcare Decision Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">
              What This Application Does
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed for doctors, nurses, hospital staff, students, and healthcare leaders to evaluate patient admission patterns and coordinate post-discharge care with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">1. Estimate Hospital Stay</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Helps clinical teams forecast how long a patient may need hospital care, supporting bed management and care planning.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">2. Assess Readmission Risk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Identifies patients who may have a higher likelihood of returning to the hospital within 30 days, assisting in discharge preparation.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">3. Assist Clinical Workflows</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides quick insights for doctors, nurses, and administrators to support daily hospital coordination and care planning.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Clinical Decision Support Notice:</strong> This application is an educational and analytical tool designed to support healthcare workflows. It does not provide medical advice, diagnosis, or treatment. All clinical decisions must be made by qualified healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Real-Time Command Center & 3D Ward Interactive Showcase */}
      <section id="realtime-command-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              Live Inpatient Operations
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Hospital Ward Overview & Clinical Telemetry
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect active bed availability, track streaming patient admissions, and evaluate care needs in real time.
            </p>
          </div>

          <Link
            to="/realtime-ward"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition self-start sm:self-auto"
          >
            <span>Open Ward Overview</span>
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
            Healthcare Assessment Tools
          </span>
          <h2 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Two Specialized Clinical Decision Support Tools
          </h2>
          <p className="text-sm text-slate-400">
            Designed to support daily hospital workflows: estimating expected stay duration and assessing 30-day readmission likelihood.
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
                  Tool 1 • Hospital Stay Estimate
                </span>
                <span className="text-xs text-slate-400">Bed Planning Tool</span>
              </div>

              <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Hospital Stay Estimate
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Estimate the expected number of days spent in the hospital based on the information provided.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PURPOSE</span>
                  <span className="font-semibold text-teal-300">Inpatient Bed Planning</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ESTIMATE FORMAT</span>
                  <span className="font-semibold text-white">Expected Days (1–14 Days)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                id="btn-try-regression-card"
                to="/predict/length-of-stay"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition"
              >
                <span>Estimate Hospital Stay</span>
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
                <span className="text-xs text-slate-400">Care Continuity Tool</span>
              </div>

              <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                30-Day Readmission Assessment
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Review the system's estimated readmission assessment based on the provided information.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PURPOSE</span>
                  <span className="font-semibold text-cyan-300">Care Continuity & Discharge</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ASSESSMENT FORMAT</span>
                  <span className="font-semibold text-white">Estimated Likelihood & Priority</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                id="btn-try-classification-card"
                to="/predict/readmission"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition"
              >
                <span>Generate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Behind the Platform */}
      <section id="tech-stack-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Secure & Reliable
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] mt-1">
                Technology Behind the Platform
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Built with modern cloud services, secure clinical data architecture, and intuitive design.
              </p>
            </div>
            <Link
              to="/architecture"
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore Platform Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-white block">Intuitive Clinical Interface</span>
              <p className="text-slate-400 leading-relaxed">
                High-performance web interface designed for fast, intuitive clinical workflows across devices.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-white block">Cloud Healthcare Service</span>
              <p className="text-slate-400 leading-relaxed">
                Cloud-powered predictive tools that process visit details in real time with high availability.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-white block">Benchmarked Data</span>
              <p className="text-slate-400 leading-relaxed">
                Calibrated against over 100,000 retrospective diabetic patient records for reliable patterns.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-white block">Decision-Support Focus</span>
              <p className="text-slate-400 leading-relaxed">
                Reliable data handling focused on educational decision support and care team assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section id="bottom-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-cyan-950/80 border border-teal-500/30 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">
            Ready to explore healthcare decision support?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Try estimating expected stay durations or assess 30-day readmission likelihood with our clean, interactive tools.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              id="cta-launch-studio-bottom"
              to="/predict/length-of-stay"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg transition"
            >
              Estimate Hospital Stay
            </Link>
            <Link
              id="cta-explore-ward-bottom"
              to="/predict/readmission"
              className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              30-Day Readmission Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
