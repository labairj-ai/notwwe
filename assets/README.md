# Character and presentation provenance

## Harbor Circuit wrestlers — 0.2 candidate

The primary characters are rigged anatomical humanoid GLBs in `assets/wrestlers/`, generated specifically for this wrestling project. They use the same CC0 MakeHuman source/toolchain as Notsims; no resident outfit, identity or resident-specific motion library is copied into this game.

- Exporter: `scripts/export-wrestlers.py` (original wrestling gear regions and 38 original skeletal motion clips).
- Authoring: Blender **4.5.4 LTS**, MPFB **2.0.18**, source commit `3af0cd5a2ffba072e93a34e5f6f494fdc4813ddf`.
- Source graphical assets: MakeHuman system CC0 pack, ZIP SHA-256 `b542127a8e25547c7c29c19f2d1d2adb9a664c80396ecd694095dbc8028a0107`.
- Used: base humanoid, game_engine skeleton, low-poly eyes/brown_eye texture, neutralized young_lightskinned_male_diffuse texture, short01/long01/afro01 hair and shoes03. No WWE likeness, tattoo, logo, branded gear or music.
- Graphical assets and original exported motion clips: CC0; declaration included as `wrestlers/CC0-1.0.txt`. MPFB program code is GPL and is **not bundled**. The graphical asset license is separate from tool source licensing.
- Sources: [MPFB license policy](https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md), [system assets](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html), [CC0 pack](https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip).

Regenerate with the pinned toolchain:

```sh
MPFB_SOURCE=/path/to/mpfb2/src MPFB_ASSETS=/path/to/system-assets CHARACTER_OUT=/path/to/output blender --background --python scripts/export-wrestlers.py
```

Copy only `athletic.glb`, `powerhouse.glb`, `women_athletic.glb` and `metadata.json` into `assets/wrestlers/`. The `.blend` authoring files and neutral source PNG stay outside the deployed package. Refresh the recorded provenance after a deliberate export with `node scripts/check-wrestlers.mjs --write-manifest`, then run `npm run assets:check`. `scripts/preview-wrestlers.py` produces offline portraits or paired phases (`PREVIEW_MODE=paired`); these are asset QA, not browser or human acceptance.

The athletic GLB carries the shared 38-clip library; the other two meshes use the same 53 named bones with independent rest proportions and retargeted rotations. Skin, hair style/color and gear tint vary at runtime. Six broad body presentations can be supported through these meshes and bounded proportions; three source meshes ship now. Marcus uses a taller powerhouse body, Cole an athletic body.

Budgets: each GLB <8 MB; all three <20 MB; each <60,000 triangles; 53 bones; 1024px maximum textures. Current files are about 6.76/5.93/5.93 MB and 36,506 triangles each. Load/cache only requested body types plus the shared athletic animation library; at most three source assets are cached. Geometry/textures are shared, cloned materials/bones are isolated. Five 1024² RGBA textures imply an upper bound of 20 MiB decoded base pixels per source asset, approximately 26.7 MiB with mipmaps if all are uploaded. Actual browser GPU memory/frame cost and physical-phone thermal behavior remain unmeasured.

## Other assets

Ring, arena and emergency simplified character geometry are project-authored code. Procedural bodies are fallback only. Sounds are original synthesized tones; no third-party music is used. Fonts use the operating system stack. Three.js is MIT licensed and its license is copied into every static build, together with the GLTFLoader/SkeletonUtils helper modules.

Character originality, visual quality, paired contact, sound quality and title naming still require the recorded human acceptance gate. Nothing in this provenance record certifies that review.
