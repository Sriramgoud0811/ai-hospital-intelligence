/**
 * useSpeechRecognition Hook
 * Manages speech-to-text input state, browser permissions, and error handling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService } from '../services/speechService';

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: (onFinal?: (text: string) => void) => void;
  stopListening: () => void;
  clearError: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onFinalCallbackRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    setIsSupported(speechService.isSpeechRecognitionSupported());
  }, []);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback((onFinal?: (text: string) => void) => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    onFinalCallbackRef.current = onFinal || null;

    if (!speechService.isSpeechRecognitionSupported()) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    speechService.startListening({
      onStart: () => {
        setIsListening(true);
        setError(null);
      },
      onResult: (text: string, isFinal: boolean) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          setIsListening(false);
          if (onFinalCallbackRef.current) {
            onFinalCallbackRef.current(text);
          }
        } else {
          setInterimTranscript(text);
        }
      },
      onError: (errMessage: string) => {
        setIsListening(false);
        setError(errMessage);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearError,
  };
};
