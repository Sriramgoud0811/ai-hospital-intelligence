/**
 * Centralized API Service for AI Hospital Intelligence
 * Communicates with FastAPI backend hosted on Render.
 *
 * Backend Base URL: https://ai-hospital-readmission-prediction.onrender.com
 *
 * Endpoints:
 * - GET  /
 * - GET  /health
 * - POST /predict/length-of-stay
 * - POST /predict/readmission
 */

import {
  RegressionRequest,
  RegressionResponse,
  ClassificationRequest,
  ClassificationResponse,
  HealthResponse,
  ApiError,
  ApiStatusState,
} from '../types/api';

const DEFAULT_BASE_URL = 'https://ai-hospital-readmission-prediction.onrender.com';
const PROXY_BASE_URL = '/api-backend';
const DEFAULT_TIMEOUT_MS = 90000; // 90s timeout for Render free tier cold-starts

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
};

// Track connection diagnostics
export interface ApiDiagnostics {
  lastCheckedUrl: string;
  isUsingProxy: boolean;
  corsBlockedOnDirect: boolean;
  lastCheckedTime: Date | null;
  lastResponseStatus: number | null;
  rawHealthData: HealthResponse | null;
  rawError: unknown;
  status: ApiStatusState;
}

export let latestApiDiagnostics: ApiDiagnostics = {
  lastCheckedUrl: DEFAULT_BASE_URL,
  isUsingProxy: false,
  corsBlockedOnDirect: false,
  lastCheckedTime: null,
  lastResponseStatus: null,
  rawHealthData: null,
  rawError: null,
  status: 'Checking',
};

/**
 * Parses FastAPI validation errors (HTTP 422)
 */
function parseValidationDetails(detail: unknown): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  if (Array.isArray(detail)) {
    for (const item of detail) {
      if (item && item.loc && Array.isArray(item.loc)) {
        const fieldName = String(item.loc[item.loc.length - 1]);
        const msg = String(item.msg || 'Invalid field value');
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(msg);
      }
    }
  }
  return fieldErrors;
}

/**
 * Handles HTTP error responses (422, 500, 502, 503, 504, etc.)
 */
async function handleResponseError(response: Response): Promise<never> {
  let errorData: any = null;
  try {
    errorData = await response.json();
  } catch {
    // Non-JSON response body
  }

  const status = response.status;
  latestApiDiagnostics.lastResponseStatus = status;

  if (status === 422) {
    const fieldErrors = errorData?.detail ? parseValidationDetails(errorData.detail) : undefined;
    const apiErr: ApiError = {
      status: 422,
      message: 'Validation failed (HTTP 422): Please check form fields for correct data types and ranges.',
      fieldErrors,
      raw: errorData,
    };
    throw apiErr;
  }

  if (status === 502 || status === 503 || status === 504) {
    const apiErr: ApiError = {
      status,
      message: 'Prediction service is waking up. This may take a few moments as Render loads model artifacts.',
      isColdStart: true,
      raw: errorData,
    };
    throw apiErr;
  }

  if (status === 500) {
    const apiErr: ApiError = {
      status: 500,
      message: errorData?.detail || errorData?.message || 'The model artifact or backend encountered an execution error (HTTP 500).',
      raw: errorData,
    };
    throw apiErr;
  }

  const apiErr: ApiError = {
    status,
    message: errorData?.detail || `API request failed with status code ${status}`,
    raw: errorData,
  };
  throw apiErr;
}

/**
 * Executes fetch with timeout, CORS auto-detection, and proxy fallback
 */
async function executeRequest(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const directBase = getApiBaseUrl();
  const directUrl = `${directBase}${endpoint}`;

  const createController = (externalSignal?: AbortSignal | null) => {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeoutMs);
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }
    return { controller, timerId };
  };

  latestApiDiagnostics.lastCheckedUrl = directUrl;

  // 1. Attempt direct request first
  const { controller: directCtrl, timerId: directTimer } = createController(options.signal);
  try {
    const response = await fetch(directUrl, {
      ...options,
      signal: directCtrl.signal,
    });
    clearTimeout(directTimer);
    latestApiDiagnostics.corsBlockedOnDirect = false;
    latestApiDiagnostics.isUsingProxy = false;
    latestApiDiagnostics.lastResponseStatus = response.status;
    return response;
  } catch (err: unknown) {
    clearTimeout(directTimer);
    const error = err as Error;

    // If aborted due to timeout or user cancel, don't fallback silently
    if (error.name === 'AbortError') {
      const apiErr: ApiError = {
        message: 'Request timed out after 90 seconds. The Render backend may be experiencing a cold start. Please retry.',
        isTimeout: true,
        isColdStart: true,
        raw: error,
      };
      throw apiErr;
    }

    // Likely a CORS or Network error on direct request
    // Check if we can route via local/dev server proxy
    const isBrowserNetworkError = error instanceof TypeError || error.message.includes('fetch');
    if (isBrowserNetworkError) {
      latestApiDiagnostics.corsBlockedOnDirect = true;
      const proxyUrl = `${PROXY_BASE_URL}${endpoint}`;
      const { controller: proxyCtrl, timerId: proxyTimer } = createController(options.signal);

      try {
        const proxyResponse = await fetch(proxyUrl, {
          ...options,
          signal: proxyCtrl.signal,
        });
        clearTimeout(proxyTimer);
        latestApiDiagnostics.isUsingProxy = true;
        latestApiDiagnostics.lastResponseStatus = proxyResponse.status;
        return proxyResponse;
      } catch (proxyErr: unknown) {
        clearTimeout(proxyTimer);
        const pErr = proxyErr as Error;

        if (pErr.name === 'AbortError') {
          throw {
            message: 'Request timed out after 90 seconds. Prediction service is waking up.',
            isTimeout: true,
            isColdStart: true,
            raw: pErr,
          } as ApiError;
        }

        // Both direct and proxy failed
        throw {
          message: 'Unable to connect to the prediction backend. Service may be waking up or temporarily unreachable.',
          isNetworkError: true,
          isCorsError: true,
          isColdStart: true,
          raw: { directError: error, proxyError: pErr },
        } as ApiError;
      }
    }

    throw {
      message: error.message || 'Network request failed.',
      isNetworkError: true,
      raw: error,
    } as ApiError;
  }
}

/**
 * GET /
 * Root endpoint for basic API status verification
 */
export async function getRootInfo(signal?: AbortSignal): Promise<{ message: string; status: string; docs: string }> {
  const response = await executeRequest('/', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  return response.json();
}

/**
 * GET /health
 * Dedicated health checking with retry loop (up to 3 retries with 5s, 10s, 20s backoff)
 */
export async function getHealthStatus(options?: {
  signal?: AbortSignal;
  onStatusChange?: (status: ApiStatusState, attempt: number) => void;
  maxRetries?: number;
}): Promise<HealthResponse> {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelays = [5000, 10000, 20000]; // 5s, 10s, 20s

  let attempt = 0;

  while (attempt <= maxRetries) {
    if (attempt === 0) {
      options?.onStatusChange?.('Checking', 0);
    } else {
      options?.onStatusChange?.('Waking Up', attempt);
    }

    try {
      const response = await executeRequest(
        '/health',
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: options?.signal,
        },
        90000
      );

      if (!response.ok) {
        await handleResponseError(response);
      }

      const data: HealthResponse = await response.json();
      latestApiDiagnostics.rawHealthData = data;
      latestApiDiagnostics.lastCheckedTime = new Date();

      if (data.status === 'healthy' && data.regression_loaded && data.classification_loaded) {
        latestApiDiagnostics.status = 'Healthy';
        options?.onStatusChange?.('Healthy', attempt);
      } else {
        latestApiDiagnostics.status = 'Unhealthy';
        options?.onStatusChange?.('Unhealthy', attempt);
      }

      return data;
    } catch (err: unknown) {
      attempt++;
      latestApiDiagnostics.rawError = err;
      latestApiDiagnostics.lastCheckedTime = new Date();

      if (attempt <= maxRetries && !options?.signal?.aborted) {
        const delayMs = retryDelays[attempt - 1] || 20000;
        options?.onStatusChange?.('Waking Up', attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        const isTimeout = (err as ApiError)?.isTimeout;
        const finalStatus: ApiStatusState = isTimeout ? 'Unavailable' : 'Request Failed';
        latestApiDiagnostics.status = finalStatus;
        options?.onStatusChange?.(finalStatus, attempt);
        throw err;
      }
    }
  }

  throw new Error('Health check exhausted all retry attempts.');
}

/**
 * POST /predict/length-of-stay
 * Inpatient length-of-stay prediction
 */
export async function predictLengthOfStay(
  payload: RegressionRequest,
  signal?: AbortSignal
): Promise<RegressionResponse> {
  // Validate required fields client-side before dispatching
  if (
    payload.admission_type_id === undefined ||
    payload.admission_source_id === undefined ||
    !payload.diag_1 ||
    !payload.payer_code
  ) {
    throw {
      status: 422,
      message: 'Missing required fields for length-of-stay prediction.',
    } as ApiError;
  }

  const response = await executeRequest('/predict/length-of-stay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const data: RegressionResponse = await response.json();
  return data;
}

/**
 * POST /predict/readmission
 * 30-Day readmission risk evaluation
 */
export async function predictReadmission(
  payload: ClassificationRequest,
  signal?: AbortSignal
): Promise<ClassificationResponse> {
  // Validate required fields client-side before dispatching
  if (
    payload.time_in_hospital === undefined ||
    payload.number_diagnoses === undefined ||
    !payload.insulin ||
    !payload.diabetesMed
  ) {
    throw {
      status: 422,
      message: 'Missing required fields for 30-day readmission risk evaluation.',
    } as ApiError;
  }

  const response = await executeRequest('/predict/readmission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const data: ClassificationResponse = await response.json();
  return data;
}
