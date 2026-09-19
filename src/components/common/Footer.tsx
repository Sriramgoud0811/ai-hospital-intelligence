/**
 * Global Footer Component
 * Includes responsible AI disclaimer, system specs, navigation, and portfolio links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ExternalLink, Github, Code2, Server, Heart, Sparkles } from 'lucide-react';
import { getApiBaseUrl } from '../../services/api';
import { openNovaChat } from '../../services/novaService';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const apiUrl = getApiBaseUrl();

  return (
    <footer id="main-footer" className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      {/* Responsible AI Disclaimer Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300">Responsible Clinical Use Notice: </span>
            This healthcare platform is an analytical clinical decision-support prototype.
            It is <strong className="text-white">not a standalone medical diagnostic or clinical treatment system</strong>. Risk scores and stay duration calculations are decision-support estimates derived from verified diabetic encounter records (1999–2008) and must never substitute for licensed medical judgment.
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base font-['Plus_Jakarta_Sans']">
                AI Hospital Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An interactive clinical care platform for estimating hospital length of stay and identifying 30-day recovery and readmission risk with live clinical ward telemetry and multidisciplinary physician and nursing support.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
                <Server className="w-3 h-3 text-teal-400" />
                FastAPI Clinical Backend
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
                <Code2 className="w-3 h-3 text-cyan-400" />
                React + TypeScript
              </span>
            </div>
          </div>

          {/* Col 3: Clinical Dashboard */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Patient Care Dashboard
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition">
                  Clinical Dashboard
                </Link>
              </li>
              <li>
                <Link to="/predict/length-of-stay" className="hover:text-cyan-400 transition">
                  Length of Stay Calculator
                </Link>
              </li>
              <li>
                <Link to="/predict/readmission" className="hover:text-cyan-400 transition">
                  30-Day Readmission Risk
                </Link>
              </li>
              <li>
                <Link to="/realtime-ward" className="hover:text-cyan-400 transition">
                  Hospital Ward Twin
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-nova-trigger-btn"
                  onClick={() => openNovaChat()}
                  className="hover:text-cyan-300 transition text-left cursor-pointer flex items-center gap-1.5 text-teal-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Nova AI Assistant (24/7)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hospital Departments */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Hospital Operations
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-cyan-400 transition">
                  Patient Records History
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: External Links & Recruiter Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Portfolio & APIs
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`${apiUrl}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition text-slate-300"
                >
                  <span>FastAPI Swagger UI</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={`${apiUrl}/openapi.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition text-slate-300"
                >
                  <span>OpenAPI Spec JSON</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">
                  About Developer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {currentYear} AI Hospital Intelligence. Engineered for machine learning demonstration.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Synthetic / anonymized retrospective data</span>
            <span>•</span>
            <span className="text-slate-400">Strict Non-Diagnostic Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
