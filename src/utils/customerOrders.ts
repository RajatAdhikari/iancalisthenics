// Customer Orders & Persistent Access Registry
import { OrderData } from '../components/CheckoutModal';

// Seed list of verified purchases (e.g. user verified live payment)
const SEED_PAID_ORDERS: OrderData[] = [
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
    const exists = current.some((o) => o.paymentId === order.paymentId);
    const updated = exists ? current : [order, ...current];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('ian_calisthenics_last_order', JSON.stringify(order));
    sessionStorage.setItem('ian_calisthenics_order', JSON.stringify(order));
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
};

export const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const findExistingOrder = (email: string, phone: string): OrderData | null => {
  const normPhone = normalizePhone(phone);
  const normEmail = normalizeEmail(email);

  if (normPhone.length < 10 && !normEmail.includes('@')) {
    return null;
  }

  const orders = getPaidOrders();

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
