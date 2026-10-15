// Meta (Facebook) Pixel & Manual Advanced Matching Utility
// Pixel Name: Rajat Adhikari - Pixel
// Pixel ID: 1377946710945110

export const META_PIXEL_ID = '1377946710945110';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    __FIRED_PURCHASES_SET__?: Set<string>;
  }
}

const FIRED_PURCHASES_KEY = 'ian_calisthenics_fired_pixel_purchases';

// All historical paid Razorpay IDs (Never fire duplicate Purchase on reload or returning visits)
const HISTORICAL_SEED_IDS = [
  'pay_To2uhIamEhY7tp',
  'pay_To1t47VBGbg96W',
  'pay_TnwlohwGqdbhEX',
  'pay_TnrVidmVvIH65L',
  'pay_Tnq05dMsqr64DG',
  'pay_TnkzjjrgjWLKwS',
  'pay_TngwwDwImWrgTK',
  'pay_Tnd0BFJwnkKliP',
  'pay_Tnbb2AjHpTgRBm',
  'pay_Tnb53bcZT7D7v9',
  'pay_TnO2t7e7fW2GqO',
  'pay_TnMVRJy3fa9Ugk',
  'pay_TnHbtILiUy3hRr',
  'pay_TnGtxyekdoiucP',
  'pay_TnEulTT9s9IWke',
  'pay_TnDl4l8pwCK23p',
  'pay_Tn0tfdBHiyoX0l',
  'pay_Tmw0IEo5gLTiPG',
  'pay_TmsUdcymj99Ijt',
  'pay_Tms9oAK8SVvN9K',
  'pay_TmquzRbPV77nGj',
  'pay_TmpHYATedSqIfB',
  'pay_TmneXhKOWkS1a8',
  'pay_TmdmqOWlC61nez',
  'pay_Tmb2z6a4byUqqn',
  'pay_TmYuNimbQrhZum',
  'pay_TmXbXZPVhDfE6j',
  'pay_TmXXXGoX2BX8sN',
  'pay_TmXXGDJLfY3IJU',
  'pay_TmUu1Ad11KUOOv',
  'pay_TmSbTfGtDaacLn',
  'pay_TmJVa7npM5Cawh',
  'pay_TmFaabXZQWOVjv',
  'pay_TmERJt2mAZ9sTf',
  'pay_TmBa1M7eHoACD2',
  'pay_TmAFmF2I37WvAG',
  'pay_Tm9WPF5eFrxlfn',
  'pay_T1y5H8hvhQsYV',
];

// Initialize in-memory set to guarantee zero duplicate fires even in private/in-app browsers
if (typeof window !== 'undefined') {
  if (!window.__FIRED_PURCHASES_SET__) {
    window.__FIRED_PURCHASES_SET__ = new Set<string>(HISTORICAL_SEED_IDS);
    try {
      const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
      if (raw) {
        const list: string[] = JSON.parse(raw);
        list.forEach((id) => window.__FIRED_PURCHASES_SET__?.add(id));
      }
    } catch {}
    try {
      const rawSession = sessionStorage.getItem(FIRED_PURCHASES_KEY);
      if (rawSession) {
        const list: string[] = JSON.parse(rawSession);
        list.forEach((id) => window.__FIRED_PURCHASES_SET__?.add(id));
      }
    } catch {}
  }
}

const hasPurchaseFired = (paymentId: string): boolean => {
  if (!paymentId) return true;
  if (HISTORICAL_SEED_IDS.includes(paymentId)) return true;
  if (typeof window !== 'undefined' && window.__FIRED_PURCHASES_SET__?.has(paymentId)) {
    return true;
  }
  try {
    const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (list.includes(paymentId)) return true;
  } catch {}
  try {
    const rawSession = sessionStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = rawSession ? JSON.parse(rawSession) : [];
    if (list.includes(paymentId)) return true;
  } catch {}
  return false;
};

const markPurchaseFired = (paymentId: string) => {
  if (!paymentId) return;
  if (typeof window !== 'undefined') {
    if (!window.__FIRED_PURCHASES_SET__) {
      window.__FIRED_PURCHASES_SET__ = new Set<string>();
    }
    window.__FIRED_PURCHASES_SET__.add(paymentId);
  }
  try {
    const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(paymentId)) {
      list.push(paymentId);
      localStorage.setItem(FIRED_PURCHASES_KEY, JSON.stringify(list));
    }
  } catch {}
  try {
    const rawSession = sessionStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = rawSession ? JSON.parse(rawSession) : [];
    if (!list.includes(paymentId)) {
      list.push(paymentId);
      sessionStorage.setItem(FIRED_PURCHASES_KEY, JSON.stringify(list));
    }
  } catch {}
};

// Format phone to E.164 digits without '+' (e.g., 919876543210) as required by Meta Advanced Matching
const formatMetaPhone = (phone: string): string => {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
};

const USER_INFO_KEY = 'ian_calisthenics_user_info';

/**
 * Sets Manual Advanced Matching parameters (em, ph, country) on the Meta Pixel
 */
export const setMetaAdvancedMatching = (email?: string, phone?: string) => {
  if (typeof window === 'undefined') return;

  try {
    let savedEm = '';
    let savedPh = '';
    try {
      const existing = JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null');
      if (existing) {
        savedEm = existing.em || '';
        savedPh = existing.ph || '';
      }
    } catch {}

    const cleanEmail = email && email.includes('@') ? email.trim().toLowerCase() : savedEm;
    const formattedPhone = phone ? formatMetaPhone(phone) : savedPh;
    const cleanPhone = formattedPhone && formattedPhone.length >= 10 ? formattedPhone : savedPh;

    if (cleanEmail || cleanPhone) {
      try {
        localStorage.setItem(
          USER_INFO_KEY,
          JSON.stringify({ em: cleanEmail, ph: cleanPhone })
        );
      } catch {}
    }

    if (typeof window.fbq === 'function') {
      const advancedMatching: Record<string, string> = {
        country: 'in',
      };
      if (cleanEmail) advancedMatching.em = cleanEmail;
      if (cleanPhone) advancedMatching.ph = cleanPhone;

      window.fbq('init', META_PIXEL_ID, advancedMatching);
    }
  } catch (e) {
    console.warn('Meta Advanced Matching error:', e);
  }
};

/**
 * Fires when user clicks any "Claim Offer" / "Get Instant Access" button to open the checkout modal
 */
export const trackInitiateCheckout = (amount = 489, hasBump = false) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    window.fbq('track', 'InitiateCheckout', {
      content_name: hasBump
        ? 'Ian Barseagle Calisthenics + Big Banana Maxxing'
        : 'Ian Barseagle Calisthenics Masterclass',
      content_category: 'Fitness & Calisthenics Course',
      content_ids: hasBump
        ? ['ian_calisthenics_489', 'big_banana_bump_99']
        : ['ian_calisthenics_489'],
      content_type: 'product',
      num_items: hasBump ? 2 : 1,
      value: amount,
      currency: 'INR',
    });
  } catch (e) {
    console.warn('Meta InitiateCheckout error:', e);
  }
};

/**
 * Fires when user checks the ₹99 Order Bump checkbox
 */
export const trackBumpAddToCart = () => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    window.fbq('track', 'AddToCart', {
      content_name: 'Big Banana Maxxing Bump Offer',
      content_ids: ['big_banana_bump_99'],
      content_type: 'product',
      value: 99,
      currency: 'INR',
    });
  } catch (e) {
    console.warn('Meta AddToCart error:', e);
  }
};

/**
 * Fires when user fills Email + Phone and clicks "Get it now" to launch Razorpay
 */
export const trackAddPaymentInfo = (email: string, phone: string, totalAmount: number, hasBump: boolean) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    setMetaAdvancedMatching(email, phone);

    window.fbq('track', 'Lead', {
      content_name: 'Ian Barseagle Calisthenics Checkout Lead',
      value: totalAmount,
      currency: 'INR',
    });

    window.fbq('track', 'AddPaymentInfo', {
      content_name: hasBump
        ? 'Ian Barseagle Calisthenics + Big Banana Maxxing'
        : 'Ian Barseagle Calisthenics Masterclass',
      content_ids: hasBump
        ? ['ian_calisthenics_489', 'big_banana_bump_99']
        : ['ian_calisthenics_489'],
      content_type: 'product',
      value: totalAmount,
      currency: 'INR',
    });
  } catch (e) {
    console.warn('Meta AddPaymentInfo error:', e);
  }
};

/**
 * Fires ONLY ONCE per verified Razorpay payment.
 * Guarded by In-Memory Set, SessionStorage, LocalStorage, Historical Seed list, and 15-minute freshness check.
 */
export const trackPurchase = (order: {
  paymentId: string;
  email?: string;
  phone?: string;
  amount: number;
  hasBump: boolean;
  timestamp?: number;
  isReturning?: boolean;
}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (!order || !order.paymentId) return;

  // Never fire for returning customer logins, manual looks, or test IDs
  if (order.isReturning) return;
  if (
    !order.paymentId.startsWith('pay_') ||
    order.paymentId.startsWith('pay_verified_') ||
    order.paymentId.startsWith('pay_demo_') ||
    order.paymentId === 'pay_live_verified'
  ) {
    return;
  }

  // Never fire if payment was created more than 15 minutes ago (prevents past orders from firing again)
  if (order.timestamp && Math.abs(Date.now() - order.timestamp) > 15 * 60 * 1000) {
    markPurchaseFired(order.paymentId);
    return;
  }

  // STRICT IN-MEMORY + STORAGE DEDUPLICATION:
  // If this payment was already fired anywhere in this session or in history, DO NOT FIRE!
  if (hasPurchaseFired(order.paymentId)) {
    return;
  }

  // Mark immediately before dispatching to block any concurrent async calls
  markPurchaseFired(order.paymentId);

  try {
    setMetaAdvancedMatching(order.email, order.phone);

    window.fbq(
      'track',
      'Purchase',
      {
        value: Number(order.amount) || 489,
        currency: 'INR',
        content_name: order.hasBump
          ? 'Ian Barseagle Calisthenics + Big Banana Maxxing Bundle'
          : 'Ian Barseagle Calisthenics Masterclass',
        content_category: 'Fitness & Calisthenics Course',
        content_type: 'product',
        content_ids: order.hasBump
          ? ['ian_calisthenics_489', 'big_banana_bump_99']
          : ['ian_calisthenics_489'],
        num_items: order.hasBump ? 2 : 1,
        order_id: order.paymentId,
      },
      { eventID: order.paymentId }
    );

    console.log(`[Meta Pixel] Verified Purchase tracked for ${order.paymentId} (₹${order.amount})`);
  } catch (e) {
    console.warn('Meta Purchase tracking error:', e);
  }
};
