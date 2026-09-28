# A. Halliwell Studio — production polish patch

Apply the folders in this ZIP over the root of the current `main` branch (`7473cbd`). Keep the existing files that are not present in the ZIP. Run `npm ci` and `npm run build` afterward.

Included: shared conversion footer, active heart navigation, work filters and business context, case study metadata and purpose, homepage copy and offer order, Lab reset and instructions, inquiry confirmation timeframe, Vercel Analytics event instrumentation, SEO preview image, privacy wording, and optimized WebP versions of 25 referenced PNG assets. Original PNG files remain for editing and rollback.

Vercel Web Analytics must be enabled in the project dashboard before page views and custom events appear. No personal form details are sent in custom events.

Verification: `npm run build` passed and all new WebP references resolve. A visual browser session could not be run in this workspace, so review desktop and mobile layouts in your preview before merging. The live inquiry delivery should be checked with the production Resend configuration.
