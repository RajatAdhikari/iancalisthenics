import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StickyMobileBar: React.FC = () => {
  const handleClick = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 border-t border-emerald-500/40 p-2.5 px-3 backdrop-blur-xl shadow-2xl shadow-black">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] text-zinc-400 line-through font-sans">₹15,000</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1 py-0.2 rounded">97% OFF</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-black text-white font-sans tracking-tight">₹489</span>
            <span className="text-[10px] text-zinc-400 font-medium">One-Time</span>
          </div>
        </div>

        <a
          href="https://superprofile.bio/vp/calisthenics"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-black text-xs text-black bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform"
        >
          <Zap className="w-4 h-4 fill-black text-black" />
          <span>UNLOCK NOW</span>
          <ArrowRight className="w-3.5 h-3.5 text-black" />
        </a>
      </div>
    </div>
  );
};
