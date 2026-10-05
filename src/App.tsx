import React from 'react';
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

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Unified Sticky Header: Top Urgency Bar + Navbar together so they NEVER overlap */}
      <header className="sticky top-0 z-40 w-full shadow-lg">
        <TopUrgencyBanner />
        <Navbar />
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Storyline & Authority (Ian's philosophy, gym vs calisthenics, inclusivity) */}
      <AuthorityStory />

      {/* Calisthenics Skills Showcase (Muscle-ups, Planche, Handstand) */}
      <SkillShowcase />

      {/* Complete 5-Pillar Curriculum (Zero Foundation to Indian Diet) */}
      <CurriculumPillars />

      {/* Student Results & Real Proof (Enfy & JAH2303 community wins) */}
      <StudentResults />

      {/* Offer Stack & Pricing (₹15,000 -> ₹489 anchor) */}
      <OfferPricing />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Meta & Google Ads Compliant Legal Footer & Modals */}
      <AdComplianceModal />

      {/* Mobile Sticky Bottom CTA */}
      <StickyMobileBar />

      {/* Live Sales Notifications (10 Indian Real-Time Buyers) */}
      <LiveSalesNotification />
    </div>
  );
};

export default App;
