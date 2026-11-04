# AICANFEEL Diwali Nights

A separate invitation around the user-selected HAPE red experience. Event: **6 November 2026, 7:30 PM IST**, hosted by **AICANFEEL** at **DU-131, PitamPura, New Delhi**.

The original `Hapes_0003_Rigged` gorilla, outfit, materials, native animation, and Vue/OGL renderer remain. This copy removes the earlier added chain and theme switching, adds a Diwali scroll story, and ends with a personal invitation. It does not change the previous sites.

## Run locally

Use Node.js; no dependency installation is required.

```sh
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4193`. The server serves `dist/` and supports media byte ranges. The build adapts the supplied runtime; it is not a fresh framework compilation. The check command checks JavaScript syntax, not browser behavior.

## Files to edit

- `dist/index.html`: event copy, sections, and runtime loading.
- `dist/diwali.css` and `dist/diwali.js`: overlay, menu, scroll choreography, and accessibility behavior.
- `dist/invite-card.css` and `dist/invite-card.js`: preview, PNG, sharing, calendar, and directions.
- `vendor/reference-runtime.js`: retained runtime input; preserve the character and rendering identity.
- `scripts/adapt-reference.mjs`: guarded transformations that generate `dist/assets/index.diwali-red-v1.js` and the retained runtime alias. Change adaptations here instead of editing generated runtime files.
- `dist/vendor/`: vendored GSAP and ScrollTrigger.
- `PRODUCT.md`, `DESIGN.md`, and `.impeccable/`: product truth, extracted visual guidance, and review evidence.

Fonts and 3D assets are local. Legacy files in the copied distribution are not a list of active features; the current HTML loads the Diwali runtime.

## Invitation behavior

The `<diwali-invite>` element previews a guest name, saves a 1200 × 1530 PNG, copies a URL using `#invitation?guest=...`, downloads an `.ics` file, and opens Google Maps directions. Names are normalized and limited to 48 Unicode code points. A fragment restores the personal preview on reload. Clipboard failure exposes selected text for manual copying.

These are browser-side tools. There is no RSVP, guest database, backend, or admission check; the code is decorative. The calendar start is `2026-11-06T14:00:00Z`, equivalent to 7:30 PM IST. No unconfirmed end time is supplied.

## Validation and limits

Recorded local browser QA covers desktop at 1440 × 900 and a touch-enabled phone viewport at 390 × 844: no page errors or horizontal overflow, 11 native meshes, and one red compositor. Name restoration, PNG download, and calendar export were checked. Evidence and export samples live in `.impeccable/review/`.

Reduced motion holds the stage at `.99`, freezes native animation time, removes the veil, and disables decorative motion. Reduced transparency supplies solid closing surfaces. Browser emulation does not establish physical-device GPU speed or FPS. Public deployment and unauthenticated access require separate verification.

One Lighthouse mobile-preset run scored performance 61, accessibility 100, and best practices 100. The retained native 3D pipeline remains heavy: approximately 19.6 MB transferred, 9 s speed index, 8.01 s total blocking time, and 77.2 s time to interactive under laboratory throttling. These are single-run lab measurements, separate from the passing functional and emulated-layout checks.

## Reference provenance

The visual authority is [HAPE](https://www.hape.io/), supplied through its [Awwwards reference](https://www.awwwards.com/sites/hape). The gorilla, reference runtime, fonts, and related assets are retained reference material; the Diwali overlay and invitation are adaptations. This project does not claim independent authorship of those assets, official HAPE affiliation, or certification of reuse rights.
