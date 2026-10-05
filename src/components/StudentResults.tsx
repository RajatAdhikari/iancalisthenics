import React from 'react';
import { Star, CheckCircle, Trophy, Flame } from 'lucide-react';

export const StudentResults: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5" />
            Proof Over Promises
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            Real Athletes. <span className="text-gradient-emerald">Unstoppable Results.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Check out actual community screenshots and member wins using Ian Barseagle's progression system.
          </p>
        </div>

        {/* 2 Featured Student Image Screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Proof 1: Enfy Muscle Up */}
          <div className="bg-zinc-900 border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500 transition-all">
            <div className="relative bg-black flex items-center justify-center p-2">
              <img
                src="/images/result-enfy-muscleup.jpg"
                alt="Enfy first muscle ups calisthenics progress"
                className="w-full max-h-[520px] object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
            <div className="p-5 bg-zinc-900/90 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-base flex items-center gap-1.5">
                  Enfy
                  <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" /> First Muscle-Up
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                "Good weighted pull-ups strength = solid muscle ups on first try. Never thought I could get above the bar this smoothly without elbow strain!"
              </p>
            </div>
          </div>

          {/* Proof 2: JAH2303 Handstand Pushups */}
          <div className="bg-zinc-900 border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500 transition-all">
            <div className="relative bg-black flex items-center justify-center p-2">
              <img
                src="/images/result-jah-hspu.jpg"
                alt="JAH2303 HSPU handstand pushups 4 in a row"
                className="w-full max-h-[520px] object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
            <div className="p-5 bg-zinc-900/90 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-base flex items-center gap-1.5">
                  JAH2303
                  <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> 4 HSPU In A Row PR
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                "New HSPU pr. 4 in a row! In the beginning of January could barely even do 1. Ian's shoulder conditioning drills completely fixed my balance."
              </p>
            </div>
          </div>
        </div>

        {/* Written Verified Indian Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
              "Main 2 saal se gym ja raha tha par chest aur pull-ups me koi strength nahi thi. Ian ke program me 60 days me maine apni pehli clean muscle-up hit ki. Diet chart bhi Indian kitchen friendly hai."
            </p>
            <div>
              <p className="font-bold text-white text-sm">Aditya Deshmukh</p>
              <p className="text-[11px] text-zinc-400">Software Engineer, Pune (Joined Jan 2026)</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
              "Being a girl, mujhe hamesha dar lagta tha ki calisthenics se bulk ya stiff body banegi. But Ian's female blueprint gave me a tight waist, lean tone, and today I can do 8 strict pull-ups!"
            </p>
            <div>
              <p className="font-bold text-white text-sm">Meghna Singhal</p>
              <p className="text-[11px] text-zinc-400">Architect, Bengaluru</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
              "USA me iska price 15,000 tha, India me sirf ₹489 me mil raha h ye steal deal h. Video quality aur detailed progressions are unmatched. Must buy for anyone serious about fitness."
            </p>
            <div>
              <p className="font-bold text-white text-sm">Varun Malhotra</p>
              <p className="text-[11px] text-zinc-400">Delhi (Verified Superprofile Buyer)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
