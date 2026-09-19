/**
 * Verified dataset constants and sample records based on the Diabetic Encounter Dataset
 * Shape: 101,766 rows × 50 columns
 * Deployed backend: XGBoost Regressor (2,359 encoded features) & XGBoost Classifier (readmit_30d)
 */

import { RegressionRequest, ClassificationRequest } from '../types/api';

export const DATASET_META = {
  name: 'Diabetic Hospital Encounter Dataset',
  totalRows: 101766,
  totalColumns: 50,
  timeRange: '1999–2008 (130 US hospitals)',
  regressionModelArtifact: 'final_xgb_regressor.pkl',
  classificationModelArtifact: 'final_xgboost_classifier.pkl',
  regressionFeaturesCount: 2359, // 2,354 categorical + 4 scaled numerical + 1 inpatient history flag
  targetRegression: 'time_in_hospital',
  targetClassification: 'target_readmit_30d',
};

export const AGE_OPTIONS = [
  '[0-10)',
  '[10-20)',
  '[20-30)',
  '[30-40)',
  '[40-50)',
  '[50-60)',
  '[60-70)',
  '[70-80)',
  '[80-90)',
  '[90-100)',
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Unknown/Invalid'];

export const RACE_OPTIONS = [
  'Caucasian',
  'AfricanAmerican',
  'Hispanic',
  'Asian',
  'Other',
  '?',
];

export const ADMISSION_TYPE_OPTIONS = [
  { id: 1, label: '1 - Emergency' },
  { id: 2, label: '2 - Urgent' },
  { id: 3, label: '3 - Elective' },
  { id: 4, label: '4 - Newborn' },
  { id: 5, label: '5 - Not Available' },
  { id: 6, label: '6 - NULL / Unknown' },
  { id: 7, label: '7 - Emergency Room' },
  { id: 8, label: '8 - Trauma Center' },
];

export const ADMISSION_SOURCE_OPTIONS = [
  { id: 7, label: '7 - Emergency Room' },
  { id: 1, label: '1 - Physician Referral' },
  { id: 2, label: '2 - Clinic Referral' },
  { id: 3, label: '3 - HMO Referral' },
  { id: 4, label: '4 - Transfer from a Hospital' },
  { id: 5, label: '5 - Transfer from a Skilled Nursing Facility' },
  { id: 6, label: '6 - Transfer from another Health Care Facility' },
  { id: 17, label: '17 - Transfer from another Service' },
  { id: 9, label: '9 - Information Not Available' },
];

export const MEDICAL_SPECIALTY_OPTIONS = [
  'Missing',
  'InternalMedicine',
  'Emergency/Trauma',
  'Family/GeneralPractice',
  'Cardiology',
  'Surgery-General',
  'Nephrology',
  'Orthopedics',
  'Orthopedics-Reconstructive',
  'Radiologist',
  'Pulmonology',
  'Psychiatry',
  'Urology',
  'ObstetricsandGynecology',
  'Gastroenterology',
  'Pediatrics',
  'Neurology',
  'Oncology',
  'Endocrinology',
];

export const PAYER_CODE_OPTIONS = [
  'Missing',
  'MC', // Medicare
  'MD', // Medicaid
  'HM', // Health Maint. Org
  'BC', // Blue Cross / Blue Shield
  'SP', // Self-pay
  'CP', // Commercial
  'UN', // United
  'OG', // Other Government
  'DM',
  'CM',
];

export const MAX_GLU_SERUM_OPTIONS = ['None', 'Norm', '>200', '>300'];

export const A1C_RESULT_OPTIONS = ['None', 'Norm', '>7', '>8'];

export const INSULIN_OPTIONS = ['No', 'Steady', 'Up', 'Down'];

export const DIABETES_MED_OPTIONS = ['Yes', 'No'];

export const CHANGE_OPTIONS = ['No', 'Ch'];

export const COMMON_ICD9_CODES = [
  { code: '250.00', label: '250.00 - Type 2 Diabetes without complications' },
  { code: '250.02', label: '250.02 - Type 2 Diabetes uncontrolled' },
  { code: '401.9', label: '401.9 - Unspecified Essential Hypertension' },
  { code: '414.01', label: '414.01 - Coronary Atherosclerosis of native vessel' },
  { code: '428.0', label: '428.0 - Congestive Heart Failure, unspecified' },
  { code: '486', label: '486 - Pneumonia, organism unspecified' },
  { code: '585.9', label: '585.9 - Chronic Kidney Disease, unspecified' },
  { code: '410.71', label: '410.71 - Subendocardial Infarction (NSTEMI)' },
  { code: '276.1', label: '276.1 - Hyposmolality and/or Hyponatremia' },
  { code: '786.50', label: '786.50 - Chest Pain, unspecified' },
];

/**
 * Verified sample case 1: Elder complex encounter (High prior inpatient utilization)
 */
export const SAMPLE_REGRESSION_CASES: { name: string; description: string; data: RegressionRequest }[] = [
  {
    name: 'Clinical Benchmark (Senior with Cardiovascular & Diabetes)',
    description: 'Male 50-60, 1 prior inpatient stay, emergency admission, primary diabetes diagnosis.',
    data: {
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
    },
  },
  {
    name: 'Elderly Heart Failure Case (High Complexity)',
    description: 'Female 70-80, Cardiology specialty, Medicare payer, 2 prior emergency visits.',
    data: {
      age: '[70-80)',
      gender: 'Female',
      race: 'Caucasian',
      admission_type_id: 1,
      admission_source_id: 7,
      medical_specialty: 'Cardiology',
      number_outpatient: 2,
      number_emergency: 2,
      number_inpatient: 3,
      diag_1: '428.0',
      diag_2: '250.00',
      diag_3: '401.9',
      payer_code: 'MC',
    },
  },
  {
    name: 'Elective Surgery Case (Low Prior Utilization)',
    description: 'Male 40-50, Elective admission with Physician referral, zero prior admissions.',
    data: {
      age: '[40-50)',
      gender: 'Male',
      race: 'AfricanAmerican',
      admission_type_id: 3,
      admission_source_id: 1,
      medical_specialty: 'Surgery-General',
      number_outpatient: 1,
      number_emergency: 0,
      number_inpatient: 0,
      diag_1: '250.00',
      diag_2: '401.9',
      diag_3: 'Missing',
      payer_code: 'BC',
    },
  },
];

export const SAMPLE_CLASSIFICATION_CASES: { name: string; description: string; data: ClassificationRequest }[] = [
  {
    name: 'High-Risk Readmission Profile (Heavy Prior Utilization)',
    description: 'Female 70-80, 5 days stayed, elevated glucose, insulin adjustment, 2 prior inpatient visits.',
    data: {
      age: '[70-80)',
      gender: 'Female',
      race: 'Caucasian',
      admission_type_id: 1,
      admission_source_id: 7,
      time_in_hospital: 5,
      medical_specialty: 'InternalMedicine',
      number_outpatient: 1,
      number_emergency: 2,
      number_inpatient: 2,
      number_diagnoses: 9,
      diag_1: '428.0',
      diag_2: '250.02',
      diag_3: '585.9',
      max_glu_serum: '>200',
      A1Cresult: '>8',
      num_medications: 24,
      num_lab_procedures: 62,
      num_procedures: 2,
      insulin: 'Up',
      diabetesMed: 'Yes',
      change: 'Ch',
    },
  },
  {
    name: 'Standard Encounter Profile (Moderate Complexity)',
    description: 'Male 50-60, 3 days stayed, normal glycemic controls, steady insulin management.',
    data: {
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
    },
  },
  {
    name: 'Low-Risk Outpatient Discharged Profile',
    description: 'Female 30-40, 2 days stayed, no prior inpatient history, stable medication.',
    data: {
      age: '[30-40)',
      gender: 'Female',
      race: 'Hispanic',
      admission_type_id: 2,
      admission_source_id: 1,
      time_in_hospital: 2,
      medical_specialty: 'Family/GeneralPractice',
      number_outpatient: 0,
      number_emergency: 0,
      number_inpatient: 0,
      number_diagnoses: 3,
      diag_1: '250.00',
      diag_2: '786.50',
      diag_3: 'Missing',
      max_glu_serum: 'Norm',
      A1Cresult: 'Norm',
      num_medications: 8,
      num_lab_procedures: 22,
      num_procedures: 0,
      insulin: 'No',
      diabetesMed: 'Yes',
      change: 'No',
    },
  },
];
