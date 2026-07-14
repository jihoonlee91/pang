import { describe, expect, it } from 'vitest'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
  MIN_BOUNCE_SPEED,
  LEVEL_RADIUS,
  PLAYER_Y,
} from './constants'
import {
  createStage,
  stepBall,
  splitBall,
  explodeToSmallest,
  rollItemDrop,
  harpoonHitsBall,
  ballHitsPlayer,
  predictLandingSpot,
} from './engine'
import type { Ball } from './types'

function makeCounter(start = 0) {
  let n = start
  return () => {
    n += 1
    return n
  }
}

describe('createStage', () => {
  it('creates one large ball for the first stage', () => {
    const balls = createStage(0)
    expect(balls).toHaveLength(1)
    expect(balls[0].level).toBe(2)
  })

  it('caps the ball count at 8 for late stages', () => {
    expect(createStage(6)).toHaveLength(7)
    expect(createStage(7)).toHaveLength(8)
    expect(createStage(20)).toHaveLength(8)
  })
})

describe('stepBall', () => {
  const baseBall: Ball = { id: 1, x: 100, y: 100, vx: 50, vy: 0, level: 2 }

  it('applies gravity to vertical velocity over time', () => {
    const next = stepBall(baseBall, 0.1)
    expect(next.vy).toBeCloseTo(GRAVITY * 0.1)
  })

  it('bounces off the floor with an upward (negative) velocity', () => {
    const r = LEVEL_RADIUS[2]
    const fallingBall: Ball = {
      id: 1,
      x: 100,
      y: CANVAS_HEIGHT - r + 5,
      vx: 0,
      vy: 500,
      level: 2,
    }
    const next = stepBall(fallingBall, 0.016)
    expect(next.y).toBeLessThanOrEqual(CANVAS_HEIGHT - r)
    expect(next.vy).toBeLessThan(0)
  })

  it('never lets the bounce speed decay to an imperceptible amount', () => {
    const r = LEVEL_RADIUS[0]
    // A ball with a tiny downward velocity right at the floor boundary —
    // without the MIN_BOUNCE_SPEED clamp this would bounce almost flat.
    const restingBall: Ball = {
      id: 1,
      x: 100,
      y: CANVAS_HEIGHT - r + 1,
      vx: 0,
      vy: 1,
      level: 0,
    }
    const next = stepBall(restingBall, 0.016)
    expect(Math.abs(next.vy)).toBeGreaterThanOrEqual(MIN_BOUNCE_SPEED)
  })

  it('bounces off the left and right walls', () => {
    const r = LEVEL_RADIUS[1]
    const leftBall: Ball = { id: 1, x: r - 5, y: 200, vx: -50, vy: 0, level: 1 }
    const afterLeft = stepBall(leftBall, 0.016)
    expect(afterLeft.x).toBeGreaterThanOrEqual(r)
    expect(afterLeft.vx).toBeGreaterThan(0)

    const rightBall: Ball = {
      id: 1,
      x: CANVAS_WIDTH - r + 5,
      y: 200,
      vx: 50,
      vy: 0,
      level: 1,
    }
    const afterRight = stepBall(rightBall, 0.016)
    expect(afterRight.x).toBeLessThanOrEqual(CANVAS_WIDTH - r)
    expect(afterRight.vx).toBeLessThan(0)
  })
})

describe('splitBall', () => {
  it('removes a level-0 ball with no children', () => {
    const ball: Ball = { id: 1, x: 0, y: 0, vx: 0, vy: 0, level: 0 }
    expect(splitBall(ball, makeCounter())).toEqual([])
  })

  it('splits a larger ball into two smaller balls moving apart', () => {
    const ball: Ball = { id: 1, x: 100, y: 100, vx: 120, vy: 0, level: 2 }
    const children = splitBall(ball, makeCounter())
    expect(children).toHaveLength(2)
    expect(children[0].level).toBe(1)
    expect(children[1].level).toBe(1)
    expect(Math.sign(children[0].vx)).not.toBe(Math.sign(children[1].vx))
    expect(children[0].vy).toBeLessThan(0)
  })
})

describe('explodeToSmallest', () => {
  it('recursively splits every ball down to level 0', () => {
    const ball: Ball = { id: 1, x: 0, y: 0, vx: 100, vy: 0, level: 2 }
    const result = explodeToSmallest([ball], makeCounter())
    expect(result.length).toBeGreaterThan(1)
    expect(result.every((b) => b.level === 0)).toBe(true)
  })

  it('leaves an already-smallest ball unchanged in count', () => {
    const ball: Ball = { id: 1, x: 0, y: 0, vx: 0, vy: 0, level: 0 }
    expect(explodeToSmallest([ball], makeCounter())).toHaveLength(1)
  })
})

describe('rollItemDrop', () => {
  it('returns null when the roll misses the drop chance', () => {
    expect(rollItemDrop(() => 0.99)).toBeNull()
  })

  it('returns a weighted item type when the roll hits', () => {
    // First call checks the drop chance, second call picks the weighted type.
    const values = [0, 0]
    const rand = () => values.shift() ?? 0
    expect(rollItemDrop(rand)).toBe('doubleWire')
  })
})

describe('collision helpers', () => {
  it('detects a harpoon overlapping a ball', () => {
    const ball: Ball = { id: 1, x: 100, y: 100, vx: 0, vy: 0, level: 2 }
    expect(harpoonHitsBall(100, 100, ball)).toBe(true)
    expect(harpoonHitsBall(500, 500, ball)).toBe(false)
  })

  it('detects a ball overlapping the player', () => {
    const ball: Ball = { id: 1, x: 100, y: PLAYER_Y, vx: 0, vy: 0, level: 2 }
    expect(ballHitsPlayer(ball, 100)).toBe(true)
    expect(ballHitsPlayer(ball, 900)).toBe(false)
  })
})

describe('predictLandingSpot', () => {
  it('predicts a falling ball will land near where its horizontal drift takes it', () => {
    const ball: Ball = { id: 1, x: 200, y: 100, vx: 100, vy: 0, level: 2 }
    const { x, time } = predictLandingSpot(ball, 1.5)
    expect(time).toBeGreaterThan(0)
    // Roughly x + vx * time, allowing for the small simulation step error.
    expect(x).toBeCloseTo(200 + 100 * time, 0)
  })

  it('returns the starting position immediately for a ball with nowhere to fall', () => {
    const ball: Ball = {
      id: 1,
      x: 50,
      y: CANVAS_HEIGHT - LEVEL_RADIUS[0],
      vx: 0,
      vy: 0,
      level: 0,
    }
    const { x } = predictLandingSpot(ball, 0.2)
    expect(x).toBeCloseTo(50, 0)
  })
})
