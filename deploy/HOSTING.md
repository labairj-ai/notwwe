# Optiplex hosting

URL: https://optiplex.tailb97cdb.ts.net/notwwe/

Provisioned 2026-10-17. Currently serves the planning-stage landing page in
`deploy/site/index.html`; no playable game or release certification is claimed.

Nginx config: `/etc/nginx/conf.d/notwwe.conf` on Optiplex.
Static root: `/var/www/notwwe/site`.
Loopback listener: `127.0.0.1:4602`.
Tailscale path `/notwwe` proxies to this listener; the existing HTTPS port 443
Funnel exposes it publicly alongside the existing root and `/notsims` routes.

Update the page by copying `deploy/site/index.html` to Optiplex and installing
it at `/var/www/notwwe/site/index.html` with mode 644. Future game builds should
replace the landing page through an appropriate release deployment process.
Do not reset Tailscale routes. Changes via `tailscale serve` can disable Funnel;
ensure port 443 Funnel remains enabled after route updates.

Validation: public landing page returned HTTP 200 and matched the local file
byte-for-byte. Existing `/notsims/` returned HTTP 200; the root returned its HTTP 302 redirect.
