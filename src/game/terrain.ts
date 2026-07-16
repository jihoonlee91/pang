import {
  CANVAS_WIDTH,
  PLAYER_CLIMB_SPEED,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_OBSTACLES,
  type Obstacle,
} from './constants'

export type Ladder = {
  x: number
  topY: number
  bottomY: number
  width: number
}

export type StageTerrain = {
  platforms: readonly Obstacle[]
  ladders: readonly Ladder[]
}

const standY = (platform: Obstacle) => platform.y - PLAYER_HEIGHT / 2

function ladderTo(platform: Obstacle, x: number, bottomY = PLAYER_Y): Ladder {
  return { x, topY: standY(platform), bottomY, width: 34 }
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
  { platforms: [], ladders: [] },
  { platforms: [], ladders: [] },
  (() => {
    const platform = { x: 390, y: 270, width: 180, height: 18 }
    return {
      platforms: [platform],
      ladders: [ladderTo(platform, platform.x + platform.width / 2)],
    }
  })(),
  (() => {
    const platform = { x: 150, y: 310, width: 210, height: 18 }
    return {
      platforms: [platform],
      ladders: [ladderTo(platform, platform.x + 52)],
    }
  })(),
]

export const STAGE_TERRAINS: readonly StageTerrain[] = STAGE_OBSTACLES.map(
  (primary, stageIndex) => {
    const earlyTerrain = EARLY_STAGE_TERRAINS[stageIndex]
    if (earlyTerrain) return earlyTerrain

    const platforms = [primary, ...EXTRA_PLATFORMS[stageIndex]]
    const ladders = platforms.map((platform, platformIndex) => {
      const inset = 44 + ((stageIndex + platformIndex) % 3) * 42
      const x = Math.min(platform.x + platform.width - 36, platform.x + inset)
      return ladderTo(platform, x)
    })
    return { platforms, ladders }
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
  up: boolean
  down: boolean
}

export function stepPlayerOnTerrain(
  x: number,
  y: number,
  input: PlayerTerrainInput,
  dtSec: number,
  horizontalSpeed: number,
  terrain: StageTerrain,
): { x: number; y: number } {
  const ladder = terrain.ladders.find(
    (candidate) =>
      Math.abs(x - candidate.x) <= candidate.width / 2 + 18 &&
      y >= candidate.topY - 3 &&
      y <= candidate.bottomY + 3,
  )
  const verticalDirection = Number(input.down) - Number(input.up)
  if (ladder && verticalDirection !== 0) {
    return {
      x: ladder.x,
      y: Math.min(
        ladder.bottomY,
        Math.max(
          ladder.topY,
          y + verticalDirection * PLAYER_CLIMB_SPEED * dtSec,
        ),
      ),
    }
  }

  const isMidLadder = ladder && y > ladder.topY + 3 && y < ladder.bottomY - 3
  if (isMidLadder) return { x: ladder.x, y }

  const horizontalDirection = Number(input.right) - Number(input.left)
  let nextX = x + horizontalDirection * horizontalSpeed * dtSec
  const standingPlatform = terrain.platforms.find(
    (platform) =>
      Math.abs(y - standY(platform)) <= 3 &&
      x >= platform.x - 2 &&
      x <= platform.x + platform.width + 2,
  )
  if (standingPlatform) {
    nextX = Math.min(
      standingPlatform.x + standingPlatform.width - PLAYER_WIDTH / 2,
      Math.max(standingPlatform.x + PLAYER_WIDTH / 2, nextX),
    )
  } else {
    nextX = Math.min(
      CANVAS_WIDTH - PLAYER_WIDTH / 2,
      Math.max(PLAYER_WIDTH / 2, nextX),
    )
  }
  return { x: nextX, y }
}
