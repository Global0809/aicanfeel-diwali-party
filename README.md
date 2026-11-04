# AICANFEEL Diwali Party

Public revision: **v3.2**, improving mobile character fidelity. The existing [Diwali Party link](https://global0809.github.io/aicanfeel-diwali-party/), `?v=final`, and [/invite/](https://global0809.github.io/aicanfeel-diwali-party/invite/) are preserved and verified. Previously shared links need no replacement.

**6 November 2026, 8 PM IST.** Hosted by **AICANFEEL** at **DU-131, PitamPura, New Delhi**. **DBYOB: Don’t Bring Your Own Booze.**

## Run

Node.js is the only runtime dependency. GSAP and ScrollTrigger are vendored locally; no dependency installation is required.

```sh
npm run build
npm run check
npm run dev
```

Local preview: `http://127.0.0.1:4193/`. `npm run pages` prepares the GitHub Pages project-path edition in the sibling `pages-preview` folder. The `gh-pages` branch serves the prepared static output; source is on `main`. The build applies guarded adaptations to the retained runtime. The check command checks JavaScript syntax; browser journeys are recorded separately.

## Experience

The original HAPE gorilla, rig, outfit, fonts, and Vue/OGL renderer remain. Forward scrolling traverses the original **Camera_Splines_002** camera and target splines once, from progress 0 to 1. Their measured full orbit is **379.436836°**. Native light/scale choreography and pointer parallax remain. A 48-link thick gold chain carries solid raised **Diwali / Party** lettering and follows Spine2.

The full-screen loader presents an animated orbital diya and rotating party quotes. Progress comes from native asset-completion events. Entry unlocks only after fonts settle, all 13 native skinned meshes are present, and three GL warmup frames have rendered. A model error or timeout offers retry and a quiet route directly to the invitation.

**Enter with sound** is the single normal loader action. It starts the reference’s original 19.252-second ambient loop from the click gesture. The header sound control can mute it later. Audio is fetched on demand and reused from its cached buffer; it does not autoplay on module import. Model-error recovery still offers a direct invitation fallback.

The dedicated final stage contains one **Yayyyy** action. It triggers finite fireworks and reveals a foil invitation pass with gentle continuous breathing and foil light: landscape on desktop, portrait on phones. Reduced motion pauses the decorative movement. The pass and its 1800 × 1080 PNG include the confirmed event details, DBYOB copy, and the cab-home note. AICANFEEL appears visibly only in the top header. Name entry, hamburger, calendar, directions, and One More Round are absent.

The social preview uses a brand-free **1200 × 630 JPEG (117,919 bytes)** with the real gorilla, Diwali, 6 November, and 8 PM. Static Open Graph/Twitter tags are present in the HTML; `/invite/` serves the same complete experience with its own share identity. Prepared custom modules use `.mobilehq5` filenames and native assets use `assets-mobile-hq5/`, preserving cached earlier releases.

## Phone budgets

Phone rendering uses the native DPR ceiling of 1.5, with a conservative adaptive floor of 1.15 on high-density screens and 1 on DPR-1 screens. Face color/normal and shirt normal maps retain their authored 2048 resolution; other character detail maps retain their original 1024 resolution. All 11 character color/normal JPEGs are copied byte-for-byte from the native source, avoiding extra lossy recompression. The 20-map phone profile weighs 3.67 MB, up from 1.07 MB for the previous profile and below the 5.22 MB source set.

Two fur shells, four bloom passes, the smaller chain, visibility pauses, and gzip model loading remain. Active phone native binaries compress from 6.07 MB raw to 2.54 MB gzip with a raw-file fallback. Desktop source texture URLs and binaries remain intact.

Hidden reference trailer and debug texture requests are disabled. Original ambient audio is a separate opt-in request. Reduced motion holds a static native pose at progress .97, removes decorative movement and fireworks, and reveals the pass immediately. Reduced transparency supplies solid alternatives.

## Source guide

- `dist/index.html`, `diwali.css`, `diwali.js`: event copy, scroll, readiness gate, sound control, and embers.
- `dist/party-loader.js/css`: loader, quotes, sound entry, error recovery, focus and scroll handling.
- `dist/party-audio.js`: original ambient loop, gesture unlock, lazy loading, caching, and mute.
- `dist/invite-card.js/css`: Yayyyy, fireworks, foil pass, DBYOB copy, and PNG.
- `scripts/camera-runtime.mjs`: original spline traversal and render budgets.
- `scripts/party-chain-runtime.mjs` and `build-party-chain.py`: native accessory integration and offline Blender builder.
- `scripts/compressed-assets-runtime.mjs`: native binary compression and fallback.
- `scripts/mobile-textures.py` and `mobile-textures-runtime.mjs`: phone assets and selection.
- `scripts/adapt-reference.mjs`: guarded runtime generation.
- `scripts/prepare-pages.mjs`: GitHub Pages project-path preparation.

## Validation and limits

Prior journeys covered desktop and phone layouts, the native full orbit, readiness gate, 13 meshes, audio, pass, fireworks, PNG, reduced motion, and model-failure fallback. Revision v3.2 quality and publication evidence are recorded in `VERIFICATION.md`.

Browser emulation and lab scores do not establish physical-device FPS or universal compatibility. The retained native 3D scene still has a substantial model and shader workload.

## Provenance

[HAPE](https://www.hape.io/) is the user-supplied visual authority. The gorilla, native renderer, fonts, original ambient audio, and source assets are retained reference material. Party copy, chain, loader, orchestration, and invitation are adaptations. This project does not claim official HAPE affiliation, independent authorship of retained assets, or certification of reuse rights. Earlier Sites publications remain separate.
