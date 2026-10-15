import React from 'react';
import { X, Check, Zap, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComparisonTableProps {
  onOpenCheckout?: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ onOpenCheckout }) => {
  const handleCta = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const COMPARISONS = [
    {
      feature: 'Workout Progression Structure',
      youtube: 'Random disjointed shorts & reels with zero sequence',
      course: '12-Week Day-by-Day structured roadmap from Level 0 to Superhuman',
    },
    {
      feature: 'Joint & Tendon Injury Prevention',
      youtube: 'High risk of elbow & shoulder tendonitis from improper form',
      course: 'Dedicated Wrist & Rotator Cuff Bulletproofing prehab drills',
    },
    {
      feature: 'Starting From 0 Pull-ups',
      youtube: 'Shows elite athletes doing moves without beginner regressions',
      course: 'Ground Zero wall & incline steps specifically for beginners & skinny-fat',
    },
    {
      feature: 'Nutrition & Diet Blueprint',
      youtube: 'Generic Western diets (avocado, salmon, expensive whey)',
      course: 'Custom Desi Indian Veg & Non-Veg Diet (Paneer, Soya, Dal, Eggs) <₹100/day',
    },
    {
      feature: 'Access & Offline Viewing',
      youtube: 'Endless ad interruptions, searching hours for the next part',
      course: 'Instant Google Drive folder download to mobile/laptop for offline training',
    },
    {
      feature: 'Time Required Per Day',
      youtube: 'Confusing 2-hour workouts that lead to overtraining',
      course: 'Laser-focused 35-45 minute routines (4 days/week) suitable for busy schedules',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-t border-zinc-900 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            The Brutal Truth About Fitness
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            Free YouTube Videos <br className="hidden sm:block" />
            <span className="text-gradient-emerald">Vs. The Ian Barseagle System</span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-zinc-400">
            Why 98% of people watching free calisthenics clips stay stuck for years, while our students unlock their first strict muscle-up in 60-90 days.
          </p>
        </div>

        {/* Comparison Table Grid */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Header row */}
          <div className="grid grid-cols-12 border-b border-zinc-800 text-xs sm:text-sm font-bold">
            <div className="col-span-4 sm:col-span-4 p-3 sm:p-5 text-zinc-400 bg-zinc-900/60 flex items-center">
              <span>CRITICAL FACTOR</span>
            </div>
            <div className="col-span-4 sm:col-span-4 p-3 sm:p-5 text-rose-400 bg-rose-950/20 border-l border-zinc-800 flex items-center justify-center text-center">
              <span>❌ Free YouTube Clips</span>
            </div>
            <div className="col-span-4 sm:col-span-4 p-3 sm:p-5 text-emerald-300 bg-emerald-950/30 border-l border-emerald-500/30 flex items-center justify-center text-center">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>Ian Barseagle System</span>
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-800/80">
            {COMPARISONS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 text-[11px] sm:text-xs md:text-sm transition-colors hover:bg-zinc-900/30"
              >
                <div className="col-span-4 sm:col-span-4 p-3 sm:p-4 font-semibold text-zinc-200 flex items-center">
                  {row.feature}
                </div>

                {/* YouTube Column */}
                <div className="col-span-4 sm:col-span-4 p-3 sm:p-4 bg-rose-950/10 border-l border-zinc-800 text-zinc-400 flex items-center gap-1.5 leading-relaxed">
                  <X className="w-4 h-4 text-rose-400 flex-shrink-0 hidden sm:inline-block" />
                  <span>{row.youtube}</span>
                </div>

                {/* Course Column */}
                <div className="col-span-4 sm:col-span-4 p-3 sm:p-4 bg-emerald-950/20 border-l border-emerald-500/30 text-zinc-100 font-medium flex items-center gap-1.5 leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 hidden sm:inline-block" />
                  <span>{row.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Callout & CTA */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-amber-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Stop Wasting Months On Guesswork</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Get the entire battle-tested system for ₹489 (less than the price of 1 fast food meal).
            </p>
          </div>

          <button
            onClick={handleCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex-shrink-0"
          >
            <span>JOIN THE MASTERCLASS (₹489)</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};
