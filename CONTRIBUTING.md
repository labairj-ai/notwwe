# Contributing to Not WWE

## Working agreement

Changes should be small, reviewable and tied to an active `.todos/*.md` item. Architectural rules in `CLAUDE.md` and `docs/architecture/` are part of the acceptance contract, not optional guidance.

## Branch and PR expectations

- Start from current `main`.
- One coherent TODO or tightly related set per PR unless a dependency requires a combined change.
- Keep `main` protected: pull request required, successful CI required, force pushes and branch deletion disabled.
- Do not merge with failing tests/build/checks.
- Human/device acceptance may remain open after implementation, but the TODO and release documentation must say so explicitly.

## Required PR description

Include:

- TODO IDs;
- behavioral summary;
- architecture impact;
- save/replay impact;
- tests added/changed;
- commands run and results;
- browser/device evidence when required;
- assets/licenses introduced;
- known limitations or acceptance still pending.

## Code-review checklist

- Simulation authority remains outside UI/presentation/renderer.
- No gameplay `Math.random()`.
- Commands and events stay serializable.
- Rejected operations are atomic and do not partially mutate state.
- New content is data-driven and schema-validated.
- No new circular dependency or renderer dependency in domain code.
- Save compatibility is explicitly evaluated.
- Deterministic replay is preserved.
- Touch/mobile controls remain viable.
- WWE-specific protected assets/content are not introduced.
