import React, { useState, useEffect } from 'react';
import {
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  Lock,
  Gift,
  HelpCircle,
  FileText,
  Film,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OfferPricingProps {
  onOpenCheckout?: () => void;
}

export const OfferPricing: React.FC<OfferPricingProps> = ({ onOpenCheckout }) => {
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
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const BONUSES = [
    {
      title: 'Desi Indian Veg & Non-Veg Shred Nutrition Blueprint',
      val: '₹2,499 Value',
      desc: 'Complete meal breakdown with Roti, Dal, Paneer, Soya, Eggs & Chicken. Hostel & home kitchen meal plans under ₹100/day.',
      icon: FileText
    },
    {
      title: 'Bulletproof Wrist, Elbow & Rotator Cuff Prehab Protocols',
      val: '₹1,999 Value',
      desc: 'Prevent golfer’s elbow and wrist strain. Joint mobility drills used by Olympic gymnasts to train injury-free.',
      icon: Award
    },
    {
      title: 'Dedicated Female Athlete Toned Core & Glute Track',
      val: '₹1,999 Value',
      desc: 'Aesthetic bodyweight sculpting for women—build a tight waist, strong back, and firm posture with zero bulkiness.',
      icon: Sparkles
    },
    {
      title: 'Lifetime Google Drive Updates & HD Video Lesson Vault',
      val: '₹4,999 Value',
      desc: 'Instant access to all 44+ video tutorials + free future lesson updates added directly to your shared Google Drive folder.',
      icon: Film
    }
  ];

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
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            In the USA, this program sells for ₹15,000 ($180). For our India Launch, get lifetime access for just ₹489.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="relative rounded-3xl bg-zinc-900/95 border-2 border-emerald-500/50 p-6 sm:p-10 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl">
          {/* Top Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 text-black font-extrabold text-xs sm:text-sm px-5 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
            97% Discount • India Launch Only
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center border-b border-zinc-800 pb-8 pt-2">
            <div className="md:col-span-7">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Full All-Inclusive Package
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                Ian Barseagle Calisthenics Mastery
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Zero to Superhuman video roadmap, progression breakdowns, Indian nutrition diet charts, and female tone track.
              </p>
            </div>

            <div className="md:col-span-5 text-center md:text-right">
              <div className="text-xs text-zinc-400 font-sans">
                USA / Global Price: <span className="line-through text-red-400 font-bold">₹15,000</span>
              </div>
              <div className="flex items-baseline justify-center md:justify-end gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight">₹489</span>
                <span className="text-xs font-bold text-emerald-400 uppercase">One-Time Fee</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-mono mt-1 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                <Clock className="w-3 h-3" />
                <span>Offer ends in: {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Value Checklist */}
          <div className="py-6 border-b border-zinc-800/80">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-widest mb-4">
              Everything Included In Your Instant Access:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-200">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Zero to Advance Video Course (₹7,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Muscle-Up & Planche Video Vault (₹3,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Custom Indian Veg & Non-Veg Diet (₹2,499 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Female Bodyweight Tone Roadmap (₹1,999 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Joint & Tendon Conditioning Guide (₹1,499 Value)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Lifetime Updates & Google Drive Access (Priceless)</span>
              </div>
            </div>
          </div>

          {/* Free Bonuses Stack */}
          <div className="py-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
                🎁 4 Free Fast-Action Bonuses (Worth ₹11,496) Included FREE Today:
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {BONUSES.map((bonus, bIdx) => {
                const Icon = bonus.icon;
                return (
                  <div
                    key={bIdx}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white leading-tight">{bonus.title}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                        {bonus.val} • <span className="text-emerald-400 font-bold uppercase">FREE TODAY</span>
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{bonus.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🛡️ 30-Day 100% Risk-Free Money Back Guarantee Box 🛡️ */}
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-emerald-950/30 border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
                <span>100% Risk-Free 30-Day Money-Back Guarantee</span>
              </h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Take 30 full days to go through the workouts. If you don't unlock noticeable upper-body strength and feel your core getting firmer, just email us at <strong className="text-white">boltlabs1@gmail.com</strong>. We will refund 100% of your ₹489 immediately. No questions asked. You keep all the PDFs & videos.
              </p>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="text-center pt-2">
            <button
              onClick={triggerConfetti}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/30 group cursor-pointer"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-black text-black group-hover:rotate-12 transition-transform" />
              <span>GET INSTANT ACCESS FOR ₹489</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Instant Delivery on Email & Screen
              </span>
              <span>•</span>
              <span>UPI (GPay, PhonePe, Paytm) & Cards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
