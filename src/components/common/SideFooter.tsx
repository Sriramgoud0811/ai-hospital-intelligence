/**
 * Side Footer Component
 * Pinned side-dock with on-duty clinical staff photos, quick department links,
 * hospital emergency telemetry, and contact channels.
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PhoneCall,
  Clock,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  Users,
  Mail,
  ShieldCheck,
  Activity,
  Bed,
} from 'lucide-react';
import doctorImg from '../../assets/images/doctor_portrait_1789729984838.jpg';
import nurseImg from '../../assets/images/nurse_portrait_1789730000400.jpg';

export const SideFooter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Hospital Ward', path: '/realtime-ward', icon: Bed },
    { label: 'About Us', path: '/about', icon: Users },
    { label: 'Contact Us', path: '/contact', icon: Mail },
  ];

  return (
    <aside
      id="hospital-side-footer"
      aria-label="Clinical Side Footer"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-42px)]'
      }`}
    >
      <div className="flex items-center">
        {/* Toggle Tab */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center justify-center gap-2 py-4 px-2.5 rounded-l-2xl bg-gradient-to-b from-teal-600 to-cyan-700 text-white shadow-[-4px_0_16px_rgba(13,148,136,0.35)] border-y border-l border-teal-400/30 hover:brightness-110 transition cursor-pointer select-none"
          title={isOpen ? 'Collapse Side Footer' : 'Open Hospital Side Footer'}
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 animate-pulse" />}
          <span className="[writing-mode:vertical-rl] text-[11px] font-bold tracking-wider uppercase font-['Plus_Jakarta_Sans']">
            Side Footer • Clinical Leads
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        {/* Side Footer Drawer Content */}
        <div className="w-80 sm:w-88 bg-slate-950/95 backdrop-blur-2xl border-y border-l border-teal-500/30 rounded-l-3xl p-5 shadow-2xl text-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                  Hospital Side Footer
                </h4>
                <p className="text-[10px] text-teal-300">Active Inpatient Operations</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              24/7 Live
            </span>
          </div>

          {/* On-Duty Care Team (Doctor & Nurse) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                On-Duty Care Leadership
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active Shift</span>
            </div>

            {/* Doctor Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/30 hover:border-teal-500/60 transition">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-teal-400/50 relative">
                <img
                  src={doctorImg}
                  alt="Dr. Evelyn Reed, MD"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">Dr. Evelyn Reed, MD</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-950 text-teal-300">MD Lead</span>
                </div>
                <p className="text-[10px] text-teal-300 truncate">Chief of Endocrinology & Triage</p>
                <p className="text-[10px] text-slate-400">14 Inpatients Under Care</p>
              </div>
            </div>

            {/* Nurse Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/60 transition">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-cyan-400/50 relative">
                <img
                  src={nurseImg}
                  alt="Marcus Vance, RN, BSN"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">Marcus Vance, RN</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">Charge RN</span>
                </div>
                <p className="text-[10px] text-cyan-300 truncate">Lead Clinical Nurse Specialist</p>
                <p className="text-[10px] text-slate-400">Step-Down & Discharge Unit</p>
              </div>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {links.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                      active
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Hospital Emergency & Support Contacts */}
          <div className="space-y-2 p-3 rounded-2xl bg-teal-950/30 border border-teal-500/20 text-xs">
            <div className="flex items-center gap-2 text-teal-300 font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Hospital Hotlines</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Emergency Triage:</span>
                <span className="font-mono text-teal-300 font-bold">(800) 412-CARE</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Central Nurse Desk:</span>
                <span className="font-mono text-cyan-300">Ext. 402</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Physician Consultation:</span>
                <span className="font-mono text-slate-200">Ext. 811</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[10px] text-slate-500 text-center leading-relaxed">
            Metabolic & Inpatient Center • 24/7 Clinical Support
          </div>
        </div>
      </div>
    </aside>
  );
};
