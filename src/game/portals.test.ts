import { describe, expect, it } from 'vitest'
import type { Ball } from './types'
import { BACKGROUNDS, STAGE_NAMES } from './backgrounds'
import { findPortalTransition, getStagePortals, teleportBall } from './portals'

describe('dimension portals', () => {
  it('provides a unique map name and background slot for all 100 stages', () => {
    expect(STAGE_NAMES).toHaveLength(100)
    expect(BACKGROUNDS).toHaveLength(100)
  })

  it('stops returning portals past the dimension-stage range (40-59)', () => {
    expect(getStagePortals(40)).toHaveLength(0)
    expect(getStagePortals(59)).toHaveLength(0)
  })

  it('changes the portal count on every dimension stage', () => {
    const expectedCounts = [1, 2, 1, 3, 2, 3, 1, 2, 3, 2]
    expect(getStagePortals(29)).toHaveLength(0)
    expect(
      expectedCounts.map((_, offset) => getStagePortals(30 + offset).length),
    ).toEqual(expectedCounts)
    for (let stage = 1; stage < expectedCounts.length; stage += 1) {
      expect(expectedCounts[stage]).not.toBe(expectedCounts[stage - 1])
    }
  })

  it('uses a distinct portal position layout for every dimension stage', () => {
    const layoutSignatures = Array.from({ length: 10 }, (_, offset) =>
      getStagePortals(30 + offset)
        .flatMap((pair) => [pair.entry, pair.exit])
        .map((portal) => `${portal.x},${portal.y}`)
        .join('|'),
    )

    expect(new Set(layoutSignatures).size).toBe(layoutSignatures.length)
  })

  it('detects contact with either side of a portal pair', () => {
    const [pair] = getStagePortals(30)
    const ball: Ball = {
      id: 1,
      x: pair.entry.x,
      y: pair.entry.y,
      vx: 180,
      vy: 40,
      level: 2,
    }

    expect(findPortalTransition(ball, [pair])).toEqual({
      from: pair.entry,
      to: pair.exit,
    })
    expect(findPortalTransition({ ...ball, x: 480, y: 30 }, [pair])).toBeNull()
  })

  it('launches a teleported ball inward and upward from its destination', () => {
    const [pair] = getStagePortals(30)
    const ball: Ball = {
      id: 1,
      x: pair.entry.x,
      y: pair.entry.y,
      vx: 180,
      vy: 100,
      level: 1,
    }
    const teleported = teleportBall(ball, pair.exit)

    expect(teleported.x).toBeLessThan(pair.exit.x)
    expect(teleported.vx).toBeLessThan(0)
    expect(teleported.vy).toBeLessThanOrEqual(-180)
  })
})
