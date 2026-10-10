// Vercel Serverless Function: Create Razorpay Order with Auto-Capture Enabled
import https from 'https';

function razorpayRequest(path, method, authHeader, payload) {
  return new Promise((resolve, reject) => {
    const bodyStr = payload ? JSON.stringify(payload) : '';
    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        port: 443,
        path,
        method,
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyStr),
          Authorization: authHeader,
        },
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { amount, currency = 'INR', receipt, notes, keyId: bodyKeyId, keySecret: bodyKeySecret } = body;

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || bodyKeyId || 'rzp_live_TkVGwV6gWcnuAO';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || bodyKeySecret || 'qD4MONTwIrZpPeUen1l6lpCJ';

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const { status, data } = await razorpayRequest('/v1/orders', 'POST', authHeader, {
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment: {
        capture: 'automatic', // 🚀 Tells Razorpay to capture payment automatically upon authorization
        capture_options: {
          automatic_expiry_period: 12,
          manual_expiry_period: 7200,
          refund_speed: 'optimum',
        },
      },
      notes: notes || {},
    });

    if (status < 200 || status >= 300) {
      return res.status(status).json(data);
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
