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

## Commercial configuration and assets

`lib/studio-config.ts` is the source for public website/refinement pricing,
offer names, inquiry investment tiers, studio email, and consultation URL.
Custom websites start at $7,000; Website Refinement starts at $2,500. Other
projects remain priced by scope.

Keep only production assets in `public/`. Add intentional artwork and reference
it in the source or project data. Do not use this repository as raw asset
storage. `npm run check:assets` audits literal paths, CSS backgrounds, project
data, and constructed case-study galleries; it fails on missing references and
reports unreferenced files without deleting anything. The agreement-signing
font and its license in `assets/` are required server assets.

See `docs/portfolio-proof.md` before publishing commissioned work.

## Client Portal

The `/portal` route keeps its public entry experience until a private Neon
database and Resend are connected and `PORTAL_ENABLED=true`. The gated client
workspace supports invited sign-in, studio project management, Stripe invoice
status and payment links, private Blob review files, and revision decisions.
There is no public self-registration. Read
[`docs/client-portal-setup.md`](docs/client-portal-setup.md) before activation;
PDF signing, private materials, milestone invoices, review feedback, and client terms are managed by the existing portal workflows.

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

## Validate and deploy

Use the existing package lock and Node.js 22:

```sh
npm ci
npm run build
```

The build runs TypeScript, the existing form/lead/consultation tests, and the
asset-reference check before Next.js compilation. GitHub Actions runs the same
build on main and pull requests. The existing Vercel Git integration publishes
main using the project's configured environment variables.

After deployment, verify the homepage, Services, Lab, Start, Studio, and all
five case studies on desktop and mobile. Verify inquiry validation and drafts;
use a clearly identified test submission only when actual email/lead delivery
is intended. Never use real client portal data in public previews.
