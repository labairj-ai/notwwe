# 0049 — Preserve Buffered Control Intent Semantics Across Context Changes

- **ID:** 0049
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0044, 0045
- **Blocks:** 0048

## Problem

The current input buffer stores an abstract control action such as:

```text
ACTION
STRIKE
GRAPPLE
SPECIAL
COUNTER
```

The buffered action is later re-resolved against the current MatchState on each simulation tick.

This is deterministic, but it can allow a queued control to change meaning while waiting for execution.

Examples:

```text
ACTION pressed while opponent is standing
→ opponent becomes knocked down
→ buffered ACTION becomes PIN
```

```text
STRIKE pressed against standing opponent
→ opponent becomes grounded
→ buffered STRIKE becomes ground offense
```

```text
SPECIAL pressed below signature threshold
→ momentum crosses threshold before expiry
→ buffered SPECIAL becomes SIGNATURE
```

This can make the game feel as though it changed the player's command.

COUNTER is intentionally different: its usefulness depends on a future defensive opportunity, so limited opportunistic reinterpretation may be desirable.

## Goal

Define and enforce an explicit semantic-buffering contract so player intent remains predictable while retaining the responsiveness benefits of deterministic buffering.

## Proposed approach

Separate:

```text
physical control
        ↓
control interpretation
        ↓
semantic intent
        ↓
buffer
        ↓
legal execution
```

For controls whose meaning is known at button-down, buffer the resolved semantic intent rather than repeatedly reinterpreting the raw control.

Example:

```js
{
  control: "ACTION",
  semanticIntent: "TAUNT",
  commandFamily: "TAUNT",
  direction: { x: 0, z: 0 },
  queuedAtTick: 100,
  expiresAtTick: 104
}
```

For directional grapple selection, preserve the selected grapple slot or move family captured when the intent is queued.

COUNTER may remain explicitly opportunistic:

```text
COUNTER
→ wait for valid defensive opportunity
→ execute ATTEMPT_REVERSAL if opportunity appears before expiry
```

Document any other intentionally opportunistic control separately.

## Required semantic policy

Initial recommendation:

| Control | Buffer policy |
| --- | --- |
| STRIKE | Preserve interpreted strike family/context |
| GRAPPLE | Preserve grapple intent and directional slot |
| ACTION | Preserve semantic action selected at input |
| SPECIAL | Preserve unavailable/signature/finisher meaning at input |
| COUNTER | Opportunistic within bounded counter buffer |

Do not silently change this table during implementation.

## Touches

- `src/systems/input/controls.js`
- `src/game/dispatch.js`
- `src/game/match.js`
- `src/game/replay.js`
- `src/persistence/save.js`
- `tests/controls.test.js`
- `docs/architecture/commands-events.md`
- `docs/architecture/mobile-interface.md`
- `docs/architecture/scenario-replay.md`

## Implementation guardrails

- Buffer timing remains simulation-tick based.
- Do not use wall-clock timers.
- Semantic intent must remain serializable.
- Save/reload must preserve pending semantic intent exactly.
- Replay must reproduce execution on the same tick.
- Buffering cannot bypass stamina, range, match rules or state legality.
- A preserved semantic action that becomes impossible should wait only until expiry, then fail cleanly.
- Do not automatically substitute a different action because it became legal.
- COUNTER's opportunistic behavior must be explicit and tested.
- AI behavior must remain unchanged unless separately specified.

## Done when

- [x] Buffered ACTION cannot silently change from TAUNT to PIN.
- [x] Buffered ACTION cannot silently change from PIN to TAUNT.
- [x] Buffered STRIKE cannot silently change from standing strike to ground attack.
- [x] Buffered SPECIAL cannot upgrade from unavailable to Signature/Finisher merely because momentum changes during the buffer.
- [x] Buffered grapple direction preserves the intended move slot.
- [x] COUNTER can still execute against an opportunity that begins within its allowed buffer.
- [x] Impossible preserved semantic intents expire without mutation.
- [x] Save/reload preserves queued intent.
- [x] Replay reproduces queued intent and execution exactly.
- [x] Chunked vs. unchunked simulation remains equivalent.

## QA requirements

Add explicit tests for:

- [x] ACTION queued standing → opponent becomes knocked down.
- [x] ACTION queued knocked down → opponent stands.
- [x] STRIKE queued standing → target becomes grounded.
- [x] STRIKE queued grounded → target begins getting up.
- [x] SPECIAL queued at 59 momentum → momentum rises above 60.
- [x] SPECIAL queued below 90 → momentum rises above 90.
- [x] Grapple queued with direction → direction changes before execution.
- [x] COUNTER queued before attack telegraph.
- [x] COUNTER queued after telegraph but before resolution.
- [x] Intent expires at exact boundary.
- [x] Save/reload with pending intent.
- [x] Exact replay equivalence.
- [x] Full test/build/check/CI passes.

## Completion evidence

Record:

- implementation SHA;
- final semantic-buffer policy;
- before/after behavior for each edge case;
- focused test counts;
- full test/build/check/CI result;
- save/replay evidence;
- any intentionally opportunistic controls.

## Source

Created from review of the 0.2 candidate after implementation of TODOs 0041–0047.

Imported from the [shared 0.2 acceptance follow-up plan](https://chatgpt.com/s/t_6ad40cea37508191834929255121f435) on 2026-10-17. Candidate identity, validation counts and review findings above describe the source plan; this import neither implements the task nor certifies human acceptance. For 0050, freeze the actual post-0049/post-0051 deployed SHA rather than carrying forward a superseded candidate.

## Implementation evidence

Implemented on `codex/semantic-intents-acceptance-diagnostics`; exact merged source and CI are recorded in the frozen first-playable acceptance header after deployment. See character-controls-validation.md and architecture contracts for semantic policy, schema/limits, migration, local report capture and tests. Only Counter is opportunistic. Full validation and CI are required before merge; human/device acceptance remains 0048.

Merged implementation: `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d`; exact-SHA CI: https://github.com/labairj-ai/notwwe/actions/runs/39082644918. 51 tests, 36 exact replays, 36 pacing runs; clean build and public deployment verified. Local completed-match example: docs/reviews/control-diagnostics-sample.json.
