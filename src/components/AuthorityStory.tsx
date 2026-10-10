import React from 'react';
import { Target, CheckCircle2, ShieldAlert, Award, ArrowRight, Sparkles } from 'lucide-react';

interface AuthorityStoryProps {
  onOpenCheckout?: () => void;
}

export const AuthorityStory: React.FC<AuthorityStoryProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            The Untold Story
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            "Gyms Sell You Machines. <br className="hidden sm:inline" />
            <span className="text-gradient-emerald">Calisthenics Unlocks Superhuman Control."</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Ian Barseagle's journey from stiff gym lifting to mastering gravity — and why bodyweight training is the ultimate fountain of youth for both men and women.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image Showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src="/images/ian-gym-shredded.jpg"
                alt="Ian Barseagle Shredded Calisthenics Physique"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                  <p className="text-sm font-bold text-white">
                    "True strength isn't lifting 100kg lying on a bench. True strength is controlling your own body through space with surgical precision."
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    — Ian Barseagle (Calisthenics Specialist)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2 font-display">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                The Flaw in Traditional Commercial Gyms
              </h3>
              <p className="text-sm sm:text-base text-zinc-400">
                Pehle main bhi wahi karta tha jo sab karte hain: heavy dumbbells, costly protein powders aur daily isolation machines. Result kya mila? Stiff shoulders, lower back fatigue aur aisi bulky body jo 2 hafte gym chhodne par gayab ho jati thi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2 font-display">
                <Target className="w-5 h-5 text-emerald-400" />
                The Calisthenics Breakthrough
              </h3>
              <p className="text-sm sm:text-base text-zinc-400">
                Jab maine Gymnastic Bodyweight Mechanics aur Calisthenics adapt kiya, sab kuch badal gaya. Tendon strength bulletproof ho gayi, body 8% bodyfat par laser-shredded ban gayi, aur maine unlock kiya Muscle-ups, Planche aur Human Flag.
              </p>
            </div>

            {/* Inclusivity & Complete Guarantee */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-zinc-200">
              <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Is Course Ke Baad Kahi Aur Se Kuch Buy Karne Ki Zaroorat Nahi!
              </h4>
              <ul className="space-y-2.5 text-sm sm:text-base text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Zero Level Se Start:</strong> Agar aap ek bhi push-up ya pull-up nahi kar sakte, tab bhi zero-risk progressions aapko build karengi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Women / Girls Friendly:</strong> Girls ke liye dedicated core, glutes, posture aur upper body tone track included hai—bulky bane bina slim & strong banne ke liye.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Complete Indian Diet Chart:</strong> Roti, Dal, Paneer, Chana, Eggs se bane budget-friendly Indian nutrition plans. Expensive supplements ki zero zaroorat.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenCheckout}
                className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-8 transition-colors cursor-pointer"
              >
                <span>Read Ian's 5-Pillar Blueprint Below or Unlock Access for ₹489</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Ian's Personal 2-Year Transformation Banner */}
        <div className="mt-16 bg-zinc-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Ian Barseagle's Real 2-Year Progression
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-3">
              "I Was Not Born With Superhuman Genetics."
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Day 1 (Skinny teenager) ➔ 6 Months (Athletic core & posture) ➔ 2+ Years (World-class Greek-God aesthetic physique). Calisthenics aur pure nutrition ka real proof!
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 max-w-3xl mx-auto shadow-2xl">
            <img
              src="/images/ian-personal-transformation.jpg"
              alt="Ian Barseagle personal transformation Day 1 to 2+ years"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
