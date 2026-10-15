import React from 'react';
import { Zap, Instagram, Youtube, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout }) => {
  return (
    <nav className="border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black text-xs sm:text-sm shadow-md shadow-emerald-500/20">
            IB
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base block font-display">
                IAN BARSEAGLE
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block mt-0.5">
              Official Calisthenics Masterclass
            </span>
          </div>
        </div>

        {/* Social Authority Badge */}
        <div className="hidden md:flex items-center gap-4 bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 rounded-full text-xs text-zinc-300 shadow-sm">
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>700K+ Followers</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>900K+ Subscribers</span>
          </div>
        </div>

        {/* Quick CTA */}
        <button
          onClick={onOpenCheckout}
          className="relative inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-500/25 group cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-black text-black group-hover:rotate-12 transition-transform" />
          <span>Get Access • ₹489</span>
        </button>
      </div>
    </nav>
  );
};
