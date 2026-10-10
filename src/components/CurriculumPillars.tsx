import React from 'react';
import { ShieldCheck, Dumbbell, Zap, Utensils, HeartHandshake, Film, PlayCircle, BookOpen } from 'lucide-react';

interface CurriculumPillarsProps {
  onOpenCheckout?: () => void;
}

const PILLARS = [
  {
    pillar: 'PILLAR 01',
    title: 'Joint & Tendon Bulletproofing',
    icon: ShieldCheck,
    color: 'emerald',
    badge: 'Injury Prevention',
    summary: '90% of beginners fail because their tendons cannot handle the load. This module conditions wrists, rotator cuffs, and elbows before heavy pulling.',
    bullets: [
      'Wrist flexibility & load adaptation protocol',
      'Shoulder depression and protraction mastery',
      'Eliminate golfer & tennis elbow forever'
    ]
  },
  {
    pillar: 'PILLAR 02',
    title: 'Zero to Hero Bodyweight Foundation',
    icon: Dumbbell,
    color: 'emerald',
    badge: 'Strength Core',
    summary: 'Whether you can do 0 push-ups or 15 pull-ups, this regression/progression matrix builds raw muscle density fast.',
    bullets: [
      'Incline, knee, and strict explosive push-up paths',
      'Negative pull-ups, Australian rows & dead-hang holds',
      'Parallel bar dip mechanics for chest & tricep thickness'
    ]
  },
  {
    pillar: 'PILLAR 03',
    title: 'Gravity Skills HD Video Vault',
    icon: Zap,
    color: 'amber',
    badge: 'Superhuman Skills',
    summary: 'Detailed multi-angle video tutorials breaking down Ian Barseagle’s elite signature movements step-by-step.',
    bullets: [
      'Muscle-Up transition secrets (eliminating the chicken wing)',
      'Wall handstand balance drill to freestanding hold',
      'Planche lean & tuck planche progression ladder'
    ]
  },
  {
    pillar: 'PILLAR 04',
    title: 'Budget-Friendly Indian Diet Blueprint',
    icon: Utensils,
    color: 'emerald',
    badge: 'Fat Loss & Muscle',
    summary: 'Tailored for Indian kitchens. High-protein, clean vegetarian and non-vegetarian meal plans without expensive foreign supplements.',
    bullets: [
      '100g+ Protein Indian Veg Chart (Paneer, Dal, Soya, Chana, Sattu)',
      'High-protein Non-Veg Meal Structure (Eggs, Chicken, Fish)',
      'Exact calorie & macro calculation for rapid fat shred'
    ]
  },
  {
    pillar: 'PILLAR 05',
    title: 'Female Athlete Sculpt & Tone Roadmap',
    icon: HeartHandshake,
    color: 'pink',
    badge: 'Specialized Track',
    summary: 'Specifically engineered for girls and women. Focuses on a lean athletic waist, sculpted arms, toned back, and empowered posture.',
    bullets: [
      'Upper body strength without developing bulky neck/traps',
      'Deep core activation to flatten lower belly',
      'Step-by-step first pull-up guide for female athletes'
    ]
  }
];

export const CurriculumPillars: React.FC<CurriculumPillarsProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Complete Curriculum Overview
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            The 5 Pillars Of <span className="text-gradient-emerald">Unstoppable Calisthenics</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            A comprehensive, all-in-one system. Once you have this masterclass, you will never need another trainer or workout program again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      {item.pillar}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-2.5 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                    {item.summary}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-zinc-800/80">
                    {item.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Film className="w-3.5 h-3.5 text-emerald-400" />
                    HD Video & PDF Guide
                  </span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: All-Inclusive Value Summary */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                ALL-IN-ONE ACCESS
              </span>
              <h3 className="text-xl font-extrabold text-white font-display mt-4 mb-2">
                Lifetime Access • Continuous Updates
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                You get unrestricted 24/7 access to all videos, PDFs, and Indian diet updates directly on your phone or laptop.
              </p>

              <div className="mt-6 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>No Recurring Subscriptions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Stream Anytime, Anywhere</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Beginner to Pro In One Single Place</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Enroll For ₹489 (Was ₹15,000)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
