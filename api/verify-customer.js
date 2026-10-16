// Vercel Serverless Function: Verify Razorpay Payment by Order ID, Payment ID, Email, or Phone
// Automatically captures authorized payments and unlocks Thank You Page even if mobile UPI tab reloaded
import https from 'https';

function razorpayRequest(path, method, authHeader, payload) {
  return new Promise((resolve, reject) => {
    const bodyStr = payload ? JSON.stringify(payload) : '';
    const headers = {
      Authorization: authHeader,
    };
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        port: 443,
        path,
        method,
        rejectUnauthorized: false,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 200, data: JSON.parse(raw || '{}') });
          } catch (e) {
            resolve({ status: res.statusCode || 200, data: { raw } });
          }
        });
      }
    );
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const body =
    req.method === 'POST'
      ? typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body || {}
      : req.query || {};

  const { orderId, paymentId, email, phone, keyId: bodyKeyId, keySecret: bodyKeySecret } = body;

  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.VITE_RAZORPAY_KEY_ID ||
    bodyKeyId ||
    'rzp_live_TkVGwV6gWcnuAO';
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.VITE_RAZORPAY_KEY_SECRET ||
    bodyKeySecret ||
    'qD4MONTwIrZpPeUen1l6lpCJ';

  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  async function ensureCapturedAndFormat(p, extraHasBump = false) {
    if (p.status === 'authorized') {
      try {
        await razorpayRequest(`/v1/payments/${p.id}/capture`, 'POST', authHeader, {
          amount: p.amount,
          currency: p.currency || 'INR',
        });
      } catch (e) {}
    }

    const amountInr = Math.round((Number(p.amount) || 48900) / 100);
    const notes = p.notes || {};
    const hasBump =
      extraHasBump ||
      amountInr >= 550 ||
      amountInr === 99 ||
      String(notes.bump_selected || '').toLowerCase().startsWith('yes') ||
      Boolean(notes.upgrade_type);

    return {
      paymentId: p.id,
      orderId: p.order_id || orderId || '',
      email: notes.customer_email || p.email || email || '',
      phone: notes.customer_phone || p.contact || phone || '',
      hasBump,
      amount: hasBump && amountInr < 550 ? 588 : amountInr,
      timestamp: (p.created_at || Math.floor(Date.now() / 1000)) * 1000,
    };
  }

  try {
    // 1. Direct Payment ID check
    if (paymentId && String(paymentId).startsWith('pay_')) {
      const { status, data } = await razorpayRequest(
        `/v1/payments/${encodeURIComponent(paymentId)}`,
        'GET',
        authHeader
      );
      if (status === 200 && data) {
        if (data.status === 'failed') {
          return res.status(200).json({ verified: false, failed: true, error: data.error_description || 'Payment failed' });
        }
        if (data.status === 'captured' || data.status === 'authorized') {
          const order = await ensureCapturedAndFormat(data);
          return res.status(200).json({ verified: true, order });
        }
      }
      return res.status(200).json({ verified: false });
    }

    // 2. Order ID check (for automatic mobile UPI polling when customer returns from GPay/PhonePe/Paytm)
    if (orderId && String(orderId).startsWith('order_')) {
      const { status, data } = await razorpayRequest(
        `/v1/orders/${encodeURIComponent(orderId)}/payments`,
        'GET',
        authHeader
      );
      if (status === 200 && data && Array.isArray(data.items)) {
        const paidItem = data.items.find(
          (item) => item.status === 'captured' || item.status === 'authorized'
        );
        if (paidItem) {
          const order = await ensureCapturedAndFormat(paidItem);
          return res.status(200).json({ verified: true, order });
        }
        const failedItem = data.items.find((item) => item.status === 'failed');
        if (failedItem) {
          return res.status(200).json({ verified: false, failed: true, error: 'Payment failed' });
        }
      }
      return res.status(200).json({ verified: false });
    }

    // 3. Returning customer lookup (ONLY when explicitly checking existing access, never for pending orders)
    const normEmail = normalizeEmail(email);
    const normPhone = normalizePhone(phone);

    if (!orderId && !paymentId && ((normEmail && normEmail.includes('@')) || normPhone.length === 10)) {
      const { status, data } = await razorpayRequest('/v1/payments?count=100', 'GET', authHeader);
      if (status === 200 && data && Array.isArray(data.items)) {
        const matchedItems = data.items.filter((item) => {
          if (item.status !== 'captured' && item.status !== 'authorized') return false;
          const notes = item.notes || {};
          const itemEmail = normalizeEmail(notes.customer_email || item.email);
          const itemPhone = normalizePhone(notes.customer_phone || item.contact);

          const emailMatch = normEmail && normEmail.includes('@') && itemEmail === normEmail;
          const phoneMatch = normPhone.length === 10 && itemPhone === normPhone;
          return emailMatch || phoneMatch;
        });

        if (matchedItems.length > 0) {
          const anyBump = matchedItems.some((item) => {
            const amt = Math.round((Number(item.amount) || 0) / 100);
            const notes = item.notes || {};
            return (
              amt >= 550 ||
              amt === 99 ||
              String(notes.bump_selected || '').toLowerCase().startsWith('yes') ||
              Boolean(notes.upgrade_type)
            );
          });

          const primaryPayment = matchedItems[0];
          const order = await ensureCapturedAndFormat(primaryPayment, anyBump);
          return res.status(200).json({ verified: true, order: { ...order, isReturning: true } });
        }
      }
    }

    return res.status(200).json({ verified: false });
  } catch (err) {
    return res.status(200).json({ verified: false, error: err.message });
  }
}
