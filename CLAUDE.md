# CLAUDE.md — Not WWE engineering contract

This file is the coding-agent operating contract for the Not WWE repository. Read this file, `README.md`, `.todos/README.md`, `docs/architecture/game-architecture.md`, and the active TODO before changing code.

## Project intent

Build an original browser-first professional wrestling career game. Preserve the architectural strengths proven in Notsims while designing the wrestling simulation correctly from the first implementation.

The initial product is not a clone of WWE 2K and is not a licensed WWE product. `Not WWE` is an internal codename. Public-facing content must remain original.

## Non-negotiable architecture rules

1. **GameState and MatchState are simulation authority.** DOM, renderer, animation, camera, audio and wall-clock time are never authoritative.
2. **Commands enter through dispatch.** Do not add direct UI mutations of authoritative state.
3. **Systems return ordered domain events.** Events describe facts already applied by the simulation; event subscribers must not mutate authoritative state.
4. **Seeded RNG only.** No `Math.random()` in gameplay systems. Cosmetic presentation randomness must use a separate non-authoritative stream and must never feed simulation state.
5. **Animation cannot determine hit/miss/reversal/damage.** Resolve the move first; presentation then choreographs the resolved result.
6. **No hidden second clocks.** Match elapsed time and career calendar use explicit simulation time. `requestAnimationFrame`, audio time and animation mixer time cannot advance gameplay.
7. **Content is data.** Wrestlers, moves, arenas and match types must be content definitions interpreted by systems, not branches hardcoded around named characters.
8. **Renderer-neutral semantics.** Match rules, damage, AI, booking and career systems must run headlessly in tests.
9. **Save migrations are pure.** No DOM, storage, wall clock, network, RNG or active session access in migrations.
10. **No LLM authority.** A future language model may generate flavor text from bounded facts, but cannot change outcomes, rankings, damage, money, titles, bookings or saves directly.

## Dependency direction

```text
content
  ↓
core
  ↓
systems
  ↓
game/session
  ↓
ui/input

persistence → core/content/validators
presentation → read-only state + domain events
render3d → presentation + read-only state
```

Do not create imports from core/systems/game into UI, presentation or render3d. Do not import a compatibility facade from leaf modules if doing so creates a cycle.

## Match-state rules

Use explicit wrestler states such as:

```text
STANDING WALKING RUNNING GRAPPLING ATTACKING REVERSING STUNNED
KNOCKED_DOWN GETTING_UP CORNERED ROPES APRON TOP_ROPE PINNING
PINNED SUBMISSION_ATTACK SUBMISSION_DEFENSE TAUNTING FINISHER VICTORY
```

State transitions belong to simulation systems. Animation controllers mirror semantic state and events; they do not invent transitions.

## Action-resolution order

For an attempted move, keep a documented deterministic order. A typical sequence is:

```text
validate command
→ validate positions/states
→ spend/verify stamina if policy requires
→ resolve defense/reversal window
→ resolve success/failure
→ apply damage/body-part effects
→ apply stamina/recovery effects
→ update momentum/crowd/story metrics
→ update wrestler state/position
→ emit ordered events
```

Do not silently reorder this contract when adding features. If it must change, update architecture docs and regression tests in the same PR.

## Persistence rules

- Save only authoritative persistent career state and explicitly resumable match state.
- Prefer derived configuration over duplicated persisted policy.
- Never persist renderer objects, animation clocks, DOM state, camera state, transient input state or event subscribers.
- Future save-version changes require a migration plus frozen prior-version fixtures.

## Testing expectations

Every gameplay TODO should add at least one focused invariant test. Critical systems need deterministic scenario tests.

At minimum preserve coverage for:

- same seed + commands = same result/events/final state;
- render frame rate cannot change match result;
- rejected commands leave state unchanged;
- stamina/damage/momentum remain within documented bounds;
- pins/submissions cannot enter impossible states;
- AI uses the same legal command path as the player;
- save/load cannot duplicate damage, pay, title changes or career events;
- content validation rejects unknown move/wrestler references;
- mobile UI can express every required first-playable action.

## TODO workflow

- Work from `.todos/` in dependency order, not merely numeric order when dependencies differ.
- Change TODO status only when its acceptance criteria are actually satisfied.
- Do not mark physical-device, human-motion, audible-output or subjective-fun acceptance complete from automated tests.
- Completion evidence should record commit SHA, commands run, test counts, browser/device observations and remaining limitations.
- Architecture changes discovered during implementation must be documented before or with the code change.

## Scope discipline

Do not introduce these before the backlog explicitly calls for them:

- online multiplayer;
- battle royal / 30-person modes;
- ladder/table destruction physics;
- backstage free roaming;
- create-an-arena;
- large facial-animation systems;
- generative booking authority;
- tag-team simulation before TODO 0037;
- unbounded roster expansion before first-playable acceptance.

Prefer a polished, replayable singles match over broad incomplete features.

## IP and asset rules

Do not commit or generate public-facing copies of WWE logos, title belts, superstar likenesses, distinctive tattoos, ring gear, entrance music, catchphrases, branded show names or exact gimmicks. Wrestlers should be original fictional characters built from broad professional-wrestling archetypes.

Every external asset must have documented provenance and redistribution rights in `assets/README.md` or a linked license file.

## Before closing a TODO

Run the relevant focused tests plus the full required project commands. Review dependency direction, save/replay impact, mobile behavior and any human/device acceptance requirement. Record truthful completion evidence; green CI is not proof of subjective quality.
