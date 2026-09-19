/**
 * Unified Prediction Studio Workspace
 * Houses both Length-of-Stay Regressor and 30-Day Readmission Classifier
 * Supports tab switching, deep-linking, real FastAPI queries, and live result visualization
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  Sparkles,
  Info,
  Layers,
  History,
  Activity,
  AlertCircle,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import doctorImg from '../assets/images/doctor_portrait_1789729984838.jpg';
import nurseImg from '../assets/images/nurse_portrait_1789730000400.jpg';
import { RegressionForm } from '../components/prediction/RegressionForm';
import { RegressionResult } from '../components/prediction/RegressionResult';
import { ClassificationForm } from '../components/prediction/ClassificationForm';
import { ClassificationResult } from '../components/prediction/ClassificationResult';
import { ApiStatusBadge } from '../components/common/ApiStatusBadge';
import {
  RegressionRequest,
  RegressionResponse,
  ClassificationRequest,
  ClassificationResponse,
  ApiError,
} from '../types/api';
import { predictLengthOfStay, predictReadmission } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface PredictionStudioPageProps {
  initialTab?: 'length-of-stay' | 'readmission';
}

export const PredictionStudioPage: React.FC<PredictionStudioPageProps> = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const tabParam = searchParams.get('model');
  const activeTab: 'length-of-stay' | 'readmission' =
    initialTab || (tabParam === 'readmission' ? 'readmission' : 'length-of-stay');

  // Regression State
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<ApiError | null>(null);
  const [regResult, setRegResult] = useState<RegressionResponse | null>(null);
  const [regInputs, setRegInputs] = useState<RegressionRequest | null>(null);
  const [regDuration, setRegDuration] = useState<number>(0);
  const [regTimestamp, setRegTimestamp] = useState<string>('');

  // Classification State
  const [clsLoading, setClsLoading] = useState(false);
  const [clsError, setClsError] = useState<ApiError | null>(null);
  const [clsResult, setClsResult] = useState<ClassificationResponse | null>(null);
  const [clsInputs, setClsInputs] = useState<ClassificationRequest | null>(null);
  const [clsDuration, setClsDuration] = useState<number>(0);
  const [clsTimestamp, setClsTimestamp] = useState<string>('');

  const setTab = (tab: 'length-of-stay' | 'readmission') => {
    setSearchParams({ model: tab });
  };

  // Helper to record history in sessionStorage
  const saveSessionHistory = (type: 'regression' | 'classification', payload: any, result: any) => {
    try {
      const existing = JSON.parse(sessionStorage.getItem('clinical_predictions_history') || '[]');
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toISOString(),
        type,
        inputs: payload,
        result,
      };
      existing.unshift(entry);
      sessionStorage.setItem('clinical_predictions_history', JSON.stringify(existing.slice(0, 30)));
    } catch {
      // ignore
    }
  };

  const handleRegressionSubmit = async (payload: RegressionRequest) => {
    setRegLoading(true);
    setRegError(null);
    const startTime = performance.now();
    try {
      const response = await predictLengthOfStay(payload);
      const elapsed = Math.round(performance.now() - startTime);
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setRegResult(response);
      setRegInputs(payload);
      setRegDuration(elapsed);
      setRegTimestamp(nowFormatted);
      saveSessionHistory('regression', payload, response);
      toast({
        type: 'success',
        title: 'Stay Estimate Generated',
        message: `Estimated hospital stay: ${response.prediction.toFixed(1)} days.`,
      });
    } catch (err: any) {
      const errorObj: ApiError = err.isAxiosError || err.fieldErrors
        ? err
        : { message: err.message || 'The service took longer than expected. Please try again.' };
      setRegError(errorObj);
      toast({
        type: 'error',
        title: errorObj.isColdStart ? 'Service Starting Up' : 'Service Notice',
        message: errorObj.message,
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleClassificationSubmit = async (payload: ClassificationRequest) => {
    setClsLoading(true);
    setClsError(null);
    const startTime = performance.now();
    try {
      const response = await predictReadmission(payload);
      const elapsed = Math.round(performance.now() - startTime);
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setClsResult(response);
      setClsInputs(payload);
      setClsDuration(elapsed);
      setClsTimestamp(nowFormatted);
      saveSessionHistory('classification', payload, response);
      toast({
        type: 'success',
        title: 'Assessment Generated',
        message: `Estimated 30-day readmission likelihood: ${(response.probability * 100).toFixed(1)}%.`,
      });
    } catch (err: any) {
      const errorObj: ApiError = err.isAxiosError || err.fieldErrors
        ? err
        : { message: err.message || 'The service took longer than expected. Please try again.' };
      setClsError(errorObj);
      toast({
        type: 'error',
        title: errorObj.isColdStart ? 'Service Starting Up' : 'Service Notice',
        message: errorObj.message,
      });
    } finally {
      setClsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Healthcare Decision Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Healthcare Assessment Tools
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Enter patient visit details to estimate expected hospital stay duration or evaluate 30-day readmission likelihood to support discharge planning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ApiStatusBadge />
        </div>
      </div>

      {/* Tool Selection Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          id="tab-btn-length-of-stay"
          onClick={() => setTab('length-of-stay')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'length-of-stay'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Hospital Stay Estimate</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60 hidden sm:inline">
            Bed Planning
          </span>
        </button>

        <button
          id="tab-btn-readmission"
          onClick={() => setTab('readmission')}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'readmission'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>30-Day Readmission Assessment</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 hidden sm:inline">
            Care Continuity
          </span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-lg">
            <div className="pb-4 mb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {activeTab === 'length-of-stay'
                    ? 'Patient Visit Details'
                    : 'Readmission Assessment Details'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {activeTab === 'length-of-stay'
                    ? 'Provide admission, laboratory, and specialty details'
                    : 'Provide admission records, prior visits, and medication factors'}
                </p>
              </div>

              <span className="text-[11px] font-medium text-teal-400 px-2.5 py-1 rounded-full bg-teal-950/60 border border-teal-800/40">
                Secure Cloud Tool
              </span>
            </div>

            {activeTab === 'length-of-stay' ? (
              <RegressionForm
                onSubmit={handleRegressionSubmit}
                isLoading={regLoading}
                apiError={regError}
                onClearError={() => setRegError(null)}
              />
            ) : (
              <ClassificationForm
                onSubmit={handleClassificationSubmit}
                isLoading={clsLoading}
                apiError={clsError}
                onClearError={() => setClsError(null)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Results & Guidance */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {activeTab === 'length-of-stay' ? (
            regResult && regInputs ? (
              <RegressionResult
                result={regResult}
                inputs={regInputs}
                durationMs={regDuration}
                timestamp={regTimestamp}
                onReset={() => setRegResult(null)}
              />
            ) : (
              <div
                id="regression-empty-state"
                className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Awaiting Stay Estimate Request</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Enter patient visit details or select an example preset to estimate the expected length of hospital stay.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
                  <span className="font-semibold text-teal-300 block">Assessment Overview:</span>
                  <p>• Estimated hospital stay duration (1 to 14 days)</p>
                  <p>• Visual hospital stay distribution comparison</p>
                  <p>• Key factors supporting ward bed planning</p>
                </div>
              </div>
            )
          ) : clsResult && clsInputs ? (
            <ClassificationResult
              result={clsResult}
              inputs={clsInputs}
              durationMs={clsDuration}
              timestamp={clsTimestamp}
              onReset={() => setClsResult(null)}
            />
          ) : (
            <div
              id="classification-empty-state"
              className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Awaiting Readmission Assessment</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Enter patient visit details, prior visit history, and medications to generate a 30-day readmission assessment.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
                <span className="font-semibold text-cyan-300 block">Assessment Overview:</span>
                <p>• Estimated 30-day readmission likelihood</p>
                <p>• Priority classification for discharge planning</p>
                <p>• Actionable follow-up recommendations for care teams</p>
              </div>
            </div>
          )}

          {/* Quick Guide Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Service Connection Notice</span>
            </div>
            <p className="leading-relaxed">
              Predictions are processed securely by our cloud healthcare service. If the service has been resting, the initial request may take up to 45 seconds to respond.
            </p>
          </div>

          {/* On-Duty Clinical Care Leads Widget with Real Doctor & Nurse Photos */}
          <div className="p-4 rounded-2xl border border-teal-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                  On-Duty Clinical Triage Leads
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                Active Ward
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Doctor snippet */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-teal-500/40">
                  <img
                    src={doctorImg}
                    alt="Dr. Evelyn Reed, MD"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-[11px]">Dr. Evelyn Reed, MD</p>
                  <p className="text-[10px] text-teal-300 truncate">Chief of Endocrinology</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">On Duty</span>
              </div>

              {/* Nurse snippet */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-cyan-500/40">
                  <img
                    src={nurseImg}
                    alt="Marcus Vance, RN, BSN"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-[11px]">Marcus Vance, RN, BSN</p>
                  <p className="text-[10px] text-cyan-300 truncate">Lead Nurse Coordinator</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">Active</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Track 3D ward bed allocation</span>
              <Link
                to="/realtime-ward"
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
              >
                <span>Live Ward Twin</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
