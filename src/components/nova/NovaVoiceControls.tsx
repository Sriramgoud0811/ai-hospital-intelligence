/**
 * NovaVoiceControls Component
 * Real-time voice interaction panel with mic state, audio equalizer visualization,
 * mute toggle, and speech error recovery.
 */

import React from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  AlertCircle,
} from 'lucide-react';
import { NovaState } from '../../types/nova';

interface NovaVoiceControlsProps {
  state: NovaState;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isSpeechRecSupported: boolean;
  isSpeechSynthSupported: boolean;
  speechError: string | null;
  interimTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onToggleMute: () => void;
  onClearError: () => void;
  compact?: boolean;
}

export const NovaVoiceControls: React.FC<NovaVoiceControlsProps> = ({
  state,
  isListening,
  isSpeaking,
  isMuted,
  isSpeechRecSupported,
  speechError,
  interimTranscript,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onToggleMute,
  onClearError,
  compact = false,
}) => {
  return (
    <div className="space-y-2">
      {/* Speech Error Banner */}
      {speechError && (
        <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-tight">{speechError}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-[10px] uppercase font-bold text-rose-300 hover:text-white underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Voice Status Ribbon & Equalizer Visualizer */}
      {(isListening || isSpeaking) && (
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-teal-500/40 flex items-center justify-between gap-2 text-xs shadow-inner">
          <div className="flex items-center gap-2.5">
            {isListening ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            ) : (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            )}

            <span className="text-[11px] font-semibold text-white">
              {isListening ? 'Nova is listening...' : 'Nova is speaking...'}
            </span>

            {/* Audio waveform visualization bars */}
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <span className="w-1 bg-teal-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-teal-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-1.5" />
              <span className="w-1 bg-cyan-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
            </div>
          </div>

          {/* Quick stop action button */}
          {isListening && (
            <button
              type="button"
              id="btn-stop-listening"
              onClick={onStopListening}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-semibold transition"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Done</span>
            </button>
          )}

          {isSpeaking && (
            <button
              type="button"
              id="btn-stop-speaking"
              onClick={onStopSpeaking}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold transition"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Stop Voice</span>
            </button>
          )}
        </div>
      )}

      {/* Interim live speech transcript preview */}
      {isListening && interimTranscript && (
        <div className="p-2 rounded-lg bg-slate-950/70 border border-teal-500/30 text-teal-300 text-xs italic">
          "{interimTranscript}..."
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5">
          {/* Main Voice Microphone Toggle Button */}
          {isSpeechRecSupported ? (
            <button
              type="button"
              id="btn-nova-toggle-mic"
              onClick={isListening ? onStopListening : onStartListening}
              disabled={state === 'thinking'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isListening
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)] font-bold'
                  : 'bg-slate-800/90 hover:bg-teal-950 text-slate-200 hover:text-teal-300 border border-slate-700/80 hover:border-teal-500/50'
              } disabled:opacity-50`}
              title={isListening ? 'Click to stop listening' : 'Speak to Nova (Microphone)'}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-teal-400" />
                  <span>{compact ? 'Voice' : 'Speak to Nova'}</span>
                </>
              )}
            </button>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] border border-slate-700"
              title="Speech recognition is not supported in this browser"
            >
              <MicOff className="w-3 h-3 text-slate-500" />
              <span>Voice Unsupported</span>
            </span>
          )}

          {/* Voice Audio Readout Mute/Unmute Toggle */}
          <button
            type="button"
            id="btn-nova-toggle-mute"
            onClick={onToggleMute}
            className={`p-1.5 rounded-xl border text-xs transition cursor-pointer ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-teal-950/40 border-teal-500/30 text-teal-300 hover:bg-teal-900/60'
            }`}
            title={isMuted ? 'Voice readout is muted. Click to unmute.' : 'Voice readout is active. Click to mute.'}
            aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* 24/7 Availability Pill */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-emerald-400">Available 24/7</span>
        </div>
      </div>
    </div>
  );
};
