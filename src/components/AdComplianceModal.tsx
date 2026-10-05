import React, { useState } from 'react';
import { Shield, X, FileText, AlertCircle, HelpCircle } from 'lucide-react';

export const AdComplianceModal: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'refund' | 'disclaimer' | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* Footer Navigation Bar */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-zinc-300 font-medium">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('refund')}
              className="hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
            >
              Refund Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('disclaimer')}
              className="hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
            >
              Health Disclaimer
            </button>
          </div>

          {/* Mandatory Meta & Google Ads Disclaimers */}
          <div className="max-w-4xl mx-auto space-y-4 text-center text-zinc-500 leading-relaxed text-[11px]">
            <p>
              <strong>Disclaimer for Meta / Facebook:</strong> This site is NOT a part of the Facebook website or Meta Platforms, Inc. Additionally, this site is NOT endorsed by Meta in any way. FACEBOOK is a trademark of META PLATFORMS, Inc.
            </p>
            <p>
              <strong>Disclaimer for Google Ads:</strong> The results stated above are real experiences from actual students. Results may vary depending on individual starting point, genetics, dedication, and consistency. No physical fitness outcome is guaranteed without adherence.
            </p>
            <p>
              <strong>Medical Advisory:</strong> The content provided in this masterclass is for educational purposes only. Always consult a physician or certified healthcare professional before beginning any vigorous physical workout or nutritional program.
            </p>
            <p className="pt-4 border-t border-zinc-900 text-zinc-600">
              © {new Date().getFullYear()} Ian Barseagle Calisthenics Masterclass. All Rights Reserved. Official checkout powered by Superprofile.
            </p>
          </div>
        </div>
      </footer>

      {/* Pop-up Modals for Legal Pages */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-zinc-300 text-xs sm:text-sm leading-relaxed">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Privacy Policy */}
            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-base font-bold">
                  <Shield className="w-5 h-5" />
                  <h3>Privacy Policy (Meta & Google Compliant)</h3>
                </div>
                <p><strong>Effective Date:</strong> January 2026</p>
                <p>
                  We respect your privacy and are committed to protecting personal data. This privacy policy explains how we collect and process your information when you access our calisthenics masterclass.
                </p>
                <h4 className="font-bold text-white pt-2">1. Information We Collect</h4>
                <p>
                  When you purchase the program via our checkout partner Superprofile, we collect your name, email address, and phone number for delivery of digital course materials and transactional receipts. We do not store sensitive payment card details; all payments are processed through RBI-approved PCI-DSS compliant payment gateways.
                </p>
                <h4 className="font-bold text-white pt-2">2. Cookies & Advertising Pixels</h4>
                <p>
                  We utilize standard Google Analytics and Meta (Facebook) Conversion Pixels to measure advertising campaign effectiveness and provide relevant recommendations. You can opt out of tracking anytime via your browser settings.
                </p>
                <h4 className="font-bold text-white pt-2">3. Data Security & Third Parties</h4>
                <p>
                  We never sell, trade, or rent your personal contact information to third-party marketing brokers. Your information is used strictly for course delivery and customer support.
                </p>
              </div>
            )}

            {/* Terms of Service */}
            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-base font-bold">
                  <FileText className="w-5 h-5" />
                  <h3>Terms of Service & Licensing</h3>
                </div>
                <p>
                  By enrolling in the Ian Barseagle Calisthenics Program, you agree to the following terms:
                </p>
                <h4 className="font-bold text-white pt-2">1. Intellectual Property & Personal License</h4>
                <p>
                  All video tutorials, PDF roadmaps, diet charts, and curriculum materials are the proprietary intellectual property of Ian Barseagle. Enrollment grants you a single-user personal, non-transferable license. Reselling, recording, re-uploading, or redistributing these videos is strictly prohibited and subject to legal copyright action.
                </p>
                <h4 className="font-bold text-white pt-2">2. Digital Product Delivery</h4>
                <p>
                  Access is delivered immediately upon successful payment verification via Superprofile to the email address provided during checkout.
                </p>
              </div>
            )}

            {/* Refund Policy */}
            {activeModal === 'refund' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-base font-bold">
                  <AlertCircle className="w-5 h-5" />
                  <h3>Refund & Cancellation Policy</h3>
                </div>
                <p>
                  Due to the immediate digital nature of our downloadable video curriculum, PDF guides, and diet blueprints, all sales at the promotional India Launch rate of ₹489 are considered final once digital download credentials have been generated and dispatched.
                </p>
                <p>
                  However, if you experience any technical difficulty accessing your course dashboard or video links, our support team will resolve it within 24 hours. Contact us through your Superprofile order invoice.
                </p>
              </div>
            )}

            {/* Health Disclaimer */}
            {activeModal === 'disclaimer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-base font-bold">
                  <HelpCircle className="w-5 h-5" />
                  <h3>Health & Medical Advisory Disclaimer</h3>
                </div>
                <p>
                  Calisthenics involves intense physical bodyweight exertion, isometric holds, and joint loading. You should be in good physical condition and able to participate in physical exercise before starting.
                </p>
                <p>
                  Ian Barseagle and this website are not medical doctors. The advice, workouts, and diet protocols provided are intended solely for educational and athletic purposes. Always seek the advice of your physician before starting any new exercise or nutrition program.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-800 text-right">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
