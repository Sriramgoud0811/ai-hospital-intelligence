/**
 * Nova AI Assistant - Type Definitions
 * Structured interfaces for messages, voice interaction, assistant states, and knowledge base.
 */

export type NovaSender = 'user' | 'nova' | 'system';

export type NovaState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface NovaMessage {
  id: string;
  sender: NovaSender;
  text: string;
  timestamp: Date;
  source?: 'knowledge-base' | 'llm' | 'system-fallback';
  category?: string;
  suggestedFollowUps?: string[];
  isError?: boolean;
}

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  permissionGranted: boolean;
}

export interface SpeechSynthesisState {
  isSupported: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  error: string | null;
}

export interface NovaKnowledgeItem {
  id: string;
  keywords: string[];
  patterns: RegExp[];
  question: string;
  answer: string;
  category: 'overview' | 'length-of-stay' | 'readmission' | 'api-technical' | 'safety-disclaimer' | 'emergency';
  followUps?: string[];
}

export interface NovaConfig {
  voiceEnabled: boolean;
  autoSpeakResponses: boolean;
  reducedMotion: boolean;
}
