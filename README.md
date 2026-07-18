# Cybercon Solutions — Marketing Site

> *"Technology, handled."*

Astro and Tailwind CSS implementation of the Cybercon Solutions marketing site, aligned to the 2026 Brand Identity Guidelines.

## Run it

Install dependencies and start Astro:

```bash
npm install
npm run dev
```

Run `npm run build` to create the static Netlify output in `dist/`.

## What's here

```
.
├── src/pages/index.astro   ← marketing site
├── src/styles/global.css   ← Tailwind entry + approved brand tokens
├── astro.config.mjs        ← Astro + Tailwind integration
├── public/                 ← browser JavaScript and static assets
├── styles.css              ← page styles
├── tokens.css              ← design tokens + fonts (CSS custom properties)
├── app.js                  ← sticky header, smooth-scroll, form, floating CTA
├── fonts/                  ← Poppins (8 weights) + Nunito variable
├── assets/brand/           ← logos, mark, colorkit
└── design-system/          ← full brand spec + original prototype + preview cards
    ├── HANDOFF.md          ← original handoff README (coding-agent instructions)
    ├── README.md           ← brand spec: voice, color, type, layout, motion
    ├── SKILL.md            ← Agent Skill manifest (cybercon-solutions-design)
    ├── chat-transcript.md  ← original design-iteration chat
    ├── colors_and_type.css ← tokens (mirror of root tokens.css)
    ├── fonts/              ← mirror
    ├── assets/brand/       ← mirror
    ├── ui_kits/website/    ← original React+Babel prototype (source of truth)
    └── preview/            ← per-token preview cards (23 HTML files)
```

## Sections implemented

- **Header** — sticky, blurs at scroll > 8px
- **Hero** — promise headline, twin CTAs, trust row, and an on-brand flat SVG illustration (managed-IT dashboard + shield + endpoint) with a restrained draw-in/fade entrance and one gentle "live" status pulse
- **Stats** — uptime / first response / endpoints / tenure, magenta accent suffixes, count-up on scroll into view
- **Our Method** — ExoSource-style 3-step layout recolored to the Cybercon palette: continuous charcoal connector hairline, magenta tick per step, large `01 Assess → 02 Optimize → 03 Manage & support` numerals
- **Logo** — rendered as an inline lockup (vector shield-network mark + Poppins ExtraBold wordmark, `CYBERCON` charcoal / `SOLUTIONS` magenta) in the header and footer, so the wordmark uses real Poppins and theming stays token-driven. The standalone mark lives at `assets/brand/mark-cybercon.svg` (favicon)
- **Services** — 3×2 grid with charcoal icon tiles and magenta corner dots: AI Automation, Managed IT &amp; Help Desk, Cybersecurity, Cloud &amp; Microsoft 365, Compliance &amp; Backup/DR, vCIO &amp; Strategy
- **Pricing calculator** — ExoSource-style estimate tool recolored to the Cybercon palette: stepper inputs for stations / users / servers + four add-on toggles, live total in a charcoal result card. Capped at &lt;50 workstations
- **Inverse callout** — charcoal band with tagline, magenta spark on "simplest"
- **Contact** — two CTA cards (`Get started today. Contact us.` for new business, `Already a client? Need support?` for support, headings copied from ExoSource) beside a working cosmetic form with success state
- **Footer** — inverse band, link columns, social icons, legal row
- **Floating CTA** — magenta pill bottom-right, slides in past 600px scroll

## Design source

The full brand spec lives in [design-system/README.md](design-system/README.md). Read it before adding new components — it documents voice, casing, color rules, type scale, spacing, motion curves, and what *not* to do (no gradients, no parallax, no emoji in marketing, no magenta as a wash).

The original React+Babel prototype is preserved at [design-system/ui_kits/website/](design-system/ui_kits/website/) as the source of truth for component visuals.

## Notes & caveats

- **Icons** are Lucide via CDN — a substitution flag from the original brief. When the WordPress / X-Theme bundle ships its own icon set, swap and keep the 1.5px monoline weight.
- **Contact form is cosmetic only** — it validates (name/email/message, inline errors, honeypot, loading state) then fakes a 600ms submit into a success state. Wire it to a real endpoint when one exists.
- **NAP is placeholder** — sales `(954) 555-0143` / `hello@cyberconsolutions.com`, support `(954) 555-0145` / `support@cyberconsolutions.com`, and the street address in the `LocalBusiness` JSON-LD are stand-ins. Replace with real details before launch (search the repo for `555-014` and `TODO`).
- **Pricing rates are placeholders** — the per-unit and add-on prices live in the `RATES` object in [app.js](app.js) (`initPricing`). Adjust them to real Cybercon pricing; the tool is an estimate and routes everyone to a "tailored quote" via the contact form.
- **SEO** — `index.html` ships Open Graph/Twitter cards and `ProfessionalService` JSON-LD for Cooper City. Swap the OG image for a 1200×630 PNG and confirm the canonical URL before launch.
- **Motion** — scroll reveals, stat count-ups, active-section nav, and the hero entrance are all in `app.js`/`styles.css`, fully gated behind `prefers-reduced-motion` and degrading to fully-visible with no JS.
- **WordPress port** — the brand brief targets WordPress / X-Theme / Cornerstone. This static site is a faithful visual reference; reproduce sections as Cornerstone rows/columns and prefix custom CSS with `.cy-` per the SKILL.md guidance.
