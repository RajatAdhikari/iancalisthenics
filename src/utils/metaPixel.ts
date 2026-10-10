// Meta (Facebook) Pixel & Manual Advanced Matching Utility
// Pixel Name: Rajat Adhikari - Pixel
// Pixel ID: 1377946710945110

export const META_PIXEL_ID = '1377946710945110';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const FIRED_PURCHASES_KEY = 'ian_calisthenics_fired_pixel_purchases';
const HISTORICAL_SEED_IDS = ['pay_Tm9WPF5eFrxlfn', 'pay_T1y5H8hvhQsYV'];

const hasPurchaseFired = (paymentId: string): boolean => {
  if (!paymentId) return false;
  if (HISTORICAL_SEED_IDS.includes(paymentId)) return true;
  try {
    const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(paymentId);
  } catch {
    return false;
  }
};

const markPurchaseFired = (paymentId: string) => {
  if (!paymentId) return;
  try {
    const raw = localStorage.getItem(FIRED_PURCHASES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(paymentId)) {
      list.push(paymentId);
      localStorage.setItem(FIRED_PURCHASES_KEY, JSON.stringify(list));
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
 * Resolves the "Set up manual advanced matching" warning in Meta Events Manager:
 * fbq('init', '1377946710945110', { em: 'email@email.com', ph: '1234567890' });
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
      localStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({ em: cleanEmail, ph: cleanPhone })
      );
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
    // 1. Update Manual Advanced Matching with customer's email & phone
    setMetaAdvancedMatching(email, phone);

    // 2. Track Lead & AddPaymentInfo for campaign funnel optimization
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
 * Fires ONLY when payment is verified & completed (or on Thank You Page if not yet fired for that paymentId).
 * Deduplicated by paymentId so refreshing the Thank You page never double-counts conversions!
 */
export const trackPurchase = (order: {
  paymentId: string;
  email?: string;
  phone?: string;
  amount: number;
  hasBump: boolean;
}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (!order || !order.paymentId) return;

  // Do not fire duplicate Purchase events for the same paymentId (e.g., on page refresh or returning customer login)
  if (hasPurchaseFired(order.paymentId)) {
    return;
  }

  try {
    // Ensure Advanced Matching data (email & phone) is attached before firing Purchase
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

    markPurchaseFired(order.paymentId);
    console.log(`[Meta Pixel] Purchase tracked for ${order.paymentId} (₹${order.amount})`);
  } catch (e) {
    console.warn('Meta Purchase tracking error:', e);
  }
};
