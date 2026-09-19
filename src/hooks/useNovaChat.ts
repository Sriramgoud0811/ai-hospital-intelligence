/**
 * useNovaChat Hook
 * Integrates chat messages state, question processing, speech-to-text,
 * and text-to-speech coordination.
 */

import { useState, useCallback, useRef } from 'react';
import { NovaMessage, NovaState } from '../types/nova';
import { novaService } from '../services/novaService';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';

const INITIAL_GREETING: NovaMessage = {
  id: 'welcome-msg',
  sender: 'nova',
  text:
    "Hello! I'm **Nova**, your AI guide for AI Hospital Intelligence.\n\nI can help you understand our machine learning models, explore patient encounter variables, and interpret our FastAPI prediction backend.\n\n*Disclosure: I am an AI assistant, not a doctor or medical professional. I do not provide diagnostic advice.*",
  timestamp: new Date(),
  source: 'knowledge-base',
  suggestedFollowUps: [
    'What does this application do?',
    'Explain length-of-stay prediction.',
    'Explain 30-day readmission prediction.',
    'How do I use the prediction tools?',
  ],
};

export const useNovaChat = () => {
  const [messages, setMessages] = useState<NovaMessage[]>([INITIAL_GREETING]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');

  const speechRec = useSpeechRecognition();
  const speechSynth = useSpeechSynthesis();

  // Compute composite state
  const assistantState: NovaState = speechRec.isListening
    ? 'listening'
    : isThinking
    ? 'thinking'
    : speechSynth.isSpeaking
    ? 'speaking'
    : 'idle';

  const lastResponseRef = useRef<NovaMessage | null>(INITIAL_GREETING);

  /**
   * Send a message to Nova
   */
  const sendMessage = useCallback(
    async (text: string, speakResponse: boolean = false) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      setLastUserPrompt(trimmed);

      const userMsg: NovaMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      // Natural pause for thinking indicator
      try {
        await new Promise((resolve) => setTimeout(resolve, 550));
        const responseMsg = await novaService.generateResponse(trimmed);
        lastResponseRef.current = responseMsg;

        setMessages((prev) => [...prev, responseMsg]);
        setIsThinking(false);

        if (speakResponse && !speechSynth.isMuted) {
          speechSynth.speak(responseMsg.text);
        }
      } catch (err: any) {
        setIsThinking(false);
        const errorMsg: NovaMessage = {
          id: `err-${Date.now()}`,
          sender: 'nova',
          text: 'Nova is temporarily experiencing connectivity issues. Please retry your inquiry or explore our documentation.',
          timestamp: new Date(),
          isError: true,
          source: 'system-fallback',
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    },
    [isThinking, speechSynth]
  );

  /**
   * Start voice input - when speech finishes, automatically sends to Nova and speaks reply
   */
  const startVoiceInput = useCallback(() => {
    // If Nova is currently speaking, stop her first
    if (speechSynth.isSpeaking) {
      speechSynth.stopSpeaking();
    }

    speechRec.startListening((finalTranscript) => {
      if (finalTranscript.trim().length > 0) {
        sendMessage(finalTranscript, true);
      }
    });
  }, [speechRec, speechSynth, sendMessage]);

  const stopVoiceInput = useCallback(() => {
    speechRec.stopListening();
  }, [speechRec]);

  const stopSpeaking = useCallback(() => {
    speechSynth.stopSpeaking();
  }, [speechSynth]);

  const speakMessage = useCallback(
    (text: string) => {
      speechSynth.speak(text);
    },
    [speechSynth]
  );

  const clearChat = useCallback(() => {
    speechSynth.stopSpeaking();
    speechRec.stopListening();
    setMessages([INITIAL_GREETING]);
  }, [speechSynth, speechRec]);

  const retryLast = useCallback(() => {
    if (lastUserPrompt) {
      sendMessage(lastUserPrompt, false);
    }
  }, [lastUserPrompt, sendMessage]);

  return {
    messages,
    isThinking,
    assistantState,
    suggestedQuestions: novaService.getSuggestedQuestions(),
    sendMessage,
    clearChat,
    retryLast,
    // Voice speech-to-text
    isListening: speechRec.isListening,
    speechError: speechRec.error,
    isSpeechRecSupported: speechRec.isSupported,
    interimTranscript: speechRec.interimTranscript,
    startVoiceInput,
    stopVoiceInput,
    clearSpeechError: speechRec.clearError,
    // Voice text-to-speech
    isSpeaking: speechSynth.isSpeaking,
    isMuted: speechSynth.isMuted,
    isSpeechSynthSupported: speechSynth.isSupported,
    toggleMute: speechSynth.toggleMute,
    setMuted: speechSynth.setMuted,
    stopSpeaking,
    speakMessage,
  };
};
