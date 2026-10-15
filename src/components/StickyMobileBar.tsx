import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickyMobileBarProps {
  onOpenCheckout?: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onOpenCheckout }) => {
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

  const handleClick = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 }
    });
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 border-t border-emerald-500/50 p-2.5 px-3 backdrop-blur-xl shadow-2xl shadow-black">
      <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-1 px-1">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          30-Day Money-Back Guarantee
        </span>
        <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
          <Clock className="w-3 h-3" />
          {formattedTime}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] text-zinc-400 line-through font-sans">₹15,000</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1 py-0.2 rounded">97% OFF</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-black text-white font-sans tracking-tight">₹489</span>
            <span className="text-[9px] text-zinc-400 font-medium">One-Time</span>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-black text-xs text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-black text-black" />
          <span>UNLOCK NOW (₹489)</span>
          <ArrowRight className="w-3.5 h-3.5 text-black" />
        </button>
      </div>
    </div>
  );
};
