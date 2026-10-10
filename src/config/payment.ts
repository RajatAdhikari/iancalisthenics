// Razorpay Payment Configuration & Course Delivery Links
export const RAZORPAY_CONFIG = {
  // Configured with your live Razorpay Key ID:
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TkVGwV6gWcnuAO',
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'qD4MONTwIrZpPeUen1l6lpCJ',
  companyName: 'Ian Barseagle Calisthenics',
  basePrice: 489,
  bumpPrice: 99,
  currency: 'INR',
  supportEmail: 'boltlabs1@gmail.com',

  // 📁 Google Drive Delivery Links:
  courseDriveLink: 'https://drive.google.com/drive/folders/1D7TwiYhxnHIDnicirPRzIOj5UgRvIxAQ?usp=drive_link',
  bumpDriveLink: 'https://drive.google.com/drive/folders/1FezGSVbAzxGMoP_a6_zfnterA6L1oinj?usp=drive_link',
};
