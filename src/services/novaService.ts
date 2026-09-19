/**
 * Nova Knowledge Engine & AI Service
 * Provides grounded, reliable answers about AI Hospital Intelligence,
 * clinical models, inputs, API statuses, architecture, and clinical safety boundaries.
 */

import { NovaKnowledgeItem, NovaMessage } from '../types/nova';

export const NOVA_KNOWLEDGE_BASE: NovaKnowledgeItem[] = [
  {
    id: 'overview',
    question: 'What does this application do?',
    keywords: ['what does this application do', 'about app', 'purpose', 'overview', 'what is this', 'what does it do'],
    patterns: [/what does (this|the) (app|application|platform|system) do/i, /what is ai hospital intelligence/i, /overview/i],
    category: 'overview',
    answer:
      'AI Hospital Intelligence is a clinical decision-support and analytics web platform. It connects to a production FastAPI machine learning service hosted on Render to provide two key predictions:\n\n1. **Length-of-Stay Estimation** (regression): Predicts patient hospitalization duration (clamped 1–14 days).\n2. **30-Day Readmission Risk** (classification): Estimates whether a patient is likely to be readmitted within 30 days post-discharge.\n\nIt features an interactive Prediction Studio, real-time ward telemetry, model explainability graphs, and clinical session audits.',
    followUps: [
      'Explain length-of-stay prediction.',
      'Explain 30-day readmission prediction.',
      'How do I use the prediction tools?',
    ],
  },
  {
    id: 'length-of-stay',
    question: 'Explain length-of-stay prediction.',
    keywords: ['length of stay', 'los', 'days', 'inpatient days', 'regression model', 'duration'],
    patterns: [/explain length[- ]of[- ]stay/i, /how does (los|length of stay) work/i, /what is length of stay/i],
    category: 'length-of-stay',
    answer:
      'The **Length-of-Stay (LOS) Regressor** estimates the number of calendar days a patient will remain hospitalized during an inpatient stay.\n\n• **Model Type**: Supervised Regression (XGBoost/LightGBM Pipeline).\n• **Key Inputs**: Patient age, admission type (Emergency/Urgent/Elective), admission source, number of lab procedures, prior inpatient/emergency visits, and number of diagnoses.\n• **Output**: Continuous prediction bounded between 1 and 14 days, with round-trip API latency tracking and baseline confidence bounds.\n\n*Note: This is an analytical estimation for hospital bed planning, not a clinical prescription.*',
    followUps: [
      'What information is required for length of stay?',
      'Explain 30-day readmission prediction.',
      'Explain regression and classification.',
    ],
  },
  {
    id: 'readmission',
    question: 'Explain 30-day readmission prediction.',
    keywords: ['readmission', '30 day readmission', 'classifier', 'risk score', 'readmitted', 'discharge risk'],
    patterns: [/explain (30[- ]day )?readmission/i, /how does readmission (risk|prediction) work/i, /what is readmission/i],
    category: 'readmission',
    answer:
      'The **30-Day Readmission Risk Evaluator** assesses the statistical likelihood that a patient will experience an unplanned return to the hospital within 30 days following discharge.\n\n• **Model Type**: Supervised Binary Classification.\n• **Key Inputs**: Primary diagnostic category (Circulatory, Respiratory, Endocrine, Digestive, etc.), number of inpatient visits in the prior 12 months, number of medications, length of stay, and diabetic glycemic indicators (Insulin, Metformin, HbA1c, Glucose test results).\n• **Output**: Probability percentage (0–100%) categorized into **Low Risk** (<35%), **Moderate Risk** (35–65%), or **High Risk** (>65%).',
    followUps: [
      'What information is required for readmission?',
      'How do I use the prediction tools?',
      'What are the limitations of this system?',
    ],
  },
  {
    id: 'how-to-use',
    question: 'How do I use the prediction tools?',
    keywords: ['how do i use', 'how to use', 'get started', 'predict studio', 'steps', 'run prediction'],
    patterns: [/how (do|can) i use/i, /how to run (a )?prediction/i, /getting started/i],
    category: 'overview',
    answer:
      'Using the Prediction Studio is straightforward:\n\n1. Navigate to **"Prediction Studio"** from the top navigation bar or homepage.\n2. Choose between the **"Length-of-Stay Estimator"** and **"30-Day Readmission Risk"** tabs.\n3. Either click one of our **Preloaded Clinical Presets** (e.g., *Elderly Diabetic Care*, *Emergency Post-Op Case*, *Elective Surgery*) or manually adjust patient encounter variables.\n4. Click **"Run Live Clinical Prediction"**.\n5. View real-time outputs, risk gauges, latency metrics, and export summary JSON reports directly to your clipboard or disk.',
    followUps: [
      'What does the API status mean?',
      'What information is required?',
      'Explain regression and classification.',
    ],
  },
  {
    id: 'required-information',
    question: 'What information is required?',
    keywords: ['what information is required', 'inputs', 'features', 'fields', 'patient data', 'variables'],
    patterns: [/what (information|data|inputs|features) (is|are) required/i, /what do i need to enter/i],
    category: 'api-technical',
    answer:
      'The required inputs correspond strictly to the FastAPI machine learning contract:\n\n**For Length of Stay:**\n• Encounter ID & Patient ID (synthetic or alphanumeric)\n• Age category & Admission Type (Emergency, Urgent, Elective)\n• Total Lab Procedures (1–150), Medications count, Prior Outpatient/Inpatient/Emergency visits\n• Primary ICD-9 diagnosis grouping & Discharge destination.\n\n**For 30-Day Readmission:**\n• Diagnostic category (e.g., Circulatory, Diabetes, Respiratory)\n• Time in hospital, Number of diagnoses, Prior inpatient visits\n• Diabetic medication regime (Insulin, Metformin, Sulfonylureas)\n• Glucose and HbA1c test readings.\n\n*All inputs accept standard validated hospital encounter parameters without requiring Protected Health Information (PHI).*',
    followUps: [
      'What does this application do?',
      'What are the limitations of this system?',
    ],
  },
  {
    id: 'api-status',
    question: 'What does the API status mean?',
    keywords: ['api status', 'render', 'cold start', 'backend status', 'healthy', 'waking up', 'fastapi'],
    patterns: [/what does (the )?api status mean/i, /why is (it|the backend) (waking up|sleeping|slow)/i, /api health/i],
    category: 'api-technical',
    answer:
      'The API badge tracks the live health of our FastAPI machine learning backend hosted on Render Cloud:\n\n• **Healthy (Green)**: The server is online, responsive (HTTP 200), and both ML model pipelines are loaded into memory.\n• **Waking Up (Amber)**: Render free-tier instances automatically sleep after inactivity. When waking up, the server takes 30–60 seconds to cold-start and load model weights.\n• **Unavailable (Rose)**: Network disruption or maintenance. Our frontend provides a retry button and timeout guards (up to 90 seconds).\n\nYou can click the status badge in the header or homepage anytime to inspect response latency and raw health diagnostics.',
    followUps: [
      'Explain regression and classification.',
      'How do I use the prediction tools?',
    ],
  },
  {
    id: 'regression-vs-classification',
    question: 'Explain regression and classification.',
    keywords: ['explain regression and classification', 'difference', 'regression vs classification', 'ml models', 'difference between models'],
    patterns: [/explain regression (and|vs) classification/i, /difference between regression and classification/i],
    category: 'api-technical',
    answer:
      'The platform showcases both primary paradigms in machine learning:\n\n• **Regression (Length of Stay)**: Predicts a **continuous numeric quantity** — specifically, the estimated inpatient stay in days (e.g., 4.8 days). It uses mean squared error loss and gradient-boosted decision trees to optimize continuous estimates.\n\n• **Classification (Readmission Risk)**: Predicts a **categorical discrete probability** — specifically, whether a patient will be readmitted (Positive/1) or not readmitted (Negative/0) within 30 days. It outputs a calibrated probability score (0.00 to 1.00) evaluated against a clinical decision threshold.',
    followUps: [
      'Explain length-of-stay prediction.',
      'Explain 30-day readmission prediction.',
      'What are the limitations of this system?',
    ],
  },
  {
    id: 'limitations',
    question: 'What are the limitations of this system?',
    keywords: ['limitations', 'accuracy', 'disclaimer', 'real patients', 'fda', 'clinical validation', 'safe'],
    patterns: [/what are the limitations/i, /can this be used (on|for) real patients/i, /is this fda approved/i, /limitations of this system/i],
    category: 'safety-disclaimer',
    answer:
      'Important System Boundaries & Disclaimers:\n\n1. **Decision-Support Only**: This application is a technological demonstration and educational decision-support platform. It is **NOT** an FDA-cleared diagnostic device.\n2. **No Clinical Substitution**: Predictions must never replace the clinical judgment of certified physicians, nurses, or hospital administrators.\n3. **Historical Data Bounds**: The underlying ML models were trained on retrospective hospital discharge datasets; they cannot account for real-time surgical complications, unique patient genetics, or sudden acute crises.\n4. **No Automated Decisions**: No automated medication changes or discharge orders should be initiated based on this tool.',
    followUps: [
      'What does this application do?',
      'Explain 30-day readmission prediction.',
    ],
  },
  {
    id: 'emergency',
    question: 'What if there is a medical emergency?',
    keywords: ['emergency', 'urgent', 'chest pain', 'bleeding', 'stroke', 'dying', 'ambulance', '911'],
    patterns: [/emergency/i, /chest pain/i, /shortness of breath/i, /call 911/i, /life threatening/i],
    category: 'emergency',
    answer:
      '🚨 **IMMEDIATE MEDICAL NOTICE**:\nIf you, a patient, or someone near you is experiencing a life-threatening medical emergency (such as severe chest pain, shortness of breath, sudden numbness, or heavy trauma), **please stop using this software and dial 911 (or your local emergency services) immediately**, or proceed to the nearest hospital Emergency Department.\n\nNova is an AI demonstration assistant and cannot assess emergency triage or render medical care.',
    followUps: [
      'What does this application do?',
      'What are the limitations of this system?',
    ],
  },
  {
    id: 'who-is-nova',
    question: 'Who are you?',
    keywords: ['who are you', 'what are you', 'are you human', 'are you a doctor', 'introduce yourself', 'nova'],
    patterns: [/who are you/i, /are you (a )?(human|doctor|nurse|real person)/i, /introduce yourself/i],
    category: 'overview',
    answer:
      "Hello! I'm **Nova**, your 24/7 AI guide for AI Hospital Intelligence.\n\nI am an interactive digital assistant designed to help you navigate our clinical predictions, understand model features, explain API operations, and guide your evaluation workflows.\n\n*Disclosure: I am an artificial intelligence system, not a licensed healthcare provider or medical doctor. I do not diagnose conditions or prescribe treatments.*",
    followUps: [
      'What does this application do?',
      'How do I use the prediction tools?',
      'What are the limitations of this system?',
    ],
  },
];

export class NovaService {
  /**
   * Process a user inquiry and generate an grounded, professional Nova response
   */
  public async generateResponse(userText: string): Promise<NovaMessage> {
    const trimmed = userText.trim();
    if (!trimmed) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'nova',
        text: "I didn't quite catch that. How can I assist you with our hospital analytics or prediction models today?",
        timestamp: new Date(),
        source: 'knowledge-base',
      };
    }

    // Emergency check - immediate high-priority override
    if (/emergency|chest pain|dying|can't breathe|shortness of breath|stroke|severe bleeding|call 911/i.test(trimmed)) {
      const em = NOVA_KNOWLEDGE_BASE.find((k) => k.id === 'emergency')!;
      return {
        id: `msg-${Date.now()}`,
        sender: 'nova',
        text: em.answer,
        timestamp: new Date(),
        source: 'knowledge-base',
        category: 'emergency',
        suggestedFollowUps: em.followUps,
      };
    }

    // Match against knowledge items via patterns and keyword scores
    const scored = NOVA_KNOWLEDGE_BASE.map((item) => {
      let score = 0;
      // Pattern match gives heavy weight
      for (const pattern of item.patterns) {
        if (pattern.test(trimmed)) {
          score += 25;
        }
      }
      // Keyword matching
      const lower = trimmed.toLowerCase();
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          score += 10;
        }
        // Substring word tokens
        const words = kw.split(' ');
        for (const w of words) {
          if (w.length > 3 && lower.includes(w)) {
            score += 2;
          }
        }
      }
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatch = scored[0];

    // Check if score is sufficient
    if (topMatch && topMatch.score >= 4) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'nova',
        text: topMatch.item.answer,
        timestamp: new Date(),
        source: 'knowledge-base',
        category: topMatch.item.category,
        suggestedFollowUps: topMatch.item.followUps,
      };
    }

    // Contextual intelligent fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'nova',
      text:
        `Thank you for asking. I'm Nova, your AI guide for AI Hospital Intelligence.\n\nWhile I can explain our machine learning models, prediction workflows, and API architectures, I want to ensure you get the most accurate information. Here are a few topics I can explain in detail:\n\n• **Length-of-Stay Prediction** (XGBoost Inpatient Duration)\n• **30-Day Readmission Risk** (Clinical Classifier & Glycemic Indicators)\n• **FastAPI Backend & API Status** (Render Cloud Architecture)\n• **System Safety Boundaries & Clinical Disclaimers**\n\nFeel free to select one of the suggested prompts below or rephrase your question.`,
      timestamp: new Date(),
      source: 'knowledge-base',
      suggestedFollowUps: [
        'What does this application do?',
        'Explain length-of-stay prediction.',
        'Explain 30-day readmission prediction.',
        'What are the limitations of this system?',
      ],
    };
  }

  public getSuggestedQuestions(): string[] {
    return [
      'What does this application do?',
      'Explain length-of-stay prediction.',
      'Explain 30-day readmission prediction.',
      'How do I use the prediction tools?',
      'What information is required?',
      'What does the API status mean?',
      'Explain regression and classification.',
      'What are the limitations of this system?',
    ];
  }
}

export const novaService = new NovaService();

/**
 * Trigger Nova chat dialog globally
 */
export const openNovaChat = (prompt?: string): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-nova-assistant', {
        detail: { prompt, voice: false },
      })
    );
  }
};

/**
 * Trigger Nova voice listening session globally
 */
export const openNovaVoice = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-nova-assistant', {
        detail: { voice: true },
      })
    );
  }
};
