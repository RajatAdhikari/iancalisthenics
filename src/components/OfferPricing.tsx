import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Zap, ArrowRight, Sparkles, Clock, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OfferPricing: React.FC = () => {
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

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Limited Spots Available
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            Claim The Complete System <br />
            <span className="text-gradient-emerald">For The Price Of A Large Pizza</span>
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-xl mx-auto">
            In the USA, this program sells for ₹15,000 ($180). For our India Launch, get lifetime access for just ₹489.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="relative rounded-3xl bg-zinc-900/95 border-2 border-emerald-500/50 p-6 sm:p-10 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl">
          {/* Top Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-amber-400 text-black font-extrabold text-xs sm:text-sm px-6 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            97% Discount • India Launch Only
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-zinc-800 pb-8">
            <div className="md:col-span-7">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Full All-Inclusive Package
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                Ian Barseagle Calisthenics Mastery
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Video tutorials, progression breakdowns, Indian nutrition diet charts, and female tone roadmap.
              </p>
            </div>

            <div className="md:col-span-5 text-center md:text-right">
              <div className="text-xs text-zinc-400 line-through">
                USA / Global Price: ₹15,000
              </div>
              <div className="flex items-baseline justify-center md:justify-end gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-display">₹489</span>
                <span className="text-xs font-semibold text-emerald-400 uppercase">One-Time Fee</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono mt-1 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                <Clock className="w-3 h-3" />
                <span>Offer ends in: {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Value Checklist */}
          <div className="py-8">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-widest mb-4">
              Everything Included In Your Instant Access:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Zero to Advance Video Course (₹7,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Muscle-Up & Planche Video Vault (₹3,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Custom Indian Veg & Non-Veg Diet (₹2,499 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Female Bodyweight Tone Roadmap (₹1,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Joint & Tendon Conditioning Guide (₹1,499 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Lifetime Updates & Community Access (Priceless)</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="text-center pt-2">
            <a
              href="https://superprofile.bio/vp/calisthenics"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerConfetti}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/30 group"
            >
              <Zap className="w-6 h-6 fill-black text-black group-hover:rotate-12 transition-transform" />
              <span>GET INSTANT ACCESS FOR ₹489</span>
              <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1.5 transition-transform" />
            </a>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Instant Access Delivered via Email
              </span>
              <span>•</span>
              <span>UPI, Cards, NetBanking Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
