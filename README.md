# Verid — Identity, made human.

Verid is a digital identity verification and trust infrastructure concept — an API-first platform built for businesses that can't afford to get "is this really them?" wrong, or slow.

This repository contains the front-end submission for Web Dev Challenge — a multi-page marketing website designed and built from the ground up around one idea: **prove the product's speed, don't just claim it.**

---

## Live Site
**https://verid-verify-trust-platform.netlify.app(#)** ← replace with your GitHub Pages / Netlify link once deployed
---

## The Idea
Manual identity verification is slow — what could resolve in seconds instead takes days, and every extra day of onboarding friction costs businesses real customers. Verid's pitch is simple: one API call, three checks (document authentication, face match, liveness detection), under two seconds, with a full audit trail for compliance teams.

The homepage keeps that promise clear and focused, while the dedicated product and developer pages carry the deeper verification flow, API, and sandbox detail.

## Pages
| Page | Purpose |
|---|---|
| **Home** (`index.html`) | Concise brand introduction, platform preview, trust proof, solution preview, and primary CTA |
| **Platform** (`platform.html`) | Explains the mechanics — document auth, face match, liveness |
| **Solutions** (`solutions.html`) | Maps real customer problems to the product that solves them, by industry |
| **Developers** (`developers.html`) | A self-serve, zero-sales-call path — code samples, sandbox key generator |
| **Company** (`company.html`) | Mission, vision, and the story behind the brand |
| **Contact** (`contact.html`) | Business, demo, and developer enquiry paths |

## Design System
- **Typography:** Instrument Sans throughout — heavy display weights for headlines, calm body weights for copy
- **Color:** a warm ivory base with a single confident indigo "signature field" per page, mint reserved exclusively for verification/success states, and one structural warm accent used only on the Solutions page
- **Motif:** a recurring "closing verification ring" ties every page together, evolving in scale and crop rather than repeating identically
- **Icons:** [Lucide](https://lucide.dev/), loaded via CDN
## Tech Stack
- Plain **HTML5**
- Plain **CSS3** (custom properties, Grid, Flexbox, no preprocessor)
- **Vanilla JavaScript** — no framework, no build step, no bundler
Everything runs directly in the browser with zero installation. Clone it, open `index.html`, done.

## Running Locally
```bash
git clone https://github.com/YOUR-USERNAME/verid-site.git
cd verid-site
```

Then just open `index.html` in your browser — or, for correct relative paths, serve it locally:

```bash
# Python 3
python -m http.server 8000
```

and visit `http://localhost:8000`.

## Project Structure
```
/
├── index.html              # Home — hero + live verification demo
├── platform.html           # Platform mechanics
├── solutions.html          # Industry mapping
├── developers.html         # Developer / sandbox path
├── company.html            # Mission & story
├── contact.html            # Demo and business enquiries
├── README.md
├── .gitignore
│
├── css/                    # Stylesheets, one file per concern
│   ├── tokens.css          #   design tokens (colour, type, spacing, geometry)
│   ├── base.css            #   reset, base type, scroll-reveal system
│   ├── layout.css          #   containers, section rhythm
│   ├── typography.css      #   display + body type scale
│   ├── components.css      #   shared components, curve engine, CTA contract
│   ├── navbar.css          #   navigation (camouflage surface, mobile menu)
│   ├── footer.css          #   site footer
│   ├── home.css            #   Home-specific compositions
│   ├── platform.css        #   Platform-specific compositions
│   ├── solutions.css       #   Solutions-specific compositions
│   ├── developers.css      #   Developers-specific compositions
│   ├── company.css         #   Company-specific compositions
│   └── contact.css         #   Contact-specific compositions
│
├── js/
│   ├── nav.js              #   navigation, mobile menu, desktop dialogs
│   ├── demo.js             #   self-playing verification demo state machine
│   ├── icons.js            #   Lucide icon initialisation
│   ├── copy-to-clipboard.js#   developer panel copy affordance
│   ├── sandbox-key.js      #   client-side sandbox key generator
│   └── main.js             #   bootstrap, scroll-reveal, section tracking
│
├── images/                 # Organised by purpose, not by page
│   ├── home/
│   ├── platform/
│   ├── solutions/
│   ├── developers/
│   └── company/
│
├── icons/                  # Local icon assets (Lucide via CDN by default)
├── fonts/                  # Instrument Sans web fonts
└── .ai/                    # AI/planning notes — git-ignored, not part of the build
```

## Key Features
- Fully responsive across mobile, tablet, and desktop — layouts recompose rather than simply shrink
- Live, stateful verification demo built in vanilla JavaScript
- Working copy-to-clipboard developer panel and client-side sandbox key generator
- Accessible: keyboard-navigable menu with focus trapping, visible focus states, semantic HTML throughout
- Respects `prefers-reduced-motion` for all animated elements
---

*Built for [Web Dev Challenge], [2026].*
