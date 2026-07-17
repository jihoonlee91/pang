import { describe, expect, it } from 'vitest'
import {
  NEBULA_START_STAGE,
  NEBULA_STAGE_COUNT,
  getStageNebulaWells,
} from './nebulae'
import { applyGravityWellPull } from './gravityWells'
import { stepBall } from './engine'

describe('getStageNebulaWells', () => {
  it('returns null outside the cosmic-frontier stage range', () => {
    expect(getStageNebulaWells(NEBULA_START_STAGE - 1)).toBeNull()
    expect(
      getStageNebulaWells(NEBULA_START_STAGE + NEBULA_STAGE_COUNT),
    ).toBeNull()
  })

  it('returns exactly two wells that escalate in strength with depth', () => {
    const first = getStageNebulaWells(NEBULA_START_STAGE)
    const last = getStageNebulaWells(
      NEBULA_START_STAGE + NEBULA_STAGE_COUNT - 1,
    )
    expect(first).toHaveLength(2)
    expect(last).toHaveLength(2)
    expect(last![0].strength).toBeGreaterThan(first![0].strength)
  })
})

describe('stepBall with an array of wells', () => {
  it('sums the pull from every well in the array', () => {
    const wells = [
      { x: 300, y: 300, strength: 4_000_000 },
      { x: 500, y: 300, strength: 4_000_000 },
    ]
    const ball = { id: 1, x: 400, y: 300, vx: 0, vy: 0, level: 2 }
    const stepped = stepBall(ball, 1 / 60, [], 0, wells)

    // Symmetric pull from both sides should roughly cancel horizontally.
    expect(Math.abs(stepped.vx)).toBeLessThan(50)

    const singleWellPull = applyGravityWellPull(wells[0], ball.x, ball.y)
    expect(Number.isFinite(singleWellPull.ax)).toBe(true)
  })
})
