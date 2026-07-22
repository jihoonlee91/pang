# Phase 6-5. Chaos Rift Finale & Golden Ball (Stages 151-200)

## Goal

- Extend the game from 150 to 200 stages (`STAGE_COUNT`) with a new
  finale block, Chaos Rift, rather than ending progression at Overdrive
  Nexus.
- Add one universal "fun" mechanic (Golden Ball) that isn't tied to any
  stage range, giving every stage a small chance at a bonus moment.

## New mechanic: Chaos Rift (stages 151-200, 0-indexed 150-199)

Rather than inventing brand-new physics, Chaos Rift remixes the game's
three most established ball-affecting hazards — never more than two new
mechanics needed, all already fully wired in `GamePlay.tsx`. Originally
shipped as one 50-stage block with a single combo (current + fire) under
one name, which read as monotonous next to every other chapter being 10
stages with its own identity. Split into 5 named sub-chapters instead,
each with a different pair:

| Stages  | Name              | Current | Gravity well       | Fire zones |
| ------- | ----------------- | :-----: | ------------------ | :--------: |
| 151-160 | Fractured Gateway |   ✅    | —                  |     ✅     |
| 161-170 | Storm Citadel     |    —    | ✅ (straight pull) |     ✅     |
| 171-180 | Molten Maelstrom  |   ✅    | ✅ (straight pull) |     —      |
| 181-190 | Prism Collapse    |    —    | ✅ (spinning)      |     ✅     |
| 191-200 | Final Singularity |   ✅    | ✅ (straight pull) |     ✅     |

- All three data generators (`chaosRift.ts`: `getChaosRiftCurrent`,
  `getChaosRiftFireZones`, `getChaosRiftWells`) return the exact same
  `StageCurrent`/`FireZone[]`/`GravityWell[]` shapes as the originals
  (current from `currents.ts`, fire zones from `fireZones.ts`, wells from
  `gravityWells.ts`), gated by which sub-chapter a stage falls in
  (`subBlockIndex`). `GamePlay.tsx` sums/merges them into the exact same
  `windAx`/`activeGravityWell`/fire-zone variables the original hazards
  use, so no new physics, rendering, damage-check, or AI-dodge code was
  needed — only the gating.
- Current and wells both start above their original chapters' peak
  strength from the first stage they appear in (current: 220 vs The
  Trench's 216 ceiling; wells: 4.4M vs Stellar Forge's 4.63M ceiling —
  and Prism Collapse's spin exceeds Vortex Frontier's).
- Counters: **Stabilizer** already neutralizes both current (`windAx`)
  and gravity wells (`activeGravityWell`) under the same
  `isStabilizerActive` gate, so one item covers every push/pull
  combination here. **Fireproof**/**Overdrive** already neutralize fire
  damage. All three already reappear in `getItemWeights` from stage 150
  onward — no new item was needed for any sub-chapter.
- Each sub-chapter's first stage (150, 160, 170, 180, 190) has its own
  `HAZARD_CATALOG` entry in `hazardCatalog.ts`, so the one-time
  "New Hazard" intro popup fires again every time the combo shifts,
  matching how every earlier chapter announces itself.
- Stage names (`backgrounds.ts`'s `STAGE_NAMES`) were re-suffixed from a
  single `(Chaos Rift)` to the 5 sub-chapter names above, matching the
  thematic content the individual stage names (e.g. "Stormbound
  Bastion", "Prism Divide") already implied. A separate, later pipeline
  (`phase6_6.md`) generated fully independent per-stage illustrations for
  151-200 using the stage title + chapter name as the art prompt — that
  art already exists and wasn't regenerated here, but the corrected
  chapter names now at least display correctly in the stage map/HUD.
- 50 procedurally-generated `STAGE_OBSTACLES` entries (matching the
  existing random-looking style) give Chaos Rift its own platform
  layouts, independent of the hazard redesign above.

## New mechanic: Golden Ball (all stages)

- A stage's starting balls (not split children) each have a
  `GOLDEN_BALL_CHANCE` (12%) chance of spawning golden
  (`ball.golden = true` in `types.ts`), independent of stage or hazard.
- A golden ball renders with a gold gradient, a stronger glow, and a
  slowly rotating dashed ring (`drawBall` in `GamePlay.tsx`) so it reads
  as a bonus target at a glance.
- Popping one (harpoon hit or Shockwave) multiplies that hit's score by
  `GOLDEN_BALL_SCORE_MULTIPLIER` (3x, stacking with Nova Surge/Overdrive
  like every other multiplier) and pays out a gold-colored particle burst
  and a "GOLDEN +N" popup instead of the usual "+N".
- Split children never inherit the golden flag (`splitBall` builds plain
  new balls) — the bonus is a one-shot moment, not a stacking chain.

## Files

- `src/game/chaosRift.ts` (new) — `getChaosRiftCurrent`,
  `getChaosRiftFireZones`, `getChaosRiftWells`, tested in
  `chaosRift.test.ts`
- `src/game/constants.ts` — `STAGE_COUNT` 150 → 200, 50 new
  `STAGE_OBSTACLES` entries, `STABILIZER_CHAOS_RIFT_START_STAGE`/
  `FIREPROOF_CHAOS_RIFT_START_STAGE` second windows in `getItemWeights`,
  `GOLDEN_BALL_CHANCE`/`GOLDEN_BALL_SCORE_MULTIPLIER`
- `src/game/types.ts` — `Ball.golden?: boolean`
- `src/game/hazardCatalog.ts` — 5 `chaosRift*` entries, one per
  sub-chapter
- `src/game/backgrounds.ts` — `STAGE_NAMES` 151-200 re-suffixed with the
  5 sub-chapter names instead of one shared `(Chaos Rift)`
- `src/GamePlay.tsx` — wires Chaos Rift's current/wells/fire zones into
  the existing physics/rendering/damage/AI-dodge paths (merged into the
  same `windAx`/`activeGravityWell`/fire-zone variables the original
  hazards use); rolls and renders Golden Ball; multiplies score and swaps
  particle color/popup text on a golden hit (both the normal harpoon-hit
  path and Shockwave)
- `src/game/terrain.test.ts`, `src/game/constants.test.ts` — updated
  expectations for the new stage count and item-pool windows

## Verification

Illustrated-background files:

- `src/assets/backgrounds/`: five Chaos Rift chapter plates
- `src/assets/backgrounds/illustrated/`: dedicated `stage151.webp`
  through `stage200.webp` runtime backgrounds
- `src/game/backgrounds.ts`: chapter fallbacks and dedicated image
  resolution without modulo reuse

- `tsc -b`, `oxlint`, `vitest run` (206 tests), and `prettier --check`
  all pass.
- Manually verified in-browser: Stage 151 shows the "Chaos Rift" HUD tag
  and fires the new-hazard intro popup with the correct description;
  Glossary lists Piercer/Chaos Rift correctly; no console errors.
