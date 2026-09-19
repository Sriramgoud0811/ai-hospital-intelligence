/**
 * MeetNovaSection Component
 * Dedicated homepage presentation section introducing Nova with interactive triggers,
 * capability badges, voice demo, and healthcare safety disclosure.
 */

import React from 'react';
import {
  Mic,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Brain,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { NovaAvatar } from './NovaAvatar';

interface MeetNovaSectionProps {
  onOpenChat: (prompt?: string) => void;
  onOpenVoice: () => void;
}

export const MeetNovaSection: React.FC<MeetNovaSectionProps> = ({
  onOpenChat,
  onOpenVoice,
}) => {
  const capabilities = [
    {
      title: 'Length-of-Stay Interpretation',
      desc: 'Understand clinical features driving continuous inpatient days estimation.',
      icon: Layers,
    },
    {
      title: '30-Day Readmission Guidance',
      desc: 'Explore diabetic medication and diagnostic factors influencing readmission risk.',
      icon: Activity,
    },
    {
      title: 'Conversational Voice AI',
      desc: 'Ask questions hands-free via speech-to-text and listen to natural audio readouts.',
      icon: Mic,
    },
    {
      title: 'FastAPI Backend Insights',
      desc: 'Learn about model inference latency, Render cold starts, and REST schemas.',
      icon: Brain,
    },
  ];

  const quickPrompts = [
    'Explain length-of-stay prediction.',
    'Explain 30-day readmission prediction.',
    'What information is required?',
    'What does the API status mean?',
  ];

  return (
    <section
      id="meet-nova-section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Meet Nova AI Guide"
    >
      {/* Container with High-Tech Biometric Glassmorphism */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-teal-950/40 border border-teal-500/30 shadow-[0_10px_50px_rgba(13,148,136,0.15)] overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Nova Avatar & Visual Aura */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <NovaAvatar state="idle" size="xl" showStatusBadge={true} />
              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span className="px-3 py-0.5 rounded-full bg-slate-900 border border-teal-400/50 text-[10px] font-mono text-teal-300 shadow-md">
                  Digital Clinical AI • 24/7
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-1">
              <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Nova
              </h3>
              <p className="text-xs text-teal-300 font-medium">
                AI Decision-Support & Platform Guide
              </p>
            </div>

            {/* Quick Prompt Starters */}
            <div className="w-full space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Try asking Nova:
              </span>
              <div className="flex flex-col gap-1.5 w-full max-w-sm mx-auto">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onOpenChat(prompt)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-teal-950/60 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white text-xs text-left transition group cursor-pointer"
                  >
                    <span className="truncate">"{prompt}"</span>
                    <ArrowRight className="w-3 h-3 text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Introduction & Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Meet Nova — Your AI Guide</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                Explore Hospital Intelligence with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">
                  Conversational Voice & Chat
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Meet Nova, your AI guide for exploring hospital analytics. Ask questions about the application's prediction models, workflow, and technical features through text or natural voice.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                id="btn-section-talk-to-nova"
                onClick={onOpenVoice}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Talk to Nova</span>
              </button>

              <button
                type="button"
                id="btn-section-chat-with-nova"
                onClick={() => onOpenChat()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 hover:border-slate-600 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Chat with Nova</span>
              </button>
            </div>

            {/* Capability Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {capabilities.map((cap, cIdx) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cIdx}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 hover:border-teal-500/40 transition"
                  >
                    <div className="flex items-center gap-2 text-teal-300 font-semibold">
                      <Icon className="w-3.5 h-3.5 text-teal-400" />
                      <span>{cap.title}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Healthcare & AI Transparency Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-teal-500/20 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-200">AI Safety Disclosure:</strong> Nova is an artificial intelligence guide and decision-support tool, not a licensed healthcare provider. Predictions generated by the models are analytical estimations and must not substitute for certified clinical judgment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
