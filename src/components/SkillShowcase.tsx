import React from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface SkillShowcaseProps {
  onOpenCheckout?: () => void;
}

const SKILLS = [
  {
    title: 'The Explosive Muscle-Up',
    description: 'Transform from standard pull-ups to soaring above the bar with zero elbow strain and explosive vertical pull.',
    level: 'Intermediate to Advanced',
    tag: 'Signature Move'
  },
  {
    title: 'The Full Handstand & HSPU',
    description: 'Build superhero shoulders, balance, and overhead pressing power without dropping heavy iron on your head.',
    level: 'Beginner to Master',
    tag: 'Upper Body Beast'
  },
  {
    title: 'Planche & Front Lever',
    description: 'The holy grail of bodyweight physics. Develop steel core tension, locked-arm tendon strength, and razor-sharp abs.',
    level: 'Advanced Progression',
    tag: 'Elite Gymnastics'
  },
  {
    title: 'L-Sit to V-Sit Core Lock',
    description: 'Carve a deep 8-pack and bulletproof hip flexors with zero sit-ups or harmful spinal bending.',
    level: 'All Levels',
    tag: 'Iron Core'
  }
];

export const SkillShowcase: React.FC<SkillShowcaseProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0d] border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Skills You Will Unlock
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            Stop Doing Boring Gym Reps. <br />
            <span className="text-gradient-gold">Unlock Real Superhuman Movements.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Step-by-step video progressions breaking down each skill from the exact initial regression to master form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Skills list */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS.map((skill, index) => (
              <div
                key={index}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded">
                      {skill.tag}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {skill.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mb-1.5">
                    {skill.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center text-xs font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5 mr-1" /> Full Video Breakdown Included
                </div>
              </div>
            ))}
          </div>

          {/* Right: Ian Outdoor Park Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-zinc-900 shadow-2xl shadow-amber-950/40 group">
              <img
                src="/images/ian-park-skills.jpg"
                alt="Ian Barseagle parallel bar calisthenics skills"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                  NO EQUIPMENT BAR MASTERY
                </span>
                <p className="text-sm font-bold text-white">
                  "All you need is a park bar or home pull-up bar. The physics do the rest."
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">100% Calisthenics Routine</span>
                  <button
                    onClick={onOpenCheckout}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    Unlock for ₹489 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
