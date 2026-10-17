# Game architecture

This is the baseline architecture contract for Not WWE. It is designed for incremental delivery using plain ES modules and plain serializable state. Do not introduce an ECS, state-management framework, DI container or runtime event bus unless a future documented problem justifies it.

## Layers and dependency direction

| Layer | Responsibility | May depend on |
| --- | --- | --- |
| Content | stable wrestler, move, arena, belt, match-type and career definitions | neutral content |
| Core/domain | deterministic RNG, math, time, state-machine and generic identifiers | content where necessary |
| Gameplay systems | movement, combat, damage, stamina, pins, submissions, crowd, AI, career, rivalry, booking | core + content |
| Game/session | new match/career construction, command dispatch, system sequencing, lifecycle | systems + core + content |
| Persistence | parse, migrate, validate, canonicalize saves | core/content + narrow validators |
| UI/input | DOM, input translation, dialogs, browser storage adapters, frame scheduling | game/session + read-only queries |
| Presentation | semantic animation intent, cameras, VFX and audio cue resolution | read-only state + ordered domain events |
| Render3D | scene graph, geometry, meshes, interpolation and picking | presentation + read-only state |

Dependencies point downward toward domain data. Core/gameplay must never import UI, presentation or Three.js.

## Two authoritative state scopes

### Career GameState

Persistent long-term state: selected wrestler, roster progression, calendar, rankings, titles, rivalries, contracts, earnings, fatigue/injuries and history.

### MatchState

Authoritative state for an active match: participants, elapsed simulation time, positions, wrestler states, damage, stamina, momentum, crowd, referee/pin/submission state, deterministic RNG state and final result.

Match completion produces a normalized `MatchResult`; career systems consume that result. Presentation never writes career or match truth.

## Application/session responsibilities

The session layer owns cross-system sequencing and transactions. Systems should not form reciprocal imports merely to trigger each other. Example: combat may return damage/momentum effects; the session applies them in documented order and emits facts.

## Runtime state that is not authoritative

Examples include:

- DOM selection and open panels;
- pointer/touch gesture state;
- camera orbit and zoom;
- Three.js object caches;
- animation mixer clocks and blend weights;
- particle effects;
- audio-node state;
- frame interpolation;
- local toast/notification timers.

None of these may alter replay results.

## Compatibility strategy

Start commands/events and deterministic state from the first implementation rather than extracting them later. The goal is to prevent the coupling that usually appears when prototype UI, animation and gameplay are allowed to mutate the same objects.
