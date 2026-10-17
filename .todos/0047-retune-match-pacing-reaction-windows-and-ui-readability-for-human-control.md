# 0047 — Retune Match Pacing, Reaction Windows and UI Readability for Human Control

- **ID:** 0047
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0044, 0045, 0046

## Problem

The original automated implementation optimized domain correctness but did not have real human play evidence.

The first human playtest found that match state changes faster than the player can reliably interpret and select controls.

Even after stable controls and buffering are implemented, simulation timing needs intentional human-facing tuning.

Potential contributors include:

- AI decision cadence;
- stun duration;
- grapple windows;
- recovery timing;
- reversal signaling;
- counter duration;
- action lockouts;
- signature/finisher opportunity duration;
- movement speed;
- post-move recovery.

Simply slowing the entire simulation is not acceptable.

## Goal

Tune the match so a player has enough time to perceive wrestling state, make a decision and act without making the game feel sluggish.

## Evaluation areas

Measure and tune:

```text
AI decision interval
strike recovery
grapple duration
reversal opportunity
stun duration
knockdown duration
get-up timing
post-finisher vulnerability
pin opportunity
submission escape readability
signature availability
finisher availability
```

## Design principle

The game should create readable wrestling beats:

```text
setup
→ action
→ sell/reaction
→ player decision
→ next exchange
```

rather than continuous command churn.

## Touches

- `src/systems/combat/combat.js`
- `src/systems/opponent-ai/decision.js`
- `src/systems/state-machine/states.js`
- `src/systems/damage/resources.js`
- `src/systems/pin/pin.js`
- `src/systems/submission/submission.js`
- `src/game/match.js`
- content tuning definitions
- `docs/product/game-design.md`

## Implementation guardrails

- Do not tune solely to make the game easier.
- Preserve wrestler-rating differentiation.
- Preserve deterministic simulation.
- Do not change rules merely to hide UI problems.
- AI difficulty levels should alter challenge without requiring superhuman reaction speed.
- Human-visible cues must begin early enough to be perceived.
- Timing values should be data-driven where practical.

## Done when

- [ ] Normal difficulty allows a first-time player to understand basic exchanges.
- [ ] Counter opportunities are readable rather than surprising.
- [ ] Grapple state persists long enough to deliberately choose a directional action.
- [ ] AI does not immediately erase every player decision window.
- [ ] Knockdowns and recovery create believable wrestling pacing.
- [ ] Signature/finisher availability is noticeable and actionable.
- [ ] Easy/normal/hard retain meaningfully different challenge.
- [ ] Automated deterministic/replay tests continue passing.

## QA requirements

- [ ] Human test at easy.
- [ ] Human test at normal.
- [ ] Human test at hard.
- [ ] Record failed-input/rejected-input frequency.
- [ ] Record match duration distribution.
- [ ] Record pin/reversal frequency.
- [ ] Compare AI/player action rates.
- [ ] Run deterministic scenario matrix after every timing change.
- [ ] Full test/build/check/CI passes.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- before/after timing configuration;
- match-duration samples;
- reversal/pin/action-rate measurements;
- human play notes;
- implementation SHA;
- deterministic scenario results;
- remaining balance concerns.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
