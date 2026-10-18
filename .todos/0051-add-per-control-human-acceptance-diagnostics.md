# 0051 — Add Per-Control Human Acceptance Diagnostics

- **ID:** 0051
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0044, 0045, 0047, 0049
- **Blocks:** 0048

## Problem

The current MatchState tracks aggregate control statistics:

```text
queued
executed
expired
replaced
```

Those totals are useful for deterministic tests, but they are not sufficient to diagnose human control problems during 0048.

If a tester reports:

> Grapple keeps ignoring me.

the current telemetry may show only:

```text
expired: 7
```

without identifying:

- which control expired;
- why it failed;
- whether it was out of range;
- whether stamina was insufficient;
- whether it was replaced by another input;
- whether it executed after buffering;
- how long it waited.

Human acceptance should produce evidence that can distinguish design problems from player misunderstanding or simulation legality.

## Goal

Add lightweight, privacy-safe, local acceptance diagnostics for each abstract player control without changing match outcomes.

## Required metrics

Track per action:

```text
STRIKE
GRAPPLE
ACTION
COUNTER
SPECIAL
```

At minimum:

```text
queued
executed
expired
replaced
averageWaitTicks
maxWaitTicks
```

Also track expiration/non-execution reasons such as:

```text
OUT_OF_RANGE
INVALID_STATE
INSUFFICIENT_STAMINA
MOVE_NOT_AVAILABLE
NO_OPPORTUNITY
TARGET_CONTEXT_CHANGED
MATCH_ENDED
```

Use stable reason codes.

## Suggested structure

Example:

```js
controlStats: {
  totals: {
    queued: 0,
    executed: 0,
    expired: 0,
    replaced: 0
  },

  byAction: {
    STRIKE: {
      queued: 0,
      executed: 0,
      expired: 0,
      replaced: 0,
      waitTicks: 0,
      maxWaitTicks: 0,
      reasons: {}
    }
  }
}
```

Exact schema may differ, but it must remain bounded and serializable.

## Acceptance summary

Provide a developer/acceptance report that can summarize a completed match such as:

```text
STRIKE
12 queued
11 executed
1 expired — OUT_OF_RANGE
median/average wait: 0.8 ticks

GRAPPLE
8 queued
5 executed
3 expired
2 OUT_OF_RANGE
1 INVALID_STATE
```

This does not need to be part of normal player UI.

It may be accessible via:

- development mode;
- acceptance export;
- console helper;
- generated local report.

## Touches

- `src/game/match.js`
- `src/game/dispatch.js`
- `src/systems/input/controls.js`
- `src/persistence/save.js`
- `tests/controls.test.js`
- `scripts/`
- `docs/reviews/first-playable-acceptance.md`
- `docs/reviews/character-controls-validation.md`

## Implementation guardrails

- Diagnostics cannot affect simulation decisions.
- Diagnostics cannot consume RNG.
- Diagnostics must be deterministic.
- Diagnostics must remain bounded.
- Do not collect personal information.
- Do not send telemetry to a remote service.
- Do not add network dependencies.
- Save/reload must validate diagnostic state if diagnostics are persisted.
- Replay results must remain identical except for expected deterministic diagnostic counters.
- Production player UI should not become cluttered with diagnostic information.

## Done when

- [ ] queued is available per control.
- [ ] executed is available per control.
- [ ] expired is available per control.
- [ ] replaced is available per control.
- [ ] execution wait time is measurable.
- [ ] expiration/failure reasons are counted.
- [ ] completed-match diagnostic summary can be produced.
- [ ] diagnostic collection does not alter gameplay.
- [ ] diagnostic state remains bounded.
- [ ] save/replay behavior is defined.
- [ ] acceptance document explains how to capture the report.

## QA requirements

- [ ] Successful immediate Strike.
- [ ] Buffered successful Strike.
- [ ] Expired Grapple from range.
- [ ] Expired action from stamina.
- [ ] Replaced intent.
- [ ] Counter with no opportunity.
- [ ] Counter executed during telegraph.
- [ ] Match end with pending intent.
- [ ] Save/reload preserves or intentionally resets diagnostics according to documented policy.
- [ ] Replay produces identical diagnostics.
- [ ] Full test/build/check/CI passes.

## Completion evidence

Record:

- implementation SHA;
- diagnostic schema;
- bounded-state limits;
- sample completed-match report;
- focused test results;
- full test/build/check/CI result;
- confirmation that no remote telemetry was introduced.

## Source

Created from review of the 0.2 candidate to strengthen TODO 0048 human/device acceptance evidence.

Imported from the [shared 0.2 acceptance follow-up plan](https://chatgpt.com/s/t_6ad40cea37508191834929255121f435) on 2026-10-17. Candidate identity, validation counts and review findings above describe the source plan; this import neither implements the task nor certifies human acceptance. For 0050, freeze the actual post-0049/post-0051 deployed SHA rather than carrying forward a superseded candidate.
