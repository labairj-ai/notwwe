# 0048 — Perform Character Fidelity and Mobile Control Human Acceptance

- **ID:** 0048
- **Status:** blocked
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0041, 0042, 0043, 0044, 0045, 0046, 0047

## Problem

The first candidate demonstrated that automated tests can prove architecture and deterministic correctness while still missing serious player-facing problems.

The next candidate must explicitly validate:

- wrestler visual quality;
- animation quality;
- wrestling contact;
- control stability;
- touch ergonomics;
- responsiveness;
- match readability;
- overall wrestling feel.

## Goal

Require direct human evidence before considering the new character and control systems acceptable.

## Required character questions

Testers must answer:

1. Do the wrestlers look like adult professional wrestlers rather than blocky game pieces?
2. Is visual quality at least comparable to the Notsims humanoid baseline?
3. Are different wrestlers visually distinguishable?
4. Do walk/run/knockdown/get-up motions look natural enough for the current milestone?
5. Do paired wrestling moves look physically connected?
6. Are obvious clipping, floating or teleporting problems rare enough not to break immersion?

## Required control questions

Testers must answer:

1. Can you identify Strike, Grapple, Action and Counter without reading changing text?
2. Do controls remain where you expect them?
3. Can you react to Counter opportunities reliably?
4. Can you intentionally perform a grapple variation?
5. Does the game regularly ignore inputs?
6. Do you accidentally trigger the wrong command?
7. Can the complete match be played comfortably on a phone?
8. Do you understand why an action failed?
9. Does the opponent give you enough time to perceive meaningful states?
10. Would you voluntarily play an immediate rematch?

## Required devices

At minimum:

- desktop browser;
- physical iPhone;
- physical Android phone.

Record orientation and exact device/browser.

## Touches

- `docs/reviews/first-playable-acceptance.md`
- `docs/reviews/current-capability-map.md`
- relevant TODO completion evidence
- `CHANGELOG.md`

## Implementation guardrails

- Human acceptance cannot be replaced by JSDOM, screenshots or headless browser automation.
- Physical-device results must name actual devices.
- A green CI result does not satisfy subjective wrestling feel.
- Failed acceptance must create actionable findings rather than being marked complete.
- Do not close 0018, 0020, 0021, 0041–0047 if their required human criteria remain unsatisfied.

## Done when

- [ ] Desktop character/control review recorded.
- [ ] Physical iPhone review recorded.
- [ ] Physical Android review recorded.
- [ ] Character fidelity acceptance recorded.
- [ ] Paired-motion/contact acceptance recorded.
- [ ] Control stability acceptance recorded.
- [ ] Input responsiveness acceptance recorded.
- [ ] Match pacing/readability acceptance recorded.
- [ ] Critical findings have either been corrected or explicitly remain open.
- [ ] First-playable acceptance record truthfully distinguishes automated and human evidence.

## QA requirements

- [ ] Fresh-player test.
- [ ] Returning-player test after initial learning.
- [ ] At least several complete matches.
- [ ] Multiple wrestlers/body archetypes exercised.
- [ ] Signature/finisher usage observed.
- [ ] Pin/reversal/grapple flow observed.
- [ ] Device thermal/performance observations recorded.
- [ ] Full automated regression suite remains green.

## Implementation evidence — 0.2 candidate

See [character/control validation](../docs/reviews/character-controls-validation.md) for concrete code, shipped asset measurements, test/scenario evidence, save/replay version impact, offline illustrations and remaining limitations. This task requires actual desktop, physical iPhone and physical Android testers. CUA has no registered browser and Chrome returns `cgWindowNotFound`; no human/device pass is claimed.

## Completion evidence

Record:

- implementation/deployed SHA;
- device/browser matrix;
- tester observations;
- screenshots/video references if retained;
- pass/fail per acceptance question;
- outstanding defects;
- final recommendation: proceed, iterate, or block broader feature work.

## Source

Created from the first human playtest of the deployed Not WWE candidate and subsequent mobile-control research covering mobile wrestling/fighting games, touch ergonomics, accessibility guidance and deterministic input-buffer design.

Imported from the [shared character and control follow-up plan](https://chatgpt.com/s/t_6ad3d2e445a88191abf7356a9e32b115) on 2026-10-17. Playtest findings and Notsims comparisons above are reported by that plan; importing them does not independently verify those observations or satisfy acceptance.
