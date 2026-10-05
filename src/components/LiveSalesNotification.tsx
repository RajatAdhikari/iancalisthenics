import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface BuyerNotification {
  name: string;
  city: string;
  item: string;
  timeAgo: string;
  avatar: string;
}

const BUYERS: BuyerNotification[] = [
  {
    name: 'Ritik Tiwari',
    city: 'Mumbai, Maharashtra',
    item: 'Full Calisthenics Mastery + Indian Diet Blueprint',
    timeAgo: '2 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Aman Sharma',
    city: 'New Delhi',
    item: 'Unlocked Beginner to Advanced Video Course',
    timeAgo: '4 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sneha Patel',
    city: 'Ahmedabad, Gujarat',
    item: 'Enrolled in Female Calisthenics & Tone Guide',
    timeAgo: '6 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rohan Deshmukh',
    city: 'Pune, Maharashtra',
    item: 'Purchased at ₹489 (97% Discount Claimed)',
    timeAgo: '8 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Priya Nair',
    city: 'Bengaluru, Karnataka',
    item: 'Started 90-Day Calisthenics Transformation',
    timeAgo: '11 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Harsh Verma',
    city: 'Lucknow, Uttar Pradesh',
    item: 'Unlocked Muscle-Up & Planche Video Guide',
    timeAgo: '14 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Arjun Singh',
    city: 'Jaipur, Rajasthan',
    item: 'Enrolled in Full Course + Nutrition Chart',
    timeAgo: '16 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ananya Roy',
    city: 'Kolkata, West Bengal',
    item: 'Joined Ian Barseagle Masterclass',
    timeAgo: '19 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Vivek Choudhary',
    city: 'Chandigarh',
    item: 'Claimed Instant Access for ₹489',
    timeAgo: '23 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pooja Reddy',
    city: 'Hyderabad, Telangana',
    item: 'Unlocked Full Program & Veg Diet Chart',
    timeAgo: '27 minutes ago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  }
];

export const LiveSalesNotification: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial popup after 2 seconds
    const initialTimeout = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);

    // Auto rotate every 8 seconds
    const interval = setInterval(() => {
      if (!dismissed) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % BUYERS.length);
          setIsVisible(true);
        }, 1200);
      }
    }, 8500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [dismissed]);

  const currentBuyer = BUYERS[currentIndex];

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[340px] pointer-events-auto">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative bg-zinc-900/95 border border-emerald-500/40 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl shadow-emerald-950/50 flex items-start gap-3 text-zinc-100"
          >
            {/* Close button */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full p-1 border border-zinc-700 shadow transition-colors"
              title="Close notification"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Buyer Avatar & Verified Dot */}
            <div className="relative flex-shrink-0">
              <img
                src={currentBuyer.avatar}
                alt={currentBuyer.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/60 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 text-black">
                <CheckCircle2 className="w-3 h-3 fill-emerald-400 text-black" />
              </span>
            </div>

            {/* Notification Text */}
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="font-bold text-white tracking-tight flex items-center gap-1">
                  {currentBuyer.name}
                  <span className="text-[10px] text-zinc-400 font-normal">({currentBuyer.city.split(',')[0]})</span>
                </p>
                <span className="text-[10px] text-emerald-400 font-mono font-medium">{currentBuyer.timeAgo}</span>
              </div>
              <p className="text-zinc-300 font-medium leading-snug line-clamp-1">
                {currentBuyer.item}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400/90 font-medium">
                <ShoppingBag className="w-3 h-3 text-emerald-400" />
                <span>Verified India Buyer • Instant Access</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
