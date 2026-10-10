// Vercel Serverless Function: Serves absolute Open Graph (og:image) URLs for WhatsApp, Instagram, Telegram & Facebook Link Previews
export default function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'iancalisthenics-plum.vercel.app';
  const baseUrl = `${proto}://${host}`;
  const imageUrl = `${baseUrl}/images/ian-hero-physique.jpg`;
  const pageUrl = `${baseUrl}${req.url || '/'}`;

  const title = 'Ian Barseagle Calisthenics Masterclass | Zero to Superhuman';
  const description =
    'Build a Greek-God physique without gyms or heavy weights. Unlock Muscle-Ups, Planche & Handstands with Ian Barseagle (700K+ IG, 900K+ YT) + Complete Indian Diet Plan for ₹489.';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  res.status(200).send(`<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <!-- Open Graph / WhatsApp / Facebook / Instagram Link Preview -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ian Barseagle Calisthenics" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="640" />
    <meta property="og:image:height" content="640" />
    <meta property="og:image:alt" content="Ian Barseagle Aesthetic Calisthenics Physique" />

    <!-- Twitter / X / Telegram Large Image Preview -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <!-- Schema.org / WhatsApp Fallback -->
    <meta itemprop="name" content="${title}" />
    <meta itemprop="description" content="${description}" />
    <meta itemprop="image" content="${imageUrl}" />
    <link rel="image_src" href="${imageUrl}" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
    <img src="${imageUrl}" alt="Ian Barseagle Aesthetic Calisthenics Physique" />
  </body>
</html>`);
}
