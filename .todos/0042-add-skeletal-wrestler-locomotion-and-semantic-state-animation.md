# 0042 — Add Skeletal Wrestler Locomotion and Semantic State Animation

- **ID:** 0042
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0041, 0006, 0019

## Problem

The current presentation uses direct procedural rotations of body groups to represent walking, attacks, knockdowns and other states.

Even with improved character meshes, procedural limb rotation will continue to look artificial unless core wrestler motion is converted to skeletal animation.

The simulation already exposes semantic states such as:

```text
STANDING
WALKING
RUNNING
ATTACKING
STUNNED
KNOCKED_DOWN
GETTING_UP
GRAPPLING
PINNING
TAUNTING
VICTORY
```

These should drive a reusable skeletal animation vocabulary.

## Goal

Create a renderer-neutral mapping from authoritative wrestler semantic state to high-quality skeletal locomotion and state presentation.

## Initial animation vocabulary

At minimum:

```text
Idle
Walk
Run
CombatIdle
GrappleIdle
Stunned
KnockdownFront
KnockdownBack
Grounded
GetUpFront
GetUpBack
Taunt
PinControl
PinEscape
SubmissionControl
SubmissionDefense
Victory
Defeat
```

Additional clips may be introduced where justified.

## Touches

- `src/presentation/animation-controller.js`
- `src/presentation/wrestler-presentation.js`
- `src/render3d/wrestler.js`
- `src/presentation/clips.js`
- `assets/wrestlers/`
- `scripts/`
- `docs/architecture/presentation-animation.md`

## Implementation guardrails

- Simulation states determine semantics; animation never determines state.
- Animation completion cannot decide when damage, reversals, pins or other gameplay effects occur.
- Cross-fades must not modify authoritative timing.
- Missing clips must fall back to a safe semantic animation.
- Reduced-motion support must remain functional.
- Animation clocks stop while the simulation is paused.
- Do not consume simulation RNG for animation variation.

## Done when

- [ ] Standing, walking and running use skeletal clips.
- [ ] Knockdown and get-up have believable skeletal presentation.
- [ ] Stun, taunt, pin and victory states are visually distinct.
- [ ] Transitions cross-fade without visible snapping under normal conditions.
- [ ] Movement animation speed corresponds reasonably to authoritative movement speed.
- [ ] Pause freezes skeletal animation.
- [ ] Reduced-motion mode has defined behavior.
- [ ] Missing animation keys fall back safely.
- [ ] No animation callback mutates MatchState.

## QA requirements

- [ ] State-transition matrix exercised visually.
- [ ] Rapid state interruption tested.
- [ ] Pause/resume tested during every major animation family.
- [ ] Knockdown/get-up cannot leave the model underground or floating.
- [ ] Movement interpolation cannot drift from authoritative position.
- [ ] Presentation-disabled simulation produces identical replay.
- [ ] Desktop and mobile performance measured.
- [ ] Full test/build/check/CI passes.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- implementation SHA;
- clip inventory;
- skeleton compatibility result;
- state-to-animation mapping;
- interruption/fallback behavior;
- visual review findings;
- mobile performance result;
- test/build/check/CI result.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
