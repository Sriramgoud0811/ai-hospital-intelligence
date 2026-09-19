/**
 * About & Recruiter Showcase Page
 * Technical summary of full-stack engineering, ML deployment, and UI/UX design choices
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  ExternalLink,
  Github,
  Mail,
  CheckCircle2,
  Sparkles,
  Server,
} from 'lucide-react';
import { getApiBaseUrl } from '../services/api';
import { ClinicalTeamSection } from '../components/team/ClinicalTeamSection';

export const AboutPage: React.FC = () => {
  const apiUrl = getApiBaseUrl();

  const competencies = [
    {
      title: 'Full-Stack Clinical Integration',
      description:
        'Architected a resilient React 19 + TypeScript client connecting directly to a remote FastAPI Python microservice on Render, complete with AbortController timeout budgets and schema validation mapping.',
    },
    {
      title: 'Real Clinical Decision Serving',
      description:
        'Zero mocked predictions. Ingests live clinical patient evaluation endpoints, calculating stay duration and readmission risk with continuous confidence scoring and calibrated risk stratification.',
    },
    {
      title: 'Responsible Healthcare UX',
      description:
        'Designed accessible, high-contrast clinical dashboards with non-diagnostic disclaimers, clear probability gauges, benchmark test presets, and audit histories.',
    },
    {
      title: 'Production-Grade Hospital Operations',
      description:
        'Engineered dynamic health polling, graceful cold-start indicators, responsive dark/light styling, and fully typed request-response cycles.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Hospital Operations & Clinical Decision Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          About AI Hospital Intelligence
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Developed as a production-quality healthcare intelligence platform demonstrating how modern clinical interfaces assist attending physicians and nursing staff in evaluating patient stay duration and 30-day readmission risk.
        </p>
      </div>

      {/* Core Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competencies.map((comp) => (
          <div
            key={comp.title}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-2"
          >
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <h3>{comp.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{comp.description}</p>
          </div>
        ))}
      </div>

      {/* Multidisciplinary Clinical Care Team */}
      <ClinicalTeamSection />

      {/* Live Services & Resources */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-6">
        <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
          Hospital Systems & Operational Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <a
            href={`${apiUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white transition flex flex-col justify-between space-y-2 group"
          >
            <div>
              <span className="font-semibold text-white block">FastAPI Clinical API</span>
              <p className="text-[11px] text-slate-500 mt-1">Live endpoint testing and service schema</p>
            </div>
            <span className="text-cyan-400 flex items-center gap-1 text-[11px] group-hover:underline">
              Inspect API <ExternalLink className="w-3 h-3" />
            </span>
          </a>

          <Link
            to="/realtime-ward"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white transition flex flex-col justify-between space-y-2 group"
          >
            <div>
              <span className="font-semibold text-white block">Interactive 3D Ward Twin</span>
              <p className="text-[11px] text-slate-500 mt-1">Live patient bed telemetry and telemetry monitors</p>
            </div>
            <span className="text-teal-400 flex items-center gap-1 text-[11px] group-hover:underline">
              Open Hospital Ward →
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="p-4 rounded-xl border border-teal-800/40 bg-teal-950/20 hover:bg-teal-950/40 text-slate-300 hover:text-white transition flex flex-col justify-between space-y-2 group"
          >
            <div>
              <span className="font-semibold text-teal-300 block">Clinical Dashboard</span>
              <p className="text-[11px] text-slate-500 mt-1">Live patient evaluation workspace</p>
            </div>
            <span className="text-teal-400 flex items-center gap-1 text-[11px] group-hover:underline">
              Launch Dashboard →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
