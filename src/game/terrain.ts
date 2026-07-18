import {
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_OBSTACLES,
  type Obstacle,
} from './constants'

export type StageTerrain = {
  platforms: readonly Obstacle[]
}

const EXTRA_PLATFORMS: readonly (readonly Obstacle[])[] = [
  [{ x: 100, y: 380, width: 220, height: 18 }],
  [{ x: 580, y: 350, width: 250, height: 18 }],
  [{ x: 100, y: 210, width: 220, height: 18 }],
  [{ x: 620, y: 210, width: 240, height: 18 }],
  [{ x: 120, y: 340, width: 230, height: 18 }],
  [{ x: 610, y: 220, width: 240, height: 18 }],
  [
    { x: 80, y: 370, width: 210, height: 18 },
    { x: 670, y: 360, width: 210, height: 18 },
  ],
  [{ x: 590, y: 220, width: 250, height: 18 }],
  [{ x: 90, y: 190, width: 230, height: 18 }],
  [
    { x: 80, y: 330, width: 220, height: 18 },
    { x: 660, y: 330, width: 220, height: 18 },
  ],
  [{ x: 610, y: 370, width: 240, height: 18 }],
  [{ x: 100, y: 360, width: 240, height: 18 }],
  [
    { x: 80, y: 200, width: 210, height: 18 },
    { x: 670, y: 210, width: 210, height: 18 },
  ],
  [{ x: 600, y: 350, width: 260, height: 18 }],
  [{ x: 100, y: 350, width: 230, height: 18 }],
  [
    { x: 70, y: 370, width: 210, height: 18 },
    { x: 680, y: 240, width: 210, height: 18 },
  ],
  [{ x: 90, y: 210, width: 220, height: 18 }],
  [{ x: 610, y: 230, width: 250, height: 18 }],
  [
    { x: 80, y: 350, width: 220, height: 18 },
    { x: 350, y: 230, width: 260, height: 18 },
  ],
  [
    { x: 60, y: 180, width: 210, height: 18 },
    { x: 690, y: 180, width: 210, height: 18 },
  ],
]

const EARLY_STAGE_TERRAINS: readonly StageTerrain[] = [
  { platforms: [] },
  { platforms: [] },
  { platforms: [{ x: 390, y: 270, width: 180, height: 18 }] },
  { platforms: [{ x: 150, y: 310, width: 210, height: 18 }] },
]

function getTargetPlatformCount(stageIndex: number): number {
  if (stageIndex < 2) return 0
  if (stageIndex < 5) return 1
  return Math.min(4, 2 + Math.floor((stageIndex - 5) / 5))
}

// Eight distinct hand-shaped layout families, cycled by stage index (with
// per-stage jitter within each family) so platform arrangements read as
// genuinely different silhouettes — stairs, towers, a diamond, a scattered
// cluster — instead of one procedural formula repeating for 80 stages
// straight (everything from stage 21 onward used to fall back to a single
// fixed shape, just re-jittered). EXTRA_PLATFORMS above still drives the
// hand-placed early game (roughly stages 5-20); this covers everything
// past it.
const LAYOUT_FAMILIES: readonly ((stageIndex: number) => Obstacle[])[] = [
  // Staggered stairs, ascending left to right.
  (stageIndex) => {
    const jitter = (stageIndex * 13) % 40
    return [
      { x: 80 + jitter, y: 350, width: 170, height: 18 },
      { x: 330 + jitter, y: 270, width: 180, height: 18 },
      { x: 590 - jitter, y: 190, width: 170, height: 18 },
    ]
  },
  // Twin towers: a stacked column on the left, one platform on the right.
  (stageIndex) => {
    const jitter = (stageIndex * 19) % 30
    return [
      { x: 90 + jitter, y: 190, width: 160, height: 18 },
      { x: 90 + jitter, y: 340, width: 160, height: 18 },
      { x: 660 - jitter, y: 260, width: 190, height: 18 },
    ]
  },
  // Outer rim: platforms hugging both edges, one high in the center.
  (stageIndex) => {
    const jitter = (stageIndex * 23) % 25
    return [
      { x: 50 + jitter, y: 300, width: 150, height: 18 },
      { x: 380, y: 160 + jitter, width: 200, height: 18 },
      { x: 720 - jitter, y: 300, width: 150, height: 18 },
    ]
  },
  // Zigzag, alternating left-right-left across the arena.
  (stageIndex) => {
    const jitter = (stageIndex * 17) % 35
    return [
      { x: 70 + jitter, y: 190, width: 160, height: 18 },
      { x: 500 - jitter, y: 300, width: 190, height: 18 },
      { x: 100 + jitter, y: 360, width: 170, height: 18 },
    ]
  },
  // Layered shelves: three horizontal bands at different heights.
  (stageIndex) => {
    const jitter = (stageIndex * 29) % 60
    return [
      { x: 120 + jitter, y: 170, width: 220, height: 18 },
      { x: 340 - jitter, y: 260, width: 230, height: 18 },
      { x: 150 + jitter, y: 350, width: 220, height: 18 },
    ]
  },
  // Diamond: one top-center platform, two mid-height side platforms.
  (stageIndex) => {
    const jitter = (stageIndex * 31) % 30
    return [
      { x: 400 + jitter, y: 160, width: 180, height: 18 },
      { x: 80, y: 280 + jitter, width: 170, height: 18 },
      { x: 690, y: 280 - jitter, width: 170, height: 18 },
    ]
  },
  // Scattered cluster: deterministic pseudo-random spread.
  (stageIndex) => [
    {
      x: 60 + ((stageIndex * 53) % 220),
      y: 160 + ((stageIndex * 37) % 60),
      width: 160,
      height: 18,
    },
    {
      x: 340 + ((stageIndex * 43) % 180),
      y: 220 + ((stageIndex * 61) % 120),
      width: 170,
      height: 18,
    },
    {
      x: 600 + ((stageIndex * 71) % 140),
      y: 180 + ((stageIndex * 47) % 150),
      width: 150,
      height: 18,
    },
  ],
  // Cross: a wide center platform, offset upper and lower platforms.
  (stageIndex) => {
    const jitter = (stageIndex * 11) % 40
    return [
      { x: 320, y: 260, width: 320 - jitter, height: 18 },
      { x: 120 + jitter, y: 160, width: 170, height: 18 },
      { x: 640 - jitter, y: 360, width: 170, height: 18 },
    ]
  },
]

function getSupplementalPlatforms(stageIndex: number): readonly Obstacle[] {
  const family = LAYOUT_FAMILIES[stageIndex % LAYOUT_FAMILIES.length]
  return family(stageIndex)
}

export const STAGE_TERRAINS: readonly StageTerrain[] = STAGE_OBSTACLES.map(
  (primary, stageIndex) => {
    const earlyTerrain = EARLY_STAGE_TERRAINS[stageIndex]
    if (earlyTerrain) return earlyTerrain

    const targetCount = getTargetPlatformCount(stageIndex)
    const candidates = [
      primary,
      ...(EXTRA_PLATFORMS[stageIndex] ?? []),
      ...getSupplementalPlatforms(stageIndex),
    ]
    return { platforms: candidates.slice(0, targetCount) }
  },
)

export function getStageTerrain(stageIndex: number): StageTerrain {
  const normalizedIndex =
    ((stageIndex % STAGE_TERRAINS.length) + STAGE_TERRAINS.length) %
    STAGE_TERRAINS.length
  return STAGE_TERRAINS[normalizedIndex]
}

type PlayerTerrainInput = {
  left: boolean
  right: boolean
}

export function stepPlayerOnTerrain(
  x: number,
  _y: number,
  input: PlayerTerrainInput,
  dtSec: number,
  horizontalSpeed: number,
  _terrain: StageTerrain,
): { x: number; y: number } {
  const horizontalDirection = Number(input.right) - Number(input.left)
  const nextX = Math.min(
    CANVAS_WIDTH - PLAYER_WIDTH / 2,
    Math.max(
      PLAYER_WIDTH / 2,
      x + horizontalDirection * horizontalSpeed * dtSec,
    ),
  )
  return { x: nextX, y: PLAYER_Y }
}
