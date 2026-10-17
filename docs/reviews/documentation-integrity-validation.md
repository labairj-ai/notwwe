# Documentation integrity validation

Date: 2026-10-17

This record verifies the initial Not WWE documentation bundle as a self-contained project documentation seed.

## Scope

The validation covers:

- root project Markdown files;
- `.todos/README.md` and TODOs 0001–0040;
- product documentation;
- architecture contracts;
- review and acceptance templates;
- asset and deployment documentation.

## Required contract check

TODO 0001 references the following architecture contracts and all are included in this bundle:

- `docs/architecture/game-architecture.md`
- `docs/architecture/system-boundaries.md`
- `docs/architecture/commands-events.md`
- `CLAUDE.md`

The commands/events contract is an actual file in the package, not merely a planned path.

## Reference policy

Paths listed in TODO `Touches` sections are repository-root-relative unless explicitly written as relative Markdown links. Validators should resolve `docs/...`, `assets/...`, `deploy/...`, `CLAUDE.md`, and `CHANGELOG.md` from the repository root.

## Validation requirements

The release bundle is valid only when:

- every entry in `MARKDOWN-MANIFEST.md` exists;
- every repository-root-relative Markdown path referenced by a TODO exists;
- all TODO IDs 0001–0040 exist exactly once;
- TODO dependencies reference existing TODO IDs;
- the dependency graph is acyclic;
- no architecture contract required by TODO 0001 is absent.

## Result

The rebuilt v2 package passed these checks before publication. No missing manifest entries or missing TODO-referenced Markdown contracts remain.
