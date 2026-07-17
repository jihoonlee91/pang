import { CANVAS_WIDTH } from './constants'

export const GRAVITY_WELL_START_STAGE = 50
export const GRAVITY_WELL_STAGE_COUNT = 10

export type GravityWell = {
  x: number
  y: number
  strength: number
  /**
   * Optional tangential force (perpendicular to the radial pull), scaled
   * the same way as strength. Turns a straight-line pull into a swirling
   * orbit instead. Used by the Vortex hazard (`vortices.ts`, stages
   * 71-80) — plain gravity wells leave this unset.
   */
  spin?: number
}

// Minimum distance-squared used when applying the pull, so a ball passing
// very close to the well doesn't get an unplayable/infinite acceleration.
const MIN_DISTANCE_SQUARED = 1600

const WELL_POSITIONS: readonly (readonly [number, number])[] = [
  [CANVAS_WIDTH / 2, 190],
  [260, 230],
  [700, 210],
  [CANVAS_WIDTH / 2, 260],
  [340, 170],
  [620, 280],
  [200, 300],
  [760, 200],
  [CANVAS_WIDTH / 2, 220],
  [480, 300],
]

// A fixed gravity well hazard for the stellar-forge stages (51-60, 0-indexed
// 50-59). Position varies per stage and pull strength escalates with depth.
export function getStageGravityWell(stageIndex: number): GravityWell | null {
  if (
    stageIndex < GRAVITY_WELL_START_STAGE ||
    stageIndex >= GRAVITY_WELL_START_STAGE + GRAVITY_WELL_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - GRAVITY_WELL_START_STAGE
  const [x, y] = WELL_POSITIONS[depth % WELL_POSITIONS.length]
  return { x, y, strength: 4_000_000 + depth * 700_000 }
}

export function applyGravityWellPull(
  well: GravityWell,
  x: number,
  y: number,
): { ax: number; ay: number } {
  const dx = well.x - x
  const dy = well.y - y
  const distanceSquared = Math.max(dx * dx + dy * dy, MIN_DISTANCE_SQUARED)
  const distance = Math.sqrt(distanceSquared)
  const pull = well.strength / distanceSquared
  let ax = (dx / distance) * pull
  let ay = (dy / distance) * pull
  if (well.spin) {
    // Perpendicular to the radius vector, so the pull curves into an
    // orbit instead of a straight line toward the center.
    const tangential = well.spin / distanceSquared
    ax += (-dy / distance) * tangential
    ay += (dx / distance) * tangential
  }
  return { ax, ay }
}
