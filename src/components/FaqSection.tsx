import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Kya ye program girls aur women ke liye bhi suitable hai?',
    a: 'Bilkul! Calisthenics ladies ke liye sabse best aur natural workout hai. Is masterclass me ek dedicated Female Athlete Blueprint module hai jo bina heavy ya bulky traps banaye, slim athletic waist, firm toned arms, back posture aur core strength develop karta hai.'
  },
  {
    q: 'Agar mujhse 1 bhi push-up ya pull-up nahi hota toh kya main kar paunga?',
    a: 'Haan, 100%! Ye program isi tarah design kiya gaya hai. Isme Zero-Level Regressions hain—jaise wall push-ups, incline push-ups, negative pull-ups aur dead-hangs. Aap pehle din se safely start kar sakte hain bina kisi joint pain ke.'
  },
  {
    q: 'Kya isme koi monthly subscription ya recurring charge hai?',
    a: 'Nahi! Ye strictly ek baar ka one-time payment hai (₹489). Iske baad koi auto-debit, monthly fee ya hidden subscription charges nahi hain. Aapko lifetime access milta hai sabhi videos aur PDFs ke sath.'
  },
  {
    q: 'Payment ke baad access kaise aur kab milega? Kya videos offline download ho sakte hain?',
    a: 'Instant 1-Second Access! Jaise hi aap Razorpay (UPI, GPay, PhonePe, Paytm ya Card) se payment karenge, aap turant screen par verified Google Drive course folders me enter ho jayenge. Saath hi aapke email aur WhatsApp par bhi access link send hoga. Sabhi MP4 video lessons aur PDF charts aap apne phone ya laptop me 100% offline save/download kar sakte hain.'
  },
  {
    q: 'Daily kitna time nikalna hoga? Mera college / office schedule busy hai.',
    a: 'Har routine laser-focused 35 se 45 minute ka hai, hafte me sirf 4 din. Isme koi 2 ghante gym me bhatakne ki zaroorat nahi hai. Aap subah ya shaam ghar ke room ya kisi bhi nearby park me asani se complete kar sakte hain.'
  },
  {
    q: 'Diet plan me kya Indian food items included hain? Main hostel me rehta hoon.',
    a: 'Haan, bilkul! Diet chart khas Indian kitchens aur hostel students ke budget (₹80-₹120/day) ko dhyan me rakh kar banaya gaya hai. Paneer, Roti, Dal, Soya chunks, Sprouts, Chana, Dahi, Eggs aur Chicken ke sath easy home meals hain jo bina expensive whey protein ke bhi 120-140g protein daily provide karte hain.'
  },
  {
    q: '30-Day Money-Back Guarantee kaise work karti hai?',
    a: 'Agar aap 30 din tak program follow karte hain aur aapko apni body me measurable strength aur muscle definition me improvement nahi dikhta, toh bas humein boltlabs1@gmail.com par ek simple email bhej dijiye. Hum bina koi sawal pooche aapka 100% payment (₹489) refund kar denge. Sabhi PDFs aur videos aapke paas rahenge. Aapka risk 0% hai.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-[#09090b] border-t border-zinc-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            Got Questions? <span className="text-gradient-emerald">We Have Answers.</span>
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Aapke sabhi doubts ka clear aur transparent jawab.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <span className="font-bold text-white text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-400' : 'text-zinc-500'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
