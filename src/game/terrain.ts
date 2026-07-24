import {
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_OBSTACLES,
  type Obstacle,
} from './constants'
import { ICE_WIND_START_STAGE, ICE_WIND_STAGE_COUNT } from './iceWinds'

export type Ladder = {
  x: number
  width: number
  // How high the player can climb — the ground itself is always PLAYER_Y.
  topY: number
}

export type StageTerrain = {
  platforms: readonly Obstacle[]
  // The floor itself is slick through Frozen Summit (same range as the
  // Ice Wind push hazard) — the player accelerates toward input instead
  // of snapping to full speed, and keeps sliding once input releases
  // instead of stopping dead. Distinct from Ice Wind: that's an external
  // push independent of the player's own input, this is the player's own
  // momentum being harder to control.
  icy?: boolean
  // A vertical zone the player can climb (Up/Down while standing in its
  // x-range) to fire harpoons from a higher vantage point — a small
  // positioning puzzle rather than a new attack, echoing classic Pang's
  // ladders. Stepping outside the ladder's x-range lets the player fall
  // back to the ground rather than float in place.
  ladder?: Ladder
}

const HIDDEN_FINALE_TERRAIN: StageTerrain = {
  platforms: [
    { x: 380, y: 142, width: 200, height: 18 },
    { x: 120, y: 245, width: 180, height: 18 },
    { x: 660, y: 245, width: 180, height: 18 },
    { x: 390, y: 350, width: 180, height: 18 },
  ],
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

function isIcyStage(stageIndex: number): boolean {
  return (
    stageIndex >= ICE_WIND_START_STAGE &&
    stageIndex < ICE_WIND_START_STAGE + ICE_WIND_STAGE_COUNT
  )
}

// Held off until the "layout families" terrain kicks in (same reasoning as
// DESTRUCTIBLE_START_STAGE below) and appears roughly one stage in four —
// frequent enough to matter, rare enough to stay a special moment rather
// than a permanent fixture of every stage.
const LADDER_START_STAGE = 30

function getStageLadder(stageIndex: number): Ladder | undefined {
  if (stageIndex < LADDER_START_STAGE) return undefined
  if (stageIndex % 4 !== 1) return undefined
  const laneJitter = (stageIndex * 41) % (CANVAS_WIDTH - 320)
  return {
    x: 160 + laneJitter,
    width: 36,
    topY: 200 + ((stageIndex * 23) % 80),
  }
}

export const STAGE_TERRAINS: readonly StageTerrain[] = STAGE_OBSTACLES.map(
  (primary, stageIndex) => {
    const icy = isIcyStage(stageIndex) ? { icy: true } : {}
    const ladder = getStageLadder(stageIndex)
    const ladderProp = ladder ? { ladder } : {}
    const earlyTerrain = EARLY_STAGE_TERRAINS[stageIndex]
    if (earlyTerrain) return { ...earlyTerrain, ...icy, ...ladderProp }

    const targetCount = getTargetPlatformCount(stageIndex)
    const candidates = [
      primary,
      ...(EXTRA_PLATFORMS[stageIndex] ?? []),
      ...getSupplementalPlatforms(stageIndex),
    ]
    return {
      platforms: candidates.slice(0, targetCount),
      ...icy,
      ...ladderProp,
    }
  },
)

export function getStageTerrain(stageIndex: number): StageTerrain {
  if (stageIndex === 200) return HIDDEN_FINALE_TERRAIN
  const normalizedIndex =
    ((stageIndex % STAGE_TERRAINS.length) + STAGE_TERRAINS.length) %
    STAGE_TERRAINS.length
  return STAGE_TERRAINS[normalizedIndex]
}

// A classic Pang callback: some platforms can be broken by a harpoon hit
// instead of just blocking it, opening up the layout mid-stage — a small
// puzzle element (when to clear a block vs. route around it) rather than
// pure reflex. Held off until stage 21 (0-indexed 20), once the ladder-
// free "layout families" terrain is established and there's more than one
// platform per stage to make destroying one a real tradeoff. Deterministic
// per stage+platform rather than random, so a stage's layout is the same
// on every attempt — roughly one in three platforms.
const DESTRUCTIBLE_START_STAGE = 20

export function isDestructiblePlatform(
  stageIndex: number,
  platformIndex: number,
): boolean {
  if (stageIndex < DESTRUCTIBLE_START_STAGE) return false
  return (stageIndex + platformIndex) % 3 === 0
}

// Held off until the same "layout families" terrain as destructible
// platforms, gated on a different modulus so the two mechanics interleave
// rather than always landing on the same platforms. A moving platform
// changes where a ball will bounce moment to moment, adding timing to
// what would otherwise be a fixed layout to memorize.
const MOVING_PLATFORM_START_STAGE = 25
const MOVING_PLATFORM_RANGE = 40

export function isMovingPlatform(
  stageIndex: number,
  platformIndex: number,
): boolean {
  if (stageIndex < MOVING_PLATFORM_START_STAGE) return false
  return (stageIndex + platformIndex) % 4 === 1
}

// Deterministic back-and-forth horizontal offset (-RANGE..+RANGE), purely
// a function of elapsed time — no mutable state to reset between attempts.
export function getMovingPlatformOffsetX(
  stageIndex: number,
  platformIndex: number,
  timeMs: number,
): number {
  if (!isMovingPlatform(stageIndex, platformIndex)) return 0
  const periodMs = 3200 + (((stageIndex + platformIndex) * 137) % 800)
  const half = periodMs / 2
  const phase = ((timeMs % periodMs) + periodMs) % periodMs
  const t = phase < half ? phase / half : 2 - phase / half
  return (t - 0.5) * 2 * MOVING_PLATFORM_RANGE
}

export function translatePlatform(
  platform: Obstacle,
  stageIndex: number,
  platformIndex: number,
  timeMs: number,
): Obstacle {
  const dx = getMovingPlatformOffsetX(stageIndex, platformIndex, timeMs)
  return dx === 0 ? platform : { ...platform, x: platform.x + dx }
}

type PlayerTerrainInput = {
  left: boolean
  right: boolean
  up?: boolean
  down?: boolean
}

// Reaches full speed in 1/3s on ice (vs. instant everywhere else) —
// still responsive, just not a snap-to-speed.
const ICE_ACCEL_PER_SEC = 900
// Takes ~0.6s to coast to a stop once input releases — noticeably
// slower than the instant stop every other stage has, which is the
// whole point of ice: overshoot is a real risk.
const ICE_DECEL_PER_SEC = 500

function moveToward(value: number, target: number, maxDelta: number): number {
  if (value < target) return Math.min(value + maxDelta, target)
  if (value > target) return Math.max(value - maxDelta, target)
  return value
}

// Climbing is deliberate (slower than walking); stepping off the ladder's
// x-range snaps back to the ground quickly so the player isn't left
// hanging in mid-air with no support underneath.
const LADDER_CLIMB_SPEED = 220
const LADDER_FALL_SPEED = 520

export function stepPlayerOnTerrain(
  x: number,
  y: number,
  input: PlayerTerrainInput,
  dtSec: number,
  horizontalSpeed: number,
  terrain: StageTerrain,
  vx = 0,
): { x: number; y: number; vx: number } {
  const horizontalDirection = Number(input.right) - Number(input.left)
  const clampX = (value: number) =>
    Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, Math.max(PLAYER_WIDTH / 2, value))

  const ladder = terrain.ladder
  const withinLadderX =
    ladder != null && x >= ladder.x && x <= ladder.x + ladder.width
  const nextY = withinLadderX
    ? Math.min(
        PLAYER_Y,
        Math.max(
          ladder.topY,
          y +
            (Number(input.down) - Number(input.up)) *
              LADDER_CLIMB_SPEED *
              dtSec,
        ),
      )
    : moveToward(y, PLAYER_Y, LADDER_FALL_SPEED * dtSec)

  if (!terrain.icy) {
    const nextX = clampX(x + horizontalDirection * horizontalSpeed * dtSec)
    return { x: nextX, y: nextY, vx: horizontalDirection * horizontalSpeed }
  }

  const targetVx = horizontalDirection * horizontalSpeed
  const accel =
    targetVx !== 0 ? ICE_ACCEL_PER_SEC * dtSec : ICE_DECEL_PER_SEC * dtSec
  const nextVx = moveToward(vx, targetVx, accel)
  const rawNextX = x + nextVx * dtSec
  const nextX = clampX(rawNextX)
  // Sliding into a wall kills the momentum instead of pinning it at max
  // speed against the boundary, so the player isn't stuck re-accelerating
  // through the wall's resistance every subsequent frame.
  const hitWall = nextX !== rawNextX
  return { x: nextX, y: nextY, vx: hitWall ? 0 : nextVx }
}
