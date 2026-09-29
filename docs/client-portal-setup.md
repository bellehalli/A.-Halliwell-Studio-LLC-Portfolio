# Private client portal setup

This is a custom workspace inside `ahalliwellstudio.com`. It is feature-gated:
the existing public `/portal` entry stays in place until `PORTAL_ENABLED=true`
and a database and mail sender are configured. No client records, prices,
contracts, or payment links are committed to Git.

## Provision before activation

1. Add a Neon Postgres database to the Vercel project and apply
   [`portal-schema.sql`](./portal-schema.sql) in its SQL editor. Set `DATABASE_URL`
   in Preview and Production.
2. Add a **private** Vercel Blob store and its `BLOB_READ_WRITE_TOKEN` for review
   files. Public Blob storage is not suitable for client artwork.
3. Use the existing Resend sender (`RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`).
   Confirm that the sender domain is verified and can email clients.
4. Connect Stripe and set `STRIPE_SECRET_KEY` for the matching environment.
   The portal reads the actual Stripe invoice, amount due, status, and hosted
   payment link. A draft invoice is never shown to a client.
5. Set `PORTAL_STUDIO_EMAIL` to the studio owner's login email. Seed the studio
   account in Neon with a fresh UUID, for example:

   ```sql
   INSERT INTO portal_clients (id, email, first_name, role)
   VALUES ('a-new-random-uuid', 'your-studio-email@example.com', 'Arabella', 'studio');
   ```

6. In Preview, set `PORTAL_ENABLED=true`, test the flows below, and only then
   set it in Production. The feature gate deliberately fails closed if the
   database or Resend key is missing.

## First client workflow

1. Agree the illustration deliverable, usage/license, price, payment schedule,
   timeline, number of included revision rounds, and how additional changes
   are priced. Do this before sending a final agreement or invoice.
2. Sign in at `/portal` as the studio owner and create Valerie's workspace.
   This creates no invoice and sends no client email on its own.
3. Create the actual agreement in an e-sign service. The provider is not yet
   selected; paste its secure signing URL into the studio workspace only after
   its terms are approved. A URL in the portal does not itself collect a legal
   signature or verify signature status.
4. Create Valerie's Stripe invoice with her matching email, correct line items,
   due date, and agreed payment terms. Keep it in **draft** until the price is
   approved. After finalizing, paste the `in_…` invoice ID into the studio
   workspace. Add optional private Zelle/check instructions to that project.
   The portal checks the Stripe invoice's customer email before it
   saves the ID; Stripe remains the source of truth for its balance and status.
5. Send the invitation from the studio workspace. Valerie receives a one-time
   link that expires after 15 minutes. After that, she can request a fresh link
   with the same email from `/portal`.
6. When the first proof is ready, upload a private PDF or image from the studio
   workspace. That publishes a version and emails Valerie. She can view the
   file and submit one approval or one set of revision notes for that version.
   Upload a new version for the next round. The studio receives an email when
   she responds.

### Zelle and check

Use the agreed invoice for the amount and due date. Add Zelle or check payment
instructions in the studio workspace; they are shown only to the signed-in client
alongside a finalized invoice. Do not commit bank details to the repo. The portal does **not** treat a client's
claim of payment as proof. After funds arrive in Chase, mark the Stripe invoice
paid **out of band** in Stripe. The portal will then display its paid status.

## Preview checks before client use

- Unknown email addresses receive the same generic sign-in response as known
  ones. A consumed or expired link fails, and sign-out invalidates its session.
- Client A cannot open Client B's project, file, or feedback endpoint by ID.
- The studio-only page and upload endpoints reject a normal client session.
- A draft Stripe invoice never exposes a price or payment link.
- A PDF/image is stored privately and served only through the authenticated
  file route with `private, no-store`.
- Test invite and review emails with a test client, and verify the e-sign
  provider's own signature and audit-trail workflow before using it for Valerie.

## Current boundaries

The custom workspace is built but not activated until the database, private
Blob store, and Stripe credentials are connected and tested. Agreement links
open a provider-hosted signing flow; provider selection and signature-state
sync remain to be completed. Review supports a single text feedback decision
per version, rather than in-image annotations. The in-process IP throttle on
login requests should be paired with a Vercel WAF rule for a shared limit across
instances. Do not send the Valerie invite until her terms and content are ready.
