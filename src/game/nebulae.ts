import { CANVAS_WIDTH } from './constants'
import type { GravityWell } from './gravityWells'

export const NEBULA_START_STAGE = 60
export const NEBULA_STAGE_COUNT = 10

const NEBULA_WELL_PAIRS: readonly (readonly [
  readonly [number, number],
  readonly [number, number],
])[] = [
  [
    [260, 200],
    [620, 260],
  ],
  [
    [220, 260],
    [660, 200],
  ],
  [
    [300, 180],
    [580, 300],
  ],
  [
    [240, 300],
    [640, 180],
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
    [620, 200],
  ],
  [
    [300, 220],
    [580, 260],
  ],
  [
    [CANVAS_WIDTH / 2 - 160, 240],
    [CANVAS_WIDTH / 2 + 160, 220],
  ],
]

// Two simultaneous, weaker gravity wells for the Cosmic Frontier stages
// (61-70, 0-indexed 60-69) — the "missing link" between Stellar Forge's
// single well and Vortex Frontier's single spinning well. Reuses the exact
// same GravityWell/applyGravityWellPull pipeline (stepBall already accepts
// an array of wells), just with two weaker pull points instead of one
// strong one, so navigating between them is the new skill.
export function getStageNebulaWells(stageIndex: number): GravityWell[] | null {
  if (
    stageIndex < NEBULA_START_STAGE ||
    stageIndex >= NEBULA_START_STAGE + NEBULA_STAGE_COUNT
  ) {
    return null
  }

  const depth = stageIndex - NEBULA_START_STAGE
  const [a, b] = NEBULA_WELL_PAIRS[depth % NEBULA_WELL_PAIRS.length]
  const strength = 1_800_000 + depth * 260_000
  return [
    { x: a[0], y: a[1], strength },
    { x: b[0], y: b[1], strength },
  ]
}
