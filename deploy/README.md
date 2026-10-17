# Deployment contract

The game should deploy as a static browser build unless future server-side features explicitly change this architecture.

## Release process

1. Start from a clean checkout of the exact release commit.
2. Record the full SHA.
3. Install from the lockfile.
4. Run `npm test`, `npm run build`, and `npm run check`.
5. Package the complete build; never copy only changed files into production.
6. Generate release metadata with source SHA, build time and check results.
7. Generate file hashes for the package.
8. Transfer/extract into a new versioned release directory.
9. Verify hashes after transfer.
10. Atomically switch the current release pointer.
11. Preserve the previous release for rollback.
12. Verify the public game, main JS/CSS, models, animation assets, audio and release metadata.
13. Record validation in `docs/reviews/release-validation.md`.

## Hosting isolation

If hosted beside Notsims on the OptiPlex, use a separate directory/listener/path and do not overwrite or reset existing Funnel/Nginx routes. A Not WWE release must be independently rollbackable.

## Release truth

A GitHub push is not a deployment. A deployment is not human acceptance. A green browser smoke is not proof of touch comfort, motion quality or audible output.
