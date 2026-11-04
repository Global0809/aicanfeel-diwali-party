# Verification — final v3

## v3.2 mobile fidelity — 4 November 2026

The higher-detail phone profile retains 11 authored character color/normal JPEGs byte-for-byte. Face color/normal and shirt normal maps increase from 1024 to 2048; body/hat normals increase from 512 to 1024. All 20 generated maps decode with verified dimensions. JPEG transfer is 3,672,870 bytes versus the previous 1,071,673 bytes; environment and auxiliary shading maps stay compact. Original source assets and earlier phone variants are untouched.

The original native DPR ceiling of 1.5 is restored on phones. Adaptive quality clamps to a floor of 1.15 on high-density devices, or 1 on DPR-1 screens. Native fur/bloom/chain budgets, geometry compression, pauses, loader readiness, and original camera splines remain. Read-only review confirmed `runCameraProgress` is byte-identical to the reference.

Prepared browser journeys passed at 390 × 844 / DPR 3, 320 × 740 / DPR 2, and desktop 1440 × 900 / DPR 1. Phone drawing buffers were 585 × 1266 and 480 × 1110; both fetched all 20 HQ maps and zero earlier phone maps. The decoded face color map was 2048 × 2048. All profiles loaded 13 meshes, entered with working sound, and had no failed requests, page errors, or horizontal overflow. The main phone journey also traversed the camera and revealed the correct invitation. Desktop fetched no phone textures. These observations do not establish physical-device FPS.

Asset namespace `assets-mobile-hq5`, application suffix `.mobilehq5`, and new `/mobile-textures/hq/` URLs prevent stale-cache mixing. Root, `?v=final`, and `/invite/` URLs are retained.

Public verification passed after GitHub Pages built `ed6d61ce183da606561550595e196da9cc4ef706`, from application source `b1b5e66a8c8ae0a30abebe19117ee77fe8b6e4ce`. All three existing URLs returned 200 and referenced the HQ bundle. An unauthenticated 390 × 844 / DPR-3 touch browser loaded all 20 HQ textures and all 13 meshes, decoded the face map at 2048 × 2048, and rendered to 585 × 1266 at DPR 1.5 with the configured 1.15 floor. Sound entry worked; one brand occurrence, no overflow, no page errors, and no failed requests were observed. Existing recipients do not need a new link.

## v3.1 refinement — 4 November 2026

Local prepared `/invite/` journeys passed at desktop 1440 × 900 and touch phone 390 × 844. Both loaded 13 meshes, offered exactly one **Enter with sound** button, fetched no audio before that click, and played the original ambient after it. Rendered body text contained exactly one AICANFEEL occurrence; the loader and card contained none. Quiet entry and One More Round were absent.

The redesigned pre-reveal stage, Yayyyy, finite fireworks, and PNG export passed. Card breathing transforms changed over a 700 ms sample on both profiles while no fireworks frame remained active. The phone layout also fit 320 × 740 without overflow; reduced motion disabled the continuous card animation. Page errors and failed requests: none.

Static Open Graph/Twitter tags specify a brand-free 1200 × 630 JPEG, a concise invitation title, date/time, and DBYOB. The JPEG weighs 117,919 bytes. A new `/invite/` path serves the same full experience with matching canonical and graph URL. Custom modules use `.night4` names while native assets remain unchanged. Syntax and whitespace checks passed.

GitHub Pages built `900dea638e3479379871f58b8b36fd4792283ffd` from application source `7c823aa0b0177fc42917b49afcbf0a04ed47838f`. The existing `?v=final` link returned 200 and loaded the new modules in an unauthenticated 390 × 844 touch browser. One sound entry, 13 meshes, audio playback, a single rendered brand, removed controls, finite fireworks, constant card breathing, correct date/time, and no horizontal overflow passed. Page errors and failed requests: none. The image loaded publicly at 1200 × 630; a crawler-style request to `/invite/` returned 200 with the matching graph URL and image metadata. Actual messaging-app preview layout/cache is controlled by that app and was not tested by sending a message. The earlier v3 evidence below is historical.

4 November 2026. Local Chromium browser checks used the GitHub Pages project-path edition. This record covers the final native-orbit, loader, audio, DBYOB, and invitation revision. [Final v3 is public on GitHub Pages](https://global0809.github.io/aicanfeel-diwali-party/?v=final).

## Final functional journeys

- Desktop 1440 × 900, touch-enabled phone 390 × 844, and narrow phone 320 × 740 passed the final journeys, with no unexpected page errors or horizontal overflow.
- The original `Hapes_0003_Rigged` scene contains 13 native skinned meshes: 11 original meshes and two gold-chain meshes. Solid pendant lettering reads Diwali Party.
- The final camera uses the original **Camera_Splines_002** camera and target data over progress 0 → 1. Its measured full orbit is **379.436836°**.
- The loader displays native resource progress and rotating quotes. Entry remains gated until fonts settle, all 13 meshes are present, and three GL warmup frames complete. Quotes do not spam the live region.
- Quiet entry made **zero audio requests**. Sound entry requested the original 19.252-second ambient once and reused its cached buffer; the header toggle remained usable.
- Yayyyy revealed the responsive foil pass. Finite fireworks ended automatically. The pass and 1800 × 1080 PNG contain 6 November 2026 at 8 PM IST and the DBYOB message, **Don’t Bring Your Own Booze**.
- Name entry, hamburger, calendar, directions controls, RSVP service, and admission validation are absent.
- The explicit negative model-failure journey passed: the loader reported failure and offered retry or a quiet route to a usable invitation, without falsely announcing model readiness.
- Reduced-motion journeys passed: static native pose, no decorative loader/stage movement or fireworks, and immediate pass reveal. Scroll and page interaction were restored after entry/fallback.
- Final guarded native build was deterministic and syntax checks passed. Prepared final assets passed smoke checks; cache-isolation review found no blockers.

## Public delivery

GitHub Pages built `2320cee0aa1f4e6266df420ba91e1f6103dea958`, from application source `179f26ca32f258ef40d3ea991b0c55bd28435a3d`. Anonymous HTTP checks returned 200 for both the base URL and the final query URL, with the final loader and asset namespace present. Versioned final modules and `assets-final/` keep cached earlier modules separate.

An unauthenticated 390 × 844 touch browser loaded all 13 meshes and reached loader progress 100 before entry. Audio requests before entry: zero. Sound entry played the original cached ambient (decoded duration 19.1875 seconds). Actual native scene progress followed scroll to .897; all sampled pose values were finite. Yayyyy revealed the DBYOB pass with `2026-11-06T20:00:00+05:30`; fireworks stopped. Name inputs: zero. Page errors, failed requests, and horizontal overflow: none.

## Resource checks

Phone profiles retain two fur shells, four bloom passes, adaptive DPR at or below 1, and paused rendering when hidden or covered. Phone chain geometry is 8,660 triangles across two meshes; desktop chain geometry is 22,736 triangles across two meshes. Native hierarchy, finite geometry, normals, indices, and rigid Spine2 weights were checked.

Twenty phone JPEG sources compress from 5.22 MB to 1.07 MB. Active phone native binaries compress from 6.07 MB raw to 2.54 MB gzip, with a raw-file fallback. Desktop source texture URLs and binaries remain intact. Hidden reference trailer/debug requests are disabled; restored ambient audio is a separate consented request.

## Lighthouse and measurement scope

Focused loader Lighthouse checks scored **accessibility 100** and **best practices 100**. These scores apply to the checked browser surface; no final-v3 performance score or physical-device FPS is asserted. Earlier revision measurements used different camera/loader states and are not promoted to final-v3 performance results.

Browser emulation and laboratory checks do not certify physical-device frame rates, universal compatibility, or pixel-identical equivalence. The retained native 3D workload remains substantial. Retained HAPE character, runtime, fonts, assets, and original audio retain their reference provenance.
