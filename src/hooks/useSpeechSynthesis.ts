/**
 * useSpeechSynthesis Hook
 * Manages text-to-speech voice playback for Nova, mute toggle, and voice state.
 */

import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../services/speechService';

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  error: string | null;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nova_voice_muted') === 'true';
    }
    return false;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supported = speechService.isSpeechSynthesisSupported();
    setIsSupported(supported);
    speechService.setMuted(isMuted);
  }, [isMuted]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      setError(null);
      if (isMuted) {
        onEnd?.();
        return;
      }
      if (!speechService.isSpeechSynthesisSupported()) {
        setError('Text-to-speech audio is not supported in this browser.');
        onEnd?.();
        return;
      }

      speechService.speak(text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          onEnd?.();
        },
        onError: (errMsg) => {
          setIsSpeaking(false);
          setError(errMsg);
          onEnd?.();
        },
      });
    },
    [isMuted]
  );

  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      speechService.setMuted(next);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nova_voice_muted', String(next));
      }
      return next;
    });
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    speechService.setMuted(muted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nova_voice_muted', String(muted));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    isMuted,
    error,
    speak,
    stopSpeaking,
    toggleMute,
    setMuted,
  };
};
