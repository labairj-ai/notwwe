# Current capability map

The playable candidate includes the base wrestling/career systems plus the 0.2 character and control revision. See [base implementation](implementation-validation.md), [character/control validation](character-controls-validation.md), and [deployment records](release-validation.md).

0041–0047 software is implemented: rigged GLB humans, 38 skeletal clips, paired choreography, stable verbs, tick buffers, analog two-thumb controls, device layouts and tuned reaction windows. 0048 and prior human/device certification remain open. Public candidate activation follows the user’s explicit OptiPlex instruction while `certified:false` stays truthful. No additional career or match-type expansion is included.

## Active semantic-control candidate (0049–0051)

Supersedes the earlier published candidate: `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d`, clean main source, [passing exact-SHA CI](https://github.com/labairj-ai/notwwe/actions/runs/39082644918). Activated 2026-10-18T00:25:39.250605+00:00. 51 tests, 36 exact replays, 36 pacing runs and source/asset/build checks pass. Certification remains false. Frozen identity, fixed release URL and required per-device SHA confirmation: [first-playable acceptance record](first-playable-acceptance.md). Previous release `e53e5cc406d85e72101365d4d8a1d8aec15214eb` is retained for rollback. Scoped `/releases/` alias exposes retained packages through the isolated NotWWE listener; no other listener or Tailscale route changes. Save v3 preserves old v1/v2 storage snapshots; earlier builds cannot import v3 exports. No human acceptance is inferred.
