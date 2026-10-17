# 0045 — Add Deterministic Buffered Player Intent

- **ID:** 0045
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0044, 0004, 0033

## Problem

The current command model generally requires an action to be legal at the exact moment the input reaches dispatch.

In a real-time touchscreen game this can feel like the game ignored the player's action when:

- the player pressed slightly before recovery completed;
- the player approached legal range just after pressing;
- a short reversal window began moments after input;
- animation/presentation made the state appear ready slightly before simulation eligibility.

Touchscreens also lack the tactile confirmation of physical controller buttons.

## Goal

Introduce a short, bounded, deterministic player-intent buffer so reasonable early inputs can execute on the first legal simulation tick.

## Proposed state

Example:

```js
{
  type: "GRAPPLE",
  direction: { x: 0.1, z: -0.9 },
  queuedAtTick: 847,
  expiresAtTick: 850,
  source: "touch"
}
```

The exact schema should remain serializable and replay-safe.

## Initial tuning ranges

Treat these only as starting values for playtesting:

```text
STRIKE   ~300 ms
GRAPPLE  ~300 ms
ACTION   ~400 ms
COUNTER  ~200 ms
SPECIAL  ~300 ms
```

Final values require human testing.

## Resolution order

```text
player input
→ create abstract ControlIntent
→ store bounded pending intent
→ simulation advances
→ evaluate intent eligibility
→ execute first legal tick
→ emit normal command/domain events
→ remove intent
```

Expired intents disappear without side effects.

## Touches

- `src/game/dispatch.js`
- `src/game/match.js`
- `src/game/replay.js`
- `src/ui/match-controls.js`
- `src/core/`
- `tests/match.test.js`
- `tests/presentation-ui.test.js`
- `docs/architecture/commands-events.md`
- `docs/architecture/scenario-replay.md`

## Implementation guardrails

- Intent expiry uses simulation ticks, never `setTimeout()` or wall clock.
- Replays must reproduce buffered execution exactly.
- Buffering must not allow impossible actions.
- A buffered command executes only if it becomes legal before expiry.
- Buffering cannot bypass stamina, range, state, momentum or rules validation.
- No duplicate execution when the input remains held.
- AI input must not silently receive player-friendly buffering unless explicitly designed.
- Save/load behavior for buffered intent must be documented.

## Done when

- [ ] Early strike input can execute on the first legal tick within its window.
- [ ] Early grapple input can execute on the first legal tick within its window.
- [ ] Counter buffering is short and cannot create unfair automatic reversals.
- [ ] Expired intents create no gameplay mutation.
- [ ] Invalid actions remain invalid.
- [ ] Replaying the same trace executes buffered actions on identical ticks.
- [ ] Chunked simulation produces identical results.
- [ ] Save/load semantics are explicit.

## QA requirements

- [ ] One tick early.
- [ ] One tick late.
- [ ] Exact expiry boundary.
- [ ] Never-becomes-legal case.
- [ ] Stamina changes before execution.
- [ ] Target leaves range before execution.
- [ ] Match ends while intent pending.
- [ ] Pause while intent pending.
- [ ] Replay equivalence.
- [ ] Full test/build/check/CI passes.

## Completion evidence

Record:

- implementation SHA;
- buffer durations;
- deterministic traces;
- early/late boundary tests;
- human responsiveness observations;
- any actions intentionally excluded from buffering.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
