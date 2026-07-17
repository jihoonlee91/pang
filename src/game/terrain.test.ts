import { describe, expect, it } from 'vitest'
import { PLAYER_Y } from './constants'
import { getStageTerrain, STAGE_TERRAINS, stepPlayerOnTerrain } from './terrain'

describe('stage terrain', () => {
  it('starts with open arenas and introduces terrain gradually', () => {
    expect(STAGE_TERRAINS).toHaveLength(100)
    expect(STAGE_TERRAINS[0]).toEqual({ platforms: [] })
    expect(STAGE_TERRAINS[1]).toEqual({ platforms: [] })
    expect(STAGE_TERRAINS[2].platforms).toHaveLength(1)
    expect(STAGE_TERRAINS[3].platforms).toHaveLength(1)

    const platformCounts = STAGE_TERRAINS.map(
      (terrain) => terrain.platforms.length,
    )
    for (let stage = 1; stage < platformCounts.length; stage += 1) {
      expect(platformCounts[stage]).toBeGreaterThanOrEqual(
        platformCounts[stage - 1],
      )
    }
    expect(platformCounts[5]).toBe(2)
    expect(platformCounts[10]).toBe(3)
    expect(platformCounts[15]).toBe(4)
  })

  it('keeps the player on the ground while moving horizontally', () => {
    const terrain = getStageTerrain(2)
    const next = stepPlayerOnTerrain(
      480,
      PLAYER_Y,
      { left: false, right: true },
      0.1,
      300,
      terrain,
    )

    expect(next.x).toBe(510)
    expect(next.y).toBe(PLAYER_Y)
  })

  it('clamps horizontal movement to the arena bounds', () => {
    const terrain = getStageTerrain(2)
    const next = stepPlayerOnTerrain(
      30,
      PLAYER_Y,
      { left: true, right: false },
      2,
      300,
      terrain,
    )

    expect(next.x).toBe(20)
    expect(next.y).toBe(PLAYER_Y)
  })
})
