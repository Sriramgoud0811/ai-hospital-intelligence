/**
 * Model Intelligence Page
 * Deep dive into the machine learning models, algorithms, loss functions,
 * feature representations, threshold tuning, and clinical trade-offs.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Clock,
  ShieldAlert,
  GitBranch,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const ModelIntelligencePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <span>Machine Learning Systems Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Model Intelligence & Mathematical Formulation
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive technical documentation of the machine learning algorithms, serialization pipelines, threshold tuning strategies, and clinical operational trade-offs deployed in the AI Hospital Intelligence platform.
        </p>
      </div>

      {/* Model 1 Deep Dive: Length of Stay */}
      <section
        id="los-model-intelligence"
        className="p-8 rounded-3xl border border-teal-500/30 bg-slate-900/60 backdrop-blur-xl space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Model 01 • Continuous Regression
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Hospital Length-of-Stay Regressor
              </h2>
            </div>
          </div>
          <Link
            to="/predict/length-of-stay"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Open in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">TARGET VARIABLE</span>
            <p className="text-base font-bold text-teal-300 font-mono">time_in_hospital</p>
            <p className="text-slate-400">Continuous inpatient stay measured in days (clipped to 1–14 range).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">ALGORITHM FAMILY</span>
            <p className="text-base font-bold text-white">Gradient Boosted Trees (XGBoost)</p>
            <p className="text-slate-400">Tree ensemble optimizing squared-error loss with L1/L2 regularization.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">INPUT ENCODING</span>
            <p className="text-base font-bold text-cyan-300">Sparse Categorical Matrix</p>
            <p className="text-slate-400">13 raw patient encounter fields transformed to ~2,359 encoded features.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-sm font-semibold text-white">Engineering Strategy & Output Clipping</h3>
          <p>
            In the source diabetic encounter dataset, inpatient stays are strictly integer days capped between 1 and 14 days. Encounters exceeding 14 days were recorded at the dataset ceiling of 14. To ensure realistic operational outputs that mirror the empirical distribution, the inference pipeline applies mathematical bounding to the raw regression output.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-teal-300">
            predicted_stay = float(np.clip(model.predict(encoded_encounter)[0], 1.0, 14.0))
          </div>
        </div>

        {/* Key Feature Drivers */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Primary Feature Importance Drivers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-1">Prior Inpatient Visits</span>
              <p className="text-slate-400 text-[11px]">
                High prior inpatient utilization strongly correlates with prolonged subsequent stays due to chronic condition instability.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-1">Admission Source ID</span>
              <p className="text-slate-400 text-[11px]">
                Emergency room admissions (Source 7) and physician referrals correlate with higher initial acuity.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-1">Diagnostic Multi-Morbidity</span>
              <p className="text-slate-400 text-[11px]">
                Complex primary ICD-9 diagnoses (circulatory 390–459 and respiratory 460–519) indicate multi-system management.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-1">Age Stratification</span>
              <p className="text-slate-400 text-[11px]">
                Older brackets ([70-80), [80-90)) show extended baseline convalescence times compared to younger cohorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Model 2 Deep Dive: Readmission Risk */}
      <section
        id="readmission-model-intelligence"
        className="p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-xl space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Model 02 • Binary Classification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                30-Day Hospital Readmission Classifier
              </h2>
            </div>
          </div>
          <Link
            to="/predict/readmission"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Open in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">TARGET VARIABLE</span>
            <p className="text-base font-bold text-cyan-300 font-mono">target_readmit_30d</p>
            <p className="text-slate-400">Binary flag: 1 indicates unplanned readmission within 30 days post-discharge.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">CLASS IMBALANCE</span>
            <p className="text-base font-bold text-white">~11% Positive Prevalence</p>
            <p className="text-slate-400">Readmission is an inherently minority class event across retrospective encounters.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono">DECISION THRESHOLD</span>
            <p className="text-base font-bold text-amber-300 font-mono">Tuned Cutoff (e.g. 0.12)</p>
            <p className="text-slate-400">Calibrated below 0.5 to optimize clinical sensitivity and capture at-risk patients.</p>
          </div>
        </div>

        {/* Threshold Calibration Explanation */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Sliders className="w-4 h-4" />
            <h3>Why Is the Decision Threshold Configured Below 0.50?</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In standard machine learning classification problems, predictions default to a probability cutoff of 0.50. However, in medical readmission screening where the ground-truth event rate is only approximately 11%, a naive 0.50 cutoff results in unacceptable false-negative rates (missing high-risk patients who would benefit from post-discharge care coordination).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 pt-1">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-white font-semibold block mb-1">Standard Cutoff (0.50) Defect</span>
              <p>Misses the vast majority of true readmission cases due to high penalty threshold, rendering early intervention useless.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-cyan-300 font-semibold block mb-1">Tuned Cutoff (e.g. 0.12) Advantage</span>
              <p>Aligns with clinical operational priorities: maximizing sensitivity so nurse case managers can schedule timely follow-up telehealth visits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Scientific Validation Statement */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Info className="w-4 h-4 text-teal-400" />
          <span>Research Protocol & Metrics Integrity</span>
        </div>
        <p className="leading-relaxed">
          In adherence to rigorous scientific standards, this platform does not publish fabricated or unverified accuracy benchmarks. The models run real pre-trained pipelines serialized with <code className="text-slate-300 font-mono">joblib</code> and served via FastAPI. All evaluations in the Prediction Studio are live inferences computed on the server.
        </p>
      </div>
    </div>
  );
};
