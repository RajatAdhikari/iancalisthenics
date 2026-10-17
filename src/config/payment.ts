// Razorpay Payment Configuration & Course Delivery Links
// Only public keyId is bundled in the frontend. All sensitive credentials remain securely on the server.
export const RAZORPAY_CONFIG = {
  // Public Razorpay Key ID used by client checkout:
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TkVGwV6gWcnuAO',
  companyName: 'Ian Barseagle Calisthenics',
  basePrice: 489,
  heightBumpPrice: 149,
  wellnessBumpPrice: 149,
  bumpPrice: 149,
  currency: 'INR',
  supportEmail: 'boltlabs1@gmail.com',

  // 📁 Google Drive Delivery Links:
  courseDriveLink: 'https://drive.google.com/drive/folders/1D7TwiYhxnHIDnicirPRzIOj5UgRvIxAQ?usp=drive_link',
  heightDriveLink: 'https://drive.google.com/drive/folders/1MDt5KlrbuklZ6wx2UsZc2jXS2LplqJx8?usp=drive_link',
  wellnessDriveLink: 'https://drive.google.com/drive/folders/1FezGSVbAzxGMoP_a6_zfnterA6L1oinj?usp=drive_link',
  bumpDriveLink: 'https://drive.google.com/drive/folders/1FezGSVbAzxGMoP_a6_zfnterA6L1oinj?usp=drive_link',
};
