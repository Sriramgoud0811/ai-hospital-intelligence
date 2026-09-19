/**
 * Real-Time Ward & Bed Telemetry Command Center Page
 * Features 3D hospital digital twin, live inpatient admission telemetry,
 * real-time bed capacity visualizer, and doctor/nurse team coordination.
 */

import React from 'react';
import { RealTimeCommandCenter } from '../components/realtime/RealTimeCommandCenter';
import { ClinicalTeamSection } from '../components/team/ClinicalTeamSection';
import {
  Activity,
  Building2,
  Radio,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Clock,
  Layers,
} from 'lucide-react';
import hospital3dHero from '../assets/images/hospital_3d_hero_1789730014193.jpg';

export const RealTimeWardPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Top Hero Banner with 3D Smart Hospital Visual */}
      <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live Hospital Telemetry & 3D Ward Twin</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                Real-Time Clinical{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">
                  Command Center
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Monitor incoming diabetic inpatient admissions, visualize bed capacity across critical wards in 3D perspective, and trigger live clinical risk evaluations directly against our hospital backend.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Stream Active: Ingestion Inflow 4.2 / hr</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>Clinical Attention Threshold: 12%</span>
                </div>
              </div>
            </div>

            {/* 3D Smart Hospital Digital Twin Preview */}
            <div className="lg:col-span-5 relative group">
              <div className="rounded-3xl overflow-hidden border-2 border-teal-500/40 shadow-2xl shadow-teal-500/15 group-hover:border-teal-400 transition-all duration-300">
                <img
                  src={hospital3dHero}
                  alt="3D Smart Hospital Ward Digital Twin"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs font-bold text-white">Smart Hospital Digital Twin</p>
                      <p className="text-[10px] text-teal-300">Octane 3D Render • Holographic Data Stream</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      Live Telemetry
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Real-Time Telemetry & 3D Beds Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RealTimeCommandCenter />
      </section>

      {/* Doctor & Nurse Clinical Leadership */}
      <section className="pt-8 border-t border-slate-800/60">
        <ClinicalTeamSection />
      </section>
    </div>
  );
};
