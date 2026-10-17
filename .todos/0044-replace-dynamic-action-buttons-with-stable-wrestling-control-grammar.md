# 0044 — Replace Dynamic Action Buttons With Stable Wrestling Control Grammar

- **ID:** 0044
- **Status:** implemented
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0020, 0021

## Problem

The current UI renders the entire current result of `legalCommands()` as buttons.

Because MatchState changes rapidly, available commands change rapidly.

This causes:

- controls to appear and disappear;
- buttons to move position;
- players to read labels during live action;
- valid actions to disappear before selection;
- poor muscle-memory formation;
- excessive dependence on visual processing;
- touch frustration.

A live wrestling game should let context alter what a known control means, not constantly change where controls are located.

## Goal

Replace the dynamic legal-command grid with a stable mobile-first control vocabulary:

```text
MOVE
STRIKE
GRAPPLE
ACTION
COUNTER
SPECIAL
PAUSE
```

Primary control positions remain stable for the entire match.

## Control contract

### MOVE

Floating left-side virtual stick.

Direction and magnitude determine movement intent.

Walking/running should be derived from stick magnitude rather than requiring a separate Run toggle.

### STRIKE

Permanent position.

Context selects the appropriate strike family:

```text
standing → standing strike
running → running strike
opponent down → ground strike
corner → corner strike
ropes → rope-context strike
```

### GRAPPLE

Permanent position.

Near a legal standing opponent:

```text
GRAPPLE → initiate grapple
```

Once in grapple context, direction modifies move choice rather than generating transient move buttons.

Example:

```text
neutral + GRAPPLE → basic grapple
up + GRAPPLE      → power/lift slot
left/right        → throw/whip slot
down              → technical/ground slot
```

Actual moves remain wrestler-specific data.

### ACTION

Permanent contextual wrestling verb.

Examples:

```text
opponent down → PIN
near ropes → WHIP
ground position → LIFT / TURN
weapon nearby → PICK UP
turnbuckle → CLIMB
otherwise → TAUNT
```

The label/icon may change.

Its physical position may not.

### COUNTER

Permanent position.

Inactive/dim outside a valid defensive opportunity.

Clearly signals when a reversal/escape window is available.

### SPECIAL

Permanent reserved position.

States:

```text
inactive
SIGNATURE
FINISHER
```

Signature/Finisher availability must not insert new controls into the layout.

## Touches

- `src/ui/app.js`
- `src/ui/views.js`
- `src/ui/match-controls.js`
- `src/ui/mobile.js`
- `src/mobile.css`
- `src/game/dispatch.js`
- `docs/architecture/mobile-interface.md`

## Implementation guardrails

- Primary control locations cannot reflow based on MatchState.
- Context may change label, icon, availability and semantic meaning.
- UI must not expose every legal domain command.
- Control intent must still route through normal dispatch.
- Move names should not require reading during high-speed live play.
- Keyboard/gamepad adapters must map to the same abstract controls.
- No DOM-level timing may determine whether an action succeeds.
- The control layer must remain independent from wrestler-specific move names.

## Done when

- [ ] Strike occupies the same screen position throughout the match.
- [ ] Grapple occupies the same position throughout the match.
- [ ] Action occupies the same position throughout the match.
- [ ] Counter occupies the same position throughout the match.
- [ ] Special occupies the same reserved position throughout the match.
- [ ] Run toggle is removed from required match controls.
- [ ] Live move-name button lists are removed.
- [ ] Direction/context chooses wrestling variation.
- [ ] Primary controls do not shift when legality changes.
- [ ] Controls can be understood without inspecting MatchState/debug information.
- [ ] Desktop keyboard/gamepad can target the same abstract action vocabulary.

## QA requirements

- [ ] Standing control matrix.
- [ ] Running control matrix.
- [ ] Grappling control matrix.
- [ ] Opponent-down control matrix.
- [ ] Corner/rope control matrix.
- [ ] Player-down defensive control matrix.
- [ ] Pin/submission control matrix.
- [ ] Signature/finisher control matrix.
- [ ] Verify button geometry does not change across all contexts.
- [ ] Full test/build/check/CI passes.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. Software exists and local automated gates pass. Required browser/physical-device/human criteria remain open; this is not a `complete` status.

## Completion evidence

Record:

- implementation SHA;
- complete control matrix;
- screenshots for major contexts;
- stable hit-box measurements;
- keyboard/gamepad mapping;
- human usability observations;
- remaining ambiguous contexts.

## Source

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
