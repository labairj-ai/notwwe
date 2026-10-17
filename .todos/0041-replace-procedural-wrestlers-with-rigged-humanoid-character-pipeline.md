# 0041 — Replace Procedural Wrestlers With Rigged Humanoid Character Pipeline

- **ID:** 0041
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0018, 0019

## Problem

The current wrestler renderer creates characters from Three.js capsule, box and sphere primitives.

The result is visually blocky, toy-like and materially below the character quality established in Notsims.

Notsims already proves a stronger browser-compatible character architecture using:

- rigged GLB humanoids;
- a shared skeletal hierarchy;
- `GLTFLoader`;
- `SkeletonUtils.clone()`;
- Three.js `AnimationMixer`;
- skeletal animation clips;
- runtime material customization;
- mobile-compatible asset budgets.

Not WWE should use the same architectural approach while creating wrestling-specific original characters, proportions, attire and presentation.

The current procedural body implementation may remain temporarily as an emergency fallback, but it must no longer be the primary wrestler presentation.

## Goal

Create an original, adult-proportioned, rigged humanoid wrestler pipeline that achieves at least the visual quality of Notsims characters while supporting wrestling-specific body types, gear and animation.

## Proposed approach

Introduce a shared wrestler asset pipeline:

```text
Original humanoid source
        ↓
Shared wrestling skeleton
        ↓
Body/archetype configuration
        ↓
Hair / skin / wrestling gear
        ↓
GLB export
        ↓
Three.js GLTFLoader
        ↓
SkeletonUtils clone
        ↓
WrestlerPresentation
```

Reuse architectural lessons from Notsims rather than duplicating its resident-specific presentation.

Support a bounded initial set of body archetypes such as:

```text
athletic
powerhouse
heavyweight
cruiserweight
women_athletic
women_powerhouse
```

All archetypes should remain compatible with the same animation vocabulary wherever practical.

## Touches

- `src/render3d/wrestler.js`
- `src/presentation/wrestler-presentation.js`
- `src/presentation/animation-controller.js`
- `src/content/wrestlers.js`
- `assets/README.md`
- `assets/wrestlers/`
- `scripts/`
- `docs/architecture/presentation-animation.md`

## Implementation guardrails

- MatchState remains authoritative.
- Character meshes, bones and animation state cannot change gameplay outcomes.
- Do not introduce wrestler-specific simulation branches to compensate for presentation differences.
- Use original or properly licensed assets only.
- Do not reuse WWE wrestler likenesses, facial likenesses, tattoos, branded gear, logos or distinctive protected attire.
- Maintain a shared skeletal contract wherever possible.
- Procedural bodies may remain only as a safe degraded fallback.
- Asset source, license and generation procedure must be recorded.
- Mobile asset size and render cost must be measured rather than assumed.

## Done when

- [ ] Primary wrestler rendering uses rigged humanoid GLB assets instead of capsule/box bodies.
- [ ] Marcus Reign and Cole Sterling have clearly different original adult wrestler identities.
- [ ] At least two distinct body archetypes are demonstrated.
- [ ] Skin, hair and wrestling gear can vary without duplicating the full skeleton/animation library.
- [ ] Wrestlers correctly inherit authoritative MatchState position and facing.
- [ ] Procedural geometry is no longer the default presentation.
- [ ] Missing/corrupt wrestler assets degrade safely.
- [ ] Asset provenance and license metadata are complete.
- [ ] Character asset budgets are documented for desktop and mobile.
- [ ] No gameplay result changes when the renderer is disabled.

## QA requirements

- [ ] Compare new wrestlers directly against current procedural wrestlers.
- [ ] Compare visual quality against the Notsims humanoid baseline.
- [ ] Test multiple cloned wrestlers simultaneously.
- [ ] Verify skeleton/material instances do not leak state between wrestlers.
- [ ] Test asset load failure and fallback behavior.
- [ ] Measure GLB size, texture memory and frame cost.
- [ ] Test desktop and representative mobile viewport rendering.
- [ ] Run full test/build/check/CI suite.
- [ ] Confirm replay results are identical with presentation enabled and disabled.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- implementation SHA;
- wrestler asset source and license;
- skeleton/bone contract;
- asset-size measurements;
- desktop/mobile render observations;
- screenshots or visual review artifacts;
- test/build/check/CI results;
- remaining body/face/gear limitations.

## Source

Created from the first human playtest of the deployed candidate and direct comparison with the established Notsims rigged-character pipeline.

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
