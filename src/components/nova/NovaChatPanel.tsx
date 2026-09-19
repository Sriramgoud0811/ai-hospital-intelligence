/**
 * NovaChatPanel Component
 * Full-featured conversational dialog for Nova with message history,
 * suggested clinical questions, speech controls, and regulatory safety disclosure.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Send,
  Trash2,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { NovaAvatar } from './NovaAvatar';
import { NovaMessage } from './NovaMessage';
import { NovaTypingIndicator } from './NovaTypingIndicator';
import { NovaVoiceControls } from './NovaVoiceControls';
import { useNovaChat } from '../../hooks/useNovaChat';

interface NovaChatPanelProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPrompt?: string;
  autoStartVoice?: boolean;
}

export const NovaChatPanel: React.FC<NovaChatPanelProps> = ({
  onClose,
  onMinimize,
  initialPrompt,
  autoStartVoice = false,
}) => {
  const {
    messages,
    isThinking,
    assistantState,
    suggestedQuestions,
    sendMessage,
    clearChat,
    // Voice STT
    isListening,
    speechError,
    isSpeechRecSupported,
    isSpeechSynthSupported,
    interimTranscript,
    startVoiceInput,
    stopVoiceInput,
    clearSpeechError,
    // Voice TTS
    isSpeaking,
    isMuted,
    toggleMute,
    stopSpeaking,
    speakMessage,
  } = useNovaChat();

  const [inputVal, setInputVal] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle initial prompt or voice auto-start if triggered from homepage
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt, false);
    } else if (autoStartVoice && isSpeechRecSupported) {
      startVoiceInput();
    }
  }, [initialPrompt, autoStartVoice, isSpeechRecSupported]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isThinking) return;
    sendMessage(inputVal, false);
    setInputVal('');
  };

  const handleSelectQuestion = (q: string) => {
    sendMessage(q, false);
    setShowQuestions(false);
  };

  return (
    <div
      id="nova-chat-panel"
      role="dialog"
      aria-label="Nova AI Clinical Assistant"
      className="flex flex-col h-[560px] max-h-[85vh] w-full sm:w-[410px] bg-slate-950/95 backdrop-blur-2xl border border-teal-500/30 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden text-slate-100 z-50 transition-all duration-300"
    >
      {/* Assistant Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 border-b border-teal-500/20 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <NovaAvatar state={assistantState} size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Nova AI Assistant
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-teal-300 flex items-center gap-1">
              <span>Available 24/7</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Clinical Guide</span>
            </p>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-rose-300 transition"
            title="Clear conversation history"
            aria-label="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Minimize Nova"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Close Nova"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety & Medical Disclaimer Ribbon */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>AI Decision Support • Not a Doctor • No PHI Stored</span>
        </div>
        <button
          type="button"
          onClick={() => setShowQuestions(!showQuestions)}
          className="text-teal-300 hover:text-white flex items-center gap-1 underline font-medium cursor-pointer"
        >
          <HelpCircle className="w-3 h-3" />
          <span>{showQuestions ? 'Hide FAQs' : 'Sample FAQs'}</span>
        </button>
      </div>

      {/* Suggested Quick Questions Drawer (Expandable) */}
      {showQuestions && (
        <div className="p-3 bg-slate-900/95 border-b border-slate-800 max-h-48 overflow-y-auto space-y-1.5 shrink-0 text-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
              Suggested Explorations
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(q)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-950/70 hover:bg-teal-950/50 text-slate-300 hover:text-teal-200 border border-slate-800/80 hover:border-teal-500/40 text-[11px] transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <NovaMessage
            key={msg.id}
            message={msg}
            onSpeak={speakMessage}
            onSelectPrompt={(prompt) => sendMessage(prompt, false)}
            isSpeakingThis={isSpeaking}
          />
        ))}

        {isThinking && <NovaTypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice & Input Controls Footer */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800/90 space-y-2.5 shrink-0">
        {/* Voice Controls Bar */}
        <NovaVoiceControls
          state={assistantState}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          isSpeechRecSupported={isSpeechRecSupported}
          isSpeechSynthSupported={isSpeechSynthSupported}
          speechError={speechError}
          interimTranscript={interimTranscript}
          onStartListening={startVoiceInput}
          onStopListening={stopVoiceInput}
          onStopSpeaking={stopSpeaking}
          onToggleMute={toggleMute}
          onClearError={clearSpeechError}
          compact
        />

        {/* Text Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            id="nova-chat-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Nova about predictions, models, or API..."
            disabled={isThinking}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 text-xs text-white placeholder:text-slate-500 transition disabled:opacity-50"
          />

          <button
            type="submit"
            id="btn-nova-send-chat"
            disabled={!inputVal.trim() || isThinking}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Local privacy hint */}
        <p className="text-[10px] text-center text-slate-500">
          Inquiries processed in-browser. No patient PHI logged or retained.
        </p>
      </div>
    </div>
  );
};
