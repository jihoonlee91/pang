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
} from './constants'
import type { Ball, Item, ItemType } from './types'

export function createStage(stageIndex: number): Ball[] {
  const count = Math.min(stageIndex + 1, 8)
  const speedMultiplier = 1 + stageIndex * 0.15
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
function reflect(v: number): number {
  const bounced = -v * RESTITUTION
  const sign = bounced < 0 ? -1 : 1
  return Math.abs(bounced) < MIN_BOUNCE_SPEED
    ? sign * MIN_BOUNCE_SPEED
    : bounced
}

function reflectAway(v: number, towardPositive: boolean): number {
  const bounced = Math.abs(v) * RESTITUTION * (towardPositive ? 1 : -1)
  const minMagnitude = Math.max(Math.abs(bounced), MIN_BOUNCE_SPEED)
  return towardPositive ? minMagnitude : -minMagnitude
}

export function stepBall(ball: Ball, dtSec: number): Ball {
  const r = LEVEL_RADIUS[ball.level]
  let { x, y, vx, vy } = ball

  vy += GRAVITY * dtSec
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
    vy = reflect(vy)
  } else if (y + r > CANVAS_HEIGHT) {
    y = CANVAS_HEIGHT - r
    vy = reflect(vy)
  }

  if (
    x + r > OBSTACLE_X &&
    x - r < OBSTACLE_X + OBSTACLE_WIDTH &&
    y + r > OBSTACLE_Y &&
    y - r < OBSTACLE_Y + OBSTACLE_HEIGHT
  ) {
    const fromTop = y < OBSTACLE_Y
    const fromBottom = y > OBSTACLE_Y + OBSTACLE_HEIGHT
    if (fromTop) {
      y = OBSTACLE_Y - r
      vy = reflectAway(vy, false)
    } else if (fromBottom) {
      y = OBSTACLE_Y + OBSTACLE_HEIGHT + r
      vy = reflectAway(vy, true)
    } else if (x < OBSTACLE_X) {
      x = OBSTACLE_X - r
      vx = reflectAway(vx, false)
    } else {
      x = OBSTACLE_X + OBSTACLE_WIDTH + r
      vx = reflectAway(vx, true)
    }
  }

  return { ...ball, x, y, vx, vy }
}

export function harpoonHitsObstacle(
  harpoonX: number,
  harpoonY: number,
): boolean {
  return (
    harpoonX > OBSTACLE_X &&
    harpoonX < OBSTACLE_X + OBSTACLE_WIDTH &&
    harpoonY > OBSTACLE_Y &&
    harpoonY < OBSTACLE_Y + OBSTACLE_HEIGHT
  )
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
  harpoonY: number,
  ball: Ball,
): boolean {
  const r = LEVEL_RADIUS[ball.level]
  return (
    Math.abs(harpoonX - ball.x) <= r &&
    harpoonY >= ball.y - r &&
    harpoonY <= ball.y + r
  )
}

export function ballHitsPlayer(ball: Ball, playerX: number): boolean {
  const r = LEVEL_RADIUS[ball.level]
  const halfW = PLAYER_WIDTH / 2
  const halfH = PLAYER_HEIGHT / 2

  const closestX = Math.min(Math.max(ball.x, playerX - halfW), playerX + halfW)
  const closestY = Math.min(
    Math.max(ball.y, PLAYER_Y - halfH),
    PLAYER_Y + halfH,
  )

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
): ItemType | null {
  if (rand() > ITEM_DROP_CHANCE) return null

  const total = ITEM_WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rand() * total
  for (const [type, weight] of ITEM_WEIGHTS) {
    if (roll < weight) return type
    roll -= weight
  }
  return ITEM_WEIGHTS[ITEM_WEIGHTS.length - 1][0]
}

export function stepItem(item: Item, dtSec: number): Item {
  const vy = item.vy + ITEM_GRAVITY * dtSec
  const y = item.y + vy * dtSec
  return { ...item, y, vy }
}

export function itemHitsPlayer(item: Item, playerX: number): boolean {
  const halfW = PLAYER_WIDTH / 2
  const halfH = PLAYER_HEIGHT / 2

  const closestX = Math.min(Math.max(item.x, playerX - halfW), playerX + halfW)
  const closestY = Math.min(
    Math.max(item.y, PLAYER_Y - halfH),
    PLAYER_Y + halfH,
  )

  const dx = item.x - closestX
  const dy = item.y - closestY
  return dx * dx + dy * dy <= ITEM_RADIUS * ITEM_RADIUS
}
