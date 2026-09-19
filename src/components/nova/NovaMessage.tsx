/**
 * NovaMessage Component
 * Displays individual chat messages with formatted markdown, timestamps,
 * audio readout button, copy button, and follow-up prompts.
 */

import React, { useState } from 'react';
import {
  Volume2,
  Copy,
  Check,
  User,
  AlertTriangle,
} from 'lucide-react';
import { NovaMessage as INovaMessage } from '../../types/nova';
import { NovaAvatar } from './NovaAvatar';

interface NovaMessageProps {
  message: INovaMessage;
  onSpeak?: (text: string) => void;
  onSelectPrompt?: (prompt: string) => void;
  isSpeakingThis?: boolean;
}

export const NovaMessage: React.FC<NovaMessageProps> = ({
  message,
  onSpeak,
  onSelectPrompt,
  isSpeakingThis = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isNova = message.sender === 'nova';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Simple clean markdown parser for bold, bullets, and linebreaks
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check if bullet point
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[•-]\s*/, '') : line;

      // Parse bold **text**
      const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-2 my-0.5">
            <span className="text-teal-400 font-bold shrink-0">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="leading-relaxed my-0.5">
          {formattedParts}
        </p>
      );
    });
  };

  if (!isNova) {
    // User Message (Right-aligned)
    return (
      <div className="flex items-end justify-end gap-2 text-xs">
        <div className="flex flex-col items-end max-w-[85%] space-y-1">
          <div className="p-3.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md">
            <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono pr-1">{formattedTime}</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mb-4">
          <User className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }

  // Nova Message (Left-aligned)
  const isEmergency = message.category === 'emergency';

  return (
    <div className="flex items-start gap-2.5 text-xs text-slate-200">
      <NovaAvatar
        state={isSpeakingThis ? 'speaking' : 'idle'}
        size="sm"
        showStatusBadge={false}
        className="mt-1"
      />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Message Bubble */}
        <div
          className={`p-4 rounded-2xl rounded-tl-sm shadow-sm space-y-2 ${
            isEmergency
              ? 'bg-rose-950/70 border border-rose-500/60 text-rose-100'
              : message.isError
              ? 'bg-amber-950/60 border border-amber-500/40 text-amber-200'
              : 'bg-slate-900/90 border border-slate-800 text-slate-200'
          }`}
        >
          {isEmergency && (
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider pb-1 border-b border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Notice</span>
            </div>
          )}

          {/* Formatted Text Body */}
          <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
            {renderFormattedContent(message.text)}
          </div>

          {/* Message Meta & Action Tools */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500">{formattedTime}</span>
              {message.source && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[9px] text-teal-400 border border-teal-800/40">
                  {message.source === 'knowledge-base' ? 'Verified Knowledge' : 'Clinical Safe Mode'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Readout Button */}
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(message.text)}
                  className={`p-1 rounded hover:bg-slate-800 transition ${
                    isSpeakingThis ? 'text-cyan-300 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isSpeakingThis ? 'Speaking this message' : 'Listen to Nova read this response'}
                  aria-label="Read response aloud"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeakingThis ? 'animate-pulse' : ''}`} />
                </button>
              )}

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Copy response text"
                aria-label="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Follow-up chips */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectPrompt && (
          <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
            {message.suggestedFollowUps.map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => onSelectPrompt(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-teal-950/60 text-slate-300 hover:text-teal-200 border border-slate-800 hover:border-teal-500/40 transition text-left cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
