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
   Stripe is optional if the project uses an uploaded Chase invoice instead.
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
2. Sign in at `/portal` as the studio owner and create Valerie's workspace with
   her already known name, email, Vale Royal Barn, project title, and agreed
   $3,750 investment. Do not ask her to repeat discovery.
   This creates no invoice and sends no client email on its own.
3. Upload the approved agreement PDF, including the correct legal client name
   and scope. Sign it from the studio's agreement page. The client can then
   review and sign the exact version in the portal. A new upload supersedes the
   previous version for signing; old signed records remain in the database.
4. Create the deposit invoice in Chase after price approval. Download its PDF
   and attach it to the project with the actual invoice number, amount, due
   date, and optional Chase payment URL. Enter the Zelle ID in the private
   studio form; leave the check address empty until it is ready. The invoice
   PDF and payment details appear to the client after signing. Add milestone
   invoices as separate documents later. Chase remains the source of truth:
   mark each invoice paid in the portal only after confirming payment in Chase.
   An alternate Stripe invoice can still be attached by ID if that is the
   payment source for a different project; do not attach both for one charge.
5. Send the invitation from the studio workspace. Valerie receives a one-time
   link that expires after 15 minutes. After that, she can request a fresh link
   with the same email from `/portal`.
6. Once Valerie signs, she can upload source imagery, plans, photos, branding,
   and references directly to the private project folder. Each file can be up
   to 25 MB; the studio sees the files and any optional note in its workspace.
   The project journey distinguishes a signed agreement from a confirmed
   deposit. Do not mark an invoice paid before payment arrives.
7. When the first proof is ready, upload a private PDF or image from the studio
   workspace. That publishes a version and emails Valerie. She can view the
   file and submit one approval or one set of revision notes for that version.
   Upload a new version for the next round. The studio receives an email when
   she responds.

### Zelle and check

Use the agreed invoice for the amount and due date. Add Zelle or check payment
instructions in the studio workspace; they are shown only to the signed-in client
alongside a finalized invoice. Do not commit bank details to the repo. The portal does **not** treat a client's
claim of payment as proof. After funds arrive in Chase, mark the uploaded Chase
invoice paid in the studio workspace. If a project uses a Stripe invoice instead,
mark an out-of-band payment in Stripe; the portal then reads its paid status.

## Preview checks before client use

- Unknown email addresses receive the same generic sign-in response as known
  ones. A consumed or expired link fails, and sign-out invalidates its session.
- Client A cannot open Client B's project, file, or feedback endpoint by ID.
- The studio-only page and upload endpoints reject a normal client session.
- Another client cannot fetch or upload this project's source materials. Test
  a file larger than 4.5 MB through the browser-to-private-Blob flow and verify
  that the completion callback saves it in the workspace.
- An unsigned client sees neither the Chase invoice PDF nor its payment details.
- A draft Stripe invoice never exposes a price or payment link.
- The studio signs first; client signing requires a verified email session,
  an exact PDF version, typed legal name, and affirmative review and consent.
  The signed PDF has dated signature pages and the database retains its hashes
  and audit fields. Test both signatures and download the final signed copy.
- A PDF/image is stored privately and served only through the authenticated
  file route with `private, no-store`.
- Test invite, signing, invoice availability, and review emails with a test client
  before using the portal for Valerie.

## Current boundaries

The custom workspace is built but not activated until the database, private
Blob store, and mail sender are connected and tested. Chase invoices are
uploaded manually; this portal cannot sync payment status from Chase. Typed
electronic signatures are recorded with a session, consent, timestamp, PDF
hash, and PDF copy. This is not a third-party identity verification service or
a cryptographic certificate. Have the agreement wording reviewed for your
business before relying on it with a client. Review supports a single text feedback decision
per version, rather than in-image annotations. The in-process IP throttle on
login requests should be paired with a Vercel WAF rule for a shared limit across
instances. Do not send the Valerie invite until her terms and content are ready.
