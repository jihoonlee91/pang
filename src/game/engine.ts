import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LEVEL_RADIUS,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y,
  GRAVITY,
} from './constants'
import type { Ball } from './types'

export function createStage(stageIndex: number): Ball[] {
  const count = stageIndex + 1
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

export function stepBall(ball: Ball, dtSec: number): Ball {
  const r = LEVEL_RADIUS[ball.level]
  let { x, y, vx, vy } = ball

  vy += GRAVITY * dtSec
  x += vx * dtSec
  y += vy * dtSec

  if (x - r < 0) {
    x = r
    vx = -vx
  } else if (x + r > CANVAS_WIDTH) {
    x = CANVAS_WIDTH - r
    vx = -vx
  }

  if (y - r < 0) {
    y = r
    vy = -vy
  } else if (y + r > CANVAS_HEIGHT) {
    y = CANVAS_HEIGHT - r
    vy = -vy
  }

  return { ...ball, x, y, vx, vy }
}

export function splitBall(ball: Ball, nextId: () => number): Ball[] {
  if (ball.level === 0) return []

  const level = ball.level - 1
  const speed = Math.max(Math.abs(ball.vx), 80)

  return [
    { id: nextId(), x: ball.x, y: ball.y, vx: speed, vy: -350, level },
    { id: nextId(), x: ball.x, y: ball.y, vx: -speed, vy: -350, level },
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

  const closestX = Math.min(
    Math.max(ball.x, playerX - halfW),
    playerX + halfW,
  )
  const closestY = Math.min(
    Math.max(ball.y, PLAYER_Y - halfH),
    PLAYER_Y + halfH,
  )

  const dx = ball.x - closestX
  const dy = ball.y - closestY
  return dx * dx + dy * dy <= r * r
}
