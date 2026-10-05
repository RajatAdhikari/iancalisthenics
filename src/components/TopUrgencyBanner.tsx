import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

export const TopUrgencyBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 47); // 14 mins 47 secs

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
    <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 bg-[length:200%_auto] animate-gradient text-white py-2 px-3 text-xs md:text-sm font-semibold tracking-wide text-center sticky top-0 z-50 shadow-lg border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full text-amber-300 font-bold uppercase text-[11px] md:text-xs">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          97% OFF Flash Sale
        </span>
        <span className="hidden sm:inline text-zinc-100">
          Special India Launch Offer (USA Price ₹15,000) ➔ Get Everything for <strong className="text-white underline decoration-emerald-400">₹489</strong>
        </span>
        <span className="sm:hidden text-zinc-100">
          Only <strong className="text-white">₹489</strong> (Was ₹15,000)
        </span>
        <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-md font-mono text-emerald-300 border border-emerald-500/30">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>Ends in: {formattedTime}</span>
        </div>
        <span className="hidden md:inline-block bg-red-500/30 text-red-200 border border-red-500/40 px-2 py-0.5 rounded text-[11px]">
          Only 4 Slots Left at ₹489
        </span>
      </div>
    </div>
  );
};
