import { PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_Y } from './constants'

export const CRITTER_START_STAGE = 5
export const CRITTER_RADIUS = 16

export type Critter = {
  minX: number
  maxX: number
  periodMs: number
  phaseMs: number
}

const LAYOUTS: readonly (readonly Omit<Critter, 'periodMs' | 'phaseMs'>[])[] = [
  [{ minX: 80, maxX: 380 }],
  [{ minX: 500, maxX: 860 }],
  [
    { minX: 80, maxX: 300 },
    { minX: 600, maxX: 860 },
  ],
  [{ minX: 200, maxX: 700 }],
  [
    { minX: 80, maxX: 250 },
    { minX: 350, maxX: 550 },
    { minX: 650, maxX: 860 },
  ],
]

// A small crawling hazard that patrols the ground line, appearing roughly
// one stage in three from stage 6 (0-indexed 5) onward — a puzzle-lite
// timing element (dodge/wait/ladder-climb past it) rather than a new
// reflex test, distinct from every other hazard so far in that it's a
// visible, physically moving obstacle instead of a zone that flips on and
// off. Deterministic patrol (a fixed-period back-and-forth), not physics-
// simulated, so a stage's pattern is identical on every attempt.
export function getStageCritters(stageIndex: number): Critter[] | null {
  if (stageIndex < CRITTER_START_STAGE) return null
  if (stageIndex % 3 !== 2) return null

  const depth = stageIndex - CRITTER_START_STAGE
  const layout = LAYOUTS[depth % LAYOUTS.length]
  const periodMs = Math.max(2200, 4200 - depth * 60)
  return layout.map((critter, index) => ({
    ...critter,
    periodMs,
    phaseMs: (index * periodMs) / layout.length,
  }))
}

function triangleWave(elapsedMs: number, periodMs: number): number {
  const half = periodMs / 2
  const phase = ((elapsedMs % periodMs) + periodMs) % periodMs
  return phase < half ? phase / half : 2 - phase / half
}

// 0 at minX, 1 at maxX, ping-ponging smoothly back and forth — purely a
// function of elapsed time, so no per-frame mutable state is needed.
export function getCritterX(critter: Critter, elapsedMs: number): number {
  const t = triangleWave(elapsedMs + critter.phaseMs, critter.periodMs)
  return critter.minX + t * (critter.maxX - critter.minX)
}

export function critterHitsPlayer(
  critterX: number,
  playerX: number,
  playerY = PLAYER_Y,
): boolean {
  const halfW = PLAYER_WIDTH / 2
  const halfH = PLAYER_HEIGHT / 2
  const closestX = Math.min(
    Math.max(critterX, playerX - halfW),
    playerX + halfW,
  )
  const closestY = Math.min(
    Math.max(PLAYER_Y, playerY - halfH),
    playerY + halfH,
  )
  const dx = critterX - closestX
  const dy = PLAYER_Y - closestY
  return dx * dx + dy * dy <= CRITTER_RADIUS * CRITTER_RADIUS
}
