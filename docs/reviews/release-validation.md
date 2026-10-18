# Release validation — implementation candidate

Date: 2026-10-17. Branch: `codex/build-notwwe-backlog`. Exact commit identity is recorded in the built package and PR commits; no production certification is claimed.

- Automated local suite: 27 passing tests, 36 exact replay scenarios, content/syntax/37-module dependency checks, full static build.
- Branch protection: GitHub API PUT/readback confirmed required `build` status, strict up-to-date checks, PR requirement (zero additional approving reviewers), administrator enforcement, linear history, conversation resolution, force pushes disabled and deletion disabled.
- Release package: complete static output includes Three.js MIT license, file hashes and `sourceSha`/`sourceClean` metadata. The build-stage `certified` flag is false.
- Rollback rehearsal: temporary filesystem test swaps current/previous release pointers atomically; corruption and uncertified activation are rejected. No existing production route was changed.
- Clean checkout and CI verification: see follow-up evidence below after the candidate commit is pushed.

## Acceptance still open

CUA inventory registered no browsers; requesting Chrome returned “Browser is not available”. No WebGL visual smoke or physical device testing was performed. Human audible-output, choreography/contact/readability, comfort, originality and gameplay/balance review remain open. This blocks certified production activation.

The candidate was subsequently deployed at the user’s explicit request; see activation evidence below. Human/device certification and production human smoke remain open, so TODO 0040 is not marked complete.

## Candidate evidence

- Implementation source: `668d7095540ea63e862c15d2903233ba0d4fdfd7`, clean checkout/tree.
- Complete build: 46 hashed static files; local `verify dist` passed with `sourceClean: true`.
- Local production-style server: `http://127.0.0.1:5194/`; `deploy/verify-http.mjs` passed expected full SHA, key asset HTTP status/MIME and manifest hashes.
- GitHub PR: https://github.com/labairj-ai/notwwe/pull/2
- CI: https://github.com/labairj-ai/notwwe/actions/runs/39062169922 — success (Node 22 install, 27 tests, source checks, 36 replay scenarios and complete build).
- These are implementation/build results, not desktop visual, physical device or certified production deployment evidence.

## OptiPlex activation — explicit user request

- User instruction: “deploy to optiplex.” This authorizes activation of the uncertified candidate while retaining truthful pending acceptance; it does not certify human/device checks.
- Source SHA: `bbf16e91dbded33f52410b2b0df6045e866badd8`; clean build; all package hashes verified after transfer.
- Activated: 2026-10-17T19:25:52.886244Z.
- URL: https://optiplex.tailb97cdb.ts.net/notwwe/
- New target: `/var/www/notwwe/releases/bbf16e91dbded33f52410b2b0df6045e866badd8` through `current`.
- Previous target: `/var/www/notwwe/site` through `previous`; original landing page retained untouched.
- Nginx configuration test and reload succeeded; only the isolated NotWWE root changed. Tailscale/Funnel configuration untouched.
- Public verifier passed HTTP status, HTML/SVG/JS/CSS/JSON MIME, expected clean source SHA, and key asset SHA-256 hashes.
- Existing root and `/notsims/` returned HTTP 200 after activation.
- No browser visual, physical-device, audible-output or subjective gameplay certification claimed. `build-info.json` remains `certified: false`.
- Rollback procedure and pointers: `deploy/HOSTING.md`.


## 0.2 rigged-character/control deployment

- Implementation PR: https://github.com/labairj-ai/notwwe/pull/5 (merged).
- CI: https://github.com/labairj-ai/notwwe/actions/runs/39066887973 — success, 43 tests, source/asset checks, 36 exact replays, 36 difficulty pacing samples and static build.
- Deployed source: `e53e5cc406d85e72101365d4d8a1d8aec15214eb`, clean main tree. Complete 61-file hashed package verified locally and after transfer.
- Activated: 2026-10-17T20:30:25.383258Z; public https://optiplex.tailb97cdb.ts.net/notwwe/.
- Current: `releases/e53e5cc406d85e72101365d4d8a1d8aec15214eb`; previous: `releases/bbf16e91dbded33f52410b2b0df6045e866badd8`; planning page `site` still retained.
- Only scoped GLB MIME added to the isolated NotWWE listener; Nginx configuration test/reload passed. No other listener/Funnel route modified.
- Public verifier passed expected clean source SHA, JS/CSS/HTML/SVG/JSON and all three GLB MIME and hash checks, including GLTFLoader, SkeletonUtils and BufferGeometryUtils modules.
- Existing root and `/notsims/` returned HTTP 200 after activation.
- Metadata remains `certified:false`. No usable CUA browser/Chrome window, physical-phone session, audible human test or subjective contact/gameplay acceptance was available. TODO 0048 remains blocked on that evidence.
- Save v2 migration/storage and rollback limitations: `docs/architecture/save-schema.md`; rollback pointers/procedure: `deploy/HOSTING.md`.

## Active semantic-control candidate (0049–0051)

Supersedes the earlier published candidate: `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d`, clean main source, [passing exact-SHA CI](https://github.com/labairj-ai/notwwe/actions/runs/39082644918). Activated 2026-10-18T00:25:39.250605+00:00. 51 tests, 36 exact replays, 36 pacing runs and source/asset/build checks pass. Certification remains false. Frozen identity, fixed release URL and required per-device SHA confirmation: [first-playable acceptance record](first-playable-acceptance.md). Previous release `e53e5cc406d85e72101365d4d8a1d8aec15214eb` is retained for rollback. Scoped `/releases/` alias exposes retained packages through the isolated NotWWE listener; no other listener or Tailscale route changes. Save v3 preserves old v1/v2 storage snapshots; earlier builds cannot import v3 exports. No human acceptance is inferred.

Post-activation verifiers passed both current and fixed acceptance URLs, including GLBs, loader modules and integrity/MIME/source checks. Embedded page identity equals build-info.json; certified remains false. Existing home route returns 302 then 200, and /notsims/ returns 200. CUA inventory still exposes no browser surfaces; no browser visual or physical-device pass is claimed.
