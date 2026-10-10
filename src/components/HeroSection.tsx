import React from 'react';
import { ShieldCheck, Star, Zap, Check, ArrowRight, Sparkles, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onOpenCheckout?: () => void;
}

const HeroImageCard: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <div className={`relative mx-auto ${isMobile ? 'max-w-[300px] sm:max-w-sm' : 'max-w-sm sm:max-w-md lg:max-w-none'}`}>
    {/* Glowing Frame */}
    <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/80 bg-zinc-900 group">
      <img
        src="/images/ian-hero-physique.jpg"
        alt="Ian Barseagle Aesthetic Calisthenics Physique"
        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* Creator Badge on Image */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-xs sm:text-base tracking-wide flex items-center gap-1.5">
              Ian Barseagle
              <span className="bg-emerald-500 text-black text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                PRO ATHLETE
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
              700K+ Instagram • 900K+ YouTube
            </p>
          </div>
          <div className="text-right">
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">
              METHODOLOGY
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-zinc-200">
              100% Bodyweight
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Floating Stat Badge */}
    <div className={`absolute ${isMobile ? '-top-2 -left-1 p-1.5' : '-top-3 -left-3 sm:-left-6 p-2.5 sm:p-3'} bg-zinc-900/95 border border-zinc-700 backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-2`}>
      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
      </div>
      <div>
        <span className="text-[8px] sm:text-[9px] uppercase font-semibold text-zinc-400 block">Community</span>
        <span className="text-[11px] sm:text-sm font-extrabold text-white font-sans">1.6 Million+</span>
      </div>
    </div>

    {/* Floating Guarantee Badge (Placed at Top-Right so bottom bar stays 100% unobstructed) */}
    <div className={`absolute ${isMobile ? '-top-2 -right-1 p-1.5' : '-top-3 -right-3 sm:-right-5 p-2.5 sm:p-3'} bg-zinc-900/95 border border-amber-500/40 backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-2`}>
      <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
        <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
      </div>
      <div>
        <span className="text-[8px] sm:text-[9px] uppercase font-semibold text-amber-400 block">Zero to Advance</span>
        <span className="text-[11px] sm:text-xs font-bold text-white">Men & Women</span>
      </div>
    </div>
  </div>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCheckout }) => {
  const handleCtaClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  return (
    <section className="relative pt-4 pb-12 sm:pt-6 sm:pb-14 md:pt-14 md:pb-24 overflow-hidden bg-radial-gradient">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Rating and Social Proof Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-300 shadow-inner">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-white font-sans">4.9/5</span>
            <span className="text-zinc-500">|</span>
            <span className="text-emerald-400 font-semibold">14,200+ Transformed Students</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Suitable for Men & Women/Girls</span>
          </div>
        </div>

        {/* Main Grid: Headline & Media */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Direct Response Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-white font-display uppercase">
              Build A <span className="text-gradient-emerald">Greek-God</span> Physique Without Gyms Or Heavy Weights
            </h1>

            {/* 📱 MOBILE HERO IMAGE: Placed right here under headline so mobile users immediately see the physique photo! */}
            <div className="block lg:hidden my-4">
              <HeroImageCard isMobile={true} />
            </div>

            <p className="mt-3 lg:mt-4 text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Master gravity. Unlock superhuman moves like <strong className="text-white">Muscle-Ups, Planche, & Handstands</strong> while shredding stubborn fat with <strong className="text-emerald-400">Ian Barseagle’s</strong> step-by-step video roadmap + complete <strong className="text-white">Indian Diet Plan</strong>.
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-w-xl mx-auto lg:mx-0 text-left text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>Zero to Advance Video Tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>Custom Indian Veg & Non-Veg Diet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>No Gym Equipment / Park & Home</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>Dedicated Female Tone & Core Track</span>
              </div>
            </div>

            {/* Price Box Anchor */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-md max-w-xl mx-auto lg:mx-0 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">USA Price:</span>
                    <span className="text-xs sm:text-sm line-through text-red-400 font-bold font-sans">₹15,000 ($180)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1 justify-center sm:justify-start">
                    <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">₹489</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      97% OFF Today
                    </span>
                    <span className="text-[11px] text-zinc-400">One-Time</span>
                  </div>
                </div>

                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-sm sm:text-base text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/25 group cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black text-black group-hover:scale-110 transition-transform" />
                  <span>GET INSTANT ACCESS</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Instant Email Delivery
              </span>
              <span>•</span>
              <span>100% Secured by Razorpay</span>
              <span>•</span>
              <span>Lifetime Access</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 relative mt-4 lg:mt-0">
            <HeroImageCard isMobile={false} />
          </div>
        </div>
      </div>
    </section>
  );
};
