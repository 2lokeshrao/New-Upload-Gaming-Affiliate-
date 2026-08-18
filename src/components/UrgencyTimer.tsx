import React, { useState, useEffect } from 'react';
import { Timer, Zap, AlertTriangle } from 'lucide-react';

interface UrgencyTimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  label?: string;
  variant?: 'compact' | 'banner' | 'card';
}

export const UrgencyTimer: React.FC<UrgencyTimerProps> = ({
  initialMinutes = 14,
  initialSeconds = 59,
  label = "OFFER EXPIRES IN:",
  variant = 'compact'
}) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Reset timer for continuous urgency
          return { minutes: initialMinutes, seconds: initialSeconds };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialMinutes, initialSeconds]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-950 border border-amber-500/50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono font-black text-white text-base sm:text-lg">
          <span className="bg-slate-950 border border-amber-500/40 px-2.5 py-1 rounded-md text-amber-400">
            {formatNumber(timeLeft.minutes)}m
          </span>
          <span className="text-amber-400 ">:</span>
          <span className="bg-slate-950 border border-amber-500/40 px-2.5 py-1 rounded-md text-amber-400">
            {formatNumber(timeLeft.seconds)}s
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-500/40 px-2.5 py-1 rounded-lg text-red-300 text-xs font-bold font-mono">
        <Timer className="w-3.5 h-3.5 text-red-400 animate-spin" />
        <span>Expires in: {formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
      </div>
    );
  }

  // Default compact
  return (
    <div className="flex items-center gap-1.5 text-amber-300 font-mono text-xs font-extrabold bg-slate-950/80 border border-amber-500/30 px-2 py-0.5 rounded-md">
      <Zap className="w-3 h-3 text-amber-400 fill-amber-400 " />
      <span>{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
};
