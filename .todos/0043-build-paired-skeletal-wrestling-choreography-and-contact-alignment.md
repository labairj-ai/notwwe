# 0043 — Build Paired Skeletal Wrestling Choreography and Contact Alignment

- **ID:** 0043
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0041, 0042, 0007, 0008, 0009, 0010, 0011, 0012, 0013, 0014

## Problem

Professional wrestling moves are interactions between two bodies.

Single-character gesture animation is insufficient for:

- suplexes;
- slams;
- throws;
- lifts;
- takedowns;
- grapples;
- signatures;
- finishers;
- reversals.

The current procedural choreography can communicate that a move occurred, but does not produce convincing physical contact.

## Goal

Create a paired animation system where resolved simulation events drive synchronized attacker/receiver skeletal choreography without allowing animation to become gameplay authority.

## Proposed architecture

```text
Resolved simulation event
        ↓
Move presentation definition
        ↓
Actor clip + Receiver clip
        ↓
Contact/alignment anchor
        ↓
Synchronized playback
        ↓
Return to semantic state
```

Each wrestling move may define presentation metadata such as:

```text
animationKey
actorClip
receiverClip
contactAnchor
alignmentMode
duration
cameraHint
impactPhase
safeFallback
```

## Initial scope

Produce high-quality paired choreography for a representative subset covering:

- standing strike;
- running strike;
- basic grapple;
- body slam;
- suplex;
- throw / Irish-whip style release;
- ground strike;
- reversal;
- signature;
- finisher.

Do not attempt to animate the full future moveset under this TODO.

## Touches

- `src/presentation/choreography.js`
- `src/presentation/animation-controller.js`
- `src/presentation/wrestler-presentation.js`
- `src/render3d/wrestler.js`
- `src/content/moves.js`
- `assets/wrestlers/`
- `docs/architecture/presentation-animation.md`

## Implementation guardrails

- The simulation resolves hit, miss, reversal, damage and resulting state before choreography begins.
- Animation cannot retroactively change the resolved move.
- Paired alignment must be bounded and presentation-only.
- Do not permanently overwrite authoritative wrestler coordinates for visual alignment.
- Interrupted choreography must degrade safely.
- No root-motion drift may accumulate into MatchState.
- Replays must produce the same domain event sequence regardless of animation frame rate.

## Done when

- [ ] Actor and receiver clips remain synchronized for representative move families.
- [ ] Contact points look intentional rather than visibly separated.
- [ ] Wrestlers do not routinely intersect, teleport or drift after moves.
- [ ] Reversal choreography has distinct attacker/receiver behavior.
- [ ] Signature/finisher presentation is visibly more important than ordinary moves.
- [ ] Interruption, pause and reduced-motion behavior are defined.
- [ ] Missing paired choreography uses a safe fallback.
- [ ] Presentation remains read-only relative to MatchState.

## QA requirements

- [ ] Slow-motion visual inspection of contact alignment.
- [ ] Test different wrestler heights/body archetypes.
- [ ] Verify paired animation remains acceptable under multiple body combinations.
- [ ] Test pause during lift/contact/landing phases.
- [ ] Test repeated moves for positional drift.
- [ ] Test reduced-motion fallback.
- [ ] Confirm deterministic replay equality.
- [ ] Measure desktop/mobile animation performance.
- [ ] Full test/build/check/CI passes.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- implementation SHA;
- paired clip list;
- supported body-size combinations;
- alignment tolerances;
- visual/contact review;
- replay-equivalence result;
- mobile performance result;
- known presentation limitations.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
