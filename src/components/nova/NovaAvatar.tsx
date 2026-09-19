/**
 * NovaAvatar Component
 * Visual presentation of Nova with state-driven holographic rings,
 * audio waveforms, and status indicators.
 */

import React from 'react';
import { Sparkles, Mic, Volume2, Cpu } from 'lucide-react';
import novaAvatarImg from '../../assets/images/nova_ai_avatar_1789733942296.jpg';
import { NovaState } from '../../types/nova';

interface NovaAvatarProps {
  state?: NovaState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusBadge?: boolean;
  className?: string;
}

export const NovaAvatar: React.FC<NovaAvatarProps> = ({
  state = 'idle',
  size = 'md',
  showStatusBadge = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-9 h-9', img: 'w-9 h-9', ring: 'ring-1' },
    md: { container: 'w-12 h-12', img: 'w-12 h-12', ring: 'ring-2' },
    lg: { container: 'w-16 h-16', img: 'w-16 h-16', ring: 'ring-2' },
    xl: { container: 'w-24 h-24 sm:w-28 sm:h-28', img: 'w-24 h-24 sm:w-28 sm:h-28', ring: 'ring-3' },
  };

  const currentSize = sizeMap[size];

  // State-specific border glow & aura
  const stateClasses = {
    idle: 'ring-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
    listening: 'ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.55)]',
    thinking: 'ring-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]',
    speaking: 'ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.6)]',
  }[state];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.container} ${className}`}
      aria-label={`Nova AI Assistant (${state})`}
    >
      {/* Listening Concentric Ripple Waves */}
      {state === 'listening' && (
        <>
          <span className="absolute inset-0 rounded-full border border-emerald-400/80 animate-ping pointer-events-none" />
          <span className="absolute -inset-1.5 rounded-full border border-teal-400/40 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Speaking Dynamic Holographic Wave Rings */}
      {state === 'speaking' && (
        <>
          <span className="absolute -inset-1 rounded-full border border-cyan-400/70 animate-pulse pointer-events-none" />
          <span className="absolute -inset-2.5 rounded-full border border-teal-300/30 animate-ping pointer-events-none" />
        </>
      )}

      {/* Thinking Shimmer Effect */}
      {state === 'thinking' && (
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-teal-400 to-cyan-400 opacity-60 blur-xs animate-spin pointer-events-none" />
      )}

      {/* Avatar Image Container */}
      <div
        className={`relative rounded-full overflow-hidden transition-all duration-300 ${currentSize.ring} ${stateClasses} bg-slate-900`}
      >
        <img
          src={novaAvatarImg}
          alt="Nova - Hospital Care AI Assistant"
          referrerPolicy="no-referrer"
          className={`object-cover object-center ${currentSize.img} transform hover:scale-105 transition-transform duration-300`}
        />

        {/* Futuristic Subtle Holographic Overlay Scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-cyan-500/15 pointer-events-none" />
      </div>

      {/* State Badge Icon */}
      {showStatusBadge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full ring-2 ring-slate-950 transition-colors ${
            size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          } ${
            state === 'listening'
              ? 'bg-emerald-500 text-slate-950 animate-bounce'
              : state === 'speaking'
              ? 'bg-cyan-400 text-slate-950 animate-pulse'
              : state === 'thinking'
              ? 'bg-indigo-400 text-slate-950 animate-spin'
              : 'bg-teal-500 text-slate-950'
          }`}
          title={`Nova Status: ${state}`}
        >
          {state === 'listening' ? (
            <Mic className="w-2.5 h-2.5" />
          ) : state === 'speaking' ? (
            <Volume2 className="w-2.5 h-2.5" />
          ) : state === 'thinking' ? (
            <Cpu className="w-2.5 h-2.5" />
          ) : (
            <Sparkles className="w-2.5 h-2.5" />
          )}
        </span>
      )}
    </div>
  );
};
