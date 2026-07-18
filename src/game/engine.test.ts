import { describe, expect, it } from 'vitest'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
  MIN_BOUNCE_SPEED,
  LEVEL_BOUNCE_SPEED,
  LEVEL_RADIUS,
  PLAYER_Y,
  STAGE_COUNT,
  STAGE_OBSTACLES,
  getStageObstacle,
  getStageTimeSeconds,
  getStageItemDropChance,
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
  chooseSafeX,
  harpoonHitsObstacle,
  getPowerHarpoonStopY,
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

  it('keeps the second stage simple while adding one small threat', () => {
    const balls = createStage(1)
    expect(balls).toHaveLength(2)
    expect(balls.map((ball) => ball.level)).toEqual([2, 0])
  })

  it('introduces difficulty gradually in the early stages', () => {
    expect(createStage(2)).toHaveLength(2)
    expect(createStage(3)).toHaveLength(2)
    expect(createStage(4)).toHaveLength(3)
  })

  it('caps the ball count at 8 for late stages', () => {
    expect(createStage(6)).toHaveLength(3)
    expect(createStage(7)).toHaveLength(4)
    expect(createStage(14)).toHaveLength(7)
    expect(createStage(20)).toHaveLength(8)
  })

  it('raises workload, speed, and time pressure steadily across all stages', () => {
    const workload = (stageIndex: number) =>
      createStage(stageIndex).reduce(
        (total, ball) => total + (2 ** (ball.level + 1) - 1),
        0,
      )
    const averageSpeed = (stageIndex: number) => {
      const balls = createStage(stageIndex)
      return (
        balls.reduce((total, ball) => total + Math.abs(ball.vx), 0) /
        balls.length
      )
    }

    for (let stage = 1; stage < STAGE_COUNT; stage += 1) {
      expect(workload(stage)).toBeGreaterThanOrEqual(workload(stage - 1))
      // Speed climbs stage over stage until it hits its intentional cap
      // (see createStage's Math.min in engine.ts), where it plateaus so
      // late stages differentiate via their own hazard instead of raw
      // ball speed alone.
      expect(averageSpeed(stage)).toBeGreaterThanOrEqual(
        averageSpeed(stage - 1),
      )
      // Time budget decreases stage over stage until it hits its intentional
      // floor (see getStageTimeSeconds' Math.max in constants.ts), where it
      // levels off rather than continuing to shrink toward zero.
      expect(getStageTimeSeconds(stage)).toBeLessThanOrEqual(
        getStageTimeSeconds(stage - 1),
      )
      // Item drop chance decreases stage over stage until it hits its
      // intentional floor (see ITEM_DROP_CHANCE's Math.max in constants.ts),
      // where it levels off rather than continuing to shrink.
      expect(getStageItemDropChance(stage)).toBeLessThanOrEqual(
        getStageItemDropChance(stage - 1),
      )
    }
  })

  it('floors stage time at 12 seconds instead of hitting zero or negative', () => {
    expect(getStageTimeSeconds(STAGE_COUNT - 1)).toBe(12)
    expect(getStageTimeSeconds(STAGE_COUNT - 1)).toBeGreaterThan(0)
  })

  it('caps ball speed at stage 80 instead of climbing unbounded to stage 100', () => {
    const speedAt = (stageIndex: number) =>
      Math.abs(createStage(stageIndex)[0].vx)
    expect(speedAt(79)).toBe(speedAt(80))
    expect(speedAt(79)).toBe(speedAt(STAGE_COUNT - 1))
  })
})

describe('stage obstacles', () => {
  it('uses a distinct obstacle position for every stage', () => {
    const positions = new Set(
      STAGE_OBSTACLES.map((obstacle) => `${obstacle.x},${obstacle.y}`),
    )

    expect(positions.size).toBe(STAGE_OBSTACLES.length)
  })

  it('uses the selected stage obstacle for harpoon collision', () => {
    const stageTwoObstacle = getStageObstacle(1)
    const centerX = stageTwoObstacle.x + stageTwoObstacle.width / 2
    const centerY = stageTwoObstacle.y + stageTwoObstacle.height / 2

    expect(harpoonHitsObstacle(centerX, centerY, stageTwoObstacle)).toBe(true)
    expect(
      harpoonHitsObstacle(
        getStageObstacle(0).x + getStageObstacle(0).width / 2,
        centerY,
        stageTwoObstacle,
      ),
    ).toBe(false)
  })

  it('stops a power harpoon below an obstacle instead of piercing it', () => {
    const obstacle = getStageObstacle(0)
    const blockedX = obstacle.x + obstacle.width / 2

    expect(getPowerHarpoonStopY(blockedX, obstacle)).toBe(
      obstacle.y + obstacle.height,
    )
    expect(getPowerHarpoonStopY(obstacle.x - 20, obstacle)).toBe(0)
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

  it('keeps every balloon size visibly airborne after a low-speed floor hit', () => {
    for (const level of [0, 1, 2]) {
      const r = LEVEL_RADIUS[level]
      let ball: Ball = {
        id: level,
        x: 100 + level * 100,
        y: CANVAS_HEIGHT - r,
        vx: 0,
        vy: 1,
        level,
      }
      let highestRise = 0

      for (let frame = 0; frame < 120; frame += 1) {
        ball = stepBall(ball, 1 / 60)
        highestRise = Math.max(highestRise, CANVAS_HEIGHT - r - ball.y)
      }

      const expectedRise =
        (LEVEL_BOUNCE_SPEED[level] * LEVEL_BOUNCE_SPEED[level]) / (2 * GRAVITY)
      expect(highestRise).toBeGreaterThan(expectedRise * 0.85)
    }
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

  it('applies a lateral current as extra horizontal acceleration', () => {
    const stillBall: Ball = { id: 1, x: 400, y: 200, vx: 0, vy: 0, level: 2 }
    const withoutWind = stepBall(stillBall, 0.1)
    const withWind = stepBall(stillBall, 0.1, undefined, 200)
    expect(withWind.vx).toBeCloseTo(withoutWind.vx + 200 * 0.1)
  })

  it('pulls a ball toward a gravity well', () => {
    const ball: Ball = { id: 1, x: 400, y: 200, vx: 0, vy: 0, level: 2 }
    const well = { x: 500, y: 200, strength: 4_000_000 }
    const next = stepBall(ball, 0.05, undefined, 0, well)
    expect(next.vx).toBeGreaterThan(0)
    expect(next.x).toBeGreaterThan(ball.x)
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

  it('can select the newly added bonus items', () => {
    const values = [0, 0.999]
    const rand = () => values.shift() ?? 0
    expect(rollItemDrop(rand)).toBe('scoreBonus')
  })

  it('draws from a custom weight table when one is passed', () => {
    const values = [0, 0.999]
    const rand = () => values.shift() ?? 0
    expect(
      rollItemDrop(rand, 1, [
        ['stabilizer', 1],
        ['oneUp', 1],
      ]),
    ).toBe('oneUp')
  })
})

describe('collision helpers', () => {
  it('detects a harpoon overlapping a ball', () => {
    const ball: Ball = { id: 1, x: 100, y: 100, vx: 0, vy: 0, level: 2 }
    expect(harpoonHitsBall(100, 100, ball)).toBe(true)
    expect(harpoonHitsBall(500, 500, ball)).toBe(false)
  })

  it('detects a ball touching any part of the extended harpoon line', () => {
    const ball: Ball = { id: 1, x: 100, y: 300, vx: 0, vy: 0, level: 2 }

    // The tip has already travelled far above the ball, but the vertical
    // harpoon line still runs through it all the way down to the player.
    expect(harpoonHitsBall(100, 80, ball)).toBe(true)
    expect(harpoonHitsBall(128, 80, ball)).toBe(true)
    expect(harpoonHitsBall(129, 80, ball)).toBe(false)
  })

  it('does not hit a ball that is above the harpoon tip', () => {
    const ball: Ball = { id: 1, x: 100, y: 40, vx: 0, vy: 0, level: 2 }
    expect(harpoonHitsBall(100, 80, ball)).toBe(false)
  })

  it('supports point-only collision for Vulcan shots', () => {
    const ball: Ball = { id: 1, x: 100, y: 300, vx: 0, vy: 0, level: 2 }
    expect(harpoonHitsBall(100, 80, ball, 80)).toBe(false)
    expect(harpoonHitsBall(100, 300, ball, 300)).toBe(true)
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

  it('treats a frozen ball (Clock active) as staying exactly where it is', () => {
    const ball: Ball = { id: 1, x: 300, y: 100, vx: 150, vy: 0, level: 2 }
    const { x, time } = predictLandingSpot(
      ball,
      1.5,
      1 / 60,
      undefined,
      0,
      undefined,
      0, // ballTimeScale: frozen
    )
    expect(x).toBe(300)
    expect(time).toBe(0)
  })

  it('still reports real elapsed time while the ball itself is slowed (Hourglass active)', () => {
    const ball: Ball = { id: 1, x: 200, y: 100, vx: 100, vy: 0, level: 2 }
    const full = predictLandingSpot(ball, 1.5)
    const slowed = predictLandingSpot(
      ball,
      1.5,
      1 / 60,
      undefined,
      0,
      undefined,
      0.4, // ballTimeScale: slowed
    )
    // The slowed ball drifts less far per real second, so it takes longer
    // (more real seconds) to reach the same kind of low point.
    expect(slowed.time).toBeGreaterThan(full.time)
  })
})

describe('chooseSafeX', () => {
  const bounds = { min: 20, max: 940 }

  it('returns the desired position when nothing is nearby', () => {
    expect(chooseSafeX(400, 400, [], bounds)).toBe(400)
  })

  it('ignores danger zones outside the dodge horizon', () => {
    const x = chooseSafeX(400, 400, [{ x: 400, time: 2, radius: 30 }], bounds)
    expect(x).toBe(400)
  })

  it('nudges away from a ball about to land where it wants to stand', () => {
    const x = chooseSafeX(400, 400, [{ x: 400, time: 0.5, radius: 30 }], bounds)
    expect(Math.abs(x - 400)).toBeGreaterThanOrEqual(30)
  })

  it('dodges immediately when something is about to land on the current spot', () => {
    const x = chooseSafeX(
      500, // desired position is far away and irrelevant here
      300, // current position
      [{ x: 300, time: 0.1, radius: 30 }],
      bounds,
    )
    expect(Math.abs(x - 300)).toBeGreaterThanOrEqual(30)
  })

  it('clamps the result within bounds', () => {
    const x = chooseSafeX(30, 30, [{ x: 30, time: 0.5, radius: 40 }], bounds)
    expect(x).toBeGreaterThanOrEqual(bounds.min)
  })

  it('ignores a distant threat that will have resolved before it could be reached', () => {
    // The zone is 900px away and resolves in 0.05s — even at full player
    // speed (300px/s) there's no way to be there by then, so it never
    // actually endangers standing at the desired spot.
    const x = chooseSafeX(
      900,
      0,
      [{ x: 900, time: 0.05, radius: 30 }],
      bounds,
      { playerSpeed: 300 },
    )
    expect(x).toBe(900)
  })

  it('picks the side with a much shorter safe detour', () => {
    // A wide zone parked left-of-center plus a narrower one on the desired
    // spot together make the left side need a huge detour (down to ~300)
    // while the right side clears in a short hop (past ~430).
    const zones = [
      { x: 400, time: 0.5, radius: 30 },
      { x: 350, time: 0.5, radius: 50 },
    ]
    const x = chooseSafeX(400, 400, zones, bounds)
    expect(x).toBeGreaterThan(400)
    expect(x - 400).toBeLessThan(100)
  })

  it('lets the caller omit a zone entirely (e.g. the ball being actively engaged)', () => {
    // GamePlay does this by simply not including the current shooting
    // target's own predicted zone in the array it passes in.
    const x = chooseSafeX(400, 400, [], bounds)
    expect(x).toBe(400)
  })
})
