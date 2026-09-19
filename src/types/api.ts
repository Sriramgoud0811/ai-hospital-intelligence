/**
 * Type definitions for AI Hospital Intelligence
 * Connected to deployed FastAPI backend at https://ai-hospital-readmission-prediction.onrender.com
 */

export interface RegressionRequest {
  age: string;
  gender: string;
  race: string;
  admission_type_id: number;
  admission_source_id: number;
  medical_specialty: string;
  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;
  diag_1: string;
  diag_2: string;
  diag_3: string;
  payer_code: string;
}

export interface RegressionResponse {
  prediction: number;
  unit: string;
  target: string;
}

export interface ClassificationRequest {
  age: string;
  gender: string;
  race: string;
  admission_type_id: number;
  admission_source_id: number;
  time_in_hospital: number;
  medical_specialty: string;
  number_outpatient: number;
  number_emergency: number;
  number_inpatient: number;
  number_diagnoses: number;
  diag_1: string;
  diag_2: string;
  diag_3: string;
  max_glu_serum: string;
  A1Cresult: string;
  num_medications: number;
  num_lab_procedures: number;
  num_procedures: number;
  insulin: string;
  diabetesMed: string;
  change: string;
}

export interface ClassificationResponse {
  prediction: number; // 0 or 1
  probability: number; // float between 0.0 and 1.0
  threshold: number; // configured decision threshold
  target: string; // "target_readmit_30d"
  readmission?: string; // e.g. "30-day readmission risk" or "No 30-day readmission risk"
}

export interface HealthResponse {
  status: string; // "healthy"
  regression_loaded: boolean;
  classification_loaded: boolean;
  artifact_errors: string[];
}

export type ApiStatusState =
  | 'Checking'
  | 'Waking Up'
  | 'Healthy'
  | 'Unhealthy'
  | 'Unavailable'
  | 'Request Failed';

export interface ApiError {
  status?: number;
  message: string;
  isColdStart?: boolean;
  isTimeout?: boolean;
  isNetworkError?: boolean;
  isCorsError?: boolean;
  fieldErrors?: Record<string, string[]>;
  raw?: unknown;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  modelType: 'regression' | 'classification';
  inputs: RegressionRequest | ClassificationRequest;
  response: RegressionResponse | ClassificationResponse;
  durationMs: number;
}
