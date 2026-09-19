/**
 * Data Science & Pipeline Page
 * Documents dataset lineage, preprocessing stages, categorical transformations,
 * target definitions, and clinical ethical considerations.
 */

import React from 'react';
import { Database, GitBranch, Layers, ShieldAlert, Sparkles, Filter, CheckCircle2, FileText } from 'lucide-react';
import { DATASET_META } from '../constants/dataset';

export const DataSciencePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dataset Provenance & Preprocessing Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Healthcare Data Science Pipeline
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The models behind AI Hospital Intelligence are trained on retrospective inpatient records from 130 US hospitals spanning 1999 to 2008. Learn about data cleaning, feature transformations, and ethical ML design.
        </p>
      </div>

      {/* Dataset Lineage Card */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                {DATASET_META.name}
              </h2>
              <p className="text-xs text-slate-400">UCI Machine Learning Repository / Strack et al.</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
            {DATASET_META.totalRows.toLocaleString()} Retrospective Records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TIME SPAN</span>
            <span className="font-bold text-white text-sm">{DATASET_META.timeRange}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TOTAL HOSPITALS</span>
            <span className="font-bold text-white text-sm">130 Facilities</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">RAW ATTRIBUTES</span>
            <span className="font-bold text-white text-sm">{DATASET_META.totalColumns} Clinical Features</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ENCODED REGRESSION FEATURES</span>
            <span className="font-bold text-teal-300 text-sm">{DATASET_META.regressionFeaturesCount.toLocaleString()} Columns</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The dataset represents 10 years (1999–2008) of clinical care at 130 US hospitals and integrated delivery networks. It includes records meeting diabetic inpatient encounter criteria with hospital stays ranging from 1 to 14 days, laboratory tests administered, and medications prescribed.
        </p>
      </div>

      {/* Preprocessing Step-by-Step Flow */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
          End-to-End Data Transformation Stages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-semibold text-white">Missing Data Handling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Medical records frequently encode unrecorded information as <code className="text-teal-300">?</code>. Columns with extreme sparsity (e.g. weight with &gt;96% missingness) are pruned, while informative missingness in fields like <code className="text-teal-300">medical_specialty</code> and <code className="text-teal-300">payer_code</code> is preserved as dedicated categorical bins.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-semibold text-white">ICD-9 Grouping & Encoding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Primary and secondary diagnosis codes (e.g. 250.xx for Diabetes Mellitus, 401.xx for Essential Hypertension) are categorized into clinically cohesive diagnostic chapters or one-hot encoded, expanding raw encounter tables into high-dimensional feature spaces.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-semibold text-white">Target Formulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For regression, <code className="text-blue-300">time_in_hospital</code> is evaluated on a continuous scale (1–14 days). For classification, the multi-class readmission field (<code className="text-blue-300">&lt;30</code>, <code className="text-blue-300">&gt;30</code>, <code className="text-blue-300">NO</code>) is binarized to isolate high-risk 30-day readmissions (<code className="text-blue-300">&lt;30</code> vs all others).
            </p>
          </div>
        </div>
      </div>

      {/* Ethical & Governance Considerations */}
      <div className="p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4">
        <div className="flex items-center gap-3 text-amber-400 font-semibold text-base">
          <ShieldAlert className="w-5 h-5" />
          <h2>Ethical Considerations & AI Governance</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Healthcare data naturally reflects clinical practice patterns, socioeconomic access disparities, and institutional referral pathways. Machine learning models trained on retrospective administrative records must be deployed with vigilant oversight:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400 pt-1">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Correlation vs. Causation:</strong> Predictions reflect statistical correlation within encounter billing logs, not biological or clinical causality.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Human-in-the-Loop Oversight:</strong> Algorithmic estimates should solely augment, never replace, the expert decision-making of licensed physicians, nurses, and care coordinators.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
