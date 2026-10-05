import React from 'react';
import { Zap, Instagram, Youtube } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-black text-black text-sm sm:text-base shadow-md">
            IB
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-sm sm:text-lg block leading-none font-display">
              IAN BARSEAGLE
            </span>
            <span className="text-[9px] sm:text-xs text-emerald-400 uppercase tracking-wider font-semibold block mt-0.5">
              Official Calisthenics Program
            </span>
          </div>
        </div>

        {/* Social Authority Badge */}
        <div className="hidden md:flex items-center gap-4 bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs text-zinc-300">
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>700K+ Followers</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>900K+ Subscribers</span>
          </div>
        </div>

        {/* Quick CTA */}
        <a
          href="https://superprofile.bio/vp/calisthenics"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-400 transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 group"
        >
          <Zap className="w-3.5 h-3.5 fill-black text-black group-hover:rotate-12 transition-transform" />
          <span>Claim ₹489 Offer</span>
        </a>
      </div>
    </nav>
  );
};
