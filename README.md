# AICANFEEL Diwali Party

Public site: https://global0809.github.io/aicanfeel-diwali-party/

6 November 2026, **8 PM IST**. Hosted by AICANFEEL at DU-131, PitamPura, New Delhi.

## Run

Node.js is the only runtime dependency. GSAP and ScrollTrigger are vendored locally.

```sh
npm run build
npm run check
npm run dev
```

Local preview: http://127.0.0.1:4193/ . `node scripts/prepare-pages.mjs` prepares the GitHub Pages project-path edition under the sibling pages-preview folder. The published gh-pages branch contains that prepared static output. Source is on main.

## Experience

The original HAPE gorilla, rig, outfit and native Vue/OGL rendering remain. A single monotonic camera path starts at an extreme face close-up and pulls wide while orbiting. A native 48-link gold chain carries raised Diwali / Party lettering and follows the Spine2 bone.

The ending contains one Yayyyy button. It triggers finite Diwali fireworks and reveals an animated foil invitation pass. The pass can be downloaded as PNG. There is no name field, menu, calendar, directions control, RSVP service or admission system.

## Phone budgets

Phone rendering uses two fur shells, four bloom passes, a smaller chain mesh and adaptive DPR capped at 1. The renderer pauses when hidden or covered by the invitation. Twenty phone JPEG variants reduce their source JPEG weight from 5.22 MB to 1.07 MB. Native gzip buffers use DecompressionStream with raw-file fallback. Active phone binary resources fall from 6.07 MB to 2.54 MB. Original desktop texture URLs and source binaries remain intact.

Hidden trailer, audio and debug texture requests are disabled. Reduced motion provides a static stage and instant invitation reveal without fireworks. Reduced transparency uses solid surfaces.

## Source guide

- dist/index.html, diwali.css, diwali.js: story, copy, scroll orchestration and embers.
- dist/invite-card.js/css: Yayyyy, fireworks, floating pass and PNG.
- scripts/camera-runtime.mjs: camera and render budgets.
- scripts/party-chain-runtime.mjs: native accessory integration.
- scripts/build-party-chain.py: offline Blender geometry builder.
- scripts/compressed-assets-runtime.mjs: native binary compression and loader fallback.
- scripts/mobile-textures.py and mobile-textures-runtime.mjs: offline phone image generation and runtime selection.
- scripts/adapt-reference.mjs: guarded runtime build.
- scripts/prepare-pages.mjs: GitHub Pages router and asset prefix preparation.

## Validation and limits

Desktop1440x900, touch390x844, 320px layout and reduced-motion journeys were checked. Both device contexts loaded 13 native skinned meshes, with no page errors, failed requests or horizontal overflow. The camera is monotonic, chain text reads Diwali Party, Yayyyy reveals the card, fireworks stop and PNG export works. See VERIFICATION.md for measured details.

Browser emulation and laboratory scores do not certify physical-device frame rates or universal compatibility. The native 3D scene still carries a substantial model and shader workload.

## Provenance

HAPE is the user-supplied visual authority: https://www.hape.io/ . The gorilla, native renderer, fonts and source assets are retained reference material. Camera direction, party accessory and invitation are adaptations. This project does not claim official HAPE affiliation or independent authorship of the retained assets.
