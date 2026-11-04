# AICANFEEL Diwali Party

Public final v3: [AICANFEEL Diwali Party](https://global0809.github.io/aicanfeel-diwali-party/?v=final). Published and verified without signing in on 4 November 2026.

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

**Enter the party — with sound** starts the reference’s original 19.252-second ambient loop from the click gesture. **Enter quietly** loads no audio. The header sound control can change the choice later. Audio is fetched on demand and reused from its cached buffer; it does not autoplay on module import.

The ending contains one **Yayyyy** action. It triggers finite fireworks and reveals a hovering foil invitation pass: landscape on desktop, portrait on phones. The pass and its 1800 × 1080 PNG include the confirmed event details, DBYOB copy, and the cab-home note. There is no name entry, hamburger menu, calendar, directions control, RSVP service, or admission system.

## Phone budgets

Phone rendering uses two fur shells, four bloom passes, a smaller chain mesh, and adaptive DPR capped at 1. Rendering pauses while hidden or covered by the invitation. Twenty phone JPEG variants reduce their source weight from 5.22 MB to 1.07 MB; active phone native binaries compress from 6.07 MB raw to 2.54 MB gzip. `DecompressionStream` has a raw-file fallback. Desktop source texture URLs and binaries remain intact.

Hidden reference trailer and debug texture requests are disabled. Original ambient audio is a separate opt-in request. Reduced motion holds a static native pose at progress .97, removes decorative movement and fireworks, and reveals the pass immediately. Reduced transparency supplies solid alternatives.

## Source guide

- `dist/index.html`, `diwali.css`, `diwali.js`: event copy, scroll, readiness gate, sound control, and embers.
- `dist/party-loader.js/css`: loader, quotes, entry choices, error recovery, focus and scroll handling.
- `dist/party-audio.js`: original ambient loop, gesture unlock, lazy loading, caching, and mute.
- `dist/invite-card.js/css`: Yayyyy, fireworks, foil pass, DBYOB copy, and PNG.
- `scripts/camera-runtime.mjs`: original spline traversal and render budgets.
- `scripts/party-chain-runtime.mjs` and `build-party-chain.py`: native accessory integration and offline Blender builder.
- `scripts/compressed-assets-runtime.mjs`: native binary compression and fallback.
- `scripts/mobile-textures.py` and `mobile-textures-runtime.mjs`: phone assets and selection.
- `scripts/adapt-reference.mjs`: guarded runtime generation.
- `scripts/prepare-pages.mjs`: GitHub Pages project-path preparation.

## Validation and limits

Final v3 browser journeys passed at 1440 × 900 desktop, touch-enabled 390 × 844, and 320 × 740. Checks cover the native full orbit, readiness gate, 13 meshes, quiet and sound entry, DBYOB pass, finite fireworks, PNG, reduced motion, and model-failure fallback. Quiet entry made zero audio requests; sound entry fetched the original ambient once and reused its buffer. Focused loader Lighthouse checks scored accessibility 100 and best practices 100. See `VERIFICATION.md` for scope.

Browser emulation and lab scores do not establish physical-device FPS or universal compatibility. The retained native 3D scene still has a substantial model and shader workload. The published phone journey also passed, including sound, orbit, and card reveal with no page errors or failed assets.

## Provenance

[HAPE](https://www.hape.io/) is the user-supplied visual authority. The gorilla, native renderer, fonts, original ambient audio, and source assets are retained reference material. Party copy, chain, loader, orchestration, and invitation are adaptations. This project does not claim official HAPE affiliation, independent authorship of retained assets, or certification of reuse rights. Earlier Sites publications remain separate.
