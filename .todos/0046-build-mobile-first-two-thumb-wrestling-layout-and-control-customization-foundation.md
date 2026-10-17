# 0046 — Build Mobile-First Two-Thumb Wrestling Layout and Control Customization Foundation

- **ID:** 0046
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0044, 0045

## Problem

The existing mobile interface uses:

- four directional buttons;
- a separate Run toggle;
- a dynamic action grid;
- arena tap movement;
- camera gestures;
- a bottom sheet.

This makes the touchscreen responsible for too many unrelated interaction types and does not optimize for stable two-thumb play.

## Goal

Create a landscape-first match-control surface optimized for two-thumb muscle memory while preserving portrait-compatible career/menu screens.

## Recommended match layout

### Left thumb

Large floating virtual-stick region.

The joystick origin appears beneath the thumb.

Movement magnitude maps continuously into movement speed.

### Right thumb

Stable curved action cluster:

```text
          SPECIAL

          STRIKE
   GRAPPLE      ACTION

          COUNTER
```

Exact geometry must be determined from physical-device testing rather than copied blindly.

## Target guidelines

Primary actions should exceed minimum accessibility guidelines.

Initial design target:

```text
Strike/Grapple     64–72 logical px
Action/Counter     58–66 logical px
Special            52–58 logical px
```

Targets must include adequate hit-region spacing.

## Camera policy

During normal match play, camera framing should be automatic.

Required combat inputs may not depend on manual camera manipulation.

Optional manual camera adjustment may use:

- two-finger gesture;
- paused-state adjustment;
- an explicit optional setting.

Single-finger wrestling controls must not compete with required camera gestures.

## Layout architecture

Control geometry must be data-driven so later presets can support:

```text
STANDARD
COMPACT
LARGE
LEFT_HANDED
CUSTOM
```

Only the required first-playable presets need implementation now.

The architecture must not hardcode physical positions throughout UI logic.

## Touches

- `src/ui/mobile.js`
- `src/ui/gestures.js`
- `src/ui/match-controls.js`
- `src/mobile.css`
- `src/presentation/camera.js`
- `docs/architecture/mobile-interface.md`

## Implementation guardrails

- No required match action may depend on a precise small tap target.
- Primary controls remain in stable locations.
- Safe-area insets must be respected.
- OS navigation/home gesture regions must not overlap critical actions.
- Camera gestures cannot accidentally issue wrestling commands.
- Movement stick should tolerate natural thumb drift.
- Mobile layout must not alter simulation rules.
- Portrait career screens and landscape match controls may intentionally differ.

## Done when

- [ ] Match is fully playable touch-only.
- [ ] Left thumb controls movement without directional buttons.
- [ ] Right thumb accesses all core match verbs without reaching across the screen.
- [ ] Walk/run is controlled through movement magnitude or equivalent unified control.
- [ ] Required camera interaction is eliminated during normal combat.
- [ ] Safe areas are respected.
- [ ] Primary targets meet or exceed the selected accessibility minimum.
- [ ] Left-handed layout can be supported by configuration without rewriting combat logic.
- [ ] Landscape orientation has a purpose-designed match layout.
- [ ] Career/non-match UI remains usable in portrait.

## QA requirements

- [ ] Physical iPhone test.
- [ ] Physical Android test.
- [ ] Small-phone viewport.
- [ ] Large-phone viewport.
- [ ] Landscape safe areas/notches.
- [ ] Thumb reach and accidental-touch observations.
- [ ] One-handed accidental behavior documented even though two-handed play is the primary target.
- [ ] Thermal/frame observations.
- [ ] Full test/build/check/CI passes.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- implementation SHA;
- tested devices;
- control dimensions and spacing;
- screenshots;
- safe-area measurements;
- accidental-touch findings;
- camera-gesture findings;
- mobile performance results.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
