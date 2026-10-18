# 0051 — Add Per-Control Human Acceptance Diagnostics

- **ID:** 0051
- **Status:** implemented
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

- [x] queued is available per control.
- [x] executed is available per control.
- [x] expired is available per control.
- [x] replaced is available per control.
- [x] execution wait time is measurable.
- [x] expiration/failure reasons are counted.
- [x] completed-match diagnostic summary can be produced.
- [x] diagnostic collection does not alter gameplay.
- [x] diagnostic state remains bounded.
- [x] save/replay behavior is defined.
- [x] acceptance document explains how to capture the report.

## QA requirements

- [x] Successful immediate Strike.
- [x] Buffered successful Strike.
- [x] Expired Grapple from range.
- [x] Expired action from stamina.
- [x] Replaced intent.
- [x] Counter with no opportunity.
- [x] Counter executed during telegraph.
- [x] Match end with pending intent.
- [x] Save/reload preserves or intentionally resets diagnostics according to documented policy.
- [x] Replay produces identical diagnostics.
- [x] Full test/build/check/CI passes.

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

## Implementation evidence

Implemented on `codex/semantic-intents-acceptance-diagnostics`; exact merged source and CI are recorded in the frozen first-playable acceptance header after deployment. See character-controls-validation.md and architecture contracts for semantic policy, schema/limits, migration, local report capture and tests. Only Counter is opportunistic. Full validation and CI are required before merge; human/device acceptance remains 0048.

Merged implementation: `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d`; exact-SHA CI: https://github.com/labairj-ai/notwwe/actions/runs/39082644918. 51 tests, 36 exact replays, 36 pacing runs; clean build and public deployment verified. Local completed-match example: docs/reviews/control-diagnostics-sample.json.
