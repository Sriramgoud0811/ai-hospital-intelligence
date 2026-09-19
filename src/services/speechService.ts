/**
 * Browser Web Speech API Service
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS) with graceful fallbacks
 * and error handling.
 */

// Speech Recognition types for browser compatibility
interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechService {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindowSpeech;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.recognition.maxAlternatives = 1;
        } catch {
          this.recognition = null;
        }
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
        if (this.synthesis.onvoiceschanged !== undefined) {
          this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  public isSpeechSynthesisSupported(): boolean {
    return this.synthesis !== null;
  }

  private loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    const voices = this.synthesis.getVoices();
    // Prefer natural, calm, pleasant English voices (Google US/UK, Samantha, Karen, Serena, Natural)
    const preferred = voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Serena')) &&
        v.lang.startsWith('en')
    );
    this.selectedVoice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
    return voices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice | null): void {
    this.selectedVoice = voice;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Start listening for voice input
   */
  public startListening(callbacks: {
    onStart?: () => void;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (errorMsg: string, isPermissionError: boolean) => void;
    onEnd?: () => void;
  }): void {
    if (!this.recognition) {
      callbacks.onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.', false);
      return;
    }

    try {
      // Clean previous listeners
      this.recognition.onstart = () => {
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        if (final.trim().length > 0) {
          callbacks.onResult?.(final.trim(), true);
        } else if (interim.trim().length > 0) {
          callbacks.onResult?.(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        let msg = 'Voice capture encountered an error.';
        let isPerm = false;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          msg = 'Microphone permission was denied. Please allow microphone access in browser settings.';
          isPerm = true;
        } else if (event.error === 'no-speech') {
          msg = 'No speech detected. Please speak clearly into your microphone.';
        } else if (event.error === 'audio-capture') {
          msg = 'No microphone was found or audio capture failed.';
        } else if (event.error === 'network') {
          msg = 'Network issue during voice recognition.';
        }

        callbacks.onError?.(msg, isPerm);
      };

      this.recognition.onend = () => {
        callbacks.onEnd?.();
      };

      this.recognition.start();
    } catch (err: any) {
      if (err.message && err.message.includes('already started')) {
        // Recognition already running
        return;
      }
      callbacks.onError?.(err?.message || 'Unable to start speech recognition.', false);
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop errors
      }
    }
  }

  /**
   * Speak text via SpeechSynthesis
   */
  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    }
  ): void {
    if (!this.synthesis || this.isMuted) {
      callbacks?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Clean markdown/bullet points for smoother speech
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/•/g, ',')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.02; // Calm, friendly pitch
      utterance.volume = 0.95;

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          callbacks?.onError?.(`Speech synthesis error: ${e.error}`);
        } else {
          callbacks?.onEnd?.();
        }
      };

      this.synthesis.speak(utterance);
    } catch (err: any) {
      callbacks?.onError?.(err?.message || 'Speech synthesis failed');
    }
  }

  /**
   * Stop speaking immediately
   */
  public stopSpeaking(): void {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }
}

export const speechService = new SpeechService();
