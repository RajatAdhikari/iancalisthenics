import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Star,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  FolderOpen,
  FileText,
  Play,
  Film,
  CheckCircle2,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onOpenCheckout?: () => void;
}

type ClipStage = 0 | 1 | 2 | 3;

const DRIVE_ITEMS = [
  {
    type: 'folder',
    name: 'ian-barseagle (Main Masterclass Folder)',
    meta: 'Shared Folder • Lifetime Access',
    size: '4.8 GB'
  },
  {
    type: 'folder',
    name: '01_Muscle_Up_&_Explosive_Pull_Mastery',
    meta: '14 HD Video Lessons • Zero to Strict Muscle-Up',
    size: '1.4 GB'
  },
  {
    type: 'folder',
    name: '02_Handstand_Planche_&_Front_Lever',
    meta: '18 HD Video Lessons • Balance & Straight-Arm Strength',
    size: '1.9 GB'
  },
  {
    type: 'folder',
    name: '03_Home_&_Park_Greek_God_Workouts',
    meta: '12 Follow-Along Routines • Men & Women Tracks',
    size: '1.1 GB'
  },
  {
    type: 'video',
    name: 'Slow_Strict_Muscle_Up_Form_Breakdown.mp4',
    meta: '1080p 60fps HD Video • Form & False Grip Secrets',
    size: '148 MB'
  },
  {
    type: 'video',
    name: 'Handstand_&_Planche_Zero_To_Advance.mp4',
    meta: '1080p 60fps HD Video • Step-by-Step Drills',
    size: '215 MB'
  },
  {
    type: 'pdf',
    name: 'Ian_Barseagle_Complete_Workout_Blueprint.pdf',
    meta: 'Illustrated PDF Guide • Weekly Sets, Reps & Rest',
    size: '28.4 MB'
  },
  {
    type: 'pdf',
    name: 'Indian_Veg_&_NonVeg_Shred_Diet_Book.pdf',
    meta: 'PDF Nutrition Guide • Budget Home & Hostel Meals',
    size: '19.2 MB'
  }
];

const HeroVideoReelCard: React.FC<{ isMobile?: boolean; onOpenCheckout?: () => void }> = ({
  isMobile,
  onOpenCheckout
}) => {
  // Stage 0: Real Slow Muscle-Up Video (0 - 8.5s)
  // Stage 1: Planche & Handstand Skill Clip (8.5 - 11s)
  // Stage 2: Shredded Physique Clip (11 - 13s)
  // Stage 3: 4-Second Google Drive Folders & PDF Screen Recording Preview (13 - 17s)
  const [stage, setStage] = useState<ClipStage>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [manualLock, setManualLock] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (manualLock) return;

    const durations: Record<ClipStage, number> = {
      0: 8500, // 8.5s real slow muscle-up video clip
      1: 2500, // 2.5s planche & handstand skill breakdown
      2: 2000, // 2.0s physique transformation clip
      3: 4200  // 4.2s scrolling inside Google Drive folders & PDF guide
    };

    const timer = setTimeout(() => {
      setStage((prev) => ((prev + 1) % 4) as ClipStage);
    }, durations[stage]);

    return () => clearTimeout(timer);
  }, [stage, manualLock]);

  useEffect(() => {
    if (stage === 0 && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [stage]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const selectStage = (targetStage: ClipStage) => {
    setStage(targetStage);
    setManualLock(true);
    setTimeout(() => setManualLock(false), 12000);
  };

  return (
    <div
      className={`relative mx-auto ${
        isMobile ? 'max-w-[330px] sm:max-w-sm' : 'max-w-sm sm:max-w-md lg:max-w-none'
      }`}
    >
      {/* Top Non-Overlapping Info Bar (Placed cleanly above the video box so nothing overlaps) */}
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <div className="bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-md rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-[8px] uppercase font-semibold text-zinc-400 block leading-none">
              Community
            </span>
            <span className="text-[11px] font-extrabold text-white font-sans leading-tight">
              1.6M+ Followers
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => selectStage(3)}
          className="bg-zinc-900/95 hover:bg-zinc-800 border border-amber-500/40 backdrop-blur-md rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-[8px] uppercase font-semibold text-amber-400 block leading-none">
              Google Drive
            </span>
            <span className="text-[11px] font-bold text-white leading-tight">
              Videos + PDF
            </span>
          </div>
        </button>
      </div>

      {/* Glowing Video Frame */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/90 bg-zinc-950 group">
        {/* Top Story Progress Bars (4-Clip 15-Second Reel) */}
        <div className="absolute top-3 left-3.5 right-3.5 z-30 flex items-center gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectStage(idx as ClipStage)}
              aria-label={`Preview clip ${idx + 1}`}
              className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stage === idx
                    ? 'w-full bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : stage > idx
                    ? 'w-full bg-emerald-500/80'
                    : 'w-0 bg-transparent'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Top Status Pill + Mute Toggle (Unobstructed!) */}
        <div className="absolute top-6 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-extrabold text-white tracking-wide uppercase truncate">
              {stage === 0 && 'Clip 1/4 • Strict Slow Muscle-Up'}
              {stage === 1 && 'Clip 2/4 • Planche & Handstand'}
              {stage === 2 && 'Clip 3/4 • 100% Bodyweight Physique'}
              {stage === 3 && 'Clip 4/4 • Inside Google Drive & PDF'}
            </span>
          </div>

          {stage === 0 && (
            <button
              type="button"
              onClick={toggleMute}
              className="pointer-events-auto inline-flex items-center gap-1 bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg transition cursor-pointer flex-shrink-0"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tap Sound</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sound ON</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* MEDIA VIEWPORT (9:11 vertical reel aspect ratio for mobile & desktop) */}
        <div className="relative w-full aspect-[4/5] bg-zinc-950 overflow-hidden select-none">
          {/* STAGE 0: REAL MP4 VIDEO - SLOW MUSCLE UP */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              stage === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <video
              ref={videoRef}
              src="/videos/slow-muscle-up.mp4"
              poster="/images/ian-hero-physique.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>

          {/* STAGE 1: PLANCHE & HANDSTAND SKILL BREAKDOWN */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              stage === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src="/images/gallery-2.png"
              alt="Calisthenics Planche and Handstand Control"
              className="w-full h-full object-cover scale-105 animate-[pulse_4s_ease-in-out_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35" />
            <div className="absolute top-14 left-3.5 right-3.5 flex flex-wrap gap-1.5">
              <span className="bg-amber-400 text-black font-black text-[10px] px-2.5 py-1 rounded-md uppercase shadow">
                🔥 Skill Unlock #2: Planche & Handstand
              </span>
            </div>
          </div>

          {/* STAGE 2: GREEK-GOD PHYSIQUE TRANSFORMATION */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              stage === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src="/images/ian-hero-physique.jpg"
              alt="Ian Barseagle Aesthetic Calisthenics Physique"
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            />
            <div className="absolute top-14 left-3.5 bg-emerald-400 text-black font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-lg shadow-lg uppercase">
              💪 100% Bodyweight + Indian Shred Diet
            </div>
          </div>

          {/* STAGE 3: 4-SECOND LIVE SCREEN RECORDING INSIDE GOOGLE DRIVE FOLDERS & PDF GUIDE */}
          <div
            className={`absolute inset-0 bg-zinc-950 flex flex-col pt-14 pb-20 px-3 transition-opacity duration-500 ${
              stage === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Simulated Google Drive Browser Header */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-700/80 p-2.5 mb-2 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-zinc-300 truncate">
                    drive.google.com/drive/folders/ian-barseagle
                  </span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                  VERIFIED DRIVE
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800 pt-1.5">
                <span className="font-bold text-white flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  My Drive &gt; ian-barseagle
                </span>
                <span className="text-emerald-400 font-semibold">44 Videos + 2 PDFs</span>
              </div>
            </div>

            {/* Auto-Scrolling Google Drive File & PDF List */}
            <div className="flex-1 overflow-hidden relative rounded-xl bg-zinc-900/70 border border-zinc-800/90 p-2">
              <div
                className="space-y-1.5 transition-transform duration-[3800ms] ease-out"
                style={{
                  transform: stage === 3 ? 'translateY(-72px)' : 'translateY(0px)'
                }}
              >
                {DRIVE_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950/90 border border-zinc-800/80"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.type === 'folder' && (
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-4 h-4 text-amber-400" />
                        </div>
                      )}
                      {item.type === 'video' && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                          <Film className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      {item.type === 'pdf' && (
                        <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-rose-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                        <p className="text-[9px] text-zinc-400 truncate">{item.meta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                        {item.size}
                      </span>
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient Overlay at Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-20" />

          {/* Creator & Course Proof Badge on Bottom of Video */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 z-30 bg-zinc-950/90 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-white text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                  Ian Barseagle
                  <span className="bg-emerald-500 text-black text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    PRO ATHLETE
                  </span>
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                  700K+ Instagram • 900K+ YouTube
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectStage(stage === 3 ? 0 : 3)}
                className="text-right bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 transition cursor-pointer"
              >
                <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">
                  {stage === 3 ? '▶ WATCH SKILL VIDEO' : '📁 PROOF: INSIDE DRIVE'}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                  {stage === 3 ? 'Slow Muscle-Up Clip' : 'See Videos & PDFs'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Clip Switcher Pills Underneath Video */}
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() => selectStage(0)}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold border transition cursor-pointer ${
            stage === 0
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Muscle-Up Clip</span>
        </button>

        <button
          type="button"
          onClick={() => selectStage(1)}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold border transition cursor-pointer ${
            stage === 1 || stage === 2
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Planche & Skills</span>
        </button>

        <button
          type="button"
          onClick={() => selectStage(3)}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold border transition cursor-pointer ${
            stage === 3
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-3 h-3 text-amber-400" />
          <span>Inside Drive PDF</span>
        </button>
      </div>
    </div>
  );
};

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

            {/* 📱 MOBILE HERO VIDEO REEL + GOOGLE DRIVE PREVIEW: Auto-plays muted right below the headline! */}
            <div className="block lg:hidden my-4">
              <HeroVideoReelCard isMobile={true} onOpenCheckout={handleCtaClick} />
            </div>

            <p className="mt-3 lg:mt-4 text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Master gravity. Unlock superhuman moves like{' '}
              <strong className="text-white">Muscle-Ups, Planche, & Handstands</strong> while shredding stubborn fat with{' '}
              <strong className="text-emerald-400">Ian Barseagle’s</strong> step-by-step video roadmap + complete{' '}
              <strong className="text-white">Indian Diet Plan</strong>.
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-w-xl mx-auto lg:mx-0 text-left text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>Zero to Advance HD Video Tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span>Custom Indian Veg & Non-Veg Diet PDF</span>
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
                <span>Instant Google Drive Lifetime Access</span>
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
                Instant Google Drive & Email Delivery
              </span>
              <span>•</span>
              <span>100% Secured by Razorpay</span>
              <span>•</span>
              <span>Lifetime Access</span>
            </div>
          </div>

          {/* Right Column: Hero Video Reel + Google Drive Preview (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 relative mt-4 lg:mt-0">
            <HeroVideoReelCard isMobile={false} onOpenCheckout={handleCtaClick} />
          </div>
        </div>
      </div>
    </section>
  );
};
