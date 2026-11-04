# Verification

4 November 2026. Tested locally in Chromium through Playwright CLI.

- Desktop 1440 × 900 and touch phone emulation 390 × 844: no page errors, no horizontal overflow; original 11 skinned meshes and red compositor index 1.
- Scroll moved the retained camera from 0.99 to approximately 0.46 and changed the red stage hue/brightness continuously.
- Menu opened and Escape closed it.
- Personalization showed the entered name; copying and reopening the fragment link restored it.
- PNG export was downloaded and visually inspected at 1200 × 1530.
- Calendar export was downloaded; start time is 2026-11-06 14:00 UTC, equivalent to 7:30 PM IST.
- Reduced motion retains static scene progress 0.99 and removes the glass transition. The native introductory camera movement is also skipped.
- JavaScript syntax checks passed for both authored modules and the generated native runtime.
- Mechanical design scan ran once. Reference micro typography produced advisory size findings; functional navigation and primary actions were increased to 11 px.

The original renderer logs Canvas2D readback performance advisories. Browser checks do not establish physical phone FPS, universal device compatibility, exact visual equivalence, or production load performance. Assets retain their HAPE reference provenance.
