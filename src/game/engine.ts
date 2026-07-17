import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LEVEL_RADIUS,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y,
  GRAVITY,
  RESTITUTION,
  MIN_BOUNCE_SPEED,
  LEVEL_BOUNCE_SPEED,
  SPLIT_VY_BASE,
  SPLIT_VY_PER_LEVEL,
  OBSTACLE_X,
  OBSTACLE_Y,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  ITEM_RADIUS,
  ITEM_GRAVITY,
  ITEM_DROP_CHANCE,
  ITEM_WEIGHTS,
  type Obstacle,
} from './constants'
import { applyGravityWellPull, type GravityWell } from './gravityWells'
import type { Ball, Item, ItemType } from './types'

const EARLY_STAGE_BALLS: readonly (readonly Omit<Ball, 'id'>[])[] = [
  [{ x: CANVAS_WIDTH / 2, y: 110, vx: 90, vy: 0, level: 2 }],
  [
    { x: CANVAS_WIDTH * 0.42, y: 115, vx: 100, vy: 0, level: 2 },
    { x: CANVAS_WIDTH * 0.7, y: 155, vx: -90, vy: 0, level: 0 },
  ],
  [
    { x: CANVAS_WIDTH * 0.36, y: 105, vx: 110, vy: 0, level: 2 },
    { x: CANVAS_WIDTH * 0.7, y: 145, vx: -105, vy: 0, level: 1 },
  ],
  [
    { x: CANVAS_WIDTH * 0.34, y: 105, vx: 115, vy: 0, level: 2 },
    { x: CANVAS_WIDTH * 0.7, y: 120, vx: -115, vy: 0, level: 2 },
  ],
  [
    { x: CANVAS_WIDTH * 0.25, y: 105, vx: 125, vy: 0, level: 2 },
    { x: CANVAS_WIDTH * 0.55, y: 125, vx: -125, vy: 0, level: 2 },
    { x: CANVAS_WIDTH * 0.78, y: 160, vx: -120, vy: 0, level: 1 },
  ],
]

export function createStage(stageIndex: number): Ball[] {
  const earlyLayout = EARLY_STAGE_BALLS[stageIndex]
  if (earlyLayout) {
    return earlyLayout.map((ball, id) => ({ id, ...ball }))
  }

  const count = Math.min(Math.floor((stageIndex - 5) / 2) + 3, 8)
  const speedMultiplier = 1 + stageIndex * 0.08
  const baseVx = 100 * speedMultiplier
  const balls: Ball[] = []
  for (let i = 0; i < count; i++) {
    const x = ((i + 1) / (count + 1)) * CANVAS_WIDTH
    const vx = i % 2 === 0 ? baseVx : -baseVx
    balls.push({ id: i, x, y: 100, vx, vy: 0, level: 2 })
  }
  return balls
}

// Reflects a velocity component off a surface, applying RESTITUTION decay
// but never letting the bounce speed fade below MIN_BOUNCE_SPEED — otherwise
// the geometric decay eventually shrinks bounces to an imperceptible height
// and the ball looks like it stopped bouncing (rolls along the floor instead).
function reflect(v: number, minimumSpeed = MIN_BOUNCE_SPEED): number {
  const bounced = -v * RESTITUTION
  const sign = bounced < 0 ? -1 : 1
  return Math.abs(bounced) < minimumSpeed ? sign * minimumSpeed : bounced
}

function reflectAway(
  v: number,
  towardPositive: boolean,
  minimumSpeed = MIN_BOUNCE_SPEED,
): number {
  const bounced = Math.abs(v) * RESTITUTION * (towardPositive ? 1 : -1)
  const minMagnitude = Math.max(Math.abs(bounced), minimumSpeed)
  return towardPositive ? minMagnitude : -minMagnitude
}

export function stepBall(
  ball: Ball,
  dtSec: number,
  obstacles: Obstacle | readonly Obstacle[] = {
    x: OBSTACLE_X,
    y: OBSTACLE_Y,
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
  },
  // Lateral push from a stage current (trench stages) and/or a pull toward
  // one or more fixed gravity wells (stellar-forge/cosmic-frontier/vortex
  // stages) — both optional, additive on top of normal gravity/bounce
  // physics. A single well or an array (nebula-field stages, multiple
  // simultaneous pull points) are both accepted, mirroring how `obstacles`
  // already supports a single value or an array.
  windAx = 0,
  well?: GravityWell | readonly GravityWell[],
  // Multiplies GRAVITY — 1 everywhere except the Void stages, where it's
  // near-zero so balls drift instead of falling predictably.
  gravityScale = 1,
): Ball {
  const r = LEVEL_RADIUS[ball.level]
  const verticalBounceSpeed = LEVEL_BOUNCE_SPEED[ball.level]
  let { x, y, vx, vy } = ball

  vy += GRAVITY * gravityScale * dtSec
  vx += windAx * dtSec
  if (well) {
    const wells = Array.isArray(well) ? well : [well]
    for (const w of wells) {
      const { ax, ay } = applyGravityWellPull(w, x, y)
      vx += ax * dtSec
      vy += ay * dtSec
    }
  }
  x += vx * dtSec
  y += vy * dtSec

  if (x - r < 0) {
    x = r
    vx = reflect(vx)
  } else if (x + r > CANVAS_WIDTH) {
    x = CANVAS_WIDTH - r
    vx = reflect(vx)
  }

  if (y - r < 0) {
    y = r
    vy = reflect(vy, verticalBounceSpeed)
  } else if (y + r > CANVAS_HEIGHT) {
    y = CANVAS_HEIGHT - r
    vy = reflect(vy, verticalBounceSpeed)
  }

  const platformList = Array.isArray(obstacles) ? obstacles : [obstacles]
  for (const obstacle of platformList) {
    if (
      x + r > obstacle.x &&
      x - r < obstacle.x + obstacle.width &&
      y + r > obstacle.y &&
      y - r < obstacle.y + obstacle.height
    ) {
      const fromTop = y < obstacle.y
      const fromBottom = y > obstacle.y + obstacle.height
      if (fromTop) {
        y = obstacle.y - r
        vy = reflectAway(vy, false, verticalBounceSpeed)
      } else if (fromBottom) {
        y = obstacle.y + obstacle.height + r
        vy = reflectAway(vy, true, verticalBounceSpeed)
      } else if (x < obstacle.x) {
        x = obstacle.x - r
        vx = reflectAway(vx, false)
      } else {
        x = obstacle.x + obstacle.width + r
        vx = reflectAway(vx, true)
      }
    }
  }

  return { ...ball, x, y, vx, vy }
}

export function harpoonHitsObstacle(
  harpoonX: number,
  harpoonY: number,
  obstacles: Obstacle | readonly Obstacle[] = {
    x: OBSTACLE_X,
    y: OBSTACLE_Y,
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
  },
): boolean {
  const platformList = Array.isArray(obstacles) ? obstacles : [obstacles]
  return platformList.some(
    (obstacle) =>
      harpoonX > obstacle.x &&
      harpoonX < obstacle.x + obstacle.width &&
      harpoonY > obstacle.y &&
      harpoonY < obstacle.y + obstacle.height,
  )
}

export function getPowerHarpoonStopY(
  harpoonX: number,
  obstacles: Obstacle | readonly Obstacle[],
  harpoonBaseY = PLAYER_Y,
): number {
  const platformList = Array.isArray(obstacles) ? obstacles : [obstacles]
  const blockingBottoms = platformList
    .filter(
      (obstacle) =>
        harpoonX > obstacle.x &&
        harpoonX < obstacle.x + obstacle.width &&
        obstacle.y + obstacle.height < harpoonBaseY,
    )
    .map((obstacle) => obstacle.y + obstacle.height)
  return blockingBottoms.length > 0 ? Math.max(...blockingBottoms) : 0
}

export function splitBall(ball: Ball, nextId: () => number): Ball[] {
  if (ball.level === 0) return []

  const level = ball.level - 1
  const speed = Math.max(Math.abs(ball.vx), 80)
  const vy = -(SPLIT_VY_BASE + level * SPLIT_VY_PER_LEVEL)

  return [
    { id: nextId(), x: ball.x, y: ball.y, vx: speed, vy, level },
    { id: nextId(), x: ball.x, y: ball.y, vx: -speed, vy, level },
  ]
}

export function harpoonHitsBall(
  harpoonX: number,
  harpoonTipY: number,
  ball: Ball,
  harpoonBaseY = PLAYER_Y,
): boolean {
  const r = LEVEL_RADIUS[ball.level]
  const segmentTop = Math.min(harpoonTipY, harpoonBaseY)
  const segmentBottom = Math.max(harpoonTipY, harpoonBaseY)
  const closestY = Math.min(Math.max(ball.y, segmentTop), segmentBottom)
  const dx = ball.x - harpoonX
  const dy = ball.y - closestY

  return dx * dx + dy * dy <= r * r
}

export function ballHitsPlayer(
  ball: Ball,
  playerX: number,
  playerY = PLAYER_Y,
): boolean {
  const r = LEVEL_RADIUS[ball.level]
  const halfW = PLAYER_WIDTH / 2
  const halfH = PLAYER_HEIGHT / 2

  const closestX = Math.min(Math.max(ball.x, playerX - halfW), playerX + halfW)
  const closestY = Math.min(Math.max(ball.y, playerY - halfH), playerY + halfH)

  const dx = ball.x - closestX
  const dy = ball.y - closestY
  return dx * dx + dy * dy <= r * r
}

/**
 * Recursively splits every ball down to the smallest level (0), used by the
 * dynamite item. Unlike a single splitBall call, this keeps splitting each
 * resulting child until nothing but level-0 balls remain.
 */
export function explodeToSmallest(balls: Ball[], nextId: () => number): Ball[] {
  const result: Ball[] = []
  const queue = [...balls]
  while (queue.length > 0) {
    const ball = queue.pop()
    if (!ball) continue
    if (ball.level === 0) {
      result.push(ball)
    } else {
      queue.push(...splitBall(ball, nextId))
    }
  }
  return result
}

/**
 * Rolls whether a hit ball drops an item, and if so, which type. Double
 * wire / clock / hourglass / barrier are common; 1UP (reward) and dynamite
 * (risk) are intentionally rare.
 */
export function rollItemDrop(
  rand: () => number = Math.random,
  dropChance = ITEM_DROP_CHANCE,
  weights: readonly [ItemType, number][] = ITEM_WEIGHTS,
): ItemType | null {
  if (rand() > dropChance) return null

  const total = weights.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rand() * total
  for (const [type, weight] of weights) {
    if (roll < weight) return type
    roll -= weight
  }
  return weights[weights.length - 1][0]
}

export function stepItem(item: Item, dtSec: number): Item {
  const vy = item.vy + ITEM_GRAVITY * dtSec
  const y = item.y + vy * dtSec
  return { ...item, y, vy }
}

export function itemHitsPlayer(
  item: Item,
  playerX: number,
  playerY = PLAYER_Y,
): boolean {
  const halfW = PLAYER_WIDTH / 2
  const halfH = PLAYER_HEIGHT / 2

  const closestX = Math.min(Math.max(item.x, playerX - halfW), playerX + halfW)
  const closestY = Math.min(Math.max(item.y, playerY - halfH), playerY + halfH)

  const dx = item.x - closestX
  const dy = item.y - closestY
  return dx * dx + dy * dy <= ITEM_RADIUS * ITEM_RADIUS
}

/**
 * Forward-simulates a ball with the exact same stepBall physics used by
 * real gameplay, to find its next "low point" — the x position it will be
 * at when it's closest to the player's row. Used by the AI/attract mode so
 * it can aim where a ball will be instead of reactively chasing where it
 * already is. Returns the predicted x and how many seconds of real time
 * away that is.
 *
 * `ballTimeScale` matches this to whatever's actually slowing/freezing the
 * ball in real gameplay (Clock stops it entirely, Hourglass slows it) —
 * only the physics integration is scaled, not the `t` bookkeeping, so
 * `time` always means real seconds even while the ball itself is frozen
 * or crawling.
 */
export function predictLandingSpot(
  ball: Ball,
  horizonSec = 1.5,
  dtSec = 1 / 60,
  obstacles?: Obstacle | readonly Obstacle[],
  windAx = 0,
  well?: GravityWell | readonly GravityWell[],
  ballTimeScale = 1,
  gravityScale = 1,
): { x: number; time: number } {
  let sim = ball
  let bestX = ball.x
  let bestY = ball.y
  let bestTime = 0
  let t = 0

  while (t < horizonSec) {
    sim = stepBall(
      sim,
      dtSec * ballTimeScale,
      obstacles,
      windAx,
      well,
      gravityScale,
    )
    t += dtSec
    if (sim.y > bestY) {
      bestY = sim.y
      bestX = sim.x
      bestTime = t
    }
  }

  return { x: bestX, time: bestTime }
}

export type DangerZone = {
  /** Predicted x position of the incoming ball. */
  x: number
  /** Seconds until it arrives there. */
  time: number
  /** Half-width of the no-go band around x (ball radius + player half-width + buffer). */
  radius: number
}

/**
 * Picks a safe x for the AI/attract mode to stand at, given where it would
 * *like* to stand (to line up a shot or grab an item) and a set of
 * near-term ball arrivals to avoid.
 *
 *  - Reflex: something is about to land right where the player already is,
 *    right now — escape as far as the time available allows, ignoring the
 *    desired position entirely.
 *  - Otherwise: a danger zone only counts against a candidate position if
 *    the player could actually *be there* when it resolves (reachable in
 *    time, and not already past by the time they'd arrive) — a distant
 *    threat that will have come and gone before the player could reach it
 *    isn't actually a threat. Among positions that clear every reachable
 *    threat, search outward from the desired x for the nearest one; if
 *    nothing is fully clear (tight quarters), fall back to whichever
 *    position has the largest margin from its nearest threat.
 *
 * Which zones are passed in at all is the caller's call — e.g. GamePlay
 * omits the ball currently being actively engaged (there's still enough
 * time to safely land the shot) so the AI walks right up to line up an
 * early kill instead of treating its own target as forbidden ground.
 */
export function chooseSafeX(
  desiredX: number,
  currentX: number,
  dangerZones: readonly DangerZone[],
  bounds: { min: number; max: number },
  options: {
    dodgeHorizonSec?: number
    immediateDangerSec?: number
    playerSpeed?: number
    stepPx?: number
  } = {},
): number {
  const dodgeHorizonSec = options.dodgeHorizonSec ?? 1.1
  const immediateDangerSec = options.immediateDangerSec ?? 0.25
  const playerSpeed = options.playerSpeed ?? 300
  const stepPx = options.stepPx ?? 12
  const clamp = (x: number) => Math.min(Math.max(x, bounds.min), bounds.max)

  const imminent = dangerZones.find(
    (zone) =>
      zone.time <= immediateDangerSec &&
      Math.abs(zone.x - currentX) < zone.radius,
  )
  if (imminent) {
    const escapeDistance = Math.max(
      imminent.radius,
      playerSpeed * Math.max(imminent.time, 0.05),
    )
    const away = currentX <= imminent.x ? -1 : 1
    return clamp(currentX + away * escapeDistance)
  }

  const relevant = dangerZones.filter((zone) => zone.time <= dodgeHorizonSec)
  const margin = (x: number) =>
    Math.min(
      ...relevant.map((zone) => {
        const travelTime = Math.abs(x - currentX) / playerSpeed
        // Already resolved by the time we'd get there — not a threat here.
        if (travelTime > zone.time + 0.15) return Infinity
        return Math.abs(x - zone.x) - zone.radius
      }),
    )
  const isSafe = (x: number) => relevant.length === 0 || margin(x) >= 0

  if (isSafe(desiredX)) return clamp(desiredX)

  const span = bounds.max - bounds.min
  for (let offset = stepPx; offset <= span; offset += stepPx) {
    for (const dir of [1, -1]) {
      const candidate = clamp(desiredX + dir * offset)
      if (isSafe(candidate)) return candidate
    }
  }

  // Nothing found fully clear — pick the position with the most breathing
  // room from its nearest reachable threat.
  let best = clamp(desiredX)
  let bestMargin = margin(best)
  for (let x = bounds.min; x <= bounds.max; x += stepPx) {
    const m = margin(x)
    if (m > bestMargin) {
      bestMargin = m
      best = x
    }
  }
  return best
}
