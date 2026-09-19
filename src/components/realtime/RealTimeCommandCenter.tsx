/**
 * Real-Time Hospital Command Center & 3D Ward Digital Twin
 * Provides live telemetry, interactive 3D bed occupancy grid,
 * streaming patient triage queue, and 1-click execution against live FastAPI endpoints.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Bed,
  HeartPulse,
  Clock,
  ShieldAlert,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Zap,
  ArrowRight,
  User,
  CheckCircle2,
  AlertTriangle,
  Send,
  Layers,
  Building2,
  Radio,
  FileText,
  Sliders,
} from 'lucide-react';
import { predictReadmission, predictLengthOfStay } from '../../services/api';
import { ClassificationRequest, ClassificationResponse, RegressionResponse } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';

export interface WardBed {
  bedNumber: string;
  wardName: 'Endocrine Care' | 'ICU & Critical' | 'Step-Down' | 'General Inpatient';
  status: 'High Risk' | 'Moderate Risk' | 'Stable' | 'Available';
  patientName?: string;
  age?: string;
  gender?: string;
  timeInHospital?: number;
  diag1?: string;
  a1c?: string;
  insulin?: string;
  medCount?: number;
  admissionType?: number;
  admissionSource?: number;
  payerCode?: string;
}

export interface StreamingEncounter {
  id: string;
  arrivalTime: string;
  patientInitials: string;
  age: string;
  gender: string;
  admissionReason: string;
  primaryDiag: string;
  icdCode: string;
  a1cStatus: string;
  insulinStatus: string;
  timeInHospital: number;
  medCount: number;
  labProcedures: number;
  historyInpatient: number;
  triagePriority: 'Urgent (High Risk)' | 'Standard' | 'Elective';
  evaluatedResult?: {
    probability: number;
    isHighRisk: boolean;
    durationMs: number;
    predictedStay?: number;
  };
}

export const RealTimeCommandCenter: React.FC = () => {
  const { toast } = useToast();
  const [streamActive, setStreamActive] = useState<boolean>(true);
  const [selectedBed, setSelectedBed] = useState<WardBed | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeWardFilter, setActiveWardFilter] = useState<string>('All Wards');

  // Beds data representing 3D Hospital Ward
  const [beds, setBeds] = useState<WardBed[]>([
    {
      bedNumber: 'B-101',
      wardName: 'Endocrine Care',
      status: 'High Risk',
      patientName: 'Encounter #4928 (F, 65)',
      age: '[60-70)',
      gender: 'Female',
      timeInHospital: 7,
      diag1: '250.02 (Diabetes with Hyperosmolarity)',
      a1c: '>8',
      insulin: 'Up',
      medCount: 19,
      admissionType: 1,
      admissionSource: 7,
    },
    {
      bedNumber: 'B-102',
      wardName: 'Endocrine Care',
      status: 'Stable',
      patientName: 'Encounter #5104 (M, 52)',
      age: '[50-60)',
      gender: 'Male',
      timeInHospital: 3,
      diag1: '250.00 (Type 2 Diabetes)',
      a1c: 'Norm',
      insulin: 'Steady',
      medCount: 11,
      admissionType: 2,
      admissionSource: 1,
    },
    {
      bedNumber: 'B-103',
      wardName: 'Endocrine Care',
      status: 'Moderate Risk',
      patientName: 'Encounter #3829 (F, 74)',
      age: '[70-80)',
      gender: 'Female',
      timeInHospital: 5,
      diag1: '401.9 (Hypertension w/ Diabetes)',
      a1c: '>7',
      insulin: 'Down',
      medCount: 16,
      admissionType: 1,
      admissionSource: 7,
    },
    {
      bedNumber: 'B-104',
      wardName: 'Endocrine Care',
      status: 'Available',
    },
    {
      bedNumber: 'ICU-201',
      wardName: 'ICU & Critical',
      status: 'High Risk',
      patientName: 'Encounter #6821 (M, 68)',
      age: '[60-70)',
      gender: 'Male',
      timeInHospital: 11,
      diag1: '414.01 (Coronary Atherosclerosis)',
      a1c: '>8',
      insulin: 'Up',
      medCount: 26,
      admissionType: 1,
      admissionSource: 7,
    },
    {
      bedNumber: 'ICU-202',
      wardName: 'ICU & Critical',
      status: 'High Risk',
      patientName: 'Encounter #7912 (F, 82)',
      age: '[80-90)',
      gender: 'Female',
      timeInHospital: 8,
      diag1: '428.0 (Congestive Heart Failure)',
      a1c: 'None',
      insulin: 'Steady',
      medCount: 22,
      admissionType: 1,
      admissionSource: 7,
    },
    {
      bedNumber: 'ICU-203',
      wardName: 'ICU & Critical',
      status: 'Stable',
      patientName: 'Encounter #8014 (M, 47)',
      age: '[40-50)',
      gender: 'Male',
      timeInHospital: 4,
      diag1: '250.10 (Diabetic Ketoacidosis)',
      a1c: '>8',
      insulin: 'Steady',
      medCount: 14,
      admissionType: 1,
      admissionSource: 7,
    },
    {
      bedNumber: 'ICU-204',
      wardName: 'ICU & Critical',
      status: 'Available',
    },
    {
      bedNumber: 'SD-301',
      wardName: 'Step-Down',
      status: 'Moderate Risk',
      patientName: 'Encounter #9120 (M, 61)',
      age: '[60-70)',
      gender: 'Male',
      timeInHospital: 4,
      diag1: '428.9 (Heart Failure Unspecified)',
      a1c: 'Norm',
      insulin: 'Steady',
      medCount: 15,
      admissionType: 2,
      admissionSource: 1,
    },
    {
      bedNumber: 'SD-302',
      wardName: 'Step-Down',
      status: 'Stable',
      patientName: 'Encounter #9340 (F, 44)',
      age: '[40-50)',
      gender: 'Female',
      timeInHospital: 2,
      diag1: '250.00 (Type 2 Diabetes)',
      a1c: 'Norm',
      insulin: 'No',
      medCount: 9,
      admissionType: 3,
      admissionSource: 1,
    },
    {
      bedNumber: 'SD-303',
      wardName: 'Step-Down',
      status: 'Available',
    },
    {
      bedNumber: 'SD-304',
      wardName: 'Step-Down',
      status: 'Stable',
      patientName: 'Encounter #9880 (M, 58)',
      age: '[50-60)',
      gender: 'Male',
      timeInHospital: 3,
      diag1: '401.1 (Benign Essential Hypertension)',
      a1c: 'None',
      insulin: 'Steady',
      medCount: 12,
      admissionType: 1,
      admissionSource: 7,
    },
  ]);

  // Initial streaming patient admissions
  const [streamingEncounters, setStreamingEncounters] = useState<StreamingEncounter[]>([
    {
      id: 'enc-live-01',
      arrivalTime: 'Just now',
      patientInitials: 'P.K.',
      age: '[60-70)',
      gender: 'Female',
      admissionReason: 'Severe Hyperglycemia & Dizziness',
      primaryDiag: 'Diabetes Mellitus with complications',
      icdCode: '250.02',
      a1cStatus: '>8',
      insulinStatus: 'Up',
      timeInHospital: 5,
      medCount: 21,
      labProcedures: 48,
      historyInpatient: 2,
      triagePriority: 'Urgent (High Risk)',
    },
    {
      id: 'enc-live-02',
      arrivalTime: '2m ago',
      patientInitials: 'T.J.',
      age: '[50-60)',
      gender: 'Male',
      admissionReason: 'Hypertensive Emergency & Metabolic Review',
      primaryDiag: 'Essential Hypertension',
      icdCode: '401.9',
      a1cStatus: 'Norm',
      insulinStatus: 'Steady',
      timeInHospital: 3,
      medCount: 13,
      labProcedures: 32,
      historyInpatient: 0,
      triagePriority: 'Standard',
    },
    {
      id: 'enc-live-03',
      arrivalTime: '6m ago',
      patientInitials: 'M.R.',
      age: '[70-80)',
      gender: 'Female',
      admissionReason: 'Post-CABG Blood Sugar Fluctuation',
      primaryDiag: 'Coronary Atherosclerosis',
      icdCode: '414.01',
      a1cStatus: '>7',
      insulinStatus: 'Steady',
      timeInHospital: 6,
      medCount: 18,
      labProcedures: 54,
      historyInpatient: 1,
      triagePriority: 'Urgent (High Risk)',
    },
  ]);

  // Simulate periodic new admissions when stream is active
  useEffect(() => {
    if (!streamActive) return;

    const interval = setInterval(() => {
      const demoNames = ['A.D.', 'R.B.', 'S.W.', 'L.M.', 'C.V.'];
      const demoDiags = [
        { desc: 'Diabetic Ketoacidosis', code: '250.10', priority: 'Urgent (High Risk)' },
        { desc: 'Hypertensive Heart Disease', code: '402.90', priority: 'Standard' },
        { desc: 'Diabetes with Renal Manifestation', code: '250.40', priority: 'Urgent (High Risk)' },
      ];
      const randomDiag = demoDiags[Math.floor(Math.random() * demoDiags.length)];
      const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];

      const newEncounter: StreamingEncounter = {
        id: `enc-live-${Date.now()}`,
        arrivalTime: 'Just now',
        patientInitials: randomName,
        age: '[60-70)',
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        admissionReason: `Emergency Triage: ${randomDiag.desc}`,
        primaryDiag: randomDiag.desc,
        icdCode: randomDiag.code,
        a1cStatus: Math.random() > 0.5 ? '>8' : 'None',
        insulinStatus: Math.random() > 0.5 ? 'Steady' : 'Up',
        timeInHospital: Math.floor(Math.random() * 6) + 2,
        medCount: Math.floor(Math.random() * 12) + 8,
        labProcedures: Math.floor(Math.random() * 30) + 25,
        historyInpatient: Math.floor(Math.random() * 2),
        triagePriority: randomDiag.priority as any,
      };

      setStreamingEncounters((prev) => [newEncounter, ...prev.slice(0, 5)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [streamActive]);

  // Execute actual live prediction on Render FastAPI endpoint
  const handleEvaluateEncounter = async (encounter: StreamingEncounter) => {
    setEvaluatingId(encounter.id);
    const startTime = performance.now();

    try {
      const payload: ClassificationRequest = {
        age: encounter.age,
        gender: encounter.gender,
        race: 'Caucasian',
        admission_type_id: 1,
        admission_source_id: 7,
        time_in_hospital: encounter.timeInHospital,
        medical_specialty: 'Missing',
        number_outpatient: 0,
        number_emergency: 0,
        number_inpatient: encounter.historyInpatient,
        number_diagnoses: 6,
        diag_1: encounter.icdCode,
        diag_2: '401.9',
        diag_3: '414.01',
        max_glu_serum: 'None',
        A1Cresult: encounter.a1cStatus,
        num_medications: encounter.medCount,
        num_lab_procedures: encounter.labProcedures,
        num_procedures: 1,
        insulin: encounter.insulinStatus,
        diabetesMed: 'Yes',
        change: 'No',
      };

      const result = await predictReadmission(payload);
      const duration = Math.round(performance.now() - startTime);

      setStreamingEncounters((prev) =>
        prev.map((item) =>
          item.id === encounter.id
            ? {
                ...item,
                evaluatedResult: {
                  probability: result.probability,
                  isHighRisk: result.prediction === 1,
                  durationMs: duration,
                },
              }
            : item
        )
      );

      toast({
        type: result.prediction === 1 ? 'warning' : 'success',
        title: `Patient Risk Evaluated (${duration}ms)`,
        message: `${encounter.patientInitials}: ${(result.probability * 100).toFixed(1)}% Readmission Risk (${result.prediction === 1 ? 'High Risk' : 'Low Risk'})`,
      });
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Evaluation Error',
        message: err.message || 'Failed to communicate with FastAPI backend.',
      });
    } finally {
      setEvaluatingId(null);
    }
  };

  const filteredBeds =
    activeWardFilter === 'All Wards'
      ? beds
      : beds.filter((b) => b.wardName === activeWardFilter);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status !== 'Available').length;
  const highRiskBeds = beds.filter((b) => b.status === 'High Risk').length;
  const occupancyPercent = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-8">
      {/* Real-time KPI Bar with 3D Card Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ward Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{occupancyPercent}%</span>
            <span className="text-[11px] text-teal-400 font-semibold">{occupiedBeds}/{totalBeds} Beds</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">High Risk Active</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{highRiskBeds}</span>
            <span className="text-[11px] text-rose-300 font-semibold">Priority Triage</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Probability &gt; 0.12 cutoff detected</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Stay Duration</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">4.3</span>
            <span className="text-[11px] text-cyan-400 font-semibold">Days Inpatient</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Clinical length of stay projection</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Clinical Evaluation Engine</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">~160ms</span>
            <span className="text-[11px] text-emerald-400 font-semibold font-mono">Online</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Live responsive service</p>
        </div>
      </div>

      {/* Main 2-Column Real-Time Application Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: 3D Digital Ward Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>3D Interactive Ward Digital Twin</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any hospital bed pod to inspect clinical indicators or trigger live risk assessment.
              </p>
            </div>

            {/* Ward Selector Filters */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              {['All Wards', 'Endocrine Care', 'ICU & Critical', 'Step-Down'].map((ward) => (
                <button
                  key={ward}
                  onClick={() => setActiveWardFilter(ward)}
                  className={`px-2.5 py-1 rounded-lg transition font-medium ${
                    activeWardFilter === ward
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ward}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Beds Perspective Container */}
          <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Ambient visual floor grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative z-10">
              {filteredBeds.map((bed) => {
                const isSelected = selectedBed?.bedNumber === bed.bedNumber;
                let statusColor = 'border-slate-800 bg-slate-950/60 text-slate-400';
                let indicatorColor = 'bg-slate-600';

                if (bed.status === 'High Risk') {
                  statusColor = 'border-rose-500/40 bg-rose-950/30 text-rose-300 hover:border-rose-400';
                  indicatorColor = 'bg-rose-500 animate-pulse';
                } else if (bed.status === 'Moderate Risk') {
                  statusColor = 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-amber-400';
                  indicatorColor = 'bg-amber-400';
                } else if (bed.status === 'Stable') {
                  statusColor = 'border-teal-500/40 bg-teal-950/30 text-teal-300 hover:border-teal-400';
                  indicatorColor = 'bg-teal-400';
                } else if (bed.status === 'Available') {
                  statusColor = 'border-dashed border-slate-800 bg-slate-950/20 text-slate-500 hover:border-slate-700';
                  indicatorColor = 'bg-slate-700';
                }

                return (
                  <div
                    key={bed.bedNumber}
                    onClick={() => setSelectedBed(bed)}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 transform hover:-translate-y-1 hover:shadow-xl ${
                      isSelected
                        ? 'ring-2 ring-teal-400 shadow-teal-500/20 scale-[1.03]'
                        : ''
                    } ${statusColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{bed.bedNumber}</span>
                      <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {bed.wardName}
                      </span>
                      {bed.status !== 'Available' ? (
                        <>
                          <p className="text-xs font-bold text-white truncate">{bed.patientName}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                            <span>Stay: {bed.timeInHospital}d</span>
                            <span>A1C: {bed.a1c}</span>
                          </div>
                        </>
                      ) : (
                        <div className="py-2 text-center text-[11px] text-slate-500 italic">
                          Vacant Bed
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-semibold flex items-center justify-between">
                      <span className="truncate">{bed.status}</span>
                      <span className="text-teal-400 group-hover:underline">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Bed Quick Inspection Panel */}
            {selectedBed && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-950/90 border border-teal-500/40 relative z-10 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/50 font-mono text-xs font-bold">
                      {selectedBed.bedNumber}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {selectedBed.wardName} — {selectedBed.patientName || 'Available Bed'}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      selectedBed.status === 'High Risk'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                        : selectedBed.status === 'Stable'
                        ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                        : selectedBed.status === 'Moderate Risk'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {selectedBed.status}
                  </span>
                </div>

                {selectedBed.status !== 'Available' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Primary Diagnosis:</span>
                      <span className="font-semibold text-white text-xs">{selectedBed.diag1}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Inpatient Duration:</span>
                      <span className="font-semibold text-teal-300 text-xs">{selectedBed.timeInHospital} Days</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Glycemic Protocol:</span>
                      <span className="font-semibold text-cyan-300 text-xs">A1C {selectedBed.a1c} • Ins. {selectedBed.insulin}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                      <Link
                        to="/predict"
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1"
                      >
                        <span>Open in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Bed is currently sanitized and ready for the next incoming diabetic triage admission.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Live Streaming Patient Triage Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Live Streaming Admissions</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time diabetic admissions queue with clinical risk assessment.
              </p>
            </div>

            <button
              onClick={() => setStreamActive(!streamActive)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                streamActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {streamActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">Stream Live</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Paused</span>
                </>
              )}
            </button>
          </div>

          {/* Queue List */}
          <div className="space-y-3">
            {streamingEncounters.map((enc) => {
              const isEvaluating = evaluatingId === enc.id;
              const hasResult = !!enc.evaluatedResult;

              return (
                <div
                  key={enc.id}
                  className="p-4 rounded-2xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-xl shadow-lg hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                        {enc.patientInitials}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">{enc.patientInitials} ({enc.age}, {enc.gender})</span>
                        <span className="block text-[10px] text-slate-400">{enc.arrivalTime}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        enc.triagePriority.includes('Urgent')
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {enc.triagePriority}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <p className="text-slate-300 font-medium">{enc.admissionReason}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1">
                      <span>ICD-9: <strong className="text-cyan-300">{enc.icdCode}</strong></span>
                      <span>•</span>
                      <span>A1C: <strong className="text-teal-300">{enc.a1cStatus}</strong></span>
                      <span>•</span>
                      <span>Stay: {enc.timeInHospital}d</span>
                      <span>•</span>
                      <span>Meds: {enc.medCount}</span>
                    </div>
                  </div>

                  {/* Evaluation Trigger or Result */}
                  <div className="flex items-center justify-between pt-1">
                    {hasResult ? (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                              enc.evaluatedResult?.isHighRisk
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {(enc.evaluatedResult!.probability * 100).toFixed(1)}% Readmission Risk
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {enc.evaluatedResult?.durationMs}ms
                          </span>
                        </div>

                        <Link
                          to="/predict"
                          className="text-[11px] text-cyan-400 hover:underline font-semibold"
                        >
                          View Full Details →
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEvaluateEncounter(enc)}
                        disabled={isEvaluating}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isEvaluating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Evaluating clinical indicators...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Run Live Risk Assessment</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
