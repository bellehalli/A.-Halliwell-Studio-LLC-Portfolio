# A. Halliwell Studio V2
Production application foundation for the real A. Halliwell Studio business.

## What is live in this build
- Next.js App Router architecture
- Homepage
- Live-work publishing gate
- Work, Services and Studio routes
- Interactive Capabilities Lab
- Three-step project configurator
- Real server-validated inquiry endpoint
- Booking route prepared for calendar integration
- Responsive production UI
- Security headers

## Intentionally NOT faked
- Stripe is not connected until real business configuration is supplied.
- Calendar availability is not invented.
- Inquiry persistence/email delivery needs a real destination/provider before launch.
- Vanta is stored as draft because no verified live URL is configured.
- VELLUM and other undeployed concepts are not included.

## Assets
Copy your existing flower-backdrop.png, flower-icon.png, jelly-heart.png and sparkle.png into /public if you want to reintroduce the exact V1 art assets during the polish sprint.

## Run
npm install
npm run dev

## Vercel
Import the repository as a Next.js project. No secrets are required for this foundation build.
