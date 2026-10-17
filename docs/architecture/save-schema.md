# Save schema and migrations

## Principles

- Begin with an explicit `CURRENT_SAVE_VERSION` from the first save implementation.
- Treat imported JSON as untrusted input.
- Parsing, migration, validation and runtime reconstruction are separate steps.
- Migrations are pure deterministic functions.
- Loading a save cannot silently apply a completed match result twice.

## Persistent career data

Persist only authoritative career state and bounded history required for gameplay. Presentation/UI settings should use separate device preferences.

## In-progress match policy

The project must explicitly choose whether an active match can be saved. If enabled, persist only authoritative resumable MatchState plus deterministic RNG state; reconstruct presentation on load. Never serialize Three.js objects, animation mixers, event listeners, audio state or DOM state.

## Migration pipeline

```text
parse
→ identify version
→ apply ordered pure migrations
→ validate canonical schema
→ rebuild derived/runtime fields
→ return separate canonical state
```

Future-version saves fail safely. Unknown IDs referenced by required authoritative data fail with actionable errors; do not silently substitute a different wrestler/move/champion.

## Testing

Every production schema bump requires a frozen real prior-version fixture, migration-chain tests, future-version rejection, input immutability, invalid migrated-data rejection and load/save idempotence checks.
