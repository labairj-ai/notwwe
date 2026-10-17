# Not WWE

**Working codename:** Not WWE  
**Project type:** browser-first professional wrestling career game  
**Status:** playable implementation candidate; human/device certification pending

Not WWE is an original professional-wrestling career game built around a deterministic simulation, an active 3D match layer, persistent career progression, rivalries, championships and a mobile-first interface derived from the successful interaction patterns used in Notsims.

The player chooses a fictional wrestler, works a weekly schedule, cuts promos, develops rivalries, wrestles matches, improves skills and attempts to become the promotion's top star. Winning matters, but match quality, crowd response and story context also drive career outcomes.

> **IP note:** `Not WWE` is an internal working title. Public release naming, branding, characters, belts, music, logos, attire and story content must remain original. See `docs/architecture/ip-and-content-guardrails.md`.

## Run locally

Requires Node 22 or newer. Run `npm ci`, then `npm run dev` and open http://127.0.0.1:5193. `npm run build` creates a complete static `dist/` package with Three.js included. No backend, accounts, model service or external asset host is needed.

The implementation includes 12 selectable wrestlers, singles/championship/No-DQ matches, procedural 3D characters and arena, touch/keyboard controls, a weekly career with training, promos, rivalries, rankings, title history, contracts, and save import/export. Display title: **Harbor Circuit**, subject to originality review.

See [implementation evidence](docs/reviews/implementation-validation.md) for automated results and remaining acceptance. The original first-playable human gate remains open; the user explicitly requested the whole software backlog, so career code is available for review before certification.

## Product principles

1. **One excellent singles match before broad feature expansion.** Do not build a large career shell around weak wrestling.
2. **Simulation decides; presentation depicts.** Three.js, animation, audio and camera systems never decide authoritative gameplay outcomes.
3. **Commands in, events out.** Player and AI intent enters through serializable commands; domain systems return ordered events.
4. **Deterministic by construction.** Gameplay randomness uses an explicit seeded RNG stream. Wall clock, render frames and animation clocks cannot affect outcomes.
5. **Browser and mobile are first-class.** Every required match action must work on touch without complex button combinations.
6. **Wrestling, not generic fighting.** Position, stamina, selling, reversals, knockdowns, pins, submissions, momentum, crowd response and match storytelling matter.
7. **Career outcomes are broader than wins.** Match quality, crowd response, rivalries, popularity and championships feed long-term progression.
8. **No generative model controls authoritative state.** Future AI text can add flavor, not decide rankings, damage, booking outcomes or economy mutations.

## First playable vertical slice

The first playable is intentionally narrow:

- Marcus Reign vs. Cole Sterling
- one arena
- one singles match type
- walk and run
- strikes
- grapples
- 8–12 moves per wrestler
- reversals
- stamina and body damage
- knockdowns and recovery
- pins and referee count
- signature and finisher
- baseline opponent AI
- crowd reaction and match rating
- complete mobile controls
- deterministic replay/acceptance coverage

Career, roster expansion and alternate match types come after the match is fun.

## Repository structure

```text
notwwe/
├── README.md
├── CLAUDE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── assets/
│   └── README.md
├── deploy/
│   └── README.md
├── docs/
│   ├── README.md
│   ├── product/
│   ├── architecture/
│   └── reviews/
├── src/
│   ├── content/
│   ├── core/
│   ├── systems/
│   ├── game/
│   ├── persistence/
│   ├── presentation/
│   ├── render3d/
│   ├── audio/
│   └── ui/
├── tests/
│   └── README.md
└── .todos/
    └── README.md
```

## Architectural layers

| Layer | Responsibility | May depend on |
| --- | --- | --- |
| Content | wrestlers, moves, arenas, belts, match types, career events | neutral content only |
| Core | deterministic math, RNG, clocks, state-machine helpers | content where necessary |
| Gameplay systems | movement, combat, damage, pin, submission, AI, career, rivalry, booking | core + content |
| Game/session | command dispatch, system sequencing, match/career lifecycle | systems + core + content |
| Persistence | parse, migrate, validate and canonicalize saves | core/content + explicit validators |
| UI/input | DOM, touch, keyboard/gamepad translation, dialogs, frame scheduling | game/session + read-only queries |
| Presentation | animation intent, camera, VFX, audio cues | ordered domain events + read-only state |
| Renderer | Three.js scene, meshes, picking, interpolation | presentation + read-only state |

See `docs/architecture/game-architecture.md` and `docs/architecture/system-boundaries.md`.

## Work order

The detailed backlog is in `.todos/`. The high-level phases are:

| Phase | TODOs | Outcome |
| --- | --- | --- |
| Foundation | 0001–0006 | stable architecture, schemas, deterministic match state and wrestler state machine |
| Core wrestling | 0007–0016 | complete headless singles match with AI |
| 3D/playability | 0017–0021 | playable, choreographed desktop/mobile match |
| Career | 0022–0032 | roster, career, rivalries, booking, titles, calendar, saves |
| Quality/release | 0033–0040 | replay, audio, camera, match expansion, acceptance and deployment |

**Recommended first batch:** 0001–0006.  
**First-playable gate:** 0001–0021.  
**Do not start broad career content until the first-playable gate passes human gameplay review.**

## Required validation commands

The implementation should expose commands equivalent to:

```sh
npm test
npm run build
npm run check
```

CI must run all three. Human/device acceptance is separate from automated CI and must never be inferred from a green build.
