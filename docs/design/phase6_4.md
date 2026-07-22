# Phase 6-4. Illustrated Late-stage Backgrounds (Stages 21-150)

## Goal

- Raise the visual quality of stages 21-150 to the illustrated standard established by stages 11-20.
- Preserve the existing 130 distinct stage compositions and their gameplay readability.
- Make every stage immediately distinguishable from every other stage, including adjacent stages in the same chapter.

## Design

- Export one optimized 960×540 WebP illustration for every stage from 21 through 150 (130 final assets). Each export permanently combines that stage's unique Canvas composition with its chapter's painted lighting and texture source.
- Treat the 13 chapter art plates as source material only, never as runtime backgrounds shared by multiple stages.
- Keep every existing Canvas background as the no-image fallback. At runtime each stage loads only its own final WebP URL, matching the dedicated-image approach used by stages 11-20.
- Adjacent stages in the same chapter must differ in focal silhouette, scenery layout, crop, lighting balance, and tonal treatment; color-only swaps do not count as unique backgrounds.
- Use the same lazy `Image` loading path and `pang-background-ready` event as stages 11-20 so gameplay and stage-map thumbnails repaint as soon as an asset is ready.
- Retain the final gameplay readability filter. Background detail must remain subordinate to balls, harpoons, platforms, hazards, and HUD elements.

## Chapter art direction

1. Stages 21-30, World Tour II: warm cinematic travel-poster texture, stone, water, foliage, and open sky.
2. Stages 31-40, Dimension X: neon megacity, alien planets, cyan/magenta energy, and deep indigo space.
3. Stages 41-50, The Trench: bioluminescent deep ocean, rock walls, bubbles, and shafts of blue light.
4. Stages 51-60, Stellar Forge: molten stellar machinery, plasma, dark metal, and orange-blue contrast.
5. Stages 61-70, Cosmic Frontier: violet-blue nebula clouds progressing toward a blazing stellar core.
6. Stages 71-80, Vortex Frontier: black-hole spirals, warped starlight, and luminous accretion ribbons.
7. Stages 81-90, Hell: lava, obsidian, embers, furnace glow, and smoke-filled depth.
8. Stages 91-100, Void: sparse near-black space, fading structures, cold light, and controlled negative space.
9. Stages 101-110, Toxic Marsh: acid-green wetlands, industrial decay, fog, and corroded surfaces.
10. Stages 111-120, Frozen Summit: glacier blues, snow haze, ice crystals, aurora, and alpine depth.
11. Stages 121-130, Solar Storm: solar plasma, prominences, sunspots, corona rays, and white-hot highlights.
12. Stages 131-140, Quantum Rift: fractured sci-fi architecture, chromatic splits, particles, and purple-cyan energy.
13. Stages 141-150, Overdrive Nexus: red/blue polarity cores, warning geometry, energy streams, and a climactic high-contrast finish.

## Verification

- `STAGE_NAMES` and `BACKGROUNDS` still contain exactly 150 entries.
- Every stage from 21 through 150 resolves to a distinct image URL and an illustrated wrapper with a working Canvas fallback.
- The 130 late-stage image files have unique binary content; no duplicated or aliased assets are accepted.
- Type check, production build, lint, formatting check, and Vitest all pass.
- Representative early/middle/final chapter stages are visually checked in the stage map or gameplay.
