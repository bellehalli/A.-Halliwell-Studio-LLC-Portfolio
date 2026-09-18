# A. Halliwell Studio

Production website for A. Halliwell Studio LLC, an independent creative web design and development studio creating custom digital experiences around how businesses actually work.

## Current Build

The site currently includes:

- Responsive editorial homepage
- Persistent floral visual system
- Selected Work
- Dynamic project case studies
- Interactive capability playground
- Project brief configurator
- Responsive navigation
- Reduced-motion support
- Accessibility and keyboard states
- Real external project links
- Project media fallback system

## Selected Work

### Willow Lily
Luxury hospitality and wedding venue digital experience.

https://willowlilyestate.com

### Maison Rivière
Hospitality and events digital experience.

https://www.maisonrivieredetroit.com

Only completed projects with real, publicly accessible websites are included in Selected Work.

## Technology

- Next.js 16
- React 19
- TypeScript
- Next.js App Router
- CSS
- Vercel

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  work/
    [slug]/
      page.tsx

components/
  CapabilityPlayground.tsx
  Navigation.tsx
  ProjectMedia.tsx
  ProjectShowcase.tsx
  StartProject.tsx

data/
  projects.ts

public/
  decorative assets
  projects/
    willow-lily/
    maison-riviere/
