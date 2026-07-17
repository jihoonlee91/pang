import { CANVAS_WIDTH } from './constants'
import type { GravityWell } from './gravityWells'

export const VORTEX_START_STAGE = 70
export const VORTEX_STAGE_COUNT = 10

const VORTEX_POSITIONS: readonly (readonly [number, number])[] = [
  [CANVAS_WIDTH / 2, 200],
  [230, 240],
  [730, 220],
  [CANVAS_WIDTH / 2, 270],
  [360, 180],
  [600, 290],
  [180, 310],
  [780, 210],
  [CANVAS_WIDTH / 2, 230],
  [460, 290],
]

// A spinning gravity well for the Vortex Frontier stages (71-80, 0-indexed
// 70-79) — same radial pull as a plain gravity well, plus a tangential
// component (`spin`, applied in applyGravityWellPull) that curves balls
// into a swirling orbit instead of a straight-line fall toward the center.
// Both pull and spin escalate with depth, so late vortex stages spiral
// noticeably faster and tighter than early ones.
export function getStageVortex(stageIndex: number): GravityWell | null {
  if (
    stageIndex < VORTEX_START_STAGE ||
    stageIndex >= VORTEX_START_STAGE + VORTEX_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - VORTEX_START_STAGE
  const [x, y] = VORTEX_POSITIONS[depth % VORTEX_POSITIONS.length]
  return {
    x,
    y,
    strength: 3_500_000 + depth * 500_000,
    spin: 2_200_000 + depth * 350_000,
  }
}
