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
import { AdComplianceModal } from './components/AdComplianceModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { CheckoutModal, OrderData } from './components/CheckoutModal';
import { ThankYouPage } from './components/ThankYouPage';
import { trackInitiateCheckout, trackPurchase } from './utils/metaPixel';

export const App: React.FC = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'thank-you'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (path.includes('thank-you') || search.get('page') === 'thank-you' || hash === '#thank-you') {
        return 'thank-you';
      }
    }
    return 'landing';
  });

  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (path.includes('thank-you') || search.get('page') === 'thank-you' || hash === '#thank-you') {
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

  const openCheckout = () => {
    trackInitiateCheckout(489, false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handlePaymentSuccess = (order: OrderData) => {
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

      {/* Hero Section (With mobile-first physique image right under headline) */}
      <HeroSection onOpenCheckout={openCheckout} />

      {/* Storyline & Authority (Ian's philosophy, gym vs calisthenics, inclusivity) */}
      <AuthorityStory onOpenCheckout={openCheckout} />

      {/* Calisthenics Skills Showcase (Muscle-ups, Planche, Handstand) */}
      <SkillShowcase onOpenCheckout={openCheckout} />

      {/* Complete 5-Pillar Curriculum (Zero Foundation to Indian Diet) */}
      <CurriculumPillars onOpenCheckout={openCheckout} />

      {/* Student Results & Real Proof (Enfy & JAH2303 community wins) */}
      <StudentResults onOpenCheckout={openCheckout} />

      {/* Offer Stack & Pricing (₹15,000 -> ₹489 anchor) */}
      <OfferPricing onOpenCheckout={openCheckout} />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Meta & Google Ads Compliant Legal Footer & Modals */}
      <AdComplianceModal />

      {/* Mobile Sticky Bottom CTA */}
      <StickyMobileBar onOpenCheckout={openCheckout} />

      {/* Live Sales Notifications (10 Indian Real-Time Buyers) */}
      <LiveSalesNotification />

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
