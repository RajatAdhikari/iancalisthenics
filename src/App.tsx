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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Urgency Countdown Top Bar */}
      <TopUrgencyBanner />

      {/* 2. Top Navigation */}
      <Navbar />

      {/* 3. Hero Section */}
      <HeroSection />

      {/* 4. Storyline & Authority (Ian's philosophy, gym vs calisthenics, inclusivity) */}
      <AuthorityStory />

      {/* 5. Calisthenics Skills Showcase (Muscle-ups, Planche, Handstand) */}
      <SkillShowcase />

      {/* 6. Complete 5-Pillar Curriculum (Zero Foundation to Indian Diet) */}
      <CurriculumPillars />

      {/* 7. Student Results & Real Proof (Enfy & JAH2303 community wins) */}
      <StudentResults />

      {/* 8. Offer Stack & Pricing (₹15,000 -> ₹489 anchor) */}
      <OfferPricing />

      {/* 9. Frequently Asked Questions */}
      <FaqSection />

      {/* 10. Meta & Google Ads Compliant Legal Footer & Modals */}
      <AdComplianceModal />

      {/* 11. Mobile Sticky Bottom CTA */}
      <StickyMobileBar />

      {/* 12. Live Sales Notifications (10 Indian Real-Time Buyers) */}
      <LiveSalesNotification />
    </div>
  );
};

export default App;
