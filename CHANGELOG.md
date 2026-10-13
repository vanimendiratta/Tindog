# Changelog

All notable changes to the **TinDog** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-10-13

### Added
- **Interactive Match Deck Simulator**: Fully playable swipeable dog profile stack with gesture drag support, Pass (❌), Super Like (⭐), Like (❤️), and keyboard navigation (`←`, `↑`, `→`).
- **Match Celebration Modal**: Interactive celebration popup when a user likes/super-likes a dog profile, featuring avatar, details, and action prompts.
- **Dynamic Pricing Calculator**: Billing cycle toggle (Monthly vs Annual) with automated 20% discount rates and visual badge feedback.
- **Dark / Light Theme Engine**: System preference detection (`prefers-color-scheme`), local storage persistence, and accessible theme toggle button.
- **App Download & Lead-Capture Modal**: Multi-platform download triggers (iOS, Google Play) and VIP pup waitlist email subscription with validation.
- **Automated Test Harness**: 17 unit and DOM component tests powered by Vitest and JSDOM.
- **GitHub Actions CI**: Automated multi-version Node.js workflow validating linting, testing, and production builds on push/PR.
- **Asset Linter**: Custom script `scripts/lint.js` checking DOCTYPE, language attributes, viewport meta tags, typo prevention, and local asset references.
- **Engineering Documentation**: Complete `README.md`, `docs/PROJECT_AUDIT.md`, `docs/IMPLEMENTATION_PLAN.md`, `CONTRIBUTING.md`, `SECURITY.md`, and real application screenshots.

### Fixed
- **Mobile Viewport Meta Tag**: Added `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, eliminating mobile rendering zoom-out bug.
- **Fragile FontAwesome Script**: Replaced unauthenticated private kit script with public Font Awesome 6.5.1 CDN.
- **Typography & Layout Defects**: Corrected `"Pirority Listing"` typo in Mastiff plan to `"Priority Listing"`; aligned all card heights uniformly with `.h-100`.
- **Accessibility & Contrast**: Added skip-to-content anchor, semantic `<main>`, descriptive `aria-label`s on icon buttons, and improved text contrast.
- **Testimonial Image Distortion**: Fixed percentage width sizing on testimonial photos to responsive circular aspect ratios.

---

## [1.0.0] - 2023-01-26

### Added
- Initial static landing page with Bootstrap 5 grid layout.
- Hero header with mobile phone mockup and download buttons.
- Features value propositions and press coverage showcase.
- Testimonial carousel and static subscription pricing table.
