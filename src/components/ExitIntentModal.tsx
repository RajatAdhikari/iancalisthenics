import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ShieldCheck, Zap, ArrowRight, Gift, Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExitIntentModalProps {
  onOpenCheckout?: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onOpenCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(8 * 60 + 59);

  useEffect(() => {
    // Check if dismissed before
    const dismissed = sessionStorage.getItem('ian_exit_modal_dismissed');
    if (dismissed) return;

    // Desktop: Trigger on mouse leaving the top of viewport (attempting to close tab)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    // Mobile / Desktop Timer fallback: Trigger after 45 seconds if user hasn't clicked checkout
    const timer = setTimeout(() => {
      if (!hasTriggered && !sessionStorage.getItem('ian_exit_modal_dismissed')) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasTriggered]);

  // Countdown timer inside modal
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('ian_exit_modal_dismissed', 'true');
  };

  const handleClaim = () => {
    handleClose();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border-2 border-emerald-500/60 p-5 sm:p-7 shadow-2xl shadow-emerald-950/80 overflow-hidden text-center"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 rounded-b-full shadow-[0_0_20px_#10b981]" />

            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400 animate-pulse" />
              WAIT! BEFORE YOU LEAVE EMPTY-HANDED
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight leading-tight">
              Don't Miss Out On Your <br />
              <span className="text-gradient-emerald">Greek-God Transformation</span>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
              Tomorrow the price returns to <span className="line-through text-red-400">₹15,000</span>. Lock in your complete lifetime access + all bonuses today for only <strong className="text-white font-black text-sm">₹489</strong>.
            </p>

            {/* Micro Bonus Box */}
            <div className="my-4 p-3.5 rounded-xl bg-zinc-900/90 border border-emerald-500/30 text-left space-y-1.5 text-xs text-zinc-200">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-[11px] uppercase tracking-wider mb-1">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Everything Automatically Unlocked Today:</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Full Zero-to-Superhuman Video Library (HD MP4)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Custom Indian Veg & Non-Veg Diet Blueprint (PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Instant Google Drive Access Link on Screen + Email</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>30-Day 100% Money-Back Guarantee (Zero Risk)</span>
              </div>
            </div>

            {/* Timer */}
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono mb-4 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Discount reserved for: {timerStr}</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleClaim}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/30 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>YES, UNLOCK EVERYTHING FOR ₹489</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={handleClose}
              className="mt-3 text-[11px] text-zinc-500 hover:text-zinc-400 underline transition cursor-pointer"
            >
              No thanks, I will pay regular ₹15,000 later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
