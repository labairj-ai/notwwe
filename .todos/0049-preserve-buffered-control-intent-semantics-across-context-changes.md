# 0049 — Preserve Buffered Control Intent Semantics Across Context Changes

- **ID:** 0049
- **Status:** proposed
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

- [ ] Buffered ACTION cannot silently change from TAUNT to PIN.
- [ ] Buffered ACTION cannot silently change from PIN to TAUNT.
- [ ] Buffered STRIKE cannot silently change from standing strike to ground attack.
- [ ] Buffered SPECIAL cannot upgrade from unavailable to Signature/Finisher merely because momentum changes during the buffer.
- [ ] Buffered grapple direction preserves the intended move slot.
- [ ] COUNTER can still execute against an opportunity that begins within its allowed buffer.
- [ ] Impossible preserved semantic intents expire without mutation.
- [ ] Save/reload preserves queued intent.
- [ ] Replay reproduces queued intent and execution exactly.
- [ ] Chunked vs. unchunked simulation remains equivalent.

## QA requirements

Add explicit tests for:

- [ ] ACTION queued standing → opponent becomes knocked down.
- [ ] ACTION queued knocked down → opponent stands.
- [ ] STRIKE queued standing → target becomes grounded.
- [ ] STRIKE queued grounded → target begins getting up.
- [ ] SPECIAL queued at 59 momentum → momentum rises above 60.
- [ ] SPECIAL queued below 90 → momentum rises above 90.
- [ ] Grapple queued with direction → direction changes before execution.
- [ ] COUNTER queued before attack telegraph.
- [ ] COUNTER queued after telegraph but before resolution.
- [ ] Intent expires at exact boundary.
- [ ] Save/reload with pending intent.
- [ ] Exact replay equivalence.
- [ ] Full test/build/check/CI passes.

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
