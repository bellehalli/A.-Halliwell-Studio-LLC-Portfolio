# Google consultation bookings → Leads

The repository contains the receiving endpoint and Google Apps Script bridge. Deployment alone does **not** activate calendar syncing.

## One-time connection

1. In Vercel, set `CONSULTATION_WEBHOOK_SECRET` for Production to a new random secret (at least 32 random bytes). Keep it out of GitHub and redeploy so the deployment receives it. `DATABASE_URL` must already be configured.
2. Sign in to Google Apps Script using the account that owns the booking calendar. Create a standalone project and paste `scripts/google-consultation-sync.gs` into its editor. Enable the advanced Google Calendar v3 service, and replace the project manifest with `scripts/appsscript.json` (enable the manifest editor in Project Settings). This limits calendar authorization to read-only access.
3. Add Script Properties:
   - `BOOKING_CALENDAR_ID`: calendar ID from Google Calendar settings.
   - `BOOKING_TITLE_PREFIX`: the exact title prefix used by this consultation appointment schedule. Inspect a genuine booked appointment first; never use an empty or broad prefix.
   - `BOOKING_WEBHOOK_SECRET`: the same secret as Vercel.
   - Optional `BOOKING_WEBHOOK_URL`: defaults to the production endpoint.
4. Run `syncConsultations` once and authorize calendar access and outbound requests. It reads matching appointments; it does not edit the calendar or send emails. Confirm a genuine booking appears in Studio → Leads.
5. Run `installConsultationSync` to install a five-minute trigger. Review Google execution logs if a sync fails.

## Behavior and limits

- Reads matching bookings from yesterday through the next 90 days with exactly one external guest. Use a dedicated consultation calendar where possible.
- Links by booking ID first, then the newest open lead with the same email (excluding support inquiries). Otherwise creates a consultation lead.
- Saves booking time, status and description privately. Notes, next actions, follow-up dates and advanced lead stages are preserved.
- Repeated deliveries are idempotent; older provider updates are ignored. Rescheduling updates the existing booking. Deletion of a previously imported future appointment records a cancellation.
- Cancelled bookings are displayed without closing the lead. Historical events outside the scan window are not imported. Moving an event outside the window is not treated as cancellation.
- Failed deliveries retry on the next run. The timestamped HMAC protects the endpoint; unsigned, expired or malformed requests are rejected.
- Script Properties retain event IDs, contact/time fields and hashes for synchronization, not appointment descriptions. Delete the trigger and `AHS_BOOKING_` properties to stop and clear bridge state. Imported Leads remain in the private portal.
- Google sends its own booking confirmations. The sync does not send lead emails.

## Validation

Run `node tests/leads.test.cjs`, `node tests/consultations.test.cjs`, and `npm run build` before publishing. End-to-end activation requires the real Google account, configured secret, successful script execution and visible imported booking.
