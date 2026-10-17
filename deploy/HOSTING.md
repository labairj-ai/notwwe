# OptiPlex hosting

Playable candidate: https://optiplex.tailb97cdb.ts.net/notwwe/

0.2 candidate activated 2026-10-17T20:30:25Z at the user’s explicit request. Source: `e53e5cc406d85e72101365d4d8a1d8aec15214eb`, built from a clean tree. Human/device certification remains pending; packaged `certified` metadata is false. No acceptance certificate was fabricated.

- Nginx config: `/etc/nginx/conf.d/notwwe.conf`
- Isolated listener: `127.0.0.1:4602`
- Static root: `/var/www/notwwe/current`
- Active pointer: `releases/e53e5cc406d85e72101365d4d8a1d8aec15214eb`
- Previous pointer: `releases/bbf16e91dbded33f52410b2b0df6045e866badd8` (0.1 playable candidate retained untouched)
- Original planning page: `site` (still retained)
- Activation record: `/var/www/notwwe/deployment.json`
- Original Nginx config: `/var/www/notwwe/notwwe.conf.before-playable`

Only the NotWWE listener’s root changed. `nginx -t` passed and Nginx reloaded successfully. No Tailscale/Funnel route or other listener was changed. Public NotWWE identity, key assets, MIME types and SHA-256 hashes passed `deploy/verify-http.mjs`; the root and `/notsims/` also returned HTTP 200 afterward.

## Roll back this activation

Run on OptiPlex as root:

```python
import os
from pathlib import Path
root = Path('/var/www/notwwe')
target = os.readlink(root / 'previous')
assert (root / target).resolve().is_relative_to(root)
assert (root / target / 'index.html').is_file()
(root / 'current.rollback').symlink_to(target)
os.replace(root / 'current.rollback', root / 'current')
```

Nginx continues using the same `current` path; no route reset or reload is needed for this pointer rollback. Verify the public page afterward. Keep the playable release for investigation/re-activation. The current previous target is a complete hashed 0.1 package, so `release.mjs rollback` can also restore it. The legacy planning page remains separately available at `site`. V2 saves cannot be read by 0.1; the separate v1 browser storage snapshot is preserved for rollback, and v2 exports should be backed up.

The listener includes a scoped `.glb` location with `model/gltf-binary` MIME. No global MIME table, other listener or Tailscale route changed. All three public GLBs and the packaged loader/skeleton addons passed hash and MIME checks.
