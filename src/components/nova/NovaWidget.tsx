/**
 * NovaWidget Component
 * Floating persistent assistant widget docked in bottom-right corner.
 * Supports greeting toast, voice trigger, expandable chat dialog, and keyboard navigation.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  X,
  MessageSquare,
  Mic,
  Sparkles,
} from 'lucide-react';
import { NovaAvatar } from './NovaAvatar';
import { NovaChatPanel } from './NovaChatPanel';

export const NovaWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGreetingVisible, setIsGreetingVisible] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);
  const [autoVoice, setAutoVoice] = useState<boolean>(false);
  const location = useLocation();

  // Show subtle greeting banner on initial session load if on homepage
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('nova_greeting_dismissed');
    if (!hasSeenGreeting && location.pathname === '/') {
      const timer = setTimeout(() => {
        setIsGreetingVisible(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Listen for global open requests (e.g. from MeetNovaSection or Navigation)
  useEffect(() => {
    const handleGlobalOpen = (event: Event) => {
      const customEvt = event as CustomEvent<{ prompt?: string; voice?: boolean }>;
      setIsGreetingVisible(false);
      sessionStorage.setItem('nova_greeting_dismissed', 'true');
      setInitialPrompt(customEvt.detail?.prompt);
      setAutoVoice(Boolean(customEvt.detail?.voice));
      setIsOpen(true);
    };

    window.addEventListener('open-nova-assistant', handleGlobalOpen);
    return () => {
      window.removeEventListener('open-nova-assistant', handleGlobalOpen);
    };
  }, []);

  const handleDismissGreeting = () => {
    setIsGreetingVisible(false);
    sessionStorage.setItem('nova_greeting_dismissed', 'true');
  };

  const handleOpenChat = (prompt?: string) => {
    setIsGreetingVisible(false);
    sessionStorage.setItem('nova_greeting_dismissed', 'true');
    setInitialPrompt(prompt);
    setAutoVoice(false);
    setIsOpen(true);
  };

  const handleOpenVoice = () => {
    setIsGreetingVisible(false);
    sessionStorage.setItem('nova_greeting_dismissed', 'true');
    setInitialPrompt(undefined);
    setAutoVoice(true);
    setIsOpen(true);
  };

  return (
    <aside
      id="nova-assistant-widget"
      aria-label="Nova AI Assistant"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none"
    >
      {/* Expanded Chat Panel */}
      {isOpen ? (
        <div className="pointer-events-auto mb-2 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <NovaChatPanel
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsOpen(false)}
            initialPrompt={initialPrompt}
            autoStartVoice={autoVoice}
          />
        </div>
      ) : (
        /* Floating Trigger & Initial Homepage Greeting Card */
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          {/* Subtle Non-Intrusive Homepage Greeting Card */}
          {isGreetingVisible && !isOpen && (
            <div
              id="nova-greeting-popup"
              className="relative p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 text-slate-100 shadow-2xl max-w-xs sm:max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
            >
              {/* Dismiss button */}
              <button
                type="button"
                onClick={handleDismissGreeting}
                className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Dismiss greeting"
                aria-label="Dismiss greeting"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <NovaAvatar state="speaking" size="sm" showStatusBadge={false} />
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                      Nova AI Assistant
                    </h4>
                    <span className="text-[10px] text-teal-400 font-mono">24/7</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hi, I'm <strong className="text-teal-300">Nova</strong>. How can I help you explore AI Hospital Intelligence?
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  id="btn-talk-to-nova"
                  onClick={handleOpenVoice}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Talk to Nova</span>
                </button>

                <button
                  type="button"
                  id="btn-chat-with-nova"
                  onClick={() => handleOpenChat()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                  <span>Chat with Nova</span>
                </button>
              </div>
            </div>
          )}

          {/* Persistent Floating Nova Trigger Button */}
          <div className="flex items-center gap-2">
            {/* Context Tooltip Pill (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-medium backdrop-blur-md shadow-lg">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Ask Nova AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            {/* Main Round Floating Button */}
            <button
              type="button"
              id="btn-nova-floating-trigger"
              onClick={() => handleOpenChat()}
              className="group relative flex items-center justify-center p-1 rounded-full bg-gradient-to-tr from-teal-600 via-cyan-600 to-teal-400 hover:from-teal-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(20,184,166,0.45)] hover:shadow-[0_0_35px_rgba(20,184,166,0.65)] border border-teal-300/40 transition transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Open Nova AI Assistant"
              aria-label="Open Nova AI Assistant"
            >
              <span className="absolute inset-0 rounded-full border border-teal-400/60 animate-ping opacity-30 pointer-events-none" />
              <NovaAvatar state="idle" size="md" showStatusBadge={false} />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow">
                <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              </span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
