# A. Halliwell Studio Portfolio Functional v2

This pass deliberately stops the decorative asset experiment and prioritizes a factual, working portfolio system.

## Asset rule

Use only:
- background images already in `/public/assets/backgrounds`
- glossy heart buttons already in `/public/assets/hearts`

The source no longer references decorative animations, flowers, objects, stickers, UI PNGs, icons or project screenshot assets.

## Functional routes

- `/`
- `/work`
- `/work/willow-lily`
- `/work/maison-riviere`
- `/services`
- `/studio`
- `/lab`
- `/resources`
- `/resources/wedding-venue-website`
- `/resources/website-redesign-checklist`
- `/newsletter`
- `/start`
- `/portal`

## Important behavior

- heart navigation never wraps on narrow desktop
- at 1180px it becomes one controlled heart menu
- project proof links to the real live websites instead of fake screenshots
- the real inquiry builder still posts to `/api/inquiry`
- resources only link to included pages
- newsletter clearly states that subscriptions are not active
- client portal remains an honest access gateway until real auth/data infrastructure exists
- Studio OS/admin is not part of this public portfolio

Keep the existing repository `public/` directory and Vercel environment variables when applying this ZIP.
