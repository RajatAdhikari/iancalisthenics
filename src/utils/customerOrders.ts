// Customer Orders & Persistent Access Registry + Live Razorpay Server Sync
import { OrderData } from '../components/CheckoutModal';

export interface PendingOrderData {
  orderId?: string;
  email: string;
  phone: string;
  hasBump: boolean;
  amount: number;
  timestamp: number;
}

// Seed list of verified purchases
const SEED_PAID_ORDERS: OrderData[] = [
  {
    paymentId: 'pay_TmsUdcymj99Ijt',
    email: 'gaurav.e26@gmail.com',
    phone: '+91 88264 01500',
    hasBump: true,
    amount: 588,
    timestamp: 1728710280000,
  },
  {
    paymentId: 'pay_Tm9WPF5eFrxlfn',
    email: 'rajatadhikari77@gmail.com',
    phone: '+91 96430 63811',
    hasBump: false,
    amount: 489,
    timestamp: 1728551760000,
  },
  {
    paymentId: 'pay_T1y5H8hvhQsYV',
    email: 'boltlabs1@gmail.com',
    phone: '+91 96430 63812',
    hasBump: false,
    amount: 489,
    timestamp: 1728511000000,
  },
];

const STORAGE_KEY = 'ian_calisthenics_paid_customers';
const PENDING_ORDER_KEY = 'ian_calisthenics_pending_order';

export const getPaidOrders = (): OrderData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored: OrderData[] = raw ? JSON.parse(raw) : [];

    // Also check last order in localStorage
    const lastOrderRaw = localStorage.getItem('ian_calisthenics_last_order');
    if (lastOrderRaw) {
      const lastOrder: OrderData = JSON.parse(lastOrderRaw);
      if (!stored.some((o) => o.paymentId === lastOrder.paymentId)) {
        stored.push(lastOrder);
      }
    }

    // Merge with SEED orders without duplicates
    const all = [...stored];
    for (const seed of SEED_PAID_ORDERS) {
      if (!all.some((o) => o.paymentId === seed.paymentId)) {
        all.push(seed);
      }
    }

    return all;
  } catch (e) {
    return SEED_PAID_ORDERS;
  }
};

export const savePaidOrder = (order: OrderData) => {
  try {
    const current = getPaidOrders();
    const existingIdx = current.findIndex((o) => o.paymentId === order.paymentId);
    let updated: OrderData[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...order };
    } else {
      updated = [order, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('ian_calisthenics_last_order', JSON.stringify(order));
    sessionStorage.setItem('ian_calisthenics_order', JSON.stringify(order));
    clearPendingOrder();
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
};

export const savePendingOrder = (pending: PendingOrderData) => {
  try {
    localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pending));
  } catch {}
};

export const getPendingOrder = (): PendingOrderData | null => {
  try {
    const raw = localStorage.getItem(PENDING_ORDER_KEY);
    if (!raw) return null;
    const parsed: PendingOrderData = JSON.parse(raw);
    // Expire pending orders older than 2 hours
    if (Date.now() - (parsed.timestamp || 0) > 2 * 60 * 60 * 1000) {
      localStorage.removeItem(PENDING_ORDER_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearPendingOrder = () => {
  try {
    localStorage.removeItem(PENDING_ORDER_KEY);
  } catch {}
};

export const normalizePhone = (phone: string): string => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const normalizeEmail = (email: string): string => {
  return (email || '').trim().toLowerCase();
};

export const findExistingOrder = (email: string, phoneOrPaymentId: string): OrderData | null => {
  const trimmedInput = (phoneOrPaymentId || '').trim();
  const normPhone = normalizePhone(trimmedInput);
  const normEmail = normalizeEmail(email);

  const orders = getPaidOrders();

  // Direct Payment ID match
  if (trimmedInput.startsWith('pay_')) {
    const byPid = orders.find((o) => o.paymentId.toLowerCase() === trimmedInput.toLowerCase());
    if (byPid) return byPid;
  }

  if (normPhone.length < 10 && !normEmail.includes('@')) {
    return null;
  }

  for (const o of orders) {
    const orderPhone = normalizePhone(o.phone);
    const orderEmail = normalizeEmail(o.email);

    // If 10-digit phone matches
    if (normPhone.length === 10 && orderPhone === normPhone) {
      return o;
    }

    // If valid email matches
    if (normEmail.includes('@') && orderEmail === normEmail) {
      return o;
    }
  }

  return null;
};

/**
 * Queries live Razorpay API via /api/verify-customer to check if an orderId, paymentId, email, or phone
 * has already completed payment (especially when mobile UPI app switch reloads or backgrounds the browser).
 */
export const verifyOrderWithServer = async (params: {
  orderId?: string;
  paymentId?: string;
  email?: string;
  phone?: string;
}): Promise<OrderData | null> => {
  try {
    const res = await fetch('/api/verify-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.verified && data.order && data.order.paymentId) {
      savePaidOrder(data.order);
      return data.order as OrderData;
    }
    return null;
  } catch {
    return null;
  }
};
