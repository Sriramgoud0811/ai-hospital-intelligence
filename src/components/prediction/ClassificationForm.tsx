/**
 * Classification Form: 30-Day Hospital Readmission Risk Prediction
 * Endpoint: POST /predict/readmission
 * Target: target_readmit_30d
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  User,
  Building2,
  Activity,
  Stethoscope,
  Pill,
  Sparkles,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { ClassificationRequest, ApiError } from '../../types/api';
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  RACE_OPTIONS,
  ADMISSION_TYPE_OPTIONS,
  ADMISSION_SOURCE_OPTIONS,
  MEDICAL_SPECIALTY_OPTIONS,
  MAX_GLU_SERUM_OPTIONS,
  A1C_RESULT_OPTIONS,
  INSULIN_OPTIONS,
  DIABETES_MED_OPTIONS,
  CHANGE_OPTIONS,
  COMMON_ICD9_CODES,
  SAMPLE_CLASSIFICATION_CASES,
} from '../../constants/dataset';

interface ClassificationFormProps {
  onSubmit: (payload: ClassificationRequest) => Promise<void>;
  isLoading: boolean;
  apiError: ApiError | null;
  onClearError: () => void;
}

export const ClassificationForm: React.FC<ClassificationFormProps> = ({
  onSubmit,
  isLoading,
  apiError,
  onClearError,
}) => {
  const initialValues: ClassificationRequest = {
    age: '[50-60)',
    gender: 'Male',
    race: 'Caucasian',
    admission_type_id: 1,
    admission_source_id: 7,
    time_in_hospital: 3,
    medical_specialty: 'Missing',
    number_outpatient: 0,
    number_emergency: 0,
    number_inpatient: 1,
    number_diagnoses: 5,
    diag_1: '250.00',
    diag_2: '401.9',
    diag_3: '414.01',
    max_glu_serum: 'None',
    A1Cresult: 'None',
    num_medications: 12,
    num_lab_procedures: 35,
    num_procedures: 1,
    insulin: 'Steady',
    diabetesMed: 'Yes',
    change: 'No',
  };

  const [formData, setFormData] = useState<ClassificationRequest>(initialValues);
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

    if (
      formData.time_in_hospital === undefined ||
      isNaN(formData.time_in_hospital) ||
      formData.time_in_hospital < 1 ||
      formData.time_in_hospital > 14
    ) {
      errors.time_in_hospital = 'Time in hospital must be between 1 and 14 days.';
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
    if (formData.number_diagnoses < 0 || isNaN(formData.number_diagnoses)) {
      errors.number_diagnoses = 'Number of diagnoses must be ≥ 0.';
    }

    if (!formData.diag_1.trim()) errors.diag_1 = 'Primary diagnosis is required.';
    if (!formData.diag_2.trim()) errors.diag_2 = 'Secondary diagnosis is required.';
    if (!formData.diag_3.trim()) errors.diag_3 = 'Additional diagnosis is required.';

    if (formData.num_medications < 0 || isNaN(formData.num_medications)) {
      errors.num_medications = 'Medications count must be ≥ 0.';
    }
    if (formData.num_lab_procedures < 0 || isNaN(formData.num_lab_procedures)) {
      errors.num_lab_procedures = 'Lab procedures count must be ≥ 0.';
    }
    if (formData.num_procedures < 0 || isNaN(formData.num_procedures)) {
      errors.num_procedures = 'Procedures count must be ≥ 0.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof ClassificationRequest, value: any) => {
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

  const handleNumberChange = (field: keyof ClassificationRequest, rawVal: string, min = 0, max?: number) => {
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed)) parsed = min;
    parsed = Math.max(min, parsed);
    if (max !== undefined) {
      parsed = Math.min(max, parsed);
    }
    handleChange(field, parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const loadSample = (index: number) => {
    setFormData(SAMPLE_CLASSIFICATION_CASES[index].data);
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
      id="classification-prediction-form"
      onSubmit={handleSubmit}
      className="space-y-6 text-slate-200"
      noValidate
    >
      {/* Sample presets bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Load Example Patient:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_CLASSIFICATION_CASES.map((sample, idx) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => loadSample(idx)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              title={sample.description}
            >
              {sample.name}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition flex items-center gap-1"
            title="Clear all fields"
          >
            <RotateCcw className="w-3 h-3" />
            Clear Form
          </button>
        </div>
      </div>

      {/* Section 1: Patient Profile */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-cyan-300">
          <User className="w-4 h-4" />
          <h3>1. Patient Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cls-age" className="block text-xs font-medium text-slate-300 mb-1.5">
              Age Group <span className="text-cyan-400">*</span>
            </label>
            <select
              id="cls-age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {AGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.age && <p className="text-[11px] text-rose-400 mt-1">{formErrors.age}</p>}
          </div>

          <div>
            <label htmlFor="cls-gender" className="block text-xs font-medium text-slate-300 mb-1.5">
              Gender <span className="text-cyan-400">*</span>
            </label>
            <select
              id="cls-gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formErrors.gender && <p className="text-[11px] text-rose-400 mt-1">{formErrors.gender}</p>}
          </div>

          <div>
            <label htmlFor="cls-race" className="block text-xs font-medium text-slate-300 mb-1.5">
              Race / Ethnicity <span className="text-cyan-400">*</span>
            </label>
            <select
              id="cls-race"
              value={formData.race}
              onChange={(e) => handleChange('race', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {RACE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === '?' ? 'Not Specified' : opt}
                </option>
              ))}
            </select>
            {formErrors.race && <p className="text-[11px] text-rose-400 mt-1">{formErrors.race}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Hospital Stay Details */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-cyan-300">
          <Building2 className="w-4 h-4" />
          <h3>2. Hospital Stay Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="cls-admission-type" className="block text-xs font-medium text-slate-300 mb-1.5">
              How was the patient admitted? <span className="text-cyan-400">*</span>
            </label>
            <select
              id="cls-admission-type"
              value={formData.admission_type_id}
              onChange={(e) => handleChange('admission_type_id', parseInt(e.target.value, 10))}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {ADMISSION_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label.replace(/^\d+\s*-\s*/, '')}
                </option>
              ))}
            </select>
            {formErrors.admission_type_id && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.admission_type_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="cls-admission-source" className="block text-xs font-medium text-slate-300 mb-1.5">
              Where did the patient arrive from? <span className="text-cyan-400">*</span>
            </label>
            <select
              id="cls-admission-source"
              value={formData.admission_source_id}
              onChange={(e) => handleChange('admission_source_id', parseInt(e.target.value, 10))}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {ADMISSION_SOURCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label.replace(/^\d+\s*-\s*/, '')}
                </option>
              ))}
            </select>
            {formErrors.admission_source_id && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.admission_source_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="cls-time-hospital" className="block text-xs font-medium text-slate-300 mb-1.5">
              Days spent in hospital (1–14 days) <span className="text-cyan-400">*</span>
            </label>
            <input
              id="cls-time-hospital"
              type="number"
              min="1"
              max="14"
              value={formData.time_in_hospital}
              onChange={(e) => handleNumberChange('time_in_hospital', e.target.value, 1, 14)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.time_in_hospital && (
              <p className="text-[11px] text-rose-400 mt-1">{formErrors.time_in_hospital}</p>
            )}
          </div>

          <div>
            <label htmlFor="cls-specialty" className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary admitting medical department
            </label>
            <select
              id="cls-specialty"
              value={formData.medical_specialty}
              onChange={(e) => handleChange('medical_specialty', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white"
            >
              {MEDICAL_SPECIALTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Missing' ? 'General Medical Care' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Healthcare Utilization */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-cyan-300">
          <Activity className="w-4 h-4" />
          <h3>3. Past Healthcare Visits & Prior Stays (Past Year)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="cls-outpatient" className="block text-xs font-medium text-slate-300 mb-1.5">
              Past outpatient clinic visits
            </label>
            <input
              id="cls-outpatient"
              type="number"
              min="0"
              value={formData.number_outpatient}
              onChange={(e) => handleNumberChange('number_outpatient', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="cls-emergency" className="block text-xs font-medium text-slate-300 mb-1.5">
              Past emergency room visits
            </label>
            <input
              id="cls-emergency"
              type="number"
              min="0"
              value={formData.number_emergency}
              onChange={(e) => handleNumberChange('number_emergency', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="cls-inpatient" className="block text-xs font-medium text-slate-300 mb-1.5">
              Past hospital admissions
            </label>
            <input
              id="cls-inpatient"
              type="number"
              min="0"
              value={formData.number_inpatient}
              onChange={(e) => handleNumberChange('number_inpatient', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="cls-num-diagnoses" className="block text-xs font-medium text-slate-300 mb-1.5">
              Total conditions diagnosed
            </label>
            <input
              id="cls-num-diagnoses"
              type="number"
              min="0"
              value={formData.number_diagnoses}
              onChange={(e) => handleNumberChange('number_diagnoses', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Clinical and Treatment Information */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-cyan-300">
          <Pill className="w-4 h-4" />
          <h3>4. Clinical Diagnoses, Tests & Treatment Details</h3>
        </div>

        {/* Diagnosis ICD-9 Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cls-diag1" className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary health condition (diag_1) <span className="text-cyan-400">*</span>
            </label>
            <input
              id="cls-diag1"
              type="text"
              value={formData.diag_1}
              onChange={(e) => handleChange('diag_1', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_1 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_1}</p>}
          </div>

          <div>
            <label htmlFor="cls-diag2" className="block text-xs font-medium text-slate-300 mb-1.5">
              Secondary health condition (diag_2) <span className="text-cyan-400">*</span>
            </label>
            <input
              id="cls-diag2"
              type="text"
              value={formData.diag_2}
              onChange={(e) => handleChange('diag_2', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_2 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_2}</p>}
          </div>

          <div>
            <label htmlFor="cls-diag3" className="block text-xs font-medium text-slate-300 mb-1.5">
              Additional health condition (diag_3) <span className="text-cyan-400">*</span>
            </label>
            <input
              id="cls-diag3"
              type="text"
              value={formData.diag_3}
              onChange={(e) => handleChange('diag_3', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
            {formErrors.diag_3 && <p className="text-[11px] text-rose-400 mt-1">{formErrors.diag_3}</p>}
          </div>
        </div>

        {/* Lab & Procedures Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label htmlFor="cls-num-meds" className="block text-xs font-medium text-slate-300 mb-1.5">
              Number of medications prescribed
            </label>
            <input
              id="cls-num-meds"
              type="number"
              min="0"
              value={formData.num_medications}
              onChange={(e) => handleNumberChange('num_medications', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="cls-num-labs" className="block text-xs font-medium text-slate-300 mb-1.5">
              Lab tests performed
            </label>
            <input
              id="cls-num-labs"
              type="number"
              min="0"
              value={formData.num_lab_procedures}
              onChange={(e) => handleNumberChange('num_lab_procedures', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label htmlFor="cls-num-proc" className="block text-xs font-medium text-slate-300 mb-1.5">
              Medical procedures performed
            </label>
            <input
              id="cls-num-proc"
              type="number"
              min="0"
              value={formData.num_procedures}
              onChange={(e) => handleNumberChange('num_procedures', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Serum, A1C, Insulin, DiabetesMed, Change */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div>
            <label htmlFor="cls-max-glu" className="block text-xs font-medium text-slate-300 mb-1.5">
              Blood sugar test (Glucose Serum)
            </label>
            <select
              id="cls-max-glu"
              value={formData.max_glu_serum}
              onChange={(e) => handleChange('max_glu_serum', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 px-2.5 py-2 text-white"
            >
              {MAX_GLU_SERUM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'None' ? 'Not Tested' : opt === 'Norm' ? 'Normal Range' : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cls-a1c" className="block text-xs font-medium text-slate-300 mb-1.5">
              HbA1c test (Long-term glycemic)
            </label>
            <select
              id="cls-a1c"
              value={formData.A1Cresult}
              onChange={(e) => handleChange('A1Cresult', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 px-2.5 py-2 text-white"
            >
              {A1C_RESULT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'None' ? 'Not Tested' : opt === 'Norm' ? 'Normal (<7%)' : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cls-insulin" className="block text-xs font-medium text-slate-300 mb-1.5">
              Insulin administration
            </label>
            <select
              id="cls-insulin"
              value={formData.insulin}
              onChange={(e) => handleChange('insulin', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 px-2.5 py-2 text-white"
            >
              {INSULIN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'No' ? 'No Insulin' : opt === 'Steady' ? 'Maintained Steady' : opt === 'Up' ? 'Dose Increased' : 'Dose Decreased'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cls-diabetes-med" className="block text-xs font-medium text-slate-300 mb-1.5">
              Diabetes medication prescribed?
            </label>
            <select
              id="cls-diabetes-med"
              value={formData.diabetesMed}
              onChange={(e) => handleChange('diabetesMed', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 px-2.5 py-2 text-white"
            >
              {DIABETES_MED_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Yes' ? 'Yes, Prescribed' : 'No Medication'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cls-change" className="block text-xs font-medium text-slate-300 mb-1.5">
              Medication change during stay?
            </label>
            <select
              id="cls-change"
              value={formData.change}
              onChange={(e) => handleChange('change', e.target.value)}
              className="w-full text-xs rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 px-2.5 py-2 text-white"
            >
              {CHANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Ch' ? 'Yes, Dosage Changed' : 'No Change'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Backend error display */}
      {apiError && (
        <div
          id="classification-api-error-alert"
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
                      ? 'Information Check Needed'
                      : apiError.status === 500
                      ? 'Service Notice'
                      : apiError.isColdStart
                      ? 'Service Starting Up'
                      : 'Service Notice'}
                  </h4>
                  {apiError.status && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
                      Code {apiError.status}
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
              id="btn-retry-classification"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-200 text-xs font-semibold transition shrink-0 cursor-pointer"
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
                id="btn-toggle-classification-error-details"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="flex items-center justify-between w-full text-[11px] font-mono text-rose-300/80 hover:text-rose-200 py-1 cursor-pointer"
              >
                <span>View diagnostic details</span>
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
          className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold transition cursor-pointer"
        >
          Reset Form
        </button>

        <button
          id="btn-submit-classification"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating readmission risk...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Assess Readmission Risk</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
