---
name: AICANFEEL Diwali Nights
description: A personal Diwali invitation in the preserved HAPE red world.
colors:
  stage-red: "#950008"
  invitation-deep: "#1d030a"
  white: "#fff9f2"
  muted: "#f7cfc7"
  gold: "#f4c989"
  invite-white: "#fff7ef"
  invite-muted: "#eac6c3"
  invite-border: "rgba(255,240,226,.27)"
  button-ink: "#46090d"
typography:
  display:
    fontFamily: "Integral CF, sans-serif"
    fontSize: "clamp(36px, 4.15vw, 80px)"
    fontWeight: 800
    lineHeight: 0.93
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Neue Plak Extended, sans-serif"
    fontSize: "clamp(12px, 1.05vw, 16px)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Druk Text Wide, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  invite-card: "14px"
  primary-pill: "100px"
  toolbar-pill: "50px"
spacing:
  card-inset: "32px"
  card-inset-compact: "25px"
  primary-inset: "16px 23px"
components:
  button-primary:
    backgroundColor: "{colors.invite-white}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.primary-pill}"
    padding: "{spacing.primary-inset}"
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.button-ink}"
  invitation-card:
    textColor: "{colors.invite-white}"
    rounded: "{rounded.invite-card}"
    padding: "{spacing.card-inset}"
---

# Design System: AICANFEEL Diwali Nights

## Overview

**Creative North Star: "The HAPE Red Night"**

The user-pinned HAPE red experience is the visual authority. Preserve its gorilla, outfit, native lighting and camera vocabulary, self-hosted typography, oversized lettering, and compact fixed controls. Diwali copy and invitation tools inhabit that established world.

The composition gives the character room to perform. Warm white lettering and restrained gold details carry the invitation over a red stage; the final personal card settles into a deeper wine surface.

**Key Characteristics:**

- Original native 3D character and full-body opening.
- Bold uppercase display type with wide compact labels.
- Red stage, warm text, and restrained gold details.
- Sparse fixed controls and a functional invitation ending.

## Colors

### Primary

Stage Red anchors the loading surface and retained red world. The runtime supplies the native materials and compositing; overlay adjustments stay within the red family.

### Secondary

Gold marks facts, personal-card accents, feedback, selection, and focus.

### Neutral

White and Muted serve the story. Invite White and Invite Muted serve the personal card. Invitation Deep grounds the closing surface; Invite Border separates fields and facts; Button Ink makes pale actions readable.

**The Red World Rule.** Preserve the red visual authority. Do not introduce alternate themes or a theme switcher.

## Typography

Display uses self-hosted Integral CF; labels and the wordmark use self-hosted Druk Text Wide; body and form text use self-hosted Neue Plak Extended. Keep these role assignments.

Main headings are uppercase, tightly led, and balanced. On phones their size becomes `clamp(34px, 9vw, 49px)` with line height `.96`. Story paragraphs use short measures, generally `31ch`; the invitation editor uses up to `34ch`. Card micro type is distinct from the larger functional action labels.

**The Reference Lettering Rule.** Keep the reference font assets and role hierarchy; do not substitute a system display face as a redesign.

## Layout

The native canvas is a fixed, inert background. Three story panels occupy at least one viewport each. Desktop copy sits beside the character and changes sides for the middle moment. Desktop story inset is `8.2vw`; fixed header and toolbar inset is `3.7vw`.

At widths up to `650px`, panels use the small viewport height and bottom-align copy with a readability gradient. Side inset becomes `7vw`. The header date and toolbar side facts yield to the phone composition; the host block carries the date. The invitation stacks from two columns to one. Intermediate adjustments occur at `1000px` for the story and `900px` for the invitation.

## Elevation & Depth

The retained 3D scene supplies the main depth. A brief glass veil bridges settled camera positions. The closing card uses a translucent wine gradient, a fine border, a soft light reflection, and backdrop blur; it is a specific invitation object, not a general container style.

The bottom invitation pill retains its reference-like inset and small offset shadow. Keep that treatment bounded to this control. Reduced transparency replaces the translucent card and menu with solid surfaces.

## Shapes

Large story areas stay open and unboxed. The invitation card has gently rounded corners; primary and bottom invite actions are pills; the menu toggle is circular. Name entry uses an underline. Card ellipses are geometric light accents.

## Components

### Navigation

The header combines the host wordmark, desktop date shortcut, and menu toggle. The full-screen menu uses large Integral CF links, traps keyboard focus, closes with Escape, and returns focus to its toggle. The bottom invite control yields when the invitation becomes visible.

### Buttons

The pale primary save pill has dark text, a gold hover state, and a slight lift. It disables while saving and reports live status. Secondary actions use underlined text. Keyboard focus uses a gold outline.

### Inputs / Fields

Name entry is transparent with a fine underline, gold focus, and gold caret. Missing names produce a specific live message and focus the input. Long names wrap in the preview and fit the exported PNG.

### Personal Invitation

The card previews a name, deterministic message and decorative code, and confirmed event facts. Its desktop tilt is smaller on phones and removed for reduced motion. PNG export is a separate authored composition.

### Native Stage

Keep `Hapes_0003_Rigged` in its Vue/OGL pipeline with the chain removed. The scroll sequence follows native progress `.99 → .46 → .99`, with brief glass transitions and restrained red-family shifts. Reduced motion holds `.99`, freezes animation time, and removes the veil. Preserve the mesh, outfit, lighting, and material identity.

## Do's and Don'ts

### Do:

- **Do** preserve the user-selected HAPE reference, original gorilla, and font assets.
- **Do** maintain clear event facts and working invitation actions on phones.
- **Do** retain keyboard focus, live status, and reduced-motion behavior.
- **Do** verify the actual card, long names, and downloads after changes.

### Don't:

- **Don't** restore the added chain, theme switcher, or alternate theme journey.
- **Don't** replace the native gorilla with a procedural approximation.
- **Don't** spread glass or cards across the open story composition.
- **Don't** treat a decorative code as admission security or imply official HAPE affiliation.
