# Phase 5-13. Overdrive Nexus (Stages 141-150)

## Goal

- Close out the current stage roster with a genuine finale: a hazard
  that's chaotic rather than merely stronger, and a capstone item that
  rewards surviving it. Reuse the gravity-well infrastructure wholesale
  (`stepBall`/`predictLandingSpot` already accept an array of wells) so
  the finale's novelty is in the _behavior_ of the wells, not new
  physics-layer code.

## New mechanic: Polarity Wells

- `getStageOverdriveBaseWells` (`overdriveWells.ts`) returns a
  twin-well pair per stage (same `GravityWell` shape as Stellar
  Forge/Cosmic Frontier/Vortex Frontier), escalating in strength with
  depth.
- `getOverdriveWellsAtTime(baseWells, stageIndex, elapsedMs)` flips
  every well's `strength` sign on a fixed half-cycle
  (`getOverdrivePolarityPeriodMs`, shortening with depth) —
  `applyGravityWellPull` already treats a negative `strength` as
  repulsion via the same distance-based formula, so no engine change
  was needed. Balls converging toward the pair suddenly scatter away
  and vice versa, on a cycle fast enough by the final stages that
  reading "which way right now" matters as much as reading the balls.
- Slotted into the same `activeGravityWell` variable the earlier
  wells/nebula/vortex hazards use (their stage ranges never overlap),
  so no new physics wiring was needed in `GamePlay.tsx` beyond
  computing the time-based polarity each tick.
- Not neutralized by Stabilizer, same precedent as every hazard added
  after Stabilizer's original design (Fireproof/Anchor/Umbrella/Grip
  Boots/Visor/Lock-On all work the same way) — only the new Overdrive
  item cancels it.

## New item: Overdrive

- The capstone reward for the whole 150-stage roster: for 8 seconds,
  blocks _all_ hazard damage (folded into the same top-level immunity
  gate as Invincible — clock/ball/fire-zone/acid-rain damage are all
  skipped) and neutralizes every push/pull/slow/jitter hazard
  (gravity wells including polarity wells, ice wind, solar flare
  slowdown, quantum jitter) simultaneously, on top of a 1.5x score
  multiplier (`OVERDRIVE_SCORE_MULTIPLIER`) that stacks with Nova
  Surge if both happen to be active. Introduced at stage 141 (0-indexed
  140), same "introduced once, stays in the pool forever after"
  pattern as every other stage-gated item, but rarer (weight 7 vs. 10)
  since it does substantially more than any single-hazard counter-item.

## Theme

- Ten climactic, high-contrast compositions (a warning-striped
  redline gate, an overheating core, four-color chaos convergence,
  twin red/blue polarity cores nodding to the twin wells, a warping
  grid maelstrom, an ascending tower, a cracking critical-mass core, a
  besieged fortress, a five-stream "ultimate overdrive" combining
  earlier blocks' color motifs, and a final imploding twin-ring
  collapse), Canvas-2D only.

## Files

- `src/game/overdriveWells.ts` — new file: `OVERDRIVE_START_STAGE`,
  `OVERDRIVE_STAGE_COUNT`, `getStageOverdriveBaseWells`,
  `getOverdrivePolarityPeriodMs`, `getOverdriveWellsAtTime`
- `src/game/overdriveWells.test.ts` — new file
- `src/GamePlay.tsx` — `activeGravityWell` extended for the
  time-flipped wells, `drawOverdriveWell` (polarity-colored variant of
  `drawGravityWell`), top-level damage gate extended with
  `isOverdriveActive`, score-multiplier stacking, "POLARITY WELLS" HUD
  badge, Overdrive item wiring
- `src/StageMap.tsx` — "POLARITY WELLS" stage-map badge
- `src/game/backgrounds.ts` — 10 new backgrounds + `STAGE_NAMES` entries
- `src/game/constants.ts` — `STAGE_COUNT` raised to 150 (final), 10 new
  `STAGE_OBSTACLES` entries, `OVERDRIVE_ITEM_START_STAGE`/
  `OVERDRIVE_DURATION_MS`/`OVERDRIVE_SCORE_MULTIPLIER` (see
  `phase3_4.md`)
- `src/game/hazardCatalog.ts` — `overdriveWells` entry
