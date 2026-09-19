/**
 * Regression Form: Hospital Length-of-Stay Prediction
 * Endpoint: POST /predict/length-of-stay
 * Target: time_in_hospital (estimated days)
 */

import React, { useState } from 'react';
import {
  Clock,
  User,
  Building2,
  Stethoscope,
  Activity,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2,
  FileCode2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { RegressionRequest, ApiError } from '../../types/api';
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  RACE_OPTIONS,
  ADMISSION_TYPE_OPTIONS,
  ADMISSION_SOURCE_OPTIONS,
  MEDICAL_SPECIALTY_OPTIONS,
  PAYER_CODE_OPTIONS,
  COMMON_ICD9_CODES,
  SAMPLE_REGRESSION_CASES,
} from '../../constants/dataset';

interface RegressionFormProps {
  onSubmit: (payload: RegressionRequest) => Promise<void>;
  isLoading: boolean;
  apiError: ApiError | null;
  onClearError: () => void;
}

export const RegressionForm: React.FC<RegressionFormProps> = ({
  onSubmit,
  isLoading,
  apiError,
  onClearError,
}) => {
  const initialValues: RegressionRequest = {
    age: '[50-60)',
    gender: 'Male',
    race: 'Caucasian',
    admission_type_id: 1,
    admission_source_id: 7,
    medical_specialty: 'Missing',
    number_outpatient: 0,
    number_emergency: 0,
    number_inpatient: 1,
    diag_1: '250.00',
    diag_2: '401.9',
    diag_3: '414.01',
    payer_code: 'Missing',
  };

  const [formData, setFormData] = useState<RegressionRequest>(initialValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.age.trim()) errors.age = 'Age group is required.';
    if (!formData.gender.trim()) errors.gender = 'Gender is required.';
    if (!formData.race.trim()) errors.race = 'Race is required.';

    if (formData.admission_type_id === undefined || isNaN(formData.admission_type_id)) {
      errors.admission_type_id = 'Admission type ID must be a valid integer.';
    }
    if (formData.admission_source_id === undefined || isNaN(formData.admission_source_id)) {
      errors.admission_source_id = 'Admission source ID must be a valid integer.';
    }

    if (formData.number_outpatient < 0 || isNaN(formData.number_outpatient)) {
      errors.number_outpatient = 'Outpatient visits must be ≥ 0.';
    }
    if (formData.number_emergency < 0 || isNaN(formData.number_emergency)) {
      errors.number_emergency = 'Emergency visits must be ≥ 0.';
    }
    if (formData.number_inpatient < 0 || isNaN(formData.number_inpatient)) {
      errors.number_inpatient = 'Inpatient visits must be ≥ 0.';
    }

    if (!formData.diag_1.trim()) errors.diag_1 = 'Primary diagnosis (diag_1) is required.';
    if (!formData.diag_2.trim()) errors.diag_2 = 'Secondary diagnosis (diag_2) is required.';
    if (!formData.diag_3.trim()) errors.diag_3 = 'Additional diagnosis (diag_3) is required.';
    if (!formData.payer_code.trim()) errors.payer_code = 'Payer code is required (use Missing if unknown).';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof RegressionRequest, value: any) => {
    onClearError();
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNumberChange = (field: keyof RegressionRequest, rawVal: string) => {
    const parsed = parseInt(rawVal, 10);
    handleChange(field, isNaN(parsed) ? 0 : Math.max(0, parsed));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const loadSample = (sampleIndex: number) => {
    setFormData(SAMPLE_REGRESSION_CASES[sampleIndex].data);
    setFormErrors({});
    onClearError();
  };

  const handleReset = () => {
    setFormData(initialValues);
    setFormErrors({});
    onClearError();
  };

  return (
    <form
      id="regression-prediction-form"
      onSubmit={handleSubmit}
      className="space-y-6 text-slate-200"
      noValidate
    >
      {/* Sample presets bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Clinical Test Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_REGRESSION_CASES.map((sample, idx) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => loadSample(idx)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              title={sample.description}
            >
              Preset {idx + 1}: {sample.name.split(' ')[0]}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition flex items-center gap-1"
            title="Reset form fields"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Section 1: Demographics */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-teal-300">
          <User className="w-4 h-4" />
          <h3>1. Patient Demographics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Age */}
          <div>
            <label htmlFor="reg-age" className="block text-xs font-medium text-slate-300 mb-1.5">
              Age Bracket <span className="text-teal-400">*</span>
            </label>
            <select
              id="reg-age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {AGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.age && <p className="text-[11px] text-rose-400 mt-1">{formErrors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="reg-gender" className="block text-xs font-medium text-slate-300 mb-1.5">
              Gender <span className="text-teal-400">*</span>
            </label>
            <select
              id="reg-gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.gender && <p className="text-[11px] text-rose-400 mt-1">{formErrors.gender}</p>}
          </div>

          {/* Race */}
          <div>
            <label htmlFor="reg-race" className="block text-xs font-medium text-slate-300 mb-1.5">
              Race / Ethnicity <span className="text-teal-400">*</span>
            </label>
            <select
              id="reg-race"
              value={formData.race}
              onChange={(e) => handleChange('race', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {RACE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === '?' ? '? (Unknown / Unreported)' : opt}
                </option>
              ))}
            </select>
            {formErrors.race && <p className="text-[11px] text-rose-400 mt-1">{formErrors.race}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Admission Context */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-teal-300">
          <Building2 className="w-4 h-4" />
          <h3>2. Admission Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Admission Type ID */}
          <div>
            <label htmlFor="reg-admission-type" className="block text-xs font-medium text-slate-300 mb-1.5">
              Admission Type ID <span className="text-teal-400">*</span>
            </label>
            <select
              id="reg-admission-type"
              value={formData.admission_type_id}
              onChange={(e) => handleChange('admission_type_id', parseInt(e.target.value, 10))}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {ADMISSION_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formErrors.admission_type_id && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.admission_type_id}</p>
            )}
          </div>

          {/* Admission Source ID */}
          <div>
            <label htmlFor="reg-admission-source" className="block text-xs font-medium text-slate-300 mb-1.5">
              Admission Source ID <span className="text-teal-400">*</span>
            </label>
            <select
              id="reg-admission-source"
              value={formData.admission_source_id}
              onChange={(e) => handleChange('admission_source_id', parseInt(e.target.value, 10))}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {ADMISSION_SOURCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formErrors.admission_source_id && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.admission_source_id}</p>
            )}
          </div>

          {/* Medical Specialty */}
          <div>
            <label htmlFor="reg-specialty" className="block text-xs font-medium text-slate-300 mb-1.5">
              Medical Specialty
            </label>
            <select
              id="reg-specialty"
              value={formData.medical_specialty}
              onChange={(e) => handleChange('medical_specialty', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {MEDICAL_SPECIALTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Payer Code */}
          <div>
            <label htmlFor="reg-payer-code" className="block text-xs font-medium text-slate-300 mb-1.5">
              Payer Code
            </label>
            <select
              id="reg-payer-code"
              value={formData.payer_code}
              onChange={(e) => handleChange('payer_code', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white"
            >
              {PAYER_CODE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Missing' ? 'Missing / Unspecified' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Previous Healthcare Utilization */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-teal-300">
          <Activity className="w-4 h-4" />
          <h3>3. Previous Healthcare Utilization (Past Year)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Outpatient */}
          <div>
            <label htmlFor="reg-outpatient" className="block text-xs font-medium text-slate-300 mb-1.5">
              Outpatient Visits
            </label>
            <input
              id="reg-outpatient"
              type="number"
              min="0"
              value={formData.number_outpatient}
              onChange={(e) => handleNumberChange('number_outpatient', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.number_outpatient && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.number_outpatient}</p>
            )}
          </div>

          {/* Emergency */}
          <div>
            <label htmlFor="reg-emergency" className="block text-xs font-medium text-slate-300 mb-1.5">
              Emergency Visits
            </label>
            <input
              id="reg-emergency"
              type="number"
              min="0"
              value={formData.number_emergency}
              onChange={(e) => handleNumberChange('number_emergency', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.number_emergency && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.number_emergency}</p>
            )}
          </div>

          {/* Inpatient */}
          <div>
            <label htmlFor="reg-inpatient" className="block text-xs font-medium text-slate-300 mb-1.5">
              Inpatient Visits (High impact)
            </label>
            <input
              id="reg-inpatient"
              type="number"
              min="0"
              value={formData.number_inpatient}
              onChange={(e) => handleNumberChange('number_inpatient', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.number_inpatient && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.number_inpatient}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Diagnosis Information */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-300">
            <Stethoscope className="w-4 h-4" />
            <h3>4. Diagnosis Information (ICD-9 Codes)</h3>
          </div>
          <span className="text-[11px] text-slate-400">e.g. 250.00, 401.9, 414.01</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reg-diag1" className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary Diagnosis (diag_1) <span className="text-teal-400">*</span>
            </label>
            <input
              id="reg-diag1"
              type="text"
              value={formData.diag_1}
              onChange={(e) => handleChange('diag_1', e.target.value)}
              placeholder="250.00"
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_1 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_1}</p>}
          </div>

          <div>
            <label htmlFor="reg-diag2" className="block text-xs font-medium text-slate-300 mb-1.5">
              Secondary Diagnosis (diag_2) <span className="text-teal-400">*</span>
            </label>
            <input
              id="reg-diag2"
              type="text"
              value={formData.diag_2}
              onChange={(e) => handleChange('diag_2', e.target.value)}
              placeholder="401.9"
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_2 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_2}</p>}
          </div>

          <div>
            <label htmlFor="reg-diag3" className="block text-xs font-medium text-slate-300 mb-1.5">
              Additional Diagnosis (diag_3) <span className="text-teal-400">*</span>
            </label>
            <input
              id="reg-diag3"
              type="text"
              value={formData.diag_3}
              onChange={(e) => handleChange('diag_3', e.target.value)}
              placeholder="414.01"
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_3 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_3}</p>}
          </div>
        </div>

        {/* Quick ICD-9 reference chips */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-1.5">Quick ICD-9 reference:</p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ICD9_CODES.slice(0, 5).map((icd) => (
              <button
                key={icd.code}
                type="button"
                onClick={() => handleChange('diag_1', icd.code)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50"
              >
                {icd.code} ({icd.label.split(' - ')[1].slice(0, 20)}...)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backend error display */}
      {apiError && (
        <div
          id="regression-api-error-alert"
          className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs space-y-3"
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-rose-300">
                    {apiError.status === 422
                      ? 'Validation Error (HTTP 422)'
                      : apiError.status === 500
                      ? 'Model Execution Error (HTTP 500)'
                      : apiError.isColdStart
                      ? 'Prediction Service Waking Up'
                      : 'Prediction Service Error'}
                  </h4>
                  {apiError.status && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
                      HTTP {apiError.status}
                    </span>
                  )}
                </div>
                <p className="leading-relaxed">{apiError.message}</p>
                {apiError.fieldErrors && (
                  <ul className="list-disc list-inside mt-2 text-[11px] text-rose-300 space-y-0.5">
                    {Object.entries(apiError.fieldErrors).map(([f, msgs]) => (
                      <li key={f}>
                        <span className="font-mono font-semibold">{f}</span>: {msgs.join(', ')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="button"
              id="btn-retry-regression"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-200 text-xs font-semibold transition shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>

          {/* Expandable Technical Details */}
          {Boolean(apiError.raw) && (
            <div className="pt-2 border-t border-rose-500/20">
              <button
                type="button"
                id="btn-toggle-regression-error-details"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="flex items-center justify-between w-full text-[11px] font-mono text-rose-300/80 hover:text-rose-200 py-1"
              >
                <span>Inspect Technical Error Diagnostics</span>
                {showErrorDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showErrorDetails && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto">
                  <pre>{JSON.stringify(apiError.raw, null, 2) || ''}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Action */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold transition"
        >
          Reset Fields
        </button>

        <button
          id="btn-submit-regression"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying XGBoost Regressor...</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>Estimate Length of Stay</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
