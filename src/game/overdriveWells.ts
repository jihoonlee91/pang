import { CANVAS_WIDTH } from './constants'
import type { GravityWell } from './gravityWells'

export const OVERDRIVE_START_STAGE = 140
export const OVERDRIVE_STAGE_COUNT = 10

const OVERDRIVE_WELL_PAIRS: readonly (readonly [
  readonly [number, number],
  readonly [number, number],
])[] = [
  [
    [260, 210],
    [620, 250],
  ],
  [
    [220, 250],
    [660, 200],
  ],
  [
    [300, 190],
    [580, 290],
  ],
  [
    [240, 290],
    [640, 190],
  ],
  [
    [280, 220],
    [600, 240],
  ],
  [
    [220, 240],
    [660, 260],
  ],
  [
    [320, 200],
    [560, 280],
  ],
  [
    [260, 280],
    [620, 210],
  ],
  [
    [CANVAS_WIDTH / 2 - 220, 220],
    [CANVAS_WIDTH / 2 + 220, 260],
  ],
  [
    [CANVAS_WIDTH / 2 - 200, 260],
    [CANVAS_WIDTH / 2 + 200, 210],
  ],
]

// Twin gravity wells for the finale Overdrive Nexus stages (141-150,
// 0-indexed 140-149) — the base pull magnitude, before the time-based
// polarity flip below is applied. Escalates with depth same as every
// other well-based hazard.
export function getStageOverdriveBaseWells(
  stageIndex: number,
): GravityWell[] | null {
  if (
    stageIndex < OVERDRIVE_START_STAGE ||
    stageIndex >= OVERDRIVE_START_STAGE + OVERDRIVE_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - OVERDRIVE_START_STAGE
  const pair = OVERDRIVE_WELL_PAIRS[depth % OVERDRIVE_WELL_PAIRS.length]
  const strength = 3_800_000 + depth * 550_000
  return pair.map(([x, y]) => ({ x, y, strength }))
}

// How often (ms) the pair's polarity flips between pulling balls in and
// flinging them out — shortens with depth so the finale gets more
// chaotic, not just stronger.
export function getOverdrivePolarityPeriodMs(stageIndex: number): number {
  const depth = Math.max(0, stageIndex - OVERDRIVE_START_STAGE)
  return Math.max(1800, 3200 - depth * 130)
}

/**
 * Applies the time-based polarity flip on top of the base wells — every
 * `getOverdrivePolarityPeriodMs` half-cycle, every well in the pair flips
 * between attracting (positive strength) and repelling (negative
 * strength) at once, so balls that were converging suddenly scatter and
 * vice versa. Reuses `applyGravityWellPull` as-is: it already treats a
 * negative `strength` as repulsion via the same distance-based formula.
 */
export function getOverdriveWellsAtTime(
  baseWells: GravityWell[] | null,
  stageIndex: number,
  elapsedMs: number,
): GravityWell[] | null {
  if (!baseWells) return null
  const periodMs = getOverdrivePolarityPeriodMs(stageIndex)
  const cycle = ((elapsedMs % periodMs) + periodMs) % periodMs
  const attracting = cycle < periodMs / 2
  return baseWells.map((well) => ({
    ...well,
    strength: attracting ? well.strength : -well.strength,
  }))
}
