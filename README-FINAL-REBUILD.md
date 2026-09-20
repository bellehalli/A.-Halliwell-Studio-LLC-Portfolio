# A. Halliwell Studio Final Portfolio Rebuild

This ZIP is a focused replacement patch for the existing production repository.

## Replace these files

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/navigation/Navigation.tsx`
- `components/visual/VisualUniverse.tsx`
- `components/projects/ProjectShowcase.tsx`
- `components/lab/CapabilityPlayground.tsx`

## Intentionally preserved

Do not replace or delete:
- inquiry API
- `components/forms/StartProject.tsx`
- project data
- project screenshots
- case study routes
- sitemap
- robots
- environment variables
- Resend configuration
- existing asset folders

## Decisions already made

- Floral backdrop is the continuous world.
- Sections are editorial sheets layered over the world.
- Heart navigation remains, with compact uppercase interface labels.
- Parisienne is removed.
- Fraunces handles editorial display.
- Bodoni Moda italic handles expressive accent typography.
- Inter handles body/interface text.
- Space Mono handles labels and technical language.
- Generic floating animation is removed.
- Objects are placed as narrative/structural props instead of all floating.
- Willow Lily remains warm, tactile and hospitality-led.
- Maison Rivière remains black, architectural and after-dark.
- Services are reduced visually and written more directly.
- Lab is a working demonstration, not a feature list.
- Studio is treated as a digital desk/workboard.
- Start Project remains a real inquiry builder.
- Footer returns to the floral universe instead of ending on a blank cream slab.
- Existing real inquiry backend and project data remain untouched.
- No fake projects were added.

## After upload

Run:

npm install
npm run build

Then inspect desktop and mobile before merging/deploying.
