import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

function razorpayRequest(path: string, method: string, authHeader: string, payload?: any): Promise<{ status: number; data: any }> {
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

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      {
        name: 'razorpay-api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/create-order' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                const currentEnv = loadEnv(mode, process.cwd(), '');
                let parsed: any = {};
                try {
                  parsed = JSON.parse(body || '{}');
                } catch (e) {}

                const keyId =
                  currentEnv.RAZORPAY_KEY_ID ||
                  currentEnv.VITE_RAZORPAY_KEY_ID ||
                  parsed.keyId ||
                  'rzp_live_TkVGwV6gWcnuAO';
                const keySecret =
                  currentEnv.RAZORPAY_KEY_SECRET ||
                  currentEnv.VITE_RAZORPAY_KEY_SECRET ||
                  parsed.keySecret ||
                  'qD4MONTwIrZpPeUen1l6lpCJ';

                try {
                  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
                  const { status, data } = await razorpayRequest('/v1/orders', 'POST', authHeader, {
                    amount: Math.round(Number(parsed.amount) * 100),
                    currency: 'INR',
                    receipt: parsed.receipt || `rcpt_${Date.now()}`,
                    payment: {
                      capture: 'automatic',
                      capture_options: {
                        automatic_expiry_period: 12,
                        manual_expiry_period: 7200,
                        refund_speed: 'optimum',
                      },
                    },
                    notes: parsed.notes || {},
                  });

                  res.statusCode = status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ orderId: data.id, ...data }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            if (req.url === '/api/capture-payment' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                const currentEnv = loadEnv(mode, process.cwd(), '');
                let parsed: any = {};
                try {
                  parsed = JSON.parse(body || '{}');
                } catch (e) {}

                const keyId =
                  currentEnv.RAZORPAY_KEY_ID ||
                  currentEnv.VITE_RAZORPAY_KEY_ID ||
                  parsed.keyId ||
                  'rzp_live_TkVGwV6gWcnuAO';
                const keySecret =
                  currentEnv.RAZORPAY_KEY_SECRET ||
                  currentEnv.VITE_RAZORPAY_KEY_SECRET ||
                  parsed.keySecret ||
                  'qD4MONTwIrZpPeUen1l6lpCJ';

                try {
                  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
                  const { status, data } = await razorpayRequest(
                    `/v1/payments/${parsed.paymentId}/capture`,
                    'POST',
                    authHeader,
                    {
                      amount: Math.round(Number(parsed.amount) * 100),
                      currency: 'INR',
                    }
                  );

                  res.statusCode = status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            next();
          });
        },
      },
    ],
  };
});
