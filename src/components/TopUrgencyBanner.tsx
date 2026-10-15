import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck } from 'lucide-react';

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
    <div className="bg-zinc-950 border-b border-emerald-500/30 text-white py-1.5 sm:py-2 px-3 text-[11px] sm:text-xs font-medium tracking-wide shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Left: Discount Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black px-2 py-0.5 rounded-full font-extrabold uppercase text-[9px] sm:text-[10px] tracking-wider shadow-sm">
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black text-black" />
            97% OFF
          </span>
          <span className="text-zinc-300 text-[10px] sm:text-xs">
            Special Promotional Pass: <strong className="text-white font-black font-sans">₹489</strong>{' '}
            <span className="line-through text-zinc-500 text-[9px] sm:text-[10px] ml-0.5">₹15,000</span>
          </span>
        </div>

        {/* Right: Guarantee & Live Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            30-Day Money-Back Guarantee
          </span>
          <div className="inline-flex items-center gap-1 bg-zinc-900 border border-emerald-500/40 px-2 py-0.5 rounded font-mono text-emerald-300 text-[10px] sm:text-xs">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Ends in: {formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
