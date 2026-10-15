import React from 'react';
import { Shield, Sparkles, Target, Flame, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgressionLadderProps {
  onOpenCheckout?: () => void;
}

export const ProgressionLadder: React.FC<ProgressionLadderProps> = ({ onOpenCheckout }) => {
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

  const LEVELS = [
    {
      level: 'LEVEL 0',
      tag: 'ABSOLUTE BEGINNER (START HERE)',
      badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
      icon: Target,
      who: 'If you can do 0 Pull-ups & struggle with regular push-ups',
      skills: [
        'Wall & Incline Push-ups (building chest & tricep activation)',
        'Dead-Hangs & Scapular Pulls (for grip & shoulder stabilization)',
        'Australian Rows (horizontal pulls using low bar or table)',
        'Lying Knee Tucks & Hollow Body fundamentals'
      ],
      timeframe: 'Weeks 1 – 3'
    },
    {
      level: 'LEVEL 1',
      tag: 'ATHLETIC FOUNDATION',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      icon: Shield,
      who: 'Building your first 10 strict push-ups & 3-5 clean pull-ups',
      skills: [
        'Strict Chest-to-Bar Pull-ups (no swinging, full extension)',
        'Deep Parallel Bar Dips (scapular depression & lockout)',
        'Pike Push-ups (overhead shoulder power for handstands)',
        'L-Sit progression on floor & parallettes'
      ],
      timeframe: 'Weeks 4 – 7'
    },
    {
      level: 'LEVEL 2',
      tag: 'EXPLOSIVE POWER & V-TAPER',
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      icon: Flame,
      who: 'Developing Greek-God aesthetic cuts & explosive bar transition',
      skills: [
        'High Explosive Pull-ups (pulling to sternum / waist)',
        'False Grip Mastery & Straight-Arm Lockout',
        'Wall Handstand Holds (1-2 minutes balance & core alignment)',
        'Tuck Planche & Tuck Front Lever holds'
      ],
      timeframe: 'Weeks 8 – 10'
    },
    {
      level: 'LEVEL 3',
      tag: 'SUPERHUMAN CALISTHENICS ELITE',
      badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      icon: Crown,
      who: 'Unlocking gravity-defying moves that turn heads in any park or gym',
      skills: [
        'Strict Slow Muscle-Up (zero momentum, pure strength)',
        'Freestanding Handstand & Handstand Push-ups',
        'Full Planche & Straddle Planche mastery',
        'Laser-cut 8% body fat Greek-God physique with Indian Diet Plan'
      ],
      timeframe: 'Weeks 11 – 12+'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            No Pre-Existing Strength Needed
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            The 0-to-Superhuman <br />
            <span className="text-gradient-emerald">Progression Ladder</span>
          </h2>
          <p className="mt-3 text-xs sm:text-base text-zinc-400">
            You don't need to be fit to start. Start at your exact current level and unlock superhuman strength step-by-step.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {LEVELS.map((lvl, idx) => {
            const Icon = lvl.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold text-white font-mono tracking-wider">
                      {lvl.level}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${lvl.badgeColor}`}>
                      {lvl.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-white">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-300">
                        {lvl.who}
                      </p>
                      <span className="text-[11px] text-zinc-400 font-mono mt-0.5 block">
                        Estimated: {lvl.timeframe}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-zinc-800/80 pt-3 text-xs text-zinc-300">
                    {lvl.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-zinc-300 text-center sm:text-left">
            <strong className="text-white">Never trained calisthenics before?</strong> You start safely on Day 1 at Level 0.
          </p>
          <button
            onClick={handleCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex-shrink-0"
          >
            <span>START AT LEVEL 0 (₹489)</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};
