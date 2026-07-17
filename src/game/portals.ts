import { CANVAS_WIDTH, LEVEL_RADIUS } from './constants'
import type { Ball } from './types'

export const PORTAL_START_STAGE = 30
export const PORTAL_RADIUS = 30
export const PORTAL_COOLDOWN_MS = 900

export type Portal = {
  x: number
  y: number
  color: string
  label: string
}

export type PortalPair = {
  entry: Portal
  exit: Portal
}

export type PortalTransition = {
  from: Portal
  to: Portal
}

type PortalCoordinates = readonly [
  entryX: number,
  entryY: number,
  exitX: number,
  exitY: number,
]

const PORTAL_LAYOUTS: readonly (readonly PortalCoordinates[])[] = [
  [[120, 150, 830, 360]],
  [
    [180, 330, 760, 130],
    [390, 120, 610, 390],
  ],
  [[90, 250, 870, 210]],
  [
    [140, 120, 820, 400],
    [320, 350, 650, 150],
    [460, 110, 510, 390],
  ],
  [
    [220, 170, 730, 330],
    [110, 390, 850, 120],
  ],
  [
    [130, 210, 820, 170],
    [330, 110, 670, 400],
    [430, 350, 540, 150],
  ],
  [[210, 120, 770, 400]],
  [
    [100, 350, 860, 140],
    [380, 180, 610, 360],
  ],
  [
    [160, 400, 800, 110],
    [300, 140, 690, 330],
    [440, 100, 520, 410],
  ],
  [
    [120, 130, 840, 380],
    [350, 400, 640, 120],
  ],
]

const PORTAL_COLORS = [
  ['#22d3ee', '#f472b6'],
  ['#a78bfa', '#facc15'],
  ['#34d399', '#fb7185'],
] as const

export function getStagePortals(stageIndex: number): readonly PortalPair[] {
  if (
    stageIndex < PORTAL_START_STAGE ||
    stageIndex >= PORTAL_START_STAGE + PORTAL_LAYOUTS.length
  ) {
    return []
  }

  const layoutIndex = stageIndex - PORTAL_START_STAGE
  return PORTAL_LAYOUTS[layoutIndex].map(
    ([entryX, entryY, exitX, exitY], pairIndex) => {
      const [entryColor, exitColor] =
        PORTAL_COLORS[pairIndex % PORTAL_COLORS.length]
      const label = String.fromCharCode(65 + pairIndex)
      return {
        entry: {
          x: entryX,
          y: entryY,
          color: entryColor,
          label,
        },
        exit: {
          x: exitX,
          y: exitY,
          color: exitColor,
          label,
        },
      }
    },
  )
}

export function findPortalTransition(
  ball: Ball,
  pairs: readonly PortalPair[],
): PortalTransition | null {
  const collisionRadius = PORTAL_RADIUS + LEVEL_RADIUS[ball.level]
  const collisionRadiusSquared = collisionRadius * collisionRadius

  for (const pair of pairs) {
    const entryDx = ball.x - pair.entry.x
    const entryDy = ball.y - pair.entry.y
    if (entryDx * entryDx + entryDy * entryDy <= collisionRadiusSquared) {
      return { from: pair.entry, to: pair.exit }
    }

    const exitDx = ball.x - pair.exit.x
    const exitDy = ball.y - pair.exit.y
    if (exitDx * exitDx + exitDy * exitDy <= collisionRadiusSquared) {
      return { from: pair.exit, to: pair.entry }
    }
  }

  return null
}

export function teleportBall(ball: Ball, destination: Portal): Ball {
  const radius = LEVEL_RADIUS[ball.level]
  const exitsOnLeft = destination.x < CANVAS_WIDTH / 2
  const horizontalOffset = PORTAL_RADIUS + radius + 5

  return {
    ...ball,
    x: destination.x + (exitsOnLeft ? horizontalOffset : -horizontalOffset),
    y: destination.y,
    vx: exitsOnLeft ? Math.abs(ball.vx) : -Math.abs(ball.vx),
    vy: -Math.max(180, Math.abs(ball.vy) * 0.7),
  }
}
