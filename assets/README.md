# Asset provenance and licensing

All external assets used by Not WWE must be documented here or in linked per-asset license files before they are committed or shipped.

For each asset record:

- file/path;
- asset type;
- original creator/source URL;
- exact license;
- whether modification is permitted;
- whether commercial redistribution is permitted;
- attribution requirement;
- source/version/hash where practical;
- modifications made;
- regeneration/export process for authored derivatives.

## Prohibited sourcing

Do not import WWE game assets, logos, belts, wrestler models, scanned likenesses, entrance audio, broadcast graphics or other protected third-party material merely because it can be found online.

## Runtime dependencies

Third-party code such as Three.js must retain its license in the built distribution where required.

## Mobile budgets

Large wrestler/animation assets should have explicit size and runtime budgets. Build checks should eventually validate required files, licenses and reasonable package sizes.
