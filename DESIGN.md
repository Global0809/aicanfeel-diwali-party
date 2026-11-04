---
name: AICANFEEL Diwali Party
description: A native HAPE red experience with a personal party invitation.
colors:
  stage-red: "#a4000b"
  loader-red: "#a0060d"
  loader-ink: "#210308"
  invitation-deep: "#21030b"
  white: "#fff9f2"
  muted: "#f1cfc9"
  gold: "#f4c989"
  pass-white: "#fff4e7"
  pass-gold: "#f7d49b"
  pass-muted: "#eac3b5"
  entry-gold: "#ffdfaa"
typography:
  display:
    fontFamily: "Integral CF, sans-serif"
    fontSize: "clamp(34px, 4.1vw, 74px)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Neue Plak Extended, sans-serif"
    fontSize: "clamp(13px, 1.04vw, 16px)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Druk Text Wide, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.6
rounded:
  pass: "18px"
  pass-phone: "16px"
  pill: "100px"
spacing:
  story-inset: "7.5vw"
  header-inset: "4vw"
  pass-inset: "36px 38px 34px"
components:
  button-save:
    backgroundColor: "{colors.pass-white}"
    textColor: "#46090d"
    rounded: "{rounded.pill}"
    padding: "17px 23px"
  button-entry:
    backgroundColor: "{colors.entry-gold}"
    textColor: "#340308"
    padding: "16px 21px"
---

# Design System: AICANFEEL Diwali Party

## Overview

**Creative North Star: "The HAPE Red Night"**

The user-pinned HAPE red world remains the visual authority: original gorilla and outfit, native fur and neon bars, Integral CF display lettering, Druk Text Wide labels, and Neue Plak Extended body text. Party adaptations belong inside that reference world. The gold chain is native geometry with raised lettering.

The loader builds anticipation with oversized black lettering, a warm orbital diya, and rotating adult party jokes. The stage remains open around the character. The ending resolves into one foil invitation pass rather than a form or service interface.

**Key Characteristics:**

- Preserved native character, typography, and full camera orbit.
- Red stage, warm text, and gold accents.
- Witty short copy with explicit DBYOB meaning.
- One celebratory pass reveal after an honest readiness gate.

## Colors

Stage Red anchors the retained world; Loader Red and Loader Ink establish the entry screen. White and Muted serve story copy. Gold marks emphasis, facts, focus, and embers. The pass has its own warm white, gold, and muted text over Invitation Deep. Entry Gold marks the sound entry action.

**The Red World Rule.** Keep the user-selected red identity; do not introduce alternate themes.

## Typography

Preserve the three self-hosted reference families and their roles. Main headings are uppercase and tightly led; story text uses a short measure up to 36ch. Functional controls use readable wide labels. The loader and foil pass have larger display variants derived from their actual CSS; do not flatten every surface into one size.

**The Reference Lettering Rule.** Keep original font assets; do not substitute a system display face as a redesign.

## Layout

The fixed native canvas sits behind three open stage panels. Desktop copy alternates sides around the character. A sparse fixed brand/date/sound header and bottom invitation pill provide shortcuts; there is no hamburger. At phone widths the copy and pass reflow without horizontal overflow. The landscape desktop pass becomes portrait below 650px, with additional compact adjustments at 370px.

The full-screen loader has a desktop copy/orbital composition and a compact phone layout. It locks scrolling and page interaction, traps focus, and restores prior state on exit. Quotes are visual, not repeated live announcements.

## Elevation & Depth

The original 3D scene supplies the main depth. Native neon, bounded gold embers, and a short glass veil support the camera movement. The foil pass combines a metallic border, refractive sweep, translucent wine material, perspective arrival, and a soft offset shadow. Reduced transparency replaces translucent surfaces with solid alternatives.

## Shapes

Keep story panels unboxed. Pills belong to primary actions; the invitation pass uses softly rounded ticket corners and a perforated stub. The loader uses a precise diya symbol, elliptical orbits, and a small number of light points.

## Components

### Native Stage

Forward scrolling evaluates the original **HAPE Camera_Splines_002** camera and target splines once over progress 0 → 1. Their measured orbit is **379.436836°**. Preserve native light/scale choreography and pointer parallax. ScrollTrigger scrub is .65 seconds; native damping accounts for frame time. Do not restore the older -16° → 47° replacement camera.

### Loader and Sound Entry

The progress bar follows native asset-completion events. Ready entry appears only after 13 skinned meshes, three GL warmup frames, and settled fonts. Primary entry synchronously unlocks the original ambient audio from the click; quiet entry requests no audio. An explicit model-error/timeout state offers retry or a quiet invitation fallback. The exit takes at most .66 seconds and becomes immediate for reduced motion.

### Yayyyy and Foil Pass

Yayyyy is the only action before reveal. It starts finite fireworks and reveals the hovering foil pass; PNG save follows. The page, pass, and PNG retain 6 November 2026, 8 PM IST, the host, venue, and **DBYOB — Don’t Bring Your Own Booze**. Reduced motion holds a static native pose at .97 and reveals the card immediately without fireworks or decorative arrival/hover.

### Sound Control

The fixed header exposes sound state and a keyboard-accessible toggle. The original ambient loop loads only after opt-in and reuses its decoded buffer. Quiet entry is an equally visible option.

## Do's and Don'ts

### Do:

- **Do** preserve the original gorilla, outfit, fonts, and native full orbit.
- **Do** show the native Diwali Party chain and one Yayyyy reveal.
- **Do** keep 8 PM, DBYOB meaning, host, and venue synchronized across surfaces.
- **Do** retain the honest readiness gate, quiet entry, error fallback, focus, and reduced motion.

### Don't:

- **Don't** restore the earlier 63° camera approximation or invent another camera path.
- **Don't** reintroduce name entry, calendar, directions, hamburger, or unrelated service UI.
- **Don't** fetch audio before opt-in or replace chain lettering with DOM text.
- **Don't** turn emulated browser results into physical-device FPS claims.
