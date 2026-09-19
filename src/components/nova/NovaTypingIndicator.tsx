/**
 * NovaTypingIndicator Component
 * Smooth typing dots indicator when Nova is processing a response
 */

import React from 'react';
import { NovaAvatar } from './NovaAvatar';

export const NovaTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 text-xs" aria-live="polite">
      <NovaAvatar state="thinking" size="sm" showStatusBadge={false} />
      <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-900 border border-teal-500/30 text-slate-200 shadow-sm flex items-center gap-2">
        <span className="text-[11px] text-teal-300 font-medium">Nova is thinking</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
