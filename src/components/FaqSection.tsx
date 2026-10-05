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
    q: 'Is course ko lene ke baad kya mujhe kuch aur buy karne ki zaroorat padegi?',
    a: 'Nahi! Ye ek all-in-one comprehensive package hai. Isme full video masterclass, step-by-step skill drills, joint bulletproofing aur complete Indian diet plan included hai. Iske baad aapko kisi gym trainer, machine ya expensive supplement ki zaroorat nahi padegi.'
  },
  {
    q: 'USA me ₹15,000 ka course India me sirf ₹489 me kyu diya ja raha hai?',
    a: 'Ye hamara special India Launch Promotional Offer hai taaki Indian fitness community ko world-class calisthenics accessible banaya ja sake. Ye offer sirf first batch ke liye hai aur limited spots bache hain, jiske baad price wapas regular ho jayega.'
  },
  {
    q: 'Payment ke baad mujhe access kaise aur kab milega?',
    a: 'Instant access! Jaise hi aap Superprofile par payment complete karenge, aapke registered email address par instant login link aur course dashboard open ho jayega. Aap mobile ya laptop kisi par bhi turant start kar sakte hain.'
  },
  {
    q: 'Diet plan me kya Indian food items included hain?',
    a: 'Haan, bilkul! Diet chart khas Indian kitchens ke budget aur availability ko dhyan me rakh kar banaya gaya hai. Paneer, Roti, Dal, Soya, Chana, Sattu, Dahi, Eggs aur Chicken ke sath meal plans hain jo daily follow karna behad aasan hai.'
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
