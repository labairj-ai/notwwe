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

## Save version 2 (0.2 candidate)

Pure migration 1→2 preserves career, damage/resources, match position, RNG and elapsed ticks, adding schemaVersion 2, empty pending intent/attack collections, bounded control statistics, zero movement vectors, movement magnitude and pin recovery protection. Existing in-progress attacks in a v1 save are already resolved facts; migration does not replay damage. Subsequent combat follows the new timing profile. `tests/fixtures/save-v1.json` stays frozen; `save-v2.json` covers a pending intent.

Version 2 persists abstract pending intents and prepared-attack deadlines so resume cannot duplicate a hit/cost. Validation rejects invalid directions, actors/actions/sources, duplicate attackers, unbounded/future deadlines, malformed statistics and terminal pending work. Hardware touch IDs, pressed keys, camera, mixer clocks, DOM and audio remain unsaved. The browser releases movement through a normal command on restore/focus/layout transitions; the pure domain loader itself remains deterministic.

Browser writes use `notwwe.save.v2`, with read-only fallback import from `notwwe.save.v1`. The legacy key is retained, allowing a rollback to 0.1 to read the pre-upgrade snapshot. A new v2 save cannot be imported by 0.1; export backups before a rollback. Explicit import validates before replacing active state or stored data.
