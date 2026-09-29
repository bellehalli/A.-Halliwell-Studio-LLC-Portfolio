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

The `/portal` route keeps its public entry experience until a private Neon
database and Resend are connected and `PORTAL_ENABLED=true`. The gated client
workspace supports invited sign-in, studio project management, Stripe invoice
status and payment links, private Blob review files, and revision decisions.
There is no public self-registration. Read
[`docs/client-portal-setup.md`](docs/client-portal-setup.md) before activation;
agreement signing still requires a provider and client terms.

## Environment

Keep the existing Vercel environment variables:
- RESEND_API_KEY
- INQUIRY_TO_EMAIL
- INQUIRY_FROM_EMAIL

For signed inbound fax delivery, add `TELNYX_PUBLIC_KEY` from Telnyx Mission
Control → Keys & Credentials → Public Key to the Vercel production environment.
After it is available in the deployed function, remove the `?secret=...` query
from the Telnyx inbound fax webhook URL. The receiver then requires Telnyx's
Ed25519 signature and timestamp headers and ignores the legacy URL secret.
The legacy `TELNYX_FAX_WEBHOOK_SECRET` remains a temporary fallback only until
the public key has been configured, to avoid interrupting inbound faxes.

Inquiry and fax sign-in-code requests have server-side per-IP limits. Vercel
functions may have separate instances, so configure project-wide WAF rate-limit
rules for `/api/inquiry` and `/api/fax/auth/request` for a shared limit across
instances and regions.

Never commit secret values.

## Deploy

Apply these source files over the portfolio repository while preserving `public/`, then:

npm install
npm run build

Deploy only after the build succeeds and the inquiry form is re-tested in production.
