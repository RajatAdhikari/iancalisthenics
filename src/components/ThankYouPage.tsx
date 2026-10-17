import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  FolderDown, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  Zap, 
  Lock, 
  AlertCircle,
  HelpCircle,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RAZORPAY_CONFIG } from '../config/payment';
import {
  findExistingOrder,
  savePaidOrder,
  getPendingOrder,
  verifyOrderWithServer,
} from '../utils/customerOrders';
import { trackPurchase } from '../utils/metaPixel';

interface OrderData {
  paymentId: string;
  email: string;
  phone: string;
  hasBump?: boolean;
  hasHeightBump?: boolean;
  hasWellnessBump?: boolean;
  amount: number;
  timestamp: number;
  token?: string;
  isReturning?: boolean;
}

interface ThankYouPageProps {
  initialOrder?: OrderData | null;
  onReturnHome?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ initialOrder, onReturnHome }) => {
  const [order, setOrder] = useState<OrderData | null>(initialOrder || null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [manualPaymentId, setManualPaymentId] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [upgradingItem, setUpgradingItem] = useState<'height' | 'wellness' | null>(null);

  // Load order data from session or storage or URL params
  useEffect(() => {
    // Fire celebratory confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (initialOrder) {
      setOrder(initialOrder);
      savePaidOrder(initialOrder);
      return;
    }

    try {
      // 1. Try URL query params first (e.g. ?payment_id=pay_xxx&bump=1 or ?razorpay_payment_id=pay_xxx)
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('payment_id') || params.get('razorpay_payment_id');
      if (pid && pid.startsWith('pay_')) {
        const matchedLocal = findExistingOrder('', pid);
        if (matchedLocal) {
          setOrder(matchedLocal);
          savePaidOrder(matchedLocal);
          return;
        }

        // Verify payment ID live with Razorpay API before unlocking
        setIsVerifying(true);
        verifyOrderWithServer({ paymentId: pid })
          .then((liveOrder) => {
            if (liveOrder) {
              setOrder(liveOrder);
              savePaidOrder(liveOrder);
            }
          })
          .finally(() => setIsVerifying(false));
        return;
      }

      // 2. Try sessionStorage
      const sessionStored = sessionStorage.getItem('ian_calisthenics_order');
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        setOrder(parsed);
        return;
      }

      // 3. Try localStorage
      const localStored = localStorage.getItem('ian_calisthenics_last_order');
      if (localStored) {
        const parsed = JSON.parse(localStored);
        setOrder(parsed);
        return;
      }

      // 4. Try pending UPI order verification against Razorpay server
      const pending = getPendingOrder();
      if (pending && pending.orderId) {
        setIsVerifying(true);
        verifyOrderWithServer({
          orderId: pending.orderId,
        })
          .then((liveOrder) => {
            if (liveOrder) {
              setOrder(liveOrder);
            }
          })
          .finally(() => setIsVerifying(false));
      }
    } catch (e) {
      console.error('Error loading order data:', e);
    }
  }, [initialOrder]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => {
      setCopiedLink(null);
    }, 2500);
  };

  // Anti-cheat verification fallback: if someone opens /thank-you directly
  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');

    const trimmedInput = manualPaymentId.trim();
    const trimmedEmail = manualEmail.trim();

    if (!trimmedInput && !trimmedEmail) {
      setVerificationError('Please enter your Razorpay Payment ID, Phone Number, or Email');
      return;
    }

    // 1. Check if phone or email or Payment ID matches a known paid order
    const matched = findExistingOrder(trimmedEmail, trimmedInput);
    if (matched) {
      setOrder(matched);
      savePaidOrder(matched);
      confetti({ particleCount: 100, spread: 70 });
      return;
    }

    setIsVerifying(true);
    try {
      // 2. Verify live against Razorpay API (by Payment ID, Phone, or Email)
      const liveVerified = await verifyOrderWithServer({
        paymentId: trimmedInput.startsWith('pay_') ? trimmedInput : undefined,
        email: trimmedEmail,
        phone: trimmedInput,
      });

      if (liveVerified) {
        setOrder(liveVerified);
        savePaidOrder(liveVerified);
        confetti({ particleCount: 100, spread: 70 });
        return;
      }

      setVerificationError(
        'No verified Razorpay payment found for those details. Please enter the exact Phone Number, Email, or Payment ID ("pay_...") used during payment.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Post-purchase 1-click upsell: Height Maxxing Protocol (₹149)
  const handleUpgradeHeight = async () => {
    if (!order) return;
    setUpgradingItem('height');

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK is loading. Please try again in a moment.');
      setUpgradingItem(null);
      return;
    }

    const upgradeAmount = RAZORPAY_CONFIG.heightBumpPrice || 149;
    let upgradeOrderId: string | undefined = undefined;
    try {
      const upRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: upgradeAmount,
          currency: RAZORPAY_CONFIG.currency,
          receipt: `rcpt_ty_h_${Date.now()}`,
          keyId: RAZORPAY_CONFIG.keyId,
          notes: {
            parent_payment_id: order.paymentId,
            customer_email: order.email,
            customer_phone: order.phone,
            upgrade_type: 'Height Maxxing Protocol (₹149)',
            height_bump_selected: 'Yes',
          },
        }),
      });
      const upData = await upRes.json().catch(() => ({}));
      if (upRes.ok && upData.orderId) {
        upgradeOrderId = upData.orderId;
      }
    } catch (e) {}

    const options: any = {
      key: RAZORPAY_CONFIG.keyId,
      amount: upgradeAmount * 100, // paise
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.companyName,
      description: 'Upgrade: Height Maxxing Protocol',
      image: window.location.origin + '/images/height-maxxing-thumb.jpg',
      prefill: {
        email: order.email,
        contact: order.phone,
      },
      notes: {
        parent_payment_id: order.paymentId,
        customer_email: order.email,
        customer_phone: order.phone,
        upgrade_type: 'Height Maxxing Protocol (₹149)',
        height_bump_selected: 'Yes',
      },
      theme: {
        color: '#06b6d4',
      },
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          fetch('/api/capture-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: upgradeAmount,
              currency: RAZORPAY_CONFIG.currency,
              keyId: RAZORPAY_CONFIG.keyId,
            }),
          }).catch(() => {});
        }

        // Track ₹149 Height Maxxing Upgrade on Meta Pixel
        trackPurchase({
          paymentId: response.razorpay_payment_id || `pay_ty_h_${Date.now()}`,
          email: order.email,
          phone: order.phone,
          hasBump: true,
          hasHeightBump: true,
          amount: upgradeAmount,
        });

        setUpgradingItem(null);
        const upgradedOrder: OrderData = {
          ...order,
          hasHeightBump: true,
          hasBump: true,
          amount: order.amount + upgradeAmount,
          paymentId: `${order.paymentId} + ${response.razorpay_payment_id || 'pay_h_up'}`,
        };
        setOrder(upgradedOrder);
        savePaidOrder(upgradedOrder);
        confetti({ particleCount: 120, spread: 80 });
      },
      modal: {
        ondismiss: function () {
          setUpgradingItem(null);
        },
      },
    };

    if (upgradeOrderId) {
      options.order_id = upgradeOrderId;
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setUpgradingItem(null);
      alert('Unable to launch checkout. Please refresh and try again.');
    }
  };

  // Post-purchase 1-click upsell: Sexual Wellness Secrets (₹149)
  const handleUpgradeWellness = async () => {
    if (!order) return;
    setUpgradingItem('wellness');

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK is loading. Please try again in a moment.');
      setUpgradingItem(null);
      return;
    }

    const upgradeAmount = RAZORPAY_CONFIG.wellnessBumpPrice || 149;
    let upgradeOrderId: string | undefined = undefined;
    try {
      const upRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: upgradeAmount,
          currency: RAZORPAY_CONFIG.currency,
          receipt: `rcpt_ty_w_${Date.now()}`,
          keyId: RAZORPAY_CONFIG.keyId,
          notes: {
            parent_payment_id: order.paymentId,
            customer_email: order.email,
            customer_phone: order.phone,
            upgrade_type: 'Sexual Wellness Secrets You Want to Know (₹149)',
            wellness_bump_selected: 'Yes',
          },
        }),
      });
      const upData = await upRes.json().catch(() => ({}));
      if (upRes.ok && upData.orderId) {
        upgradeOrderId = upData.orderId;
      }
    } catch (e) {}

    const options: any = {
      key: RAZORPAY_CONFIG.keyId,
      amount: upgradeAmount * 100, // paise
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.companyName,
      description: 'Upgrade: Sexual Wellness Secrets You Want to Know',
      image: window.location.origin + '/images/sexual-wellness-thumb.jpg',
      prefill: {
        email: order.email,
        contact: order.phone,
      },
      notes: {
        parent_payment_id: order.paymentId,
        customer_email: order.email,
        customer_phone: order.phone,
        upgrade_type: 'Sexual Wellness Secrets You Want to Know (₹149)',
        wellness_bump_selected: 'Yes',
      },
      theme: {
        color: '#f59e0b',
      },
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          fetch('/api/capture-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: upgradeAmount,
              currency: RAZORPAY_CONFIG.currency,
              keyId: RAZORPAY_CONFIG.keyId,
            }),
          }).catch(() => {});
        }

        // Track ₹149 Sexual Wellness Upgrade on Meta Pixel
        trackPurchase({
          paymentId: response.razorpay_payment_id || `pay_ty_w_${Date.now()}`,
          email: order.email,
          phone: order.phone,
          hasBump: true,
          hasWellnessBump: true,
          amount: upgradeAmount,
        });

        setUpgradingItem(null);
        const upgradedOrder: OrderData = {
          ...order,
          hasWellnessBump: true,
          hasBump: true,
          amount: order.amount + upgradeAmount,
          paymentId: `${order.paymentId} + ${response.razorpay_payment_id || 'pay_w_up'}`,
        };
        setOrder(upgradedOrder);
        savePaidOrder(upgradedOrder);
        confetti({ particleCount: 120, spread: 80 });
      },
      modal: {
        ondismiss: function () {
          setUpgradingItem(null);
        },
      },
    };

    if (upgradeOrderId) {
      options.order_id = upgradeOrderId;
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setUpgradingItem(null);
      alert('Unable to launch checkout. Please refresh and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Brand Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button 
            onClick={onReturnHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-black text-black text-sm shadow-md">
              IB
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm sm:text-base block leading-none font-display">
                IAN BARSEAGLE
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold block mt-0.5">
                Official Access Portal
              </span>
            </div>
          </button>

          <button
            onClick={onReturnHome}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {!order ? (
          /* 🔒 Anti-Cheat Protection Card: When accessed without active payment session */
          <div className="p-6 sm:p-8 bg-zinc-900/90 border border-amber-500/40 rounded-3xl text-center space-y-5 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Order Verification Required
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Google Drive download links are restricted to verified buyers. If you recently paid via Razorpay, please enter your Phone Number or Payment ID below to unlock your materials:
              </p>
            </div>

            <form onSubmit={handleManualVerification} className="space-y-3 text-left">
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Mobile Number OR Razorpay Payment ID*
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9643063812 or pay_T1y5H8..."
                  value={manualPaymentId}
                  onChange={(e) => setManualPaymentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Email Address used during checkout (optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {verificationError && (
                <p className="text-red-400 text-xs flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {verificationError}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-950"
              >
                {isVerifying ? 'Verifying...' : 'Unlock My Access Links →'}
              </button>
            </form>

            <div className="pt-3 border-t border-zinc-800 text-center">
              <button
                type="button"
                onClick={onReturnHome}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                Haven't purchased yet? Click here to join the Masterclass for ₹489
              </button>
            </div>
          </div>
        ) : (
          /* ✅ Verified Order - Full Thank You Experience */
          <>
            {/* Success Celebration Banner */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                Payment Verified • Lifetime Access Activated
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
                Thank You For Your Enrollment! 🎉
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
                Welcome to the <strong>Ian Barseagle Calisthenics Mastery</strong>. Your Google Drive course access links have been generated below:
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-4 sm:p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Official Receipt</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                  VERIFIED PAID
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-zinc-300">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Payment ID</span>
                  <span className="font-mono text-emerald-400 font-medium break-all select-all">{order.paymentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Registered Email</span>
                  <span className="text-white font-medium break-all">{order.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Mobile Number</span>
                  <span className="text-white font-medium">{order.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Total Paid</span>
                  <span className="text-white font-black text-sm font-sans">₹{order.amount}</span>
                  <span className="text-[10px] text-zinc-400 ml-1">
                    ({order.hasHeightBump && (order.hasWellnessBump || order.hasBump)
                      ? 'Course + Height + Wellness'
                      : order.hasHeightBump
                      ? 'Course + Height Maxxing'
                      : order.hasWellnessBump || order.hasBump
                      ? 'Course + Sexual Wellness'
                      : 'Calisthenics Course Only'})
                  </span>
                </div>
              </div>
            </div>

            {/* 🌟 DOWNLOAD & GOOGLE DRIVE ACCESS LINKS SECTION 🌟 */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                    <FolderDown className="w-6 h-6 text-emerald-400" />
                    <span>Your Google Drive Access Links</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Click the buttons below to open your Drive folder or copy the links to save them on your device.
                  </p>
                </div>
              </div>

              {/* PRODUCT 1: Ian Barseagle Calisthenics Mastery (Always available for paid users) */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-emerald-500/50 rounded-3xl shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/40">
                      <FolderDown className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                          Main Program • Unlocked
                        </span>
                        <span className="text-[10px] text-zinc-400 font-sans">₹489 Lifetime Access</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                        Ian Barseagle Calisthenics Mastery
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Contains all <strong>Zero to Advanced Video Tutorials</strong> (Muscle-ups, Planche, Handstands, Levers), progression sheets, and the complete <strong>Indian Veg & Non-Veg High-Protein Diet Blueprint</strong>.
                </p>

                {/* Direct Google Drive Link Box */}
                <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                    Google Drive Link:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={RAZORPAY_CONFIG.courseDriveLink}
                      className="flex-1 bg-zinc-900/90 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 truncate focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(RAZORPAY_CONFIG.courseDriveLink, 'course')}
                      className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                      title="Copy Link to Clipboard"
                    >
                      {copiedLink === 'course' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <a
                    href={RAZORPAY_CONFIG.courseDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-center"
                  >
                    <span>👉 Open Calisthenics Drive Folder</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* PRODUCT 2: Height Maxxing Protocol (Position 1 Bump • Unlocked or 1-Click Upgrade) */}
              {order.hasHeightBump ? (
                <div className="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-cyan-400/60 rounded-3xl shadow-2xl relative overflow-hidden space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-400/40">
                        <Sparkles className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded">
                            #1 Add-on • Unlocked
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sans">₹149 Special Offer Added</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                          Height Maxxing Protocol
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Complete natural vertical growth blueprint, spinal decompression routines, posture correction guides, and human growth hormone (HGH) sleep & nutrition optimization.
                  </p>

                  {/* Direct Google Drive Link Box */}
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                      Google Drive Link:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={RAZORPAY_CONFIG.heightDriveLink}
                        className="flex-1 bg-zinc-900/90 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 truncate focus:outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(RAZORPAY_CONFIG.heightDriveLink, 'height')}
                        className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                        title="Copy Link to Clipboard"
                      >
                        {copiedLink === 'height' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href={RAZORPAY_CONFIG.heightDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 text-center"
                    >
                      <span>👉 Open Height Maxxing Drive Folder</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                /* 🔒 Height Maxxing NOT Purchased - Safe Post-Purchase Upsell Box */
                <div className="p-5 sm:p-6 bg-zinc-950/80 border-2 border-dashed border-cyan-500/40 rounded-3xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-cyan-400/40">
                        <img
                          src="/images/height-maxxing-thumb.jpg"
                          alt="Height Maxxing Protocol"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                          Available Add-On • 1-Click Access
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white font-display mt-0.5">
                          Height Maxxing Protocol
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white font-sans">₹149</span>
                      <span className="text-[10px] line-through text-zinc-500 block font-sans">₹6,499</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    You skipped this offer at checkout. If you want to add the <strong>Height Maxxing Protocol</strong> now for just ₹149, click below to unlock your Google Drive folder instantly:
                  </p>

                  <button
                    type="button"
                    onClick={handleUpgradeHeight}
                    disabled={upgradingItem === 'height'}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950 active:scale-95 disabled:opacity-60"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{upgradingItem === 'height' ? 'Launching Checkout...' : 'Unlock Height Maxxing for ₹149 Now →'}</span>
                  </button>
                </div>
              )}

              {/* PRODUCT 3: Sexual Wellness Secrets (Position 2 Bump • Unlocked or 1-Click Upgrade) */}
              {(order.hasWellnessBump || order.hasBump) ? (
                <div className="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-400/60 rounded-3xl shadow-2xl relative overflow-hidden space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-400/40">
                        <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
                            #2 Add-on • Unlocked
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sans">Special Offer Added</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                          Sexual Wellness Secrets You Want to Know
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Complete men's vitality blueprints, natural blood flow and circulation enhancement routines, testosterone & hormonal mastery, and peak physical endurance habits.
                  </p>

                  {/* Direct Google Drive Link Box */}
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                      Google Drive Link:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={RAZORPAY_CONFIG.wellnessDriveLink}
                        className="flex-1 bg-zinc-900/90 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 truncate focus:outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(RAZORPAY_CONFIG.wellnessDriveLink, 'wellness')}
                        className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                        title="Copy Link to Clipboard"
                      >
                        {copiedLink === 'wellness' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-amber-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href={RAZORPAY_CONFIG.wellnessDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 text-center"
                    >
                      <span>👉 Open Sexual Wellness Drive Folder</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                /* 🔒 Sexual Wellness NOT Purchased - Safe Post-Purchase Upsell Box */
                <div className="p-5 sm:p-6 bg-zinc-950/80 border-2 border-dashed border-amber-500/40 rounded-3xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-amber-400/40">
                        <img
                          src="/images/sexual-wellness-thumb.jpg"
                          alt="Sexual Wellness Secrets You Want to Know"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          Available Add-On • 1-Click Access
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white font-display mt-0.5">
                          Sexual Wellness Secrets You Want to Know
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white font-sans">₹149</span>
                      <span className="text-[10px] line-through text-zinc-500 block font-sans">₹7,800</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    You skipped this offer at checkout. If you want to add the <strong>Sexual Wellness Secrets</strong> program now for just ₹149, click below to unlock your Google Drive folder instantly:
                  </p>

                  <button
                    type="button"
                    onClick={handleUpgradeWellness}
                    disabled={upgradingItem === 'wellness'}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950 active:scale-95 disabled:opacity-60"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{upgradingItem === 'wellness' ? 'Launching Checkout...' : 'Unlock Sexual Wellness Secrets for ₹149 Now →'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Next Steps & Instructions */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3 text-xs text-zinc-300">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Important Access Tips:</span>
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-zinc-400 leading-relaxed">
                <li>
                  <strong>Save / Bookmark this URL:</strong> You can bookmark this page or copy your Google Drive link to access your workouts anytime from mobile or laptop.
                </li>
                <li>
                  <strong>Offline Access:</strong> In Google Drive, you can click "Download" on video modules or PDF diet sheets to practice outdoors without an internet connection.
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span><strong>Customer Support:</strong> If you face any access issues, simply contact us at <a href={`mailto:${RAZORPAY_CONFIG.supportEmail}`} className="text-emerald-400 underline font-semibold">{RAZORPAY_CONFIG.supportEmail}</a> with your Payment ID <span className="font-mono text-white font-semibold">({order.paymentId})</span>.</span>
                </li>
              </ul>
            </div>

            {/* Done & Return Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onReturnHome}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Course Homepage</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 space-y-1">
        <p>© {new Date().getFullYear()} Ian Barseagle Calisthenics Mastery. All rights reserved.</p>
        <p className="text-[11px] text-zinc-600">
          Official Support: <a href={`mailto:${RAZORPAY_CONFIG.supportEmail}`} className="text-emerald-400/80 hover:underline">{RAZORPAY_CONFIG.supportEmail}</a> • Secured with 256-Bit SSL Encryption via Razorpay Payments.
        </p>
      </footer>
    </div>
  );
};
