import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ExternalLink, 
  Copy, 
  Check, 
  FolderDown, 
  Flame,
  Zap
} from 'lucide-react';
import { RAZORPAY_CONFIG } from '../config/payment';
import { findExistingOrder, savePaidOrder } from '../utils/customerOrders';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface OrderData {
  paymentId: string;
  email: string;
  phone: string;
  hasBump: boolean;
  amount: number;
  timestamp: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (order: OrderData) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasBump, setHasBump] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Key ID & Key Secret handling (allows pasting directly in UI or config)
  const [customKey, setCustomKey] = useState('');
  const [customSecret, setCustomSecret] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('razorpay_key_id');
    if (saved && (saved.includes('DEMO') || !saved.startsWith('rzp_'))) {
      localStorage.removeItem('razorpay_key_id');
      setCustomKey('');
    } else if (saved) {
      setCustomKey(saved);
    }

    const savedSecret = localStorage.getItem('razorpay_key_secret');
    if (savedSecret) {
      setCustomSecret(savedSecret);
    }
  }, []);

  if (!isOpen) return null;

  // Check if returning customer
  const existingOrder = findExistingOrder(email, phone);

  const activeKey = customKey.trim() || RAZORPAY_CONFIG.keyId;
  const activeSecret = customSecret.trim() || RAZORPAY_CONFIG.keySecret || '';
  const isKeyPlaceholder = activeKey === 'rzp_live_DEMO_KEY' || activeKey.includes('DEMO_KEY') || !activeKey.startsWith('rzp_');

  const basePrice = RAZORPAY_CONFIG.basePrice; // 489
  const bumpPrice = RAZORPAY_CONFIG.bumpPrice; // 99
  const totalAmount = hasBump ? basePrice + bumpPrice : basePrice; // 588 or 489

  const validate = () => {
    const newErrors: { email?: string; phone?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'This field is mandatory';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'This field is mandatory';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => {
      setCopiedLink(null);
    }, 2500);
  };

  const saveCustomKey = (keyToSave: string, secretToSave?: string) => {
    const trimmed = keyToSave.trim();
    if (trimmed) {
      setCustomKey(trimmed);
      localStorage.setItem('razorpay_key_id', trimmed);
    }
    if (secretToSave !== undefined) {
      const trimmedSecret = secretToSave.trim();
      setCustomSecret(trimmedSecret);
      localStorage.setItem('razorpay_key_secret', trimmedSecret);
    }
    setShowKeyInput(false);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // 🚀 RETURNING CUSTOMER CHECK: If details match an existing payment, redirect directly to thank you page!
    if (existingOrder) {
      // If customer already owns everything OR did not select bump, redirect directly!
      if (!hasBump || existingOrder.hasBump) {
        if (onPaymentSuccess) {
          onPaymentSuccess(existingOrder);
        }
        handleClose();
        return;
      }

      // If customer already owns base course and wants to add bump offer now, charge only ₹99!
      const upgradeAmount = bumpPrice;
      setIsProcessing(true);
      let upgradeOrderId: string | undefined = undefined;
      try {
        const upRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: upgradeAmount,
            currency: RAZORPAY_CONFIG.currency,
            receipt: `rcpt_up_${Date.now()}`,
            keyId: activeKey,
            keySecret: activeSecret,
            notes: {
              customer_email: email,
              customer_phone: phone,
              upgrade_type: 'Big Banana Maxxing Bump Offer (₹99)',
              parent_payment: existingOrder.paymentId,
            },
          }),
        });
        const upData = await upRes.json().catch(() => ({}));
        if (upRes.ok && upData.orderId) {
          upgradeOrderId = upData.orderId;
        }
      } catch (e) {} finally {
        setIsProcessing(false);
      }

      const options: any = {
        key: activeKey,
        amount: upgradeAmount * 100, // 9900 paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.companyName,
        description: 'Upgrade: Big Banana Maxxing Men\'s Protocol',
        image: window.location.origin + '/images/ian-hero-physique.jpg',
        prefill: {
          email: email,
          contact: phone.startsWith('+91') ? phone : '+91' + phone,
        },
        notes: {
          customer_email: email,
          customer_phone: phone,
          upgrade_type: 'Big Banana Maxxing Bump Offer (₹99)',
          parent_payment: existingOrder.paymentId,
        },
        theme: {
          color: '#3b82f6',
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
                keyId: activeKey,
                keySecret: activeSecret,
              }),
            }).catch(() => {});
          }

          const upgradedOrder: OrderData = {
            paymentId: `${existingOrder.paymentId} + ${response.razorpay_payment_id || 'pay_bump_upgrade'}`,
            email: email,
            phone: phone.startsWith('+91') ? phone : '+91' + phone,
            hasBump: true,
            amount: existingOrder.amount + 99,
            timestamp: Date.now()
          };
          savePaidOrder(upgradedOrder);
          if (onPaymentSuccess) {
            onPaymentSuccess(upgradedOrder);
          }
          handleClose();
        }
      };

      if (upgradeOrderId) {
        options.order_id = upgradeOrderId;
      }

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (err: any) {
        alert('Failed to launch Razorpay: ' + err.message);
        return;
      }
    }

    // If key is a placeholder or not provided, prompt user to enter key or test
    if (isKeyPlaceholder) {
      setShowKeyInput(true);
      return;
    }

    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    setIsProcessing(true);

    // 🚀 ORDERS API INTEGRATION: Create order with payment: { capture: 'automatic' }
    let orderId: string | undefined = undefined;
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: RAZORPAY_CONFIG.currency,
          receipt: `rcpt_${Date.now()}`,
          keyId: activeKey,
          keySecret: activeSecret,
          notes: {
            customer_email: email,
            customer_phone: phone,
            bump_selected: hasBump ? 'Yes (Big Banana Maxxing ₹99)' : 'No',
            total_inr: `₹${totalAmount}`,
          },
        }),
      });

      const orderData = await orderRes.json().catch(() => ({}));
      if (orderRes.ok && orderData.orderId) {
        orderId = orderData.orderId;
      } else if (orderData.code === 'MISSING_KEY_SECRET') {
        console.warn('Razorpay Key Secret not set yet — opening Key Secret setup for Auto-Capture');
      }
    } catch (err) {
      console.warn('Orders API endpoint unavailable, proceeding with direct payment:', err);
    } finally {
      setIsProcessing(false);
    }

    const options: any = {
      key: activeKey,
      amount: totalAmount * 100, // paise (48900 or 58800)
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.companyName,
      description: hasBump
        ? 'Calisthenics Masterclass + Big Banana Maxxing'
        : 'Ian Barseagle Calisthenics Masterclass (Lifetime Access)',
      image: window.location.origin + '/images/ian-hero-physique.jpg',
      prefill: {
        email: email,
        contact: phone.startsWith('+91') ? phone : '+91' + phone,
      },
      notes: {
        customer_email: email,
        customer_phone: phone,
        bump_selected: hasBump ? 'Yes (Big Banana Maxxing ₹99)' : 'No',
        total_inr: `₹${totalAmount}`,
      },
      theme: {
        color: '#10b981',
      },
      handler: function (response: any) {
        // Redundancy: Attempt background auto-capture if API is active
        if (response.razorpay_payment_id) {
          fetch('/api/capture-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: totalAmount,
              currency: RAZORPAY_CONFIG.currency,
              keyId: activeKey,
              keySecret: activeSecret,
            }),
          }).catch(() => {});
        }

        const orderData: OrderData = {
          paymentId: response.razorpay_payment_id || 'pay_live_verified',
          email: email,
          phone: phone.startsWith('+91') ? phone : '+91' + phone,
          hasBump: hasBump,
          amount: totalAmount,
          timestamp: Date.now()
        };

        // Persist order so customer is recognized in future visits
        savePaidOrder(orderData);

        setIsSuccess(true);
        setPaymentId(orderData.paymentId);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        // Trigger redirection to thank you page
        if (onPaymentSuccess) {
          onPaymentSuccess(orderData);
        }
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay modal closed');
        },
      },
    };

    // Attach order_id to enable automatic capture
    if (orderId) {
      options.order_id = orderId;
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(
          'Payment Error from Razorpay: ' +
            (response.error.description || response.error.code || 'Please verify your Key ID in Razorpay Dashboard')
        );
      });
      rzp.open();
    } catch (err: any) {
      alert('Failed to launch Razorpay: ' + err.message);
    }
  };

  const simulateTestPayment = () => {
    if (!validate()) return;
    const testPid = 'pay_demo_' + Math.floor(Math.random() * 899999 + 100000);
    const orderData: OrderData = {
      paymentId: testPid,
      email: email,
      phone: phone.startsWith('+91') ? phone : '+91' + phone,
      hasBump: hasBump,
      amount: totalAmount,
      timestamp: Date.now()
    };

    savePaidOrder(orderData);

    setIsSuccess(true);
    setPaymentId(testPid);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    if (onPaymentSuccess) {
      onPaymentSuccess(orderData);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail('');
    setPhone('');
    setHasBump(false);
    setErrors({});
    setShowKeyInput(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl text-zinc-100 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Payment Success State with Direct Google Drive Delivery Links */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white font-display">
              Payment Successful! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Thank you for enrolling in <strong>Ian Barseagle Calisthenics Mastery</strong>.
            </p>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-left space-y-1">
              <p className="text-zinc-400">Payment ID: <span className="font-mono text-emerald-400 font-bold">{paymentId}</span></p>
              <p className="text-zinc-400">Sent to: <span className="text-white font-medium">{email}</span></p>
              <p className="text-zinc-400">Amount Paid: <span className="text-white font-bold">₹{totalAmount}</span></p>
            </div>

            {/* Direct Google Drive Unlocked Links in Modal */}
            <div className="space-y-3 text-left pt-1">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FolderDown className="w-4 h-4 text-emerald-400" />
                <span>Your Unlocked Course Folders:</span>
              </h4>

              {/* Product 1: Calisthenics Masterclass Drive Link */}
              <div className="p-3 bg-zinc-950 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Calisthenics Masterclass
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(RAZORPAY_CONFIG.courseDriveLink, 'modal-course')}
                    className="text-[10px] text-zinc-300 hover:text-white bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink === 'modal-course' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'modal-course' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <a
                  href={RAZORPAY_CONFIG.courseDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>👉 Open Calisthenics Drive Folder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Product 2: Big Banana Maxxing Drive Link (ONLY IF BUMP WAS PURCHASED) */}
              {hasBump && (
                <div className="p-3 bg-zinc-950 border border-blue-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-blue-400 fill-blue-400" />
                      Big Banana Maxxing (Bump Offer)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(RAZORPAY_CONFIG.bumpDriveLink, 'modal-bump')}
                      className="text-[10px] text-zinc-300 hover:text-white bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink === 'modal-bump' ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink === 'modal-bump' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <a
                    href={RAZORPAY_CONFIG.bumpDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <span>👉 Open Big Banana Maxxing Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  if (onPaymentSuccess) {
                    onPaymentSuccess({
                      paymentId,
                      email,
                      phone,
                      hasBump,
                      amount: totalAmount,
                      timestamp: Date.now()
                    });
                  }
                  handleClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Go to Full Thank You Page →</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                Close & Return to Site
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  Instant Access Checkout
                </span>
                {/* Security Trust Badge / Key Pill */}
                {isKeyPlaceholder ? (
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    title="Configure Razorpay Key ID"
                  >
                    <Key className="w-3 h-3" />
                    <span>Set Key ID</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 cursor-pointer hover:opacity-80"
                    title="Click to configure Razorpay Auto-Capture Key Secret"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit Encrypted</span>
                  </button>
                )}
              </div>

              <h3 className="text-xl font-black text-white font-display mt-2">
                Ian Barseagle Calisthenics Mastery
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Access to this purchase will be sent to this email
              </p>
            </div>

            {/* 🌟 RETURNING CUSTOMER ACTIVE MEMBERSHIP DETECTED BANNER 🌟 */}
            {existingOrder && (
              <div className="mb-4 p-3.5 bg-emerald-950/70 border border-emerald-500/60 rounded-2xl space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-emerald-300 text-xs sm:text-sm">
                        Active Membership Found! 🎉
                      </h5>
                      <span className="text-[10px] text-zinc-400">
                        Payment ID: <span className="font-mono text-white">{existingOrder.paymentId}</span>
                      </span>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                    PAID
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-snug">
                  Aapne is mobile number/email par pehle hi enrollment complete kar liya hai. <strong>Aapko dobara payment karne ki zarurat nahi hai!</strong>
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (onPaymentSuccess) {
                      onPaymentSuccess(existingOrder);
                    }
                    handleClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950 cursor-pointer"
                >
                  <span>👉 Access Your Unlocked Google Drive Folders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Razorpay Key Input Dropdown if Needed (Developer/Admin Mode) */}
            {showKeyInput && (
              <div className="mb-4 p-3.5 bg-zinc-950 border border-amber-500/50 rounded-2xl text-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      Razorpay Auto-Capture Keys Setup
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Auto-Capture (Order ID) ke liye apna <strong>Razorpay Key Secret</strong> niche paste karein (Dashboard ➔ Account & Settings ➔ API Keys).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowKeyInput(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Key ID (rzp_live_TkVGwV6gWcnuAO)"
                    value={customKey || activeKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Paste Razorpay Key Secret here..."
                      value={customSecret}
                      onChange={(e) => setCustomSecret(e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-amber-500/60 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => saveCustomKey(customKey || activeKey, customSecret)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
                  <a
                    href="https://dashboard.razorpay.com/app/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Get Key Secret from Razorpay <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    type="button"
                    onClick={simulateTestPayment}
                    className="text-amber-300 hover:underline font-semibold"
                  >
                    ⚡ Test Free Simulation
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-950 border ${
                    errors.email ? 'border-red-500 text-red-100' : 'border-zinc-700/80'
                  } focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-zinc-500 transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-zinc-700/80 bg-zinc-800 text-zinc-300 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="Phone number *"
                    className={`w-full px-4 py-3 rounded-r-xl bg-zinc-950 border ${
                      errors.phone ? 'border-red-500 text-red-100' : 'border-zinc-700/80'
                    } focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-zinc-500 transition-colors`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* 🌟 Order Bump Offer Box (Blue dashed border matching user's design) 🌟 */}
              <div
                onClick={() => setHasBump(!hasBump)}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-3 sm:p-3.5 transition-all ${
                  hasBump
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-950/50'
                    : 'border-blue-500/60 bg-blue-950/20 hover:border-blue-400 hover:bg-blue-950/30'
                }`}
              >
                <div className="flex gap-3">
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-blue-400/40">
                    <img
                      src="/images/bump-thumbnail.jpg"
                      alt="Big Banana Maxxing"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h4 className="font-extrabold text-white text-sm leading-tight">
                      Big Banana Maxxing
                    </h4>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug line-clamp-3">
                      Unlock your full potential with a program designed for men's wellness, featuring benefits like boosted confidence, vitality, and peak performance...
                    </p>
                  </div>
                </div>

                {/* Price & Checkbox Button */}
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-blue-500/20">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-white font-sans">₹99</span>
                    <span className="text-xs line-through text-zinc-400 font-sans">₹7,800</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-zinc-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasBump}
                      onChange={(e) => setHasBump(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-zinc-400 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Avail the offer</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="pt-2 border-t border-zinc-800 space-y-1 text-xs text-zinc-300">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Sub Total</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through">₹14,700</span>
                    <span className="text-white font-semibold font-sans">₹489</span>
                  </div>
                </div>

                {hasBump && (
                  <div className="flex justify-between items-center text-blue-300">
                    <span>Big Banana Maxxing Bump</span>
                    <span className="font-semibold font-sans">+ ₹99</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-base font-black text-white pt-1.5 border-t border-zinc-800/80">
                  <span>Total</span>
                  <span className="text-emerald-400 text-lg font-sans">₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit Button */}
              {existingOrder && (!hasBump || existingOrder.hasBump) ? (
                /* Returning Customer - Direct Access Button (NO Razorpay call) */
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>Access Unlocked Course (Already Paid) →</span>
                </button>
              ) : existingOrder && hasBump && !existingOrder.hasBump ? (
                /* Returning Customer who owns base course and wants to unlock bump for ₹99 */
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-white font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-950 mt-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-white" />
                  <span>Pay ₹99 To Unlock Bump Offer →</span>
                </button>
              ) : (
                /* New Customer - Regular Get It Now */
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-95 disabled:opacity-70 text-black font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/40 group mt-2 cursor-pointer"
                >
                  <span>{isProcessing ? 'Connecting Razorpay...' : 'Get it now'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Delivery • 100% Secured by Razorpay UPI & Cards</span>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
