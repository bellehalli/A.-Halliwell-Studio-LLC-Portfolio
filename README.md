# A. Halliwell Studio — Stage 1
Production shell + homepage only.

This deliberately does NOT include booking, Stripe, API routes, onboarding, or the future multi-page application.

## Upload
Preserve the folders exactly:
- app/
- public/
- package.json
- tsconfig.json
- next.config.ts
- next-env.d.ts

If `public/ASSETS-REQUIRED.txt` exists, move the four existing PNG assets from the repository root into `/public` before deployment.

## Test
npm install
npm run build
npm run dev
