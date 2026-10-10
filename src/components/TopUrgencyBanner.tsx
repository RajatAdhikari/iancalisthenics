import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

export const TopUrgencyBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 47);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 text-white py-1 sm:py-1.5 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold tracking-wide border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-3 flex-nowrap overflow-x-hidden">
        <span className="inline-flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-full text-amber-300 font-bold uppercase text-[9px] sm:text-[10px] flex-shrink-0">
          <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400 animate-pulse" />
          97% OFF
        </span>
        <span className="text-zinc-100 font-medium text-[10px] sm:text-xs truncate">
          India Launch: <strong className="text-white font-black font-sans">₹489</strong> <span className="line-through text-zinc-300 text-[9px] sm:text-[10px] ml-0.5">₹15,000</span>
        </span>
        <div className="inline-flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded font-mono text-emerald-300 border border-emerald-500/30 text-[9px] sm:text-[10px] flex-shrink-0">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
          <span>Ends in: {formattedTime}</span>
        </div>
        <span className="hidden md:inline-block bg-red-500/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded text-[10px] flex-shrink-0">
          Only 4 Slots Left
        </span>
      </div>
    </div>
  );
};
