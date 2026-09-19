/**
 * Clinical Care & AI Triage Team Showcase
 * Highlights real doctor and nurse clinical leaders with photorealistic portraits,
 * active duty telemetry, and direct interactive links to the ML prediction studio.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  ShieldCheck,
  UserCheck,
  Award,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Activity,
  CheckCircle2,
  Clock,
  PhoneCall,
  CalendarCheck,
} from 'lucide-react';
import doctorImg from '../../assets/images/doctor_portrait_1789729984838.jpg';
import nurseImg from '../../assets/images/nurse_portrait_1789730000400.jpg';

interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  image: string;
  roleType: 'Physician / Lead' | 'Specialist Nurse';
  status: 'On Duty' | 'In Consultation' | 'Active Triage';
  experienceYears: number;
  patientsAssigned: number;
  clinicalFocus: string[];
  quote: string;
  modelUsageStat: string;
}

export const ClinicalTeamSection: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [consultRequested, setConsultRequested] = useState<string | null>(null);

  const staffMembers: StaffMember[] = [
    {
      id: 'doctor-reed',
      name: 'Dr. Evelyn Reed, MD, FACP',
      title: 'Chief of Inpatient Endocrinology & Risk Analytics',
      department: 'Department of Internal Medicine & Metabolic Care',
      image: doctorImg,
      roleType: 'Physician / Lead',
      status: 'On Duty',
      experienceYears: 16,
      patientsAssigned: 14,
      clinicalFocus: [
        'Complex Diabetic Inpatient Triage',
        'ICD-9 Diagnostic Reconciliation',
        'Glycemic Control Regimens (A1C / Insulin)',
      ],
      quote:
        'Machine learning provides an objective, early probability baseline for 30-day readmissions, empowering our attending team to tailor post-discharge glycemic plans before complications escalate.',
      modelUsageStat: '94.8% Clinical Protocol Concurrence',
    },
    {
      id: 'nurse-vance',
      name: 'Marcus Vance, RN, BSN, CCRN',
      title: 'Lead Clinical Nurse Specialist & Discharge Coordinator',
      department: 'Inpatient Step-Down & Care Coordination Unit',
      image: nurseImg,
      roleType: 'Specialist Nurse',
      status: 'Active Triage',
      experienceYears: 11,
      patientsAssigned: 8,
      clinicalFocus: [
        'Post-Acute Care Transition Planning',
        'Real-Time Patient Bedside Telemetry',
        'Medication Reconciliation & Follow-Up Scheduling',
      ],
      quote:
        'When the XGBoost classifier highlights a probability over the 0.12 cutoff, we immediately trigger a specialized discharge bundle including 48-hour outpatient nurse contact and home insulin verification.',
      modelUsageStat: '1,420+ Readmission Interventions Guided',
    },
  ];

  const handleRequestConsult = (staffId: string) => {
    setConsultRequested(staffId);
    setTimeout(() => {
      setConsultRequested(null);
    }, 4000);
  };

  return (
    <section id="clinical-team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header with 3D Badge */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multidisciplinary Clinical Triage Team</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Physician & Nursing Leadership
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real healthcare professionals collaborating with deployed AI models. Learn how physicians and clinical nurses use XGBoost probability scores to protect high-risk diabetic patients.
          </p>
        </div>

        <Link
          to="/realtime-ward"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500/40 bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 text-xs font-semibold shadow-lg shadow-teal-500/10 transition group shrink-0"
        >
          <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>View Real-Time Ward Roster</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3D Depth Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {staffMembers.map((member) => {
          const isRequested = consultRequested === member.id;
          return (
            <div
              key={member.id}
              className="group relative p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-teal-500/40 hover:shadow-teal-500/10 hover:-translate-y-1.5 flex flex-col justify-between space-y-6"
            >
              {/* Top Row: Photo + Core Info with 3D Depth Frame */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-xl shadow-teal-500/10 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  {/* Live Status Beacon */}
                  <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{member.status}</span>
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-950/80 border border-teal-800/40 text-[11px] font-semibold text-teal-300 uppercase font-mono">
                      {member.roleType}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {member.experienceYears} Years Exp.
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-300">{member.title}</p>
                  <p className="text-[11px] text-slate-400">{member.department}</p>
                </div>
              </div>

              {/* Clinical Quote */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/70 relative">
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{member.quote}"
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">ML Protocol Metric:</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {member.modelUsageStat}
                  </span>
                </div>
              </div>

              {/* Clinical Focus Badges */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Clinical Domains & Responsibilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.clinicalFocus.map((focus) => (
                    <span
                      key={focus}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-300"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Interactive Actions */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>{member.patientsAssigned} Active Beds Assigned</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRequestConsult(member.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      isRequested
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Consult Assigned</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Request Consult</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/predict"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition flex items-center gap-1.5"
                  >
                    <span>Run Encounter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
