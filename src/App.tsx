import React, { useState, useEffect } from 'react';
import { TopUrgencyBanner } from './components/TopUrgencyBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AuthorityStory } from './components/AuthorityStory';
import { SkillShowcase } from './components/SkillShowcase';
import { CurriculumPillars } from './components/CurriculumPillars';
import { StudentResults } from './components/StudentResults';
import { OfferPricing } from './components/OfferPricing';
import { FaqSection } from './components/FaqSection';
import { ProgressionLadder } from './components/ProgressionLadder';
import { ComparisonTable } from './components/ComparisonTable';
import { ExitIntentModal } from './components/ExitIntentModal';
import { AdComplianceModal } from './components/AdComplianceModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { CheckoutModal, OrderData } from './components/CheckoutModal';
import { ThankYouPage } from './components/ThankYouPage';
import { trackInitiateCheckout, trackPurchase } from './utils/metaPixel';
import { getPendingOrder, verifyOrderWithServer, savePaidOrder } from './utils/customerOrders';

export const App: React.FC = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'thank-you'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (
        path.includes('thank-you') ||
        search.get('page') === 'thank-you' ||
        search.get('payment_id') ||
        search.get('razorpay_payment_id') ||
        hash === '#thank-you'
      ) {
        return 'thank-you';
      }
    }
    return 'landing';
  });

  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  const handlePaymentSuccess = (order: OrderData) => {
    savePaidOrder(order);
    trackPurchase(order);
    setCompletedOrder(order);
    setIsCheckoutOpen(false);
    setCurrentPage('thank-you');
    try {
      const url = `/thank-you?payment_id=${order.paymentId}&bump=${order.hasBump ? '1' : '0'}`;
      window.history.pushState({ page: 'thank-you', order }, '', url);
    } catch (e) {
      window.location.hash = '#thank-you';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (
        path.includes('thank-you') ||
        search.get('page') === 'thank-you' ||
        search.get('payment_id') ||
        search.get('razorpay_payment_id') ||
        hash === '#thank-you'
      ) {
        setCurrentPage('thank-you');
      } else {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // 🔄 Automatic Mobile UPI Return Watcher:
  // If a customer switched to GPay/PhonePe/Paytm/iMobile and their mobile browser tab reloaded or backgrounded,
  // automatically verify their pending order with Razorpay as soon as they return to the page!
  useEffect(() => {
    let isChecking = false;

    const checkPendingUpiPayment = async () => {
      if (isChecking || currentPage === 'thank-you') return;
      const pending = getPendingOrder();
      if (!pending) return;

      isChecking = true;
      try {
        const verified = await verifyOrderWithServer({
          orderId: pending.orderId,
          email: pending.email,
          phone: pending.phone,
        });
        if (verified) {
          handlePaymentSuccess(verified);
        }
      } finally {
        isChecking = false;
      }
    };

    // Check immediately on mount (in case mobile browser reloaded after UPI app switch)
    checkPendingUpiPayment();

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkPendingUpiPayment();
      }
    };

    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('visibilitychange', onVisibilityOrFocus);

    const interval = setInterval(() => {
      if (getPendingOrder()) {
        checkPendingUpiPayment();
      }
    }, 4000);

    return () => {
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
      clearInterval(interval);
    };
  }, [currentPage]);

  const openCheckout = () => {
    trackInitiateCheckout(489, false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleReturnHome = () => {
    setCurrentPage('landing');
    try {
      window.history.pushState({}, '', '/');
    } catch (e) {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing Thank You Page
  if (currentPage === 'thank-you') {
    return <ThankYouPage initialOrder={completedOrder} onReturnHome={handleReturnHome} />;
  }

  // Otherwise render Main Landing Page
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Unified Sticky Header: Top Urgency Bar + Navbar together so they NEVER overlap */}
      <header className="sticky top-0 z-40 w-full shadow-lg">
        <TopUrgencyBanner />
        <Navbar onOpenCheckout={openCheckout} />
      </header>

      {/* Hero Section (With mobile-first physique image & auto-playing video) */}
      <HeroSection onOpenCheckout={openCheckout} />

      {/* Storyline & Authority (Ian's philosophy, gym vs calisthenics, inclusivity) */}
      <AuthorityStory onOpenCheckout={openCheckout} />

      {/* 🚀 NEW: Level 0 to Superhuman Progression Ladder (Eliminates beginner intimidation) */}
      <ProgressionLadder onOpenCheckout={openCheckout} />

      {/* Calisthenics Skills Showcase (Muscle-ups, Planche, Handstand) */}
      <SkillShowcase onOpenCheckout={openCheckout} />

      {/* Complete 5-Pillar Curriculum (Zero Foundation to Indian Diet) */}
      <CurriculumPillars onOpenCheckout={openCheckout} />

      {/* ⚡ NEW: "Free YouTube vs. Ian Barseagle Masterclass" (Eliminates "Why pay?" objection) */}
      <ComparisonTable onOpenCheckout={openCheckout} />

      {/* Student Results & Real Proof (Celebrity Hrithik benchmark + Enfy & JAH2303 community wins) */}
      <StudentResults onOpenCheckout={openCheckout} />

      {/* Offer Stack & Pricing (₹15,000 -> ₹489 anchor + 30-Day Guarantee + 4 Free Bonuses) */}
      <OfferPricing onOpenCheckout={openCheckout} />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Meta & Google Ads Compliant Legal Footer & Modals */}
      <AdComplianceModal />

      {/* Mobile Sticky Bottom CTA */}
      <StickyMobileBar onOpenCheckout={openCheckout} />

      {/* Live Sales Notifications (10 Indian Real-Time Buyers) */}
      <LiveSalesNotification />

      {/* 🛑 NEW: Exit-Intent Recovery Modal (Catches abandoning visitors) */}
      <ExitIntentModal onOpenCheckout={openCheckout} />

      {/* 🚀 High-Converting Direct Razorpay Checkout Modal With Order Bump Offer 🚀 */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={closeCheckout} 
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
};

export default App;
