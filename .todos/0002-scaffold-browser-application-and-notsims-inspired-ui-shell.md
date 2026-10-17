# 0002 — Scaffold browser application and Notsims-inspired UI shell

- **ID:** 0002
- **Status:** proposed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0001

## Problem

Create the buildable static-browser shell and responsive three-column/arena-first interface without introducing authoritative gameplay into DOM code.

## Goal

Implement this capability inside the documented Not WWE architecture without weakening deterministic simulation, command/event boundaries, mobile viability, save/replay safety or content-originality guardrails.

## Proposed approach

- Keep authoritative decisions in the owning simulation/application layer.
- Express new player/AI mutations through serializable commands and ordered domain events where applicable.
- Keep named wrestlers, moves and presentation assets data-driven; avoid character-specific gameplay branches.
- Use explicit seeded randomness for any gameplay uncertainty.
- Add focused invariant tests before relying on browser/presentation checks.
- Update architecture/review documentation in the same change if the implemented contract differs from the current design.

## Touches

- `index.html`
- `src/main.js`
- `src/style.css`
- `src/mobile.css`
- `src/ui/app.js`
- `src/ui/mobile.js`

## Implementation guardrails

- UI, animation, camera and audio cannot become simulation authority.
- Do not use wall-clock/render-frame timing to determine gameplay outcomes.
- Do not add unrelated scope from later TODOs merely because the extension point is visible.
- Preserve deterministic replay and atomic rejection semantics.
- Do not introduce WWE-protected assets, logos, likenesses, music, branded names or one-to-one gimmick copies.
- Human/device acceptance must be recorded as human/device evidence, not inferred from CI.

## Done when

- [ ] Desktop shell provides wrestler summary, central arena surface and right-side navigation/panel region.
- [ ] Mobile shell provides full-screen arena, compact HUD, bottom actions/navigation and collapsible sheet.
- [ ] App starts with placeholder/read-only state through the application boundary.
- [ ] Safe areas and minimum touch-target sizing are supported.
- [ ] No UI handler mutates future MatchState fields directly.

## QA requirements

- [ ] Desktop responsive smoke at representative wide viewport.
- [ ] Mobile responsive smoke at representative phone/tablet viewports.
- [ ] Keyboard/touch handlers can be unit-tested without Three.js.
- [ ] Build/check/CI green.
- [ ] Relevant full-suite tests, build and source checks pass.
- [ ] No new forbidden dependency direction or circular import is introduced.
- [ ] Save/replay impact is reviewed and documented.

## Completion evidence

When implemented, record:

- source commit SHA;
- focused and full test results/counts;
- build/check/CI result;
- deterministic scenario/replay evidence where relevant;
- browser/device/human evidence required by this TODO;
- remaining limitations or acceptance still open.

## Source

Created from the initial Not WWE architecture and product plan on 2026-10-17, using the established Notsims repository documentation/TODO discipline as the process model.
