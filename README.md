# A. Halliwell Studio

Production-ready source package for ahalliwellstudio.com.

Included:
- expressive portfolio homepage
- selected work index
- Willow Lily case study
- Maison Rivière case study
- interactive capability Lab
- services and Studio positioning
- real project inquiry builder and Resend endpoint
- private-by-default Client Portal entry page
- sitemap and robots controls
- responsive and reduced-motion behavior

## Existing repo assets to keep

This package intentionally does not duplicate the large `/public` asset library or real project screenshots already present in the GitHub repository. Keep the existing `public/` directory when applying this package.

## Client Portal

The `/portal` route is a polished private client entry experience. It deliberately does not invent authentication, client accounts, files, invoices or project data. Those require a real identity/data provider before they can be safely activated. Public self-registration is intentionally absent.

## Environment

Keep the existing Vercel environment variables:
- RESEND_API_KEY
- INQUIRY_TO_EMAIL
- INQUIRY_FROM_EMAIL

Never commit secret values.

## Deploy

Apply these source files over the portfolio repository while preserving `public/`, then:

npm install
npm run build

Deploy only after the build succeeds and the inquiry form is re-tested in production.
