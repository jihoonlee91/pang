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

  it('varies platform layouts across the 8 layout families from stage 21 onward', () => {
    // Stage 20 (0-indexed) is the first stage past the hand-placed
    // EXTRA_PLATFORMS range, where LAYOUT_FAMILIES takes over.
    const layouts = Array.from({ length: 8 }, (_, i) =>
      getStageTerrain(20 + i)
        .platforms.map((p) => `${p.x},${p.y}`)
        .join('|'),
    )
    const distinctLayouts = new Set(layouts)
    expect(distinctLayouts.size).toBe(8)
  })

  it('jitters the same layout family differently one cycle apart', () => {
    // Stages 20 and 28 both land on family index 4 (20 % 8 === 28 % 8),
    // but per-stage jitter should still make their exact platforms differ.
    const first = getStageTerrain(20).platforms
    const second = getStageTerrain(28).platforms
    expect(first).not.toEqual(second)
  })
})
