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
const FAILED_PAYMENTS_KEY = 'ian_calisthenics_failed_payments';

// All historical paid Razorpay IDs (Never fire duplicate Purchase on reload or returning visits)
const HISTORICAL_SEED_IDS = [
  // 16 October 2026 captured payments
  'pay_ToYVYOQ9rZfGyE',
  'pay_ToYFY2yMHE8ov4',
  'pay_ToWb0CEXyep57Q',
  'pay_ToW6pe1XVBwy4R',
  'pay_ToUdGsKBUFYeL4',
  'pay_ToTA2xvvIUjL6S',
  'pay_ToRvS2L3CI6cmn',
  'pay_ToQ24vniEUgJsK',
  'pay_ToOoq1XyhjHSqZ',
  'pay_ToJFZ69mqlzUKv',
  // 15 October 2026 captured payments
  'pay_ToEqpOmRTssDwB',
  'pay_ToElMHHCBATXi5',
  'pay_To87F4DmDKpxI3',
  'pay_To2uhIamEhY7tp',
  'pay_To1t47VBGbg96W',
  // 14 October 2026 & earlier captured payments
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

// Explicit blocklist of known failed/cancelled Razorpay payments (MUST NEVER TRIGGER PURCHASE)
const HISTORICAL_FAILED_IDS = [
  'pay_ToZhaW1LPKbSIe',
  'pay_ToXikOGvOxFZvJ',
  'pay_ToLxjKS9APrzo1',
  'pay_To2TVh8JDoxyjm',
];

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    __FIRED_PURCHASES_SET__?: Set<string>;
    __FAILED_PAYMENTS_SET__?: Set<string>;
  }
}

// Initialize in-memory sets to guarantee zero duplicate fires & 100% block of failed payments
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

  if (!window.__FAILED_PAYMENTS_SET__) {
    window.__FAILED_PAYMENTS_SET__ = new Set<string>(HISTORICAL_FAILED_IDS);
    try {
      const rawFailed = localStorage.getItem(FAILED_PAYMENTS_KEY);
      if (rawFailed) {
        const list: string[] = JSON.parse(rawFailed);
        list.forEach((id) => window.__FAILED_PAYMENTS_SET__?.add(id));
      }
    } catch {}
    try {
      const rawFailedSession = sessionStorage.getItem(FAILED_PAYMENTS_KEY);
      if (rawFailedSession) {
        const list: string[] = JSON.parse(rawFailedSession);
        list.forEach((id) => window.__FAILED_PAYMENTS_SET__?.add(id));
      }
    } catch {}
  }
}

export const markPaymentFailed = (paymentId: string) => {
  if (!paymentId) return;
  const cleanId = paymentId.trim();
  if (typeof window !== 'undefined') {
    if (!window.__FAILED_PAYMENTS_SET__) {
      window.__FAILED_PAYMENTS_SET__ = new Set<string>(HISTORICAL_FAILED_IDS);
    }
    window.__FAILED_PAYMENTS_SET__.add(cleanId);
  }
  try {
    const raw = localStorage.getItem(FAILED_PAYMENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(cleanId)) {
      list.push(cleanId);
      localStorage.setItem(FAILED_PAYMENTS_KEY, JSON.stringify(list));
    }
  } catch {}
  try {
    const rawSession = sessionStorage.getItem(FAILED_PAYMENTS_KEY);
    const list: string[] = rawSession ? JSON.parse(rawSession) : [];
    if (!list.includes(cleanId)) {
      list.push(cleanId);
      sessionStorage.setItem(FAILED_PAYMENTS_KEY, JSON.stringify(list));
    }
  } catch {}
  console.warn(`[Meta Pixel] Blacklisted failed payment: ${cleanId}`);
};

export const isPaymentFailed = (paymentId: string): boolean => {
  if (!paymentId) return false;
  const cleanId = paymentId.trim();
  if (HISTORICAL_FAILED_IDS.includes(cleanId)) return true;
  if (typeof window !== 'undefined' && window.__FAILED_PAYMENTS_SET__?.has(cleanId)) return true;
  try {
    const raw = localStorage.getItem(FAILED_PAYMENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (list.includes(cleanId)) return true;
  } catch {}
  return false;
};

const hasPurchaseFired = (paymentId: string): boolean => {
  if (!paymentId) return true;
  const cleanId = paymentId.trim();
  if (isPaymentFailed(cleanId)) return true;
  if (HISTORICAL_SEED_IDS.includes(cleanId)) return true;
  if (typeof window !== 'undefined' && window.__FIRED_PURCHASES_SET__?.has(cleanId)) {
    return true;
  }
  try {
    const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (list.includes(cleanId)) return true;
  } catch {}
  try {
    const rawSession = sessionStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = rawSession ? JSON.parse(rawSession) : [];
    if (list.includes(cleanId)) return true;
  } catch {}
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
 * Fires when user checks either the Height Maxxing or Sexual Wellness Order Bump checkbox
 */
export const trackBumpAddToCart = (bumpType: 'height' | 'wellness' = 'height') => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    const isHeight = bumpType === 'height';
    window.fbq('track', 'AddToCart', {
      content_name: isHeight
        ? 'Height Maxxing Protocol (Add-On)'
        : 'Sexual Wellness Secrets You Want to Know (Add-On)',
      content_ids: [isHeight ? 'height_maxxing_149' : 'sexual_wellness_149'],
      content_type: 'product',
      value: 149,
      currency: 'INR',
    });
  } catch (e) {
    console.warn('Meta AddToCart error:', e);
  }
};

/**
 * Fires when user fills Email + Phone and clicks "Get it now" to launch Razorpay
 */
export const trackAddPaymentInfo = (
  email: string,
  phone: string,
  totalAmount: number,
  options?: { hasHeightBump?: boolean; hasWellnessBump?: boolean; hasBump?: boolean } | boolean
) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  try {
    setMetaAdvancedMatching(email, phone);

    window.fbq('track', 'Lead', {
      content_name: 'Ian Barseagle Calisthenics Checkout Lead',
      value: totalAmount,
      currency: 'INR',
    });

    const isBool = typeof options === 'boolean';
    const hasBump = isBool ? options : Boolean(options?.hasBump);
    const hasHeightBump = !isBool && Boolean(options?.hasHeightBump);
    const hasWellnessBump = !isBool ? Boolean(options?.hasWellnessBump) : hasBump;

    const contentIds = ['ian_calisthenics_489'];
    const names = ['Ian Barseagle Calisthenics Masterclass'];

    if (hasHeightBump) {
      contentIds.push('height_maxxing_149');
      names.push('Height Maxxing Protocol');
    }
    if (hasWellnessBump || hasBump) {
      contentIds.push('sexual_wellness_149');
      names.push('Sexual Wellness Secrets');
    }

    window.fbq('track', 'AddPaymentInfo', {
      content_name: names.join(' + '),
      content_ids: contentIds,
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
  hasBump?: boolean;
  hasHeightBump?: boolean;
  hasWellnessBump?: boolean;
  timestamp?: number;
  isReturning?: boolean;
}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (!order || !order.paymentId) return;

  // Never fire for returning customer logins, manual looks, or test IDs
  if (order.isReturning) return;
  if (
    !order.paymentId ||
    !order.paymentId.startsWith('pay_') ||
    order.paymentId.startsWith('pay_verified_') ||
    order.paymentId.startsWith('pay_demo_') ||
    order.paymentId === 'pay_live_verified'
  ) {
    return;
  }

  // Split multi-id strings (e.g. "pay_xxx + pay_yyy") and check if any part is failed or fired
  const subIds = order.paymentId.split('+').map((s) => s.trim()).filter((s) => s.startsWith('pay_'));
  for (const sid of subIds) {
    if (isPaymentFailed(sid)) {
      console.warn(`[Meta Pixel] Aborting Purchase - ID ${sid} is marked failed.`);
      return;
    }
    if (hasPurchaseFired(sid)) {
      console.warn(`[Meta Pixel] Aborting Purchase - ID ${sid} already fired.`);
      return;
    }
  }

  // Never fire if payment was created more than 15 minutes ago (prevents past orders from firing again)
  if (order.timestamp && Math.abs(Date.now() - order.timestamp) > 15 * 60 * 1000) {
    markPurchaseFired(order.paymentId);
    subIds.forEach((sid) => markPurchaseFired(sid));
    return;
  }

  // STRICT IN-MEMORY + STORAGE DEDUPLICATION:
  // If this payment was already fired anywhere in this session or in history, DO NOT FIRE!
  if (hasPurchaseFired(order.paymentId)) {
    return;
  }

  // Mark immediately before dispatching to block any concurrent async calls
  markPurchaseFired(order.paymentId);
  subIds.forEach((sid) => markPurchaseFired(sid));

  try {
    setMetaAdvancedMatching(order.email, order.phone);

    const contentIds = ['ian_calisthenics_489'];
    const names = ['Ian Barseagle Calisthenics Masterclass'];
    let numItems = 1;

    if (order.hasHeightBump) {
      contentIds.push('height_maxxing_149');
      names.push('Height Maxxing Protocol');
      numItems++;
    }
    if (order.hasWellnessBump || order.hasBump) {
      contentIds.push('sexual_wellness_149');
      names.push('Sexual Wellness Secrets');
      numItems++;
    }

    window.fbq(
      'track',
      'Purchase',
      {
        value: Number(order.amount) || 489,
        currency: 'INR',
        content_name: names.join(' + '),
        content_category: 'Fitness & Calisthenics Course',
        content_type: 'product',
        content_ids: contentIds,
        num_items: numItems,
        order_id: order.paymentId,
      },
      { eventID: order.paymentId }
    );

    console.log(`[Meta Pixel] Verified Purchase tracked for ${order.paymentId} (₹${order.amount})`);
  } catch (e) {
    console.warn('Meta Purchase tracking error:', e);
  }
};
